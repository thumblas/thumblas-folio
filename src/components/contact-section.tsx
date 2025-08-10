import React, { useState } from "react";
import Reveal from "@/components/ui/reveal";
import { useContent } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";

export default function ContactSection() {
  const { data: userData } = useContent("user");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [showForm, setShowForm] = useState(false);

  // Listen for global event to toggle the quick message form
  // Allows hero CTA to trigger the form without prop drilling
  React.useEffect(() => {
    const toggle = () => setShowForm((v) => !v);
    window.addEventListener('toggle-contact-form', toggle);
    return () => window.removeEventListener('toggle-contact-form', toggle);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Create mailto link with form data
    const subject = encodeURIComponent(`Message from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoLink = `mailto:${(userData?.content as any)?.email}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Success",
      description: "Opening your email client...",
    });

    // Reset form and hide
    setFormData({ name: "", email: "", message: "" });
    setShowForm(false);
  };

  if (!userData) {
    return (
      <section id="contact" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[--primary] mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  type UserContent = {
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
  };
  const user = userData.content as UserContent;

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-5xl md:text-6xl font-black gradient-text mb-6">Let&#39;s Work Together</h2>
            <p className="text-xl text-gray-700 mb-8">Ready to bring your next project to life? Let&#39;s connect and create something amazing.</p>
          </Reveal>
          
          <div className="flex flex-col items-center gap-6 mb-10">
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="px-6 py-3 rounded-full border border-[--border] text-gray-800 hover:text-gray-900 hover:border-[--primary] transition-colors"
              data-testid="button-say-hello"
            >
              { showForm ? 'Hide quick message' : "Send a quick message" }
            </button>
            {/* <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4"
              onClick={() => setShowForm((v) => !v)}
              data-testid="toggle-contact-form"
            >
              {showForm ? 'Hide quick message' : 'Send a quick message'}
            </button> */}
            {showForm && (
              <Reveal className="dark-glass rounded-3xl p-6 w-full" data-testid="contact-form">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name" 
                    className="w-full bg-white border border-[--border] rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:border-[--primary] focus:outline-none transition-colors"
                    data-testid="input-name"
                  />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Your Email" 
                    className="w-full bg-white border border-[--border] rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:border-[--primary] focus:outline-none transition-colors"
                    data-testid="input-email"
                  />
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your Message" 
                    rows={4} 
                    className="w-full bg-white border border-[--border] rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:border-[--primary] focus:outline-none transition-colors resize-none"
                    data-testid="textarea-message"
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-[--primary] hover:brightness-110 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105"
                    data-testid="button-send-message"
                  >
                    Send Message
                  </button>
                </form>
              </Reveal>
            )}
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mt-10" data-testid="social-links">
            <a 
              href={user.github} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-pastel-sage hover:brightness-105 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              data-testid="social-github"
            >
              <i className="fab fa-github text-2xl text-gray-900 group-hover:text-[--primary]"></i>
            </a>
            <a 
              href={user.linkedin} 
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-pastel-sky hover:brightness-105 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              data-testid="social-linkedin"
            >
              <i className="fab fa-linkedin text-2xl text-[#2B4A5A]"></i>
            </a>
            <a 
              href={`mailto:${user.email}`} 
              className="w-16 h-16 bg-pastel-brown hover:brightness-105 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              data-testid="social-email"
            >
              <i className="fas fa-envelope text-2xl text-[#7A2D3A]"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
