"use client";
import { useEffect } from "react";
import CustomCursor from "@/components/custom-cursor";
import Header from "@/components/ui/header";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SkillsSection from "@/components/skills-section";
import ExperienceTimeline from "@/components/experience-timeline";
import ProjectsSection from "@/components/projects-section";
import ContactSection from "@/components/contact-section";
import FloatingNavigation from "@/components/floating-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.add('opacity-100');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('.dark-glass, .skill-badge, .glassmorphism, section[id] h2, section[id] p, section[id] a, section[id] button');
    elementsToObserve.forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen relative z-10">
      <div className="aurora" />
      <Header />
      {!isMobile && <CustomCursor />}
      
      <HeroSection />
      <AboutSection />
      <ExperienceTimeline />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <FloatingNavigation />
      
      {/* Footer */}
      <footer className="py-6 border-t border-[--border]">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-1">
            <div className="text-xl font-bold gradient-text">Shivani Firodiya</div>
            <p className="text-gray-700">Full Stack Developer • Software Engineer</p>
            <p className="text-xs text-gray-500">© 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
