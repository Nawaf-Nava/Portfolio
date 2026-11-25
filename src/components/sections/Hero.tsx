"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Eye, PlayCircle, Mail } from "lucide-react";
import { SOCIAL_ICONS } from "@/components/ui/SocialIcon";
import profile from "@/data/profile.json";
import socials from "@/data/socials.json";

const REVEAL_LINE = 0.88;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function useReveal(ref: { current: HTMLElement | null }, active: boolean) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!active || revealed) return;

    let firstCheck = true;
    const checkPosition = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const triggerY = viewportHeight * REVEAL_LINE;

      // On the first check, anything already visible gets its entrance immediately.
      // After that, elements below the fold wait until their top reaches 42% of the viewport.
      const alreadyVisible = firstCheck && rect.top < viewportHeight && rect.bottom > 0;
      firstCheck = false;

      if (alreadyVisible || rect.top <= triggerY) {
        setRevealed(true);
      }
    };

    checkPosition();
    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition);
    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, [active, revealed, ref]);

  return revealed;
}

function TypedText({ text, className = "", active }: { text: string; className?: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useReveal(ref, active);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={active && isInView
        ? { opacity: 1, y: 0, filter: "blur(0px)" }
        : { opacity: 0, y: 8, filter: "blur(4px)" }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      dangerouslySetInnerHTML={{ __html: escapeHtml(text) }}
    />
  );
}

function TitleItem({ title, active }: { title: string; active: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useReveal(ref, active);

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -22, filter: "blur(5px)" }}
      animate={active && isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: -22, filter: "blur(5px)" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="flex items-center gap-2 text-white/80"
    >
      <span className="text-neon-red">{">"}</span>
      <TypedText text={title} active={active} />
    </motion.li>
  );
}

function RevealLink({
  href,
  className,
  direction,
  delay,
  active,
  target,
  rel,
  children,
}: {
  href: string;
  className: string;
  direction: number;
  delay: number;
  active: boolean;
  target?: string;
  rel?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isInView = useReveal(ref, active);

  return (
    <motion.a
      ref={ref}
      initial={false}
      animate={active && isInView
        ? { opacity: 1, x: 0, filter: "blur(0px)" }
        : { opacity: 0, x: direction, filter: "blur(7px)" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      href={href}
      target={target}
      rel={rel}
      className={className}
    >
      {children}
    </motion.a>
  );
}

function SocialLinks({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useReveal(ref, active);

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-3"
      initial="hidden"
      animate={active && isInView ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } } }}
    >
      {socials.map((social) => {
        const Icon = SOCIAL_ICONS[social.icon] ?? SOCIAL_ICONS.Github;
        const iconVariants = {
          hidden: { opacity: 0, y: 18, scale: 0.82, filter: "blur(5px)" },
          show: { opacity: social.url ? 1 : 0.4, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.42, ease: "easeOut" as const } },
        };

        if (!social.url) {
          return (
            <motion.span
              key={social.name}
              aria-label={`${social.name} (link coming soon)`}
              title={`${social.name} — link coming soon`}
              variants={iconVariants}
              className="w-11 h-11 flex items-center justify-center rounded-lg glass cursor-not-allowed"
            >
              <Icon size={18} />
            </motion.span>
          );
        }

        return (
          <motion.a
            key={social.name}
            variants={iconVariants}
            whileHover={{ y: -5, rotate: -4, scale: 1.1 }}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            title={social.name}
            className="w-11 h-11 flex items-center justify-center rounded-lg glass cursor-pointer hover:neon-border-red hover:text-neon-red hover:scale-110 transition-all"
          >
            <Icon size={18} />
          </motion.a>
        );
      })}
    </motion.div>
  );
}

