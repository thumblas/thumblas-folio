import { useContent } from "@/hooks/use-content";
import Reveal from "@/components/ui/reveal";
import HeroParticles from "@/components/ui/hero-particles";

export default function HeroSection() {
  const { data: userData } = useContent("user");
  const { data: statsData } = useContent("stats");
  const { data: currentRoleData } = useContent("currentRole");
  const { data: skillsData } = useContent("skills");

  const handleHireMe = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactMe = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Signal ContactSection to toggle the quick message form
    const event = new Event('toggle-contact-form');
    window.dispatchEvent(event);
  };

  if (!userData || !statsData || !currentRoleData) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary]"></div>
      </section>
    );
  }

  type UserContent = {
    name: string;
    tagline: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
  };
  type StatsContent = {
    experience: string;
    projects: string;
  };
  type CurrentRoleContent = {
    company: string;
    position: string;
    duration: string;
    location: string;
    description: string;
  };
  type SkillsContent = {
    programmingLanguages: { name: string; icon: string; color: string }[];
  };

  const user = userData.content as UserContent;
  const stats = statsData.content as StatsContent;
  const currentRole = currentRoleData.content as CurrentRoleContent;
  const skills = (skillsData?.content as SkillsContent) || { programmingLanguages: [] };

  return (
    <section id="hero" className="min-h-screen h-screen flex items-center justify-center relative overflow-hidden pt-24">
      {/* Disabled particles for performance */}
      {/* <HeroParticles /> */}
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(to right, rgba(31,45,31,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,45,31,0.06) 1px, transparent 1px)", backgroundSize: '40px 40px' }} />

      <div className="container mx-auto px-6 z-10 relative">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <Reveal className="text-center md:text-left md:max-w-3xl mx-auto md:mx-0 mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="block">SHIVANI</span>
              <span className="block gradient-text">FIRODIYA</span>
            </h1>

            <div className="text-base md:text-xl text-gray-700 mb-6">
              <span className="block mb-2">{user.tagline}</span>
              <span className="block text-base text-[--primary] font-mono">{user.subtitle}</span>
            </div>

            {/* Quick Highlights */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm text-gray-600 mb-8">
              <span className="px-4 py-2 rounded-full bg-pastel-sage">{stats.experience} years experience</span>
              <span className="px-4 py-2 rounded-full bg-pastel-sky">{stats.projects} projects</span>
              <span className="px-4 py-2 rounded-full bg-pastel-sand">{currentRole.company} • {currentRole.position}</span>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a
                href="#experience"
                className="glassmorphism text-gray-900 hover:text-gray-950 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md"
                data-testid="button-cta-experience"
              >
                View Experience
              </a>
              <button
                type="button"
                onClick={handleContactMe}
                className="glassmorphism text-gray-900 hover:text-gray-950 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md"
                data-testid="button-cta-contact"
              >
                Contact Me
              </button>
              <a
                href="/resume.pdf"
                className="glassmorphism text-gray-900 hover:text-gray-950 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-md"
                data-testid="button-cta-experience"
              >
                Resume
              </a>
            </div>

            {/* Quick skills row */}
            {skills.programmingLanguages.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3 text-gray-700">
                {skills.programmingLanguages.slice(0, 6).map((skill) => (
                  <span key={skill.name} className="glassmorphism rounded-xl px-3 py-2 inline-flex items-center gap-2">
                    <i className={`${skill.icon} text-[--primary]`}></i>
                    <span className="text-sm font-medium">{skill.name}</span>
                  </span>
                ))}
              </div>
            )}
          </Reveal>

          {/* Scroll cue */}
          {/* <div className="absolute left-1/2 -translate-x-1/2 bottom-6 text-gray-600 text-sm hidden sm:flex items-center gap-2">
            <i className="fas fa-arrow-down" />
            <span>Scroll</span>
          </div> */}
        </div>
      </div>
    </section>
  );
}
