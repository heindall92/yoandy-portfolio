import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Terminal, Server } from "lucide-react";
import { motion } from "framer-motion";

const hmvMachines = [
  {
    slug: "dc01-hmv", emoji: "🏰", name: "DC01",
    desc: "Controlador de dominio Windows Server 2022. Enumeración de usuarios con RID brute-force, password spraying para acceso inicial, Kerberoasting para crackear cuentas de servicio, y Pass-the-Hash con privilegios de Enterprise Admin para obtener root.",
    tags: ["Active Directory", "Kerberoasting", "Pass the Hash", "SMB"],
    difficulty: "EASY", diffColor: "neon-magenta",
    os: "Windows",
  },
  {
    slug: "dc01-v2-hmv", emoji: "🏰", name: "DC01 — Pentest Report",
    desc: "Segundo enfoque del DC01: informe completo estilo pentest con cadena de ataque detallada — RID brute-force de 1069 usuarios, password spray, Kerberoasting de file_svc, y Pass-the-Hash con la cuenta de máquina FileServer$ para comprometer el dominio como SYSTEM.",
    tags: ["Active Directory", "Pentest Report", "Kerberoasting", "Pass the Hash"],
    difficulty: "EASY", diffColor: "neon-magenta",
    os: "Windows",
  },
  {
    slug: "tripladvisor-hmv", emoji: "✈️", name: "TriplAdvisor",
    desc: "Windows Server 2008 R2 con XAMPP y WordPress. LFI en el plugin Site Editor (CVE-2018-7422), RCE mediante Log Poisoning en Apache y escalada a SYSTEM con JuicyPotato explotando SeImpersonatePrivilege.",
    tags: ["WordPress", "LFI", "Log Poisoning", "JuicyPotato"],
    difficulty: "EASY", diffColor: "neon-magenta",
    os: "Windows",
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

const HMVCard = ({ m, index = 0 }: { m: typeof hmvMachines[0]; index?: number }) => {
  const style = diffStyles[m.diffColor];

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link
        to={`/report/${m.slug}`}
        className={`group relative block overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-500 hover:-translate-y-2 ${style.glow}`}
      >
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.stripe} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

        <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border/30">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-neon-yellow/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/70" />
          </div>
          <div className="flex items-center gap-2 ml-2 flex-1 min-w-0">
            <Terminal size={12} className="text-muted-foreground/60" />
            <span className="font-mono text-xs text-muted-foreground/60 truncate">root@hmv:~/{m.slug}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server size={12} className="text-muted-foreground/40" />
            <span className="font-mono text-[10px] text-muted-foreground/40">{m.os}</span>
          </div>
        </div>

        <div className="p-5 pl-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl drop-shadow-lg">{m.emoji}</span>
              <div>
                <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">{m.name}</h3>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono mt-1 ${style.badge}`}>{m.difficulty}</span>
              </div>
            </div>
            <FileText size={16} className="text-muted-foreground/30 group-hover:text-primary transition-all duration-300 group-hover:rotate-12" />
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{m.desc}</p>

          <div className="flex flex-wrap gap-1.5">
            {m.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded font-mono text-[10px] bg-muted/80 text-secondary/80 border border-secondary/10 group-hover:border-secondary/30 transition-colors duration-300">{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/20">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] text-primary/70">ROOTED</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-300">
              Ver writeup →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export { hmvMachines, HMVCard };

const HackMyVM = () => (
  <div className="min-h-screen pt-24 pb-16 relative z-10">
    <div className="container mx-auto px-4 max-w-5xl">
      <Link to="/#projects" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} /> Volver
      </Link>
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl font-bold text-primary text-glow-green mb-2"
      >
        {">"} Máquinas HackMyVM
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-mono text-sm text-muted-foreground mb-10"
      >
        {hmvMachines.length} máquinas completadas
      </motion.p>
      <div className="grid md:grid-cols-2 gap-6">
        {hmvMachines.map((m, i) => <HMVCard key={m.slug} m={m} index={i} />)}
      </div>
    </div>
  </div>
);

export default HackMyVM;