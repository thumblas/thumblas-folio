"""
Core cleanup job functionality for managing old impression records.
"""

import boto3
import json
import logging
import time
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional, Any
from botocore.exceptions import ClientError

# Set up logging
logger = logging.getLogger('ImpressionCleanup')
logger.setLevel(logging.INFO)

# Add CloudWatch handler if running in AWS
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Constants
BATCH_SIZE = 25  # DynamoDB batch write limit
TTL_INCREMENT_MINUTES = 15  # Time increment between batches
MAX_RETRIES = 3  # Maximum retries for throttled requests

def get_next_week_1pm_est_timestamp() -> int:
    """
    Get timestamp for 1 PM EST one week from now

    Returns:
        int: Unix timestamp for 1 PM EST one week from now
    """
    # Get current time in UTC
    now = datetime.now(timezone.utc)

    # Convert to EST (UTC-5)
    est = timezone(timedelta(hours=-5))
    now_est = now.astimezone(est)

    # Add one week
    next_week = now_est + timedelta(days=7)

    # Set time to 1 PM EST
    next_week_1pm = next_week.replace(hour=13, minute=0, second=0, microsecond=0)

    logger.info(f"Calculated TTL base time: {next_week_1pm.isoformat()} EST")

    # Convert back to UTC and get timestamp
    return int(next_week_1pm.timestamp())

def handle_throttling(func: callable, *args: Any, **kwargs: Any) -> Optional[Any]:
    """
    Handle throttling with exponential backoff

    Args:
        func: Function to execute
        *args: Positional arguments for the function
        **kwargs: Keyword arguments for the function

    Returns:
        Optional[Any]: Result from the function call, or None if all retries failed
    """
    for attempt in range(MAX_RETRIES):
        try:
            result = func(*args, **kwargs)
            if attempt > 0:
                logger.info(f"Successfully recovered after {attempt + 1} attempts")
            return result
        except ClientError as e:
            if e.response['Error']['Code'] == 'ProvisionedThroughputExceededException':
                if attempt == MAX_RETRIES - 1:
                    logger.error(
                        f"Max retries ({MAX_RETRIES}) exceeded. Last error: {str(e)}\n"
                        f"Consider adjusting provisioned throughput or implementing "
                        f"additional backoff"
                    )
                    raise
                backoff_time = (2 ** attempt * 0.1)  # Exponential backoff
                logger.warning(
                    f"Request throttled (attempt {attempt + 1}/{MAX_RETRIES}), "
                    f"retrying in {backoff_time:.2f} seconds..."
                )
                time.sleep(backoff_time)
            else:
                logger.error(f"Unexpected DynamoDB error: {str(e)}")
                raise
    return None

def update_batch_with_ttl(table: boto3.resource, batch: List[Dict], base_ttl: int, batch_number: int) -> int:
    """
    Update a batch of items with incrementing TTL values

    Args:
        table: DynamoDB table resource
        batch: List of items to update
        base_ttl: Base TTL timestamp (1 PM EST one week from now)
        batch_number: Current batch number for TTL increment

    Returns:
        int: Number of items successfully updated
    """
    try:
        # Calculate TTL for this batch (increment by 15 minutes for each batch)
        batch_ttl = base_ttl + (batch_number * TTL_INCREMENT_MINUTES * 60)
        ttl_time = datetime.fromtimestamp(batch_ttl, tz=timezone.utc).astimezone(timezone(timedelta(hours=-5)))

        log_batch_summary(batch, batch_number + 1, ttl_time)

        success_count = 0
        with table.batch_writer() as batch_writer:
            for item in batch:
                try:
                    # Keep all original attributes except TTL
                    item_copy = item.copy()
                    item_copy['ttl'] = batch_ttl
                    handle_throttling(
                        batch_writer.put_item,
                        Item=item_copy
                    )
                    success_count += 1
                except Exception as e:
                    logger.error(
                        f"Failed to update item: {json.dumps(item, default=str)}\n"
                        f"Error: {str(e)}"
                    )

        if success_count < len(batch):
            logger.warning(
                f"Batch {batch_number + 1}: Only updated {success_count} out of "
                f"{len(batch)} items"
            )
        else:
            logger.info(f"Batch {batch_number + 1}: Successfully updated all {len(batch)} items")

        return success_count
    except Exception as e:
        logger.error(f"Error updating batch {batch_number + 1}: {str(e)}")
        return 0

def log_batch_summary(batch: List[Dict], batch_number: int, ttl_time: datetime) -> None:
    """
    Log summary information about a batch of records

    Args:
        batch: List of records in the batch
        batch_number: Current batch number
        ttl_time: TTL time for this batch
    """
    oldest_record = min(batch, key=lambda x: x.get('reportTime', 0))
    newest_record = max(batch, key=lambda x: x.get('reportTime', 0))

    oldest_time = datetime.fromtimestamp(oldest_record.get('reportTime', 0) / 1000, tz=timezone.utc)
    newest_time = datetime.fromtimestamp(newest_record.get('reportTime', 0) / 1000, tz=timezone.utc)

    now = datetime.now(timezone.utc)
    age_range = f"{(now - oldest_time).days} to {(now - newest_time).days}"

    logger.info(
        f"Batch {batch_number} Summary:\n"
        f"  - Records in batch: {len(batch)}\n"
        f"  - TTL set to: {ttl_time.isoformat()} EST\n"
        f"  - Oldest record: {oldest_time.isoformat()} UTC\n"
        f"  - Newest record: {newest_time.isoformat()} UTC\n"
        f"  - Age range: {age_range} days"
    )

