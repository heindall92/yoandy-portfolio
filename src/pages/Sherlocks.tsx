import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Terminal, Search } from "lucide-react";
import { motion } from "framer-motion";

const sherlocks = [
  {
    slug: "crownjewel1-sherlock", emoji: "👑", name: "CrownJewel-1",
    desc: "Análisis forense de Active Directory. Investigación de ataques contra AD CS y extracción de credenciales.",
    tags: ["Active Directory", "AD CS", "DFIR", "Forensics"],
    difficulty: "MEDIUM", diffColor: "neon-yellow",
  },
  {
    slug: "dreamjob1-sherlock", emoji: "💼", name: "Dream Job-1",
    desc: "Investigación de campaña de spear-phishing con análisis de documentos maliciosos y técnicas de ingeniería social.",
    tags: ["Phishing", "Malware Analysis", "DFIR", "Social Engineering"],
    difficulty: "HARD", diffColor: "destructive",
  },
  {
    slug: "dreamjob2-sherlock", emoji: "💼", name: "Dream Job-2",
    desc: "Continuación del análisis forense de la campaña Dream Job. Investigación avanzada de artefactos y persistencia.",
    tags: ["Persistence", "Forensics", "DFIR", "Threat Hunting"],
    difficulty: "HARD", diffColor: "destructive",
  },
  {
    slug: "romcom-sherlock", emoji: "🎭", name: "RomCom",
    desc: "Análisis del grupo APT RomCom. Investigación de malware, C2 y técnicas de evasión utilizadas.",
    tags: ["APT", "Malware", "C2", "Threat Intel", "DFIR"],
    difficulty: "HARD", diffColor: "destructive",
  },
  {
    slug: "brutus-sherlock", emoji: "🔓", name: "Brutus",
    desc: "Análisis forense de un servidor Linux comprometido mediante fuerza bruta SSH. Investigación de logs auth.log y wtmp para rastrear acceso no autorizado.",
    tags: ["SSH Brute Force", "Log Analysis", "DFIR", "Linux"],
    difficulty: "EASY", diffColor: "primary",
  },
];

const diffStyles: Record<string, { badge: string; stripe: string; glow: string }> = {
  "neon-magenta": {
    badge: "bg-neon-magenta/10 text-neon-magenta border border-neon-magenta/20",
    stripe: "bg-neon-magenta",
    glow: "group-hover:shadow-[0_0_25px_hsl(300_100%_60%/0.3)]",
  },
  "primary": {
    badge: "bg-primary/10 text-primary border border-primary/20",
    stripe: "bg-primary",
    glow: "group-hover:shadow-[0_0_25px_hsl(120_100%_50%/0.3)]",
  },
  "neon-yellow": {
    badge: "bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20",
    stripe: "bg-neon-yellow",
    glow: "group-hover:shadow-[0_0_25px_hsl(43_96%_56%/0.3)]",
  },
  "destructive": {
    badge: "bg-destructive/10 text-destructive border border-destructive/20",
    stripe: "bg-destructive",
    glow: "group-hover:shadow-[0_0_25px_hsl(0_85%_60%/0.3)]",
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

const SherlockCard = ({ s, index = 0 }: { s: typeof sherlocks[0]; index?: number }) => {
  const style = diffStyles[s.diffColor];

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link
        to={`/report/${s.slug}`}
        className={`group relative block overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-500 hover:-translate-y-2 ${style.glow}`}
      >
        {/* Difficulty color stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.stripe} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

        {/* Terminal bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/70" />
          </div>
          <div className="flex items-center gap-2 ml-2 flex-1 min-w-0">
            <Search size={12} className="text-muted-foreground/60" />
            <span className="font-mono text-xs text-muted-foreground/60 truncate">sherlock:~/{s.slug}</span>
          </div>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 text-secondary/60 border border-secondary/20">DFIR</span>
        </div>

        {/* Content */}
        <div className="p-5 pl-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl drop-shadow-lg">{s.emoji}</span>
              <div>
                <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{s.name}</h3>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono mt-1 ${style.badge}`}>{s.difficulty}</span>
              </div>
            </div>
            <FileText size={16} className="text-muted-foreground/30 group-hover:text-primary transition-all duration-300 group-hover:rotate-12" />
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{s.desc}</p>

          <div className="flex flex-wrap gap-1.5">
            {s.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded font-mono text-[10px] bg-muted/80 text-secondary/80 border border-secondary/10 group-hover:border-secondary/30 transition-colors duration-300">{tag}</span>
            ))}
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
              <span className="font-mono text-[10px] text-neon-cyan/70">SOLVED</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-300">
              Ver análisis →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export { sherlocks, SherlockCard };

const Sherlocks = () => (
  <div className="min-h-screen pt-24 pb-16 relative z-10">
    <div className="container mx-auto px-4 max-w-5xl">
      <Link to="/sherlocks" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} /> Volver a Sherlocks
      </Link>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl font-bold text-primary text-glow-green mb-2"
      >
        {">"} HTB Sherlocks
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-mono text-sm text-muted-foreground mb-10"
      >
        {sherlocks.length} investigaciones DFIR completadas
      </motion.p>
      <div className="grid md:grid-cols-2 gap-6">
        {sherlocks.map((s, i) => <SherlockCard key={s.slug} s={s} index={i} />)}
      </div>
    </div>
  </div>
);

export default Sherlocks;
