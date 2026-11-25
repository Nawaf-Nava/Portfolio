"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, PlayCircle, Mail } from "lucide-react";
import { SOCIAL_ICONS } from "@/components/ui/SocialIcon";
import profile from "@/data/profile.json";
import socials from "@/data/socials.json";

function TypedText({ text, className = "", active }: { text: string; className?: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.01 });
  const characters = Array.from(text);
  return (
    <motion.span ref={ref} aria-label={text} className={className} initial="hidden"
      animate={active && isInView ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }}>
      {characters.map((character, index) => (
        <motion.span key={index} aria-hidden="true" className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
            show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.24, ease: "easeOut" } },
          }}>
          {character === " " ? "\u00A0" : character}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const [introComplete, setIntroComplete] = useState(false);

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
              <TypedText text="NAWAF" active={introComplete} />
            </span>
            <span className="block neon-text-red text-[2rem] md:text-5xl xl:text-6xl mt-2 tracking-wide">
              <TypedText text="AI & SOFTWARE PROJECTS" active={introComplete} />
            </span>
          </h1>

          <p className="text-white/70 text-sm md:text-base tracking-wide mb-7 max-w-xl">
            <TypedText text="Software Development | AI Projects | Web Applications" active={introComplete} />
          </p>

          {/* Animated typing list */}
          <motion.ul className="font-hack text-sm md:text-base space-y-2 mb-9">
            {profile.titles.map((title, i) => (
              <motion.li
                key={title}
                variants={{
                  hidden: { opacity: 0, x: -22, filter: "blur(5px)" },
                  show: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: "easeOut" } },
                }}
                initial="hidden"
                whileInView={introComplete ? "show" : undefined}
                viewport={{ once: true, amount: 0.01 }}
                className="flex items-center gap-2 text-white/80"
              >
                <span className="text-neon-red">{">"}</span>
                <TypedText text={title} active={introComplete} />
              </motion.li>
            ))}
          </motion.ul>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-9">
            <motion.a
              initial={{ opacity: 0, x: 64, filter: "blur(7px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              href="#projects"
              className="glow-btn group flex items-center gap-2 px-6 py-3.5 rounded-lg bg-neon-red/90 text-white font-hack text-sm uppercase tracking-wider shadow-[0_0_24px_rgba(255,0,60,0.45)] hover:shadow-[0_0_36px_rgba(255,0,60,0.75)] transition-all"
            >
              <Eye size={17} /> View Portfolio
            </motion.a>
            <motion.a
              initial={{ opacity: 0, x: -64, filter: "blur(7px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
              whileHover={{ y: -4, scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              href={socials.find((s) => s.name === "YouTube")?.url ?? "#videos"}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn flex items-center gap-2 px-6 py-3.5 rounded-lg neon-border-cyan text-neon-cyan font-hack text-sm uppercase tracking-wider hover:bg-neon-cyan/10 transition-colors"
            >
              <PlayCircle size={17} /> Watch YouTube
            </motion.a>
            <motion.a
              initial={{ opacity: 0, x: 64, filter: "blur(7px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              whileHover={{ y: -4, scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${profile.email}`
              className="glow-btn flex items-center gap-2 px-6 py-3.5 rounded-lg border border-white/20 text-white/90 font-hack text-sm uppercase tracking-wider hover:border-neon-red hover:text-neon-red transition-colors"
            >
              <Mail size={17} /> Contact Me
            </motion.a>
          </motion.div>

          {/* Socials */}
          <motion.div className="flex items-center gap-3" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } } }}>
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon] ?? SOCIAL_ICONS.Github;
              if (!s.url) {
                return (
                  <span
                    key={s.name}
                    aria-label={`${s.name} (link coming soon)`}
                    title={`${s.name} — link coming soon`}
                    className="w-11 h-11 flex items-center justify-center rounded-lg glass opacity-40 cursor-not-allowed"
                  >
                    <Icon size={18} />
                  </span>
                );
              }
              return (
                <motion.a
                  key={s.name}
                  variants={{ hidden: { opacity: 0, y: 18, scale: 0.82 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42 } } }}
                  whileHover={{ y: -5, rotate: -4, scale: 1.1 }}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className="w-11 h-11 flex items-center justify-center rounded-lg glass cursor-pointer hover:neon-border-red hover:text-neon-red hover:scale-110 transition-all"
                >
                  <Icon size={18} />
                </motion.a>
              );
            })}
          </motion.div>
        </div>

        {/* Right column — cinematic hacker artwork */}
        <motion.div
          initial={{ opacity: 0, x: 42, scale: 0.94, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ duration: 1.05, ease: "easeOut" }}
          className="order-1 lg:order-2 relative"
        >
          <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
            <Image
              src="/images/earth-photo.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain opacity-90 scale-[1.42]"
            />
          </div>

          {/* Volumetric red glow behind the figure */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.01 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-x-0 top-[8%] bottom-[12%] -z-10 hero-glow-red rounded-full"
          />


          <motion.div
            whileInView={{ y: [0, -8, 0] }}
            viewport={{ once: true, amount: 0.01 }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative left-1/2 z-10 w-screen max-w-none -translate-x-1/2 lg:left-auto lg:mx-auto lg:w-full lg:max-w-[590px] lg:translate-x-0"
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

          {/* HUD annotations floating around the globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.01 }}
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
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40 hover:text-neon-cyan transition-colors"
      >
        <span className="font-hack text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="w-5 h-8 rounded-full border border-white/25 flex justify-center pt-1.5">
          <motion.span
            className="w-1 h-1.5 rounded-full bg-neon-cyan"
            initial={{ y: 0, opacity: 1 }}
            whileInView={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
            viewport={{ once: true, amount: 0.01 }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </span>
      </motion.a>
    </section>
  );
}
