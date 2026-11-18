"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

const HeroGlobe = dynamic(() => import("@/components/ui/HeroGlobe"), {
  ssr: false,
});

export default function IntroSections() {
  return (
    <div className="relative isolate overflow-hidden bg-[#060607]">
      {/* One continuous animated globe behind both introductory sections. */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
        <HeroGlobe />
      </div>
      <div className="relative z-10">
        <Hero />
        <About />
      </div>
    </div>
  );
}
