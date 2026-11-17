"use client";

import { motion } from "framer-motion";
import { Code2, ExternalLink } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import projects from "@/data/projects.json";

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 px-5 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Selected Work" title="Projects" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="cyber-card overflow-hidden group"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-cyan-950/80 via-slate-950 to-red-950/60 flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.35),transparent_60%)]" />
                <Code2 size={54} className="relative text-neon-cyan/80 transition-transform duration-500 group-hover:scale-110" />
                <span className="absolute bottom-4 left-5 font-hack text-[11px] uppercase tracking-[0.3em] text-white/45">
                  {project.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-lg mb-2 neon-text-cyan">
                  {project.title}
                </h3>
                <p className="text-white/60 text-sm mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-[11px] font-hack border border-white/15 text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md bg-neon-red text-xs font-hack uppercase tracking-wider hover:shadow-[0_0_16px_rgba(255,0,60,0.6)] transition-shadow"
                >
                  <ExternalLink size={14} /> Open Project
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
