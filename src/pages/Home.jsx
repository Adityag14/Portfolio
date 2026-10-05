import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { AboutMe } from "../components/AboutMe";
import { ExperienceSection } from "../components/ExperienceSection";
import { RecognitionSection } from "../components/RecognitionSection";
import { SkillsSection } from "../components/SkillsSection";
import { Projects } from "../components/Projects";
import { ContactMe } from "../components/ContactMe";
import { Footer } from "../components/Footer";

const Home = () => (
  <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <Navbar />
    <main>
      <HeroSection />
      <AboutMe />
      <ExperienceSection />
      <RecognitionSection />
      <SkillsSection />
      <Projects />
      <ContactMe />
    </main>
    <Footer />
  </div>
);

export default Home;