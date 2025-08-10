import { useContent } from "@/hooks/use-content";
import Reveal from "@/components/ui/reveal";

export default function ProjectsSection() {
  const { data: projectsData, isLoading } = useContent("projects");

  if (isLoading) {
    return (
      <section id="projects" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary] mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!projectsData) {
    return (
      <section id="projects" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-gray-600">Projects data not available</div>
          </div>
        </div>
      </section>
    );
  }

  const projects = projectsData.content;

  const getProjectLayoutClass = (layout: string) => {
    switch (layout) {
      case 'wide':
        return 'bento-wide';
      case 'tall':
        return 'bento-tall';
      default:
        return '';
    }
  };

  const getTechBadgeColor = (tech: string) => {
    const techColors: Record<string, string> = {
      'Microservices': 'bg-pastel-sage text-[#2B4A5A]',
      'Docker': 'bg-pastel-sky text-[#2B4A5A]',
      'Kubernetes': 'bg-pastel-lavender text-[#493C73]',
      'Jenkins': 'bg-pastel-sand text-[#6B4F2B]',
      'ML': 'bg-pastel-lavender text-[#493C73]',
      'DNN': 'bg-pastel-sky text-[#2B4A5A]',
      'Audio Processing': 'bg-pastel-sage text-[#2B4A5A]',
      'C/C++': 'bg-pastel-brown text-[#5A4632]',
      'Threading': 'bg-pastel-sand text-[#6B4F2B]',
      'Performance': 'bg-pastel-sky text-[#2B4A5A]',
      'CNN': 'bg-pastel-lavender text-[#493C73]',
      'Autoencoders': 'bg-pastel-sky text-[#2B4A5A]',
      'Deep Learning': 'bg-pastel-sage text-[#2B4A5A]',
      'Django': 'bg-pastel-sage text-[#2B4A5A]',
      'AI': 'bg-pastel-lavender text-[#493C73]',
      'Game Development': 'bg-pastel-sand text-[#6B4F2B]'
    };
    
    return techColors[tech] || 'bg-[#EAEAEA] text-[#6B7280]';
  };

  return (
    <section id="projects" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">Selected Work</h2>
            <p className="text-xl text-gray-700">Impactful projects from professional roles and notable initiatives</p>
          </Reveal>
          
          {/* Project Cards in Waterfall Layout */}
          <div className="waterfall-grid">
            {projects.map((project: any) => (
              <Reveal 
                key={project.id} 
                className={`dark-glass rounded-3xl p-8 parallax-container ${getProjectLayoutClass(project.layout)}`}
                data-testid={`project-${project.id}`}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                    <div className="text-sm text-[--primary] font-mono">{project.duration}</div>
                  </div>
                  <p className="text-gray-700 mb-6">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech: string) => (
                      <span 
                        key={tech} 
                        className={`px-3 py-1 rounded-full text-sm ${getTechBadgeColor(tech)}`}
                        data-testid={`tech-${tech.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project-specific content */}
                {project.highlights && (
                  <div className="text-gray-400">
                    {project.icon && <i className={`${project.icon} text-[--primary] mr-2`}></i>}
                    {project.highlights.join(' • ')}
                  </div>
                )}

                {/* Special layout for Xodia project */}
                {project.games && (
                  <div className="space-y-4 mt-6">
                    {project.games.map((game: any) => (
                      <div 
                        key={game.name} 
                        className="flex items-center justify-between glassmorphism rounded-xl p-3"
                        data-testid={`game-${game.name.toLowerCase()}`}
                      >
                        <span className="text-sm font-semibold text-gray-900">{game.name}</span>
                        <i className={`${game.icon} ${game.color}`}></i>
                      </div>
                    ))}
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
