import { Contact } from "@/designs/classic/components/contact";
import { Education } from "@/designs/classic/components/education";
import { Experience } from "@/designs/classic/components/experience";
import { Expertise } from "@/designs/classic/components/expertise";
import { Footer } from "@/designs/classic/components/footer";
import { Hero } from "@/designs/classic/components/hero";
import { Marquee } from "@/designs/classic/components/marquee";
import { Nav } from "@/designs/classic/components/nav";
import { Projects } from "@/designs/classic/components/projects";
import { Skills } from "@/designs/classic/components/skills";

export default function ClassicHome() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Experience />
        <Projects />
        <Expertise />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
