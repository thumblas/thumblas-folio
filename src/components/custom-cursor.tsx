import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function CustomCursor() {
  const isMobile = useIsMobile();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isMobile) {
      return;
    }
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Delayed ring follow effect
      setTimeout(() => {
        setRingPosition({ x: e.clientX - 20, y: e.clientY - 20 });
      }, 50);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener('mousemove', updateMousePosition);
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .skill-badge');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isMobile]);

  return (
    <>
      {!isMobile && (
        <>
          <div
            className="cursor-dot"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
            }}
          />
          <div
            className="cursor-ring"
            style={{
              left: ringPosition.x,
              top: ringPosition.y,
              transform: isHovering ? 'scale(1.5)' : 'scale(1)',
              borderColor: isHovering ? 'var(--primary)' : 'rgba(155, 199, 181, 0.5)'
            }}
          />
        </>
      )}
    </>
  );
}
