"use client";

import dynamic from "next/dynamic";

const HeroGlobe = dynamic(() => import("@/components/ui/HeroGlobe"), {
  ssr: false,
});

export default function GlobalSiteBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[100lvh] overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#060607]" />
      <div className="absolute inset-0 grid-bg-red opacity-90" />
      <div className="absolute top-[12%] right-[8%] h-[min(520px,70vw)] w-[min(520px,70vw)] rounded-full hero-glow-red opacity-60" />
      <div className="absolute -left-40 top-[48%] h-[420px] w-[420px] rounded-full bg-neon-red/5 blur-[130px]" />
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 opacity-70">
        <HeroGlobe />
      </div>
    </div>
  );
}