export default function Hero() {
  const [introComplete, setIntroComplete] = useState(false);
  const artworkRef = useRef<HTMLDivElement>(null);
  const artworkVisible = useReveal(artworkRef, introComplete);
  const scrollCueRef = useRef<HTMLAnchorElement>(null);
  const scrollCueVisible = useReveal(scrollCueRef, introComplete);

  useEffect(() => {
    const activate = () => setIntroComplete(true);
    if (document.documentElement.dataset.navaReady === "true") activate();
    window.addEventListener("nava:loader-complete", activate);
    return () => window.removeEventListener("nava:loader-complete", activate);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="mx-auto max-w-7xl w-full px-5 md:px-8 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
        {/* Left column */}
        <div className="order-2 lg:order-1">
          <p className="font-hack text-neon-cyan text-sm md:text-base mb-5 tracking-wide">
            <TypedText text="< Student Developer />" active={introComplete} />
          </p>

          <h1 className="font-display font-black leading-[0.95] mb-5">
            <span className="block text-white text-6xl md:text-7xl xl:text-8xl drop-shadow-[0_0_18px_rgba(255,255,255,0.15)]">
              <TypedText text="NAWAF" active={introComplete} className="notranslate" />
            </span>
            <span className="block neon-text-red text-[2rem] md:text-5xl xl:text-6xl mt-2 tracking-wide">
              <TypedText text="AI & SOFTWARE PROJECTS" active={introComplete} />
            </span>
          </h1>

          <p className="text-white/70 text-sm md:text-base tracking-wide mb-7 max-w-xl">
            <TypedText text="Software Development | AI Projects | Web Applications" active={introComplete} />
          </p>

          {/* Each title waits for its own viewport entry */}
          <ul className="font-hack text-sm md:text-base space-y-2 mb-9">
            {profile.titles.map((title) => (
              <TitleItem key={title} title={title} active={introComplete} />
            ))}
          </ul>

          {/* Each CTA has its own viewport observer */}
          <div className="flex flex-wrap gap-4 mb-9">
            <RevealLink
              href="#projects"
              className="glow-btn group flex items-center gap-2 px-6 py-3.5 rounded-lg bg-neon-red/90 text-white font-hack text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(255,0,60,0.45)] hover:shadow-[0_0_36px_rgba(255,0,60,0.75)] transition-all"
              direction={64}
              delay={0}
              active={introComplete}
            >
              <Eye size={17} /> View Portfolio
            </RevealLink>
            <RevealLink
              href={socials.find((s) => s.name === "YouTube")?.url ?? "#videos"}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn flex items-center gap-2 px-6 py-3.5 rounded-lg neon-border-cyan text-neon-cyan font-hack text-sm uppercase tracking-wider hover:bg-neon-cyan/10 transition-colors"
              direction={-64}
              delay={0}
              active={introComplete}
            >
              <PlayCircle size={17} /> Watch YouTube
            </RevealLink>
            <RevealLink
              href={`mailto:${profile.email}`}
              className="glow-btn flex items-center gap-2 px-6 py-3.5 rounded-lg border border-white/20 text-white/90 font-hack text-sm uppercase tracking-wider hover:border-neon-red hover:text-neon-red transition-colors"
              direction={64}
              delay={0}
              active={introComplete}
            >
              <Mail size={17} /> Contact Me
            </RevealLink>
          </div>

          {/* Social row waits for its own viewport entry, then reveals icons in sequence */}
          <SocialLinks active={introComplete} />
        </div>

        {/* Right column — cinematic hacker artwork */}
        <div
          ref={artworkRef}
          className="order-1 lg:order-2 relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.08, rotate: -16, filter: "blur(12px)" }}
            animate={artworkVisible
              ? { opacity: 0.9, scale: 1, rotate: 0, filter: "blur(0px)" }
              : { opacity: 0, scale: 0.08, rotate: -16, filter: "blur(12px)" }}
            transition={{ type: "spring", stiffness: 150, damping: 17, mass: 0.72 }}
            className="absolute inset-0 z-0 pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src="/images/earth-photo.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain opacity-90 scale-[1.42]"
            />
          </motion.div>

          {/* Volumetric red glow behind the figure */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={artworkVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-[8%] bottom-[12%] -z-10 hero-glow-red rounded-full"
          />


          <motion.div
            initial={{ opacity: 0, y: 34, scale: 0.68, filter: "blur(12px)" }}
            animate={artworkVisible
              ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, y: 34, scale: 0.68, filter: "blur(12px)" }}
            transition={{ type: "spring", stiffness: 125, damping: 16, mass: 0.82, delay: 0.08 }}
            className="relative left-1/2 z-10 w-screen max-w-none -translate-x-1/2 lg:left-auto lg:mx-auto lg:w-full lg:max-w-[590px] lg:translate-x-0"
          >
            <motion.div
              animate={artworkVisible ? { y: [0, -8, 0] } : { y: 0 }}
              transition={{ duration: 8, repeat: artworkVisible ? Infinity : 0, ease: "easeInOut" }}
            >
            <Image
              src="/images/hacker-cutout-hd.png"
              alt="Nawaf portfolio artwork"
              width={754}
              height={866}
              quality={95}
              priority
              sizes="(min-width: 1024px) 560px, 90vw"
              className="relative block w-full h-auto select-none pointer-events-none drop-shadow-[0_18px_28px_rgba(0,0,0,0.85)] [mask-image:linear-gradient(to_bottom,#000_0%,#000_97%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_97%,transparent_100%)]"
            />
            </motion.div>
          </motion.div>

          {/* HUD annotations floating around the globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={artworkVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="pointer-events-none absolute inset-0 z-20 hidden sm:block font-hack select-none"
          >
            <span className="absolute top-[3%] right-[2%] text-[11px] tracking-[0.25em] text-neon-cyan/70">
              TARGET_01
            </span>
            <span className="absolute top-[22%] right-[0%] text-right text-[9px] leading-relaxed tracking-[0.2em] text-neon-red/50">
              SECURE
              <br />
              ACCESS_GRANTED
            </span>
            <span className="absolute top-[55%] -right-[3%] text-[11px] tracking-[0.15em] text-neon-cyan/70">
              /3.118.35.7
            </span>
            <span className="absolute top-[33%] left-[1%] flex items-center gap-1.5 text-[11px] tracking-[0.15em] text-neon-cyan/60">
              <span className="inline-block w-1.5 h-1.5 bg-neon-cyan/70" />
              1D 900FF21
            </span>
            <span className="absolute bottom-[9%] right-[4%] text-[11px] tracking-[0.25em] text-neon-red/70">
              #ATTACK_VECTOR
            </span>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        ref={scrollCueRef}
        href="#about"
        initial={{ opacity: 0, y: 12 }}
        animate={scrollCueVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40 hover:text-neon-cyan transition-colors"
      >
        <span className="font-hack text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="w-5 h-8 rounded-full border border-white/25 flex justify-center pt-1.5">
          <motion.span
            className="w-1 h-1.5 rounded-full bg-neon-cyan"
            animate={scrollCueVisible ? { y: [0, 8, 0], opacity: [1, 0.2, 1] } : { y: 0, opacity: 1 }}
            transition={{ duration: 1.6, repeat: scrollCueVisible ? Infinity : 0 }}
          />
        </span>
      </motion.a>
    </section>
  );
}
