import IntroSections from "@/components/sections/IntroSections";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Videos from "@/components/sections/Videos";
import Certifications from "@/components/sections/Certifications";
import OtherCertificates from "@/components/sections/OtherCertificates";
import Experience from "@/components/sections/Experience";
import Webinars from "@/components/sections/Webinars";
import CyberDashboard from "@/components/sections/CyberDashboard";

export default function Home() {
  return (
    <>
      <IntroSections />
      <Certifications />
      <Videos />
      <Skills />
      <Projects />
      <Webinars />
      <Experience />
      <OtherCertificates />
      <CyberDashboard />
    </>
  );
}
