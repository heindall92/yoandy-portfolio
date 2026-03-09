import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

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

const SherlockCard = ({ s }: { s: typeof sherlocks[0] }) => (
  <Link
    to={`/report/${s.slug}`}
    className="group block p-6 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300 hover:-translate-y-1"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{s.emoji}</span>
        <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
      </div>
      <FileText size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
    <div className="flex flex-wrap gap-2 mb-3">
      {s.tags.map((tag) => (
        <span key={tag} className="px-2 py-0.5 rounded-full font-mono text-xs bg-muted text-secondary border border-secondary/20">{tag}</span>
      ))}
    </div>
    <div className="flex items-center gap-3 font-mono text-xs">
      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">SHERLOCK</span>
      <span className={`px-2 py-0.5 rounded bg-${s.diffColor}/10 text-${s.diffColor} border border-${s.diffColor}/20`}>{s.difficulty}</span>
    </div>
  </Link>
);

export { sherlocks, SherlockCard };

const Sherlocks = () => (
  <div className="min-h-screen pt-24 pb-16 relative z-10">
    <div className="container mx-auto px-4 max-w-5xl">
      <Link to="/#projects" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} /> Volver
      </Link>
      <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8">{">"} HTB Sherlocks</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {sherlocks.map((s) => <SherlockCard key={s.slug} s={s} />)}
      </div>
    </div>
  </div>
);

export default Sherlocks;
