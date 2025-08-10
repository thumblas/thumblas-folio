import allContent from "@/data/portfolio-content.json";

type ContentEntry = {
  id: string;
  section: string;
  content: any;
  updatedAt?: string;
};

export function useContent(
  section: string
): { data?: ContentEntry; isLoading: false } {
  const contentMap = allContent as Record<string, unknown>;
  const value = contentMap?.[section];
  if (value === undefined) {
    return { data: undefined, isLoading: false };
  }
  return {
    data: {
      id: section,
      section,
      content: value,
    },
    isLoading: false,
  };
}

export function useAllContent(): { data?: ContentEntry[]; isLoading: false } {
  const contentMap = allContent as Record<string, unknown>;
  const entries: ContentEntry[] = Object.keys(contentMap).map((key) => ({
    id: key,
    section: key,
    content: (contentMap as any)[key],
  }));
  return { data: entries, isLoading: false };
}
