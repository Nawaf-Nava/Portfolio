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
      {/* Shared Hero background across both introductory sections. */}
      <div className="pointer-events-none absolute inset-0 z-[-2] grid-bg-red" />
      <div className="pointer-events-none absolute top-1/3 right-[8%] z-[-2] w-[520px] h-[520px] max-w-[70vw] rounded-full hero-glow-red opacity-60" />
      <div className="pointer-events-none absolute -left-40 top-1/2 z-[-2] w-[420px] h-[420px] rounded-full bg-neon-red/5 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 z-[-1] hero-vignette" />
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
