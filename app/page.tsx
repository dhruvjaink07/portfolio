import ContactSection from '@/components/ContactSection';
import ExperienceSection from '@/components/ExperienceSection';
import Footer from '@/components/Footer';
import HeroBento from '@/components/HeroBento';
import Nav from '@/components/Nav';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';

export default function Home() {
  return (
    <>
      <main id="main-content" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <HeroBento />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
      <Nav />
    </>
  );
}
