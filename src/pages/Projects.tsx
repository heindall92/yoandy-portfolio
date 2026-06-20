import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { projects } from "@/lib/projects-registry";
import { useSeo } from "@/hooks/use-seo";

const statusStyles: Record<string, string> = {
  PRODUCTION: "bg-primary/10 text-primary border-primary/30",
  WIP:        "bg-neon-yellow/10 text-neon-yellow border-neon-yellow/30",
  ARCHIVED:   "bg-muted text-muted-foreground border-border",
};

const Projects = () => {
  useSeo({
    title: "Proyectos · Heindall — Valhalla SOC y laboratorios profesionales",
    description:
      "Proyectos de ciberseguridad desarrollados por Yoandy Ramírez Delgado: Valhalla SOC (Wazuh + Cowrie + Ollama), laboratorios del Máster en Ciberseguridad & IA y herramientas propias.",
    path: "/projects",
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-mono text-xs text-primary tracking-[0.3em] mb-3">// PROYECTOS · LABS · INVESTIGACIÓN</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
            ARSENAL <em className="text-primary not-italic">DEFENSIVO</em>
          </h1>
          <p className="text-muted-foreground max-w-2xl font-mono text-sm leading-relaxed">
            Plataformas y laboratorios propios que complementan los write-ups ofensivos.
            Stack productivo, código abierto y documentación lista para entregar.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={`/projects/${p.slug}`}
                className="group block rounded-xl border border-border/60 bg-card overflow-hidden hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(120_100%_50%/0.35)] transition-all duration-500"
              >
                {p.screenshots[0] && (
                  <div className="relative aspect-video bg-muted overflow-hidden border-b border-border/40">
                    <img
                      src={p.screenshots[0].src}
                      alt={`${p.name} — preview`}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent pointer-events-none" />
                    <span className={`absolute top-3 right-3 font-mono text-[10px] tracking-[0.2em] px-2 py-1 rounded border ${statusStyles[p.status]}`}>
                      ● {p.status}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div>
                      <h2 className="text-xl font-bold tracking-wide" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}>
                        {p.name}
                      </h2>
                      <p className="font-mono text-[10px] text-muted-foreground tracking-widest">{p.year} · {p.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{p.tagline}. {p.summary}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.tags.slice(0, 6).map((t) => (
                      <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary/90">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <span className="font-mono text-xs text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                      Ver caso completo <ArrowRight size={14} />
                    </span>
                    <a
                      href={p.links.find((l) => l.primary)?.href ?? p.links[0].href}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1.5"
                    >
                      <Github size={14} /> repo
                    </a>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Placeholder card — próximo proyecto */}
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
            <p className="font-mono text-xs text-muted-foreground tracking-[0.2em] mb-2">// PRÓXIMAMENTE</p>
            <p className="text-2xl mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
              PRÁCTICA 2 — MÁSTER EVOLVE
            </p>
            <p className="text-sm text-muted-foreground font-mono max-w-xs">
              En desarrollo. Segunda entrega del Máster en Ciberseguridad &amp; IA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;