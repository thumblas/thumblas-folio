import { useContent } from "@/hooks/use-content";
import Reveal from "@/components/ui/reveal";

export default function SkillsSection() {
  const { data: skillsData, isLoading } = useContent("skills");

  if (isLoading) {
    return (
      <section id="skills" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary] mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!skillsData) {
    return (
      <section id="skills" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-gray-600">Skills data not available</div>
          </div>
        </div>
      </section>
    );
  }

  const skills = skillsData.content;

  return (
    <section id="skills" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">Skills & Technologies</h2>
            <p className="text-xl text-gray-700">Proficient in modern technologies across the full development stack</p>
          </Reveal>
          
          {/* Bento Skills Grid */}
          <div className="waterfall-grid">
            {/* Programming Languages */}
            <Reveal className="dark-glass rounded-3xl p-8 bento-wide" data-testid="programming-languages-section">
              <h3 className="text-2xl font-bold gradient-text mb-8">Programming Languages</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {skills.programmingLanguages.map((skill: any, index: number) => (
                  <div 
                    key={skill.name} 
                    className="skill-badge glassmorphism rounded-2xl p-4 text-center"
                    data-testid={`skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <i className={`${skill.icon} text-3xl ${skill.color} mb-3`}></i>
                    <div className="font-semibold">{skill.name}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            
            {/* Database & Data */}
            <Reveal className="dark-glass rounded-3xl p-8" data-testid="databases-section">
              <h3 className="text-xl font-bold gradient-text mb-6">Data & Databases</h3>
              <div className="space-y-3">
                {skills.databases.map((db: any) => (
                  <div 
                    key={db.name} 
                    className="flex items-center justify-between glassmorphism rounded-xl p-3"
                    data-testid={`database-${db.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <span className="font-semibold text-gray-900">{db.name}</span>
                    <i className={`${db.icon} ${db.color}`}></i>
                  </div>
                ))}
              </div>
            </Reveal>
            
            {/* Machine Learning */}
            <Reveal className="dark-glass rounded-3xl p-8 bento-tall md:row-span-1" data-testid="machine-learning-section">
              <h3 className="text-xl font-bold gradient-text mb-6">ML & AI</h3>
              <div className="space-y-4">
                {skills.machineLearning.map((ml: any) => (
                  <div 
                    key={ml.name} 
                    className="glassmorphism rounded-xl p-4"
                    data-testid={`ml-${ml.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <div className="flex items-center mb-2">
                      <i className={`${ml.icon} ${ml.color} mr-3`}></i>
                      <span className="font-semibold">{ml.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">{ml.description}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            
            {/* Backend & DevOps */}
            <Reveal className="dark-glass rounded-3xl p-8 bento-wide md:col-span-1" data-testid="backend-devops-section">
              <h3 className="text-2xl font-bold gradient-text mb-8">Backend & DevOps</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {skills.backendDevops.map((tool: any) => (
                  <div 
                    key={tool.name} 
                    className="text-center"
                    data-testid={`devops-${tool.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <i className={`${tool.icon} text-4xl ${tool.color} mb-3`}></i>
                    <div className="font-semibold text-sm text-gray-900">{tool.name}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
