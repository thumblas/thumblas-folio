import { useEffect, useState } from "react";

export default function Header() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="relative z-30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="font-black tracking-tight text-xl gradient-text">Shivani Firodiya</a>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-700">
          <a href="#about" className="hover:text-[--primary]">About</a>
          <a href="#skills" className="hover:text-[--primary]">Skills</a>
          <a href="#experience" className="hover:text-[--primary]">Experience</a>
          <a href="#projects" className="hover:text-[--primary]">Projects</a>
          <a href="#contact" className="hover:text-[--primary]">Contact</a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="glassmorphism px-3 py-1.5 rounded-lg border border-[--border] hover:border-[--primary] transition-colors"
            data-testid="nav-resume"
          >
            Resume
          </a>
        </nav>
      </div>
      <div className="h-1 bg-[--border]">
        <div className="h-1 bg-[--primary] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}

