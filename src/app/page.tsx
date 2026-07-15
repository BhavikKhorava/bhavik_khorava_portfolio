import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { AiSystems } from "@/components/sections/ai-systems";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";

function Divider() {
  return (
    <div className="px-6 sm:px-10">
      <div className="section-divider mx-auto w-full max-w-4xl" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Divider />
        <TechStack />
        <Divider />
        <AiSystems />
        <Divider />
        <Experience />
        <Divider />
        <Projects />
        <Divider />
        <Education />
        <Divider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
