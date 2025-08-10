import { useEffect, useState } from "react";

const navigationItems = [
  { id: "hero", icon: "fas fa-home", label: "Home" },
  { id: "about", icon: "fas fa-user", label: "About" },
  { id: "experience", icon: "fas fa-briefcase", label: "Experience" },
  { id: "skills", icon: "fas fa-code", label: "Skills" },
  { id: "projects", icon: "fas fa-folder", label: "Projects" },
  { id: "contact", icon: "fas fa-envelope", label: "Contact" },
  { id: "resume", icon: "fas fa-file", label: "Resume", href: "/resume.pdf" }
];

export default function FloatingNavigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'hero';
      
      const viewportCenter = window.innerHeight / 2;
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        if (sectionTop <= viewportCenter && sectionBottom >= viewportCenter) {
          current = section.id;
        }
      });
      setActiveSection(current);
      // Hide on hero; show on all other sections
      setIsVisible(current !== 'hero');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide the pill when the footer becomes visible to avoid overlap
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsFooterVisible(entries.some((e) => e.isIntersecting));
      },
      { threshold: 0.01 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible && !isFooterVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
      data-testid="floating-navigation"
    >
      <div className="glassmorphism rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-4">
          {navigationItems.map((item) => (
            item.href ? (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform duration-200 hover:scale-110 text-gray-600 hover:text-[--primary]"
                title={item.label}
                aria-label={item.label}
                data-testid={`nav-${item.id}`}
              >
                <i className={`${item.icon} text-base`}></i>
              </a>
            ) : (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`transition-transform duration-200 hover:scale-110 ${
                  activeSection === item.id ? 'text-[--primary]' : 'text-gray-600 hover:text-[--primary]'
                }`}
                title={item.label}
                aria-label={item.label}
                data-testid={`nav-${item.id}`}
              >
                <i className={`${item.icon} text-base`}></i>
              </button>
            )
          ))}
        </div>
      </div>
    </nav>
  );
}
