import { useContent } from "@/hooks/use-content";
import Reveal from "@/components/ui/reveal";

export default function AboutSection() {
  const { data: educationData, isLoading } = useContent("education");

  if (isLoading) {
    return (
      <section id="about" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary] mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!educationData) {
    return (
      <section id="about" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center text-gray-600">Education data not available</div>
          </div>
        </div>
      </section>
    );
  }

  const education = educationData.content;

  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">About Me</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Passionate software engineer with expertise in full-stack development, machine learning, and scalable system architecture.
            </p>
          </Reveal>
          
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {/* Education & Background */}
            <Reveal className="dark-glass rounded-3xl p-8 h-full flex flex-col" data-testid="education-section">
              <h3 className="text-2xl font-bold gradient-text mb-8">Education</h3>
              <div className="space-y-8">
                <div className="border-l-4 border-[--primary] pl-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{education.masters.degree}</h4>
                  <p className="text-[--primary] font-semibold mb-1">{education.masters.school}</p>
                  <p className="text-gray-600 text-sm">{education.masters.year} • CGPA: {education.masters.cgpa}</p>
                </div>
                <div className="border-l-4 border-[#9BC7B5] pl-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{education.bachelors.degree}</h4>
                  <p className="text-[#2B4A5A] font-semibold mb-1">{education.bachelors.school}</p>
                  <p className="text-gray-600 text-sm">{education.bachelors.year}</p>
                </div>
              </div>
            </Reveal>
            
            {/* Personal Info */}
            <Reveal className="dark-glass rounded-3xl p-8 h-full flex flex-col" data-testid="personal-info-section">
              <h3 className="text-2xl font-bold gradient-text mb-8">Beyond Code</h3>
              <div className="space-y-6 flex-1">
                <div className="flex items-start">
                  <i className="fas fa-code text-[--primary] text-xl mr-4 mt-1"></i>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Problem Solver</h4>
                    <p className="text-gray-700">I thrive on tackling complex technical challenges and finding elegant solutions to real-world problems.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-users text-[#2B4A5A] text-xl mr-4 mt-1"></i>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Team Player</h4>
                    <p className="text-gray-700">Experience in collaborative environments, from teaching at IU to working with diverse teams at tech giants.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-trophy text-yellow-500 text-xl mr-4 mt-1"></i>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Award Winner</h4>
                    <p className="text-gray-700">Distinguished performance at multiple hackathons including Hack the Talk, India Hacks, and Rescue Hub.</p>
                  </div>
                </div>
              </div>
              <div className="mt-auto" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
