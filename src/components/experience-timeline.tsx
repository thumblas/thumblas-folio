import { useContent } from "@/hooks/use-content";
import Reveal from "@/components/ui/reveal";

export default function ExperienceTimeline() {
  const { data: experiencesData, isLoading } = useContent("experiences");

  if (isLoading) {
    return (
      <section id="experience" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary] mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!experiencesData) {
    return (
      <section id="experience" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-gray-600">Experience data not available</div>
          </div>
        </div>
      </section>
    );
  }

  const experiences = experiencesData.content;

  return (
    <section id="experience" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">Experience</h2>
            <p className="text-xl text-gray-700">Professional journey across leading tech companies</p>
          </Reveal>
          
          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#9BC7B5] to-[#D6EFFF] hidden md:block"></div>
            
            {experiences.map((experience: any, index: number) => (
              <div 
                key={experience.id} 
                className={`relative flex items-center mb-16 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
                data-testid={`experience-${experience.id}`}
              >
                <div className={`md:w-1/2 w-full ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8'}`}>
                  <Reveal className="dark-glass rounded-3xl p-8">
                    <div className={`text-sm font-mono mb-2 ${experience.color === 'electric-blue' ? 'text-[--primary]' : 'text-[#2B4A5A]'}`}>
                      {experience.duration}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{experience.position}</h3>
                    <h4 className={`text-lg font-semibold mb-4 ${experience.color === 'electric-blue' ? 'text-[--primary]' : 'text-[#2B4A5A]'}`}>
                      {experience.company} • {experience.location}
                    </h4>
                    <p className="text-gray-700">{experience.description}</p>
                  </Reveal>
                </div>
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white ${experience.color === 'electric-blue' ? 'bg-[--primary]' : 'bg-pastel-sky'} hidden md:block`}></div>
                <div className={`md:w-1/2 w-0 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
