import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, X } from "lucide-react";
import { getProject } from "@/lib/projects-registry";
import { useSeo } from "@/hooks/use-seo";
import { useEffect, useState } from "react";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (lightboxIdx === null || !project) return;
      if (e.key === "ArrowRight") setLightboxIdx((i) => (i === null ? 0 : (i + 1) % project.screenshots.length));
      if (e.key === "ArrowLeft")  setLightboxIdx((i) => (i === null ? 0 : (i - 1 + project.screenshots.length) % project.screenshots.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, project]);

  useSeo({
    title: project ? `${project.name} — ${project.tagline} | Heindall` : "Proyecto no encontrado | Heindall",
    description: project
      ? `${project.name}: ${project.summary}`
      : "Este proyecto no existe o ha sido movido. Vuelve al listado de proyectos.",
    path: slug ? `/projects/${slug}` : "/projects",
    type: "article",
    jsonLd: project
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          name: project.name,
          description: project.summary,
          programmingLanguage: project.stack.join(", "),
          codeRepository: project.links.find((l) => l.primary)?.href,
          author: { "@type": "Person", name: "Yoandy Ramírez Delgado", url: "https://yoandyramirez.com/" },
          inLanguage: "es",
          keywords: project.tags.join(", "),
        }
      : undefined,
  });

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-xl font-mono mb-4">Proyecto no encontrado</p>
          <Link to="/projects" className="text-primary font-mono text-sm hover:underline">← Volver a proyectos</Link>
        </div>
      </div>
    );
  }

  const repoLink = project.links.find((l) => l.primary) ?? project.links[0];

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <Link to="/projects" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft size={14} /> volver a proyectos
        </Link>

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-border/40 pb-12"
        >
          <div className="flex items-center gap-3 mb-4 font-mono text-[11px] tracking-[0.25em] text-muted-foreground">
            <span className="text-primary">● {project.status}</span>
            <span>·</span>
            <span>{project.year}</span>
            <span>·</span>
            <span>{project.role}</span>
          </div>
          <h1 className="mb-6 leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}>
            <span className="text-3xl md:text-4xl block text-primary/70 mb-4">{project.emoji} {project.codename}</span>
            <span
              className="block text-foreground"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.6rem, 9vw, 7.5rem)",
                lineHeight: 0.95,
                letterSpacing: "0.02em",
              }}
            >
              {project.name.toUpperCase().split(/(\s+)/).map((w, i) =>
                w.trim().toUpperCase() === "SOC" ? (
                  <span
                    key={i}
                    className="text-primary"
                    style={{ textShadow: "0 0 32px hsl(var(--primary) / 0.55), 0 0 8px hsl(var(--primary) / 0.4)" }}
                  >
                    {w}
                  </span>
                ) : (
                  <span key={i}>{w}</span>
                )
              )}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 font-light max-w-3xl mb-2">{project.tagline}</p>
          <p className="font-mono text-xs text-primary/80 tracking-wider">{project.context}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-xs tracking-wider transition-all ${
                  l.primary
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_25px_hsl(120_100%_50%/0.4)]"
                    : "border border-border hover:border-primary/50 hover:text-primary"
                }`}
              >
                {l.label.toLowerCase().includes("repo") || l.label.toLowerCase().includes("github") ? <Github size={14} /> : <ExternalLink size={14} />}
                {l.label}
              </a>
            ))}
          </div>
        </motion.header>

        {/* HIGHLIGHTS */}
        <section className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-16">
          {project.highlights.map((h) => (
            <div key={h.label} className="border border-border/50 rounded-lg p-4 bg-card/50">
              <div className="font-bold text-primary text-lg leading-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{h.value}</div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-widest mt-1">{h.label}</div>
            </div>
          ))}
        </section>

        {/* OVERVIEW */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6 font-mono tracking-wider">// 01 OVERVIEW</h2>
          <div className="space-y-5 text-foreground/85 leading-relaxed max-w-3xl">
            {project.description.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* STACK */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6 font-mono tracking-wider">// 02 STACK</h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className="font-mono text-xs px-3 py-1.5 rounded border border-primary/30 bg-primary/5 text-primary">
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* ARCHITECTURE */}
        {project.architecture && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-primary mb-6 font-mono tracking-wider">// 03 ARQUITECTURA</h2>
            <pre className="bg-card border border-border/50 rounded-lg p-6 overflow-x-auto text-xs md:text-sm font-mono text-foreground/80 leading-relaxed">
              {project.architecture}
            </pre>
          </section>
        )}

        {/* RULES */}
        {project.rules && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-primary mb-6 font-mono tracking-wider">// 04 REGLAS DE DETECCIÓN · MITRE ATT&amp;CK</h2>
            <div className="overflow-x-auto rounded-lg border border-border/50">
              <table className="w-full text-sm font-mono">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Nivel</th>
                    <th className="text-left p-3">Detección</th>
                    <th className="text-left p-3">MITRE</th>
                  </tr>
                </thead>
                <tbody>
                  {project.rules.map((r) => {
                    const color =
                      r.level >= 13 ? "text-destructive" :
                      r.level >= 10 ? "text-neon-yellow" :
                      r.level >= 8  ? "text-primary" :
                      "text-muted-foreground";
                    return (
                      <tr key={r.id} className="border-t border-border/30 hover:bg-card/50 transition-colors">
                        <td className="p-3 text-foreground/70">{r.id}</td>
                        <td className={`p-3 font-bold ${color}`}>{r.level}</td>
                        <td className="p-3 text-foreground/90">{r.what}</td>
                        <td className="p-3 text-primary/80 text-xs">{r.mitre}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SCREENSHOTS */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-primary mb-6 font-mono tracking-wider">// 05 CAPTURAS DE PANTALLA</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {project.screenshots.map((s, i) => (
              <figure key={s.src} className="rounded-lg overflow-hidden border border-border/50 bg-card group">
                <button
                  type="button"
                  onClick={() => setLightboxIdx(i)}
                  aria-label={`Ampliar imagen ${i + 1}: ${s.caption}`}
                  className="relative overflow-hidden bg-muted aspect-video w-full block cursor-zoom-in"
                >
                  <img
                    src={s.src}
                    alt={s.caption}
                    loading={i < 2 ? "eager" : "lazy"}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <figcaption className="p-4 font-mono text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary mr-2">[{String(i + 1).padStart(2, "0")}]</span>
                  {s.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 p-8 md:p-12 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent text-center">
          <p className="font-mono text-xs text-primary tracking-[0.3em] mb-3">// EXPLORA EL CÓDIGO</p>
          <h3 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
            ¿Quieres ver cómo funciona por dentro?
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6 text-sm">
            Todo el código, configuración de Wazuh, reglas custom y docker-compose están publicados en GitHub bajo licencia GPL v2.
          </p>
          <a
            href={repoLink.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-mono text-sm tracking-wider hover:shadow-[0_0_30px_hsl(120_100%_50%/0.4)] transition-all"
          >
            <Github size={16} /> Ver repositorio en GitHub
          </a>
        </section>
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIdx !== null && project.screenshots[lightboxIdx] && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxIdx(null)}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
            style={{ background: "rgba(8,18,12,0.92)", backdropFilter: "blur(16px)" }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(null); }}
              className="absolute top-4 right-4 p-2 rounded-full border border-primary/30 bg-background/50 text-primary hover:bg-primary/20 transition"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
            <motion.figure
              key={`lightbox-${lightboxIdx}`}
              initial={{ scale: 0.85, y: 40, opacity: 0, rotateX: 8 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-[92vw] max-h-[88vh] cursor-default"
              style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
            >
              <img
                src={project.screenshots[lightboxIdx].src}
                alt={project.screenshots[lightboxIdx].caption}
                className="max-w-[92vw] max-h-[78vh] object-contain rounded-lg border border-primary/30"
                style={{ boxShadow: "0 40px 90px rgba(0,0,0,0.65), 0 0 60px hsl(var(--primary) / 0.25)" }}
              />
              <figcaption
                className="mt-4 font-mono text-xs md:text-sm text-foreground/85 leading-relaxed text-center max-w-3xl mx-auto"
              >
                <span className="text-primary mr-2">[{String(lightboxIdx + 1).padStart(2, "0")} / {String(project.screenshots.length).padStart(2, "0")}]</span>
                {project.screenshots[lightboxIdx].caption}
              </figcaption>
              {/* Prev / Next */}
              {project.screenshots.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + project.screenshots.length) % project.screenshots.length); }}
                    className="absolute top-1/2 -translate-y-1/2 -left-3 md:-left-14 w-10 h-10 rounded-full border border-primary/30 bg-background/60 text-primary hover:bg-primary/20 transition flex items-center justify-center"
                    aria-label="Anterior"
                  >
                    ‹
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % project.screenshots.length); }}
                    className="absolute top-1/2 -translate-y-1/2 -right-3 md:-right-14 w-10 h-10 rounded-full border border-primary/30 bg-background/60 text-primary hover:bg-primary/20 transition flex items-center justify-center"
                    aria-label="Siguiente"
                  >
                    ›
                  </button>
                </>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;