def update_old_records(table_name: str = 'ExportImpressionRecordTable', retention_days: int = 60) -> Dict[str, Any]:
    """
    Update TTL for old records in the specified DynamoDB table,
    spreading deletions over time by incrementing TTL values starting from 1 PM EST one week from now

    Args:
        table_name: Name of the DynamoDB table
        retention_days: Number of days to keep records

    Returns:
        Dict[str, Any]: Statistics about the update operation
    """
    logger.info(f"Starting cleanup job for table: {table_name}")
    logger.info(f"Retention period: {retention_days} days")

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    # Calculate cutoff date
    cutoff_date = datetime.now() - timedelta(days=retention_days)
    cutoff_timestamp = int(cutoff_date.timestamp() * 1000)  # Convert to milliseconds for reportTime comparison

    # Get base TTL value (1 PM EST one week from now)
    base_ttl = get_next_week_1pm_est_timestamp()
    base_ttl_time = datetime.fromtimestamp(base_ttl, tz=timezone.utc).astimezone(timezone(timedelta(hours=-5)))

    logger.info(f"Scanning for records older than: {cutoff_date.isoformat()}")
    logger.info(
        f"Base TTL time (for first batch) will be next week "
        f"({base_ttl_time.strftime('%Y-%m-%d')}) at 1 PM EST: {base_ttl_time.isoformat()}"
    )

    # Initialize statistics
    stats = {
        'total_processed': 0,
        'total_updated': 0,
        'batch_count': 0,
        'start_time': datetime.now(),
        'first_ttl': base_ttl,
        'last_ttl': base_ttl,  # Will be updated as batches are processed
        'throttling_events': 0,
        'failed_items': 0,
        'table_name': table_name,
        'retention_days': retention_days,
        'items_per_second': 0.0,  # Initialize to 0
        'cutoff_date': cutoff_date.isoformat(),
        'base_ttl_time': base_ttl_time.isoformat()
    }

    # Scan for old items with pagination
    scan_kwargs = {
        'FilterExpression': '#rt < :cutoff AND attribute_not_exists(#ttl)',
        'ExpressionAttributeNames': {
            '#rt': 'reportTime',
            '#ttl': 'ttl'
        },
        'ExpressionAttributeValues': {
            ':cutoff': cutoff_timestamp
        }
    }

    try:
        done = False
        page_count = 0
        while not done:
            # Perform scan with error handling
            logger.info(f"Scanning page {page_count + 1}...")
            response = handle_throttling(table.scan, **scan_kwargs)
            items = response.get('Items', [])

            if not items:
                logger.info("No more items found")
                break

            page_count += 1
            batch_count = len(items) // BATCH_SIZE + (1 if len(items) % BATCH_SIZE else 0)
            logger.info(f"Found {len(items)} items to update in {batch_count} batches on page {page_count}")

            # Process items in batches
            for i in range(0, len(items), BATCH_SIZE):
                batch = items[i:i + BATCH_SIZE]

                logger.info(f"\nProcessing batch {stats['batch_count'] + 1} ({len(batch)} items)")
                updated = update_batch_with_ttl(table, batch, base_ttl, stats['batch_count'])

                stats['total_processed'] += len(batch)
                stats['total_updated'] += updated
                stats['failed_items'] += len(batch) - updated
                stats['batch_count'] += 1

                # Update last TTL
                stats['last_ttl'] = base_ttl + ((stats['batch_count'] - 1) * TTL_INCREMENT_MINUTES * 60)

                # Print progress
                elapsed_time = (datetime.now() - stats['start_time']).total_seconds()
                items_per_second = stats['total_processed'] / elapsed_time if elapsed_time > 0 else 0
                logger.info(
                    f"Progress: {stats['total_updated']}/{stats['total_processed']} "
                    f"items updated ({items_per_second:.2f} items/second)"
                )

            # Check for more items
            if 'LastEvaluatedKey' in response:
                scan_kwargs['ExclusiveStartKey'] = response['LastEvaluatedKey']
                logger.info("More items available, continuing to next page...")
            else:
                done = True
                logger.info("Completed scanning all items")

    except Exception as e:
        logger.error(f"Error during update process: {str(e)}", exc_info=True)
        raise

    # Calculate final statistics
    stats['end_time'] = datetime.now()
    stats['elapsed_seconds'] = (stats['end_time'] - stats['start_time']).total_seconds()
    stats['ttl_span_minutes'] = stats['batch_count'] * TTL_INCREMENT_MINUTES
    stats['pages_processed'] = page_count
    stats['items_per_second'] = stats['total_processed'] / stats['elapsed_seconds'] if stats['elapsed_seconds'] > 0 else 0


    if stats['total_processed'] > 0:
        stats['success_rate'] = (stats['total_updated'] / stats['total_processed']) * 100

    # Log final statistics
    logger.info("\nFinal Statistics:")
    logger.info(json.dumps(stats, indent=2, default=str))

    # Log recommendations if needed
    if stats['failed_items'] > 0:
        logger.warning(
            f"Failed to update {stats['failed_items']} items. Consider:\n"
            f"1. Checking DynamoDB error logs\n"
            f"2. Verifying IAM permissions\n"
            f"3. Adjusting retry settings"
        )

    if stats.get('items_per_second', float('inf')) < 10:  # Arbitrary threshold for illustration
        logger.warning(
            "Processing speed seems low. Consider:\n"
            "1. Increasing DynamoDB provisioned throughput\n"
            "2. Adjusting batch size\n"
            "3. Implementing parallel processing"
        )

    return stats
