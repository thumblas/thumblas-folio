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
          
          {/* Timeline - improved alternating layout with clearer content */}
          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[3px] h-full bg-gradient-to-b from-[#9BC7B5] to-[#D6EFFF] hidden md:block" />

            {experiences.map((experience: any, index: number) => {
              const bullets: string[] = String(experience.description)
                .split(/;\s+|\.\s+(?=[A-Z])/)
                .map((s: string) => s.trim())
                .filter(Boolean);
              const onLeft = index % 2 === 1;
              return (
                <div
                  key={experience.id}
                  className={`relative mb-16 md:flex md:items-stretch ${onLeft ? '' : 'md:flex-row-reverse'}`}
                  data-testid={`experience-${experience.id}`}
                >
                  {/* Card */}
                  <div className={`w-full md:w-1/2 ${onLeft ? 'md:pr-10 md:text-right' : 'md:pl-10'}`}>
                    <Reveal className="dark-glass rounded-3xl p-8 shadow-sm">
                      <div className={`text-xs md:text-sm font-mono mb-2 ${experience.color === 'electric-blue' ? 'text-[--primary]' : 'text-[#2B4A5A]'}`}>
                        {experience.duration}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{experience.position}</h3>
                      <h4 className={`text-base md:text-lg font-semibold mb-4 ${experience.color === 'electric-blue' ? 'text-[--primary]' : 'text-[#2B4A5A]'}`}>
                        {experience.company} • {experience.location}
                      </h4>
                      {bullets.length > 1 ? (
                        <ul className={`text-gray-800 text-[15px] md:text-base leading-7 space-y-2 list-disc ${onLeft ? 'md:ml-6' : 'md:mr-6'} ml-5`}>
                          {bullets.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-800 text-[15px] md:text-base leading-7">{experience.description}</p>
                      )}
                    </Reveal>
                  </div>

                  {/* Dot */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-1/2 -mt-2 w-4 h-4 rounded-full border-4 border-white ${experience.color === 'electric-blue' ? 'bg-[--primary]' : 'bg-pastel-sky'} hidden md:block`} />

                  {/* Connector from center line to card */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 ${onLeft ? 'right-1/2' : 'left-1/2'} hidden md:block`}
                    style={{ width: '2.5rem' }}
                  >
                    <div className={`h-[2px] ${experience.color === 'electric-blue' ? 'bg-[--primary]' : 'bg-[#9BC7B5]'} ${onLeft ? 'ml-auto' : ''}`} />
                  </div>

                  {/* Spacer column on opposite side */}
                  <div className={`md:w-1/2 w-0 ${onLeft ? 'md:pl-10' : 'md:pr-10'}`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
