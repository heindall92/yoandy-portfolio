import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, ExternalLink, Shield, Terminal, Wrench, CheckCircle, BookOpen, MapPin, FileText, ArrowRight } from "lucide-react";
import profileImg from "@/assets/profile.jpg";
import TypingAnimation from "@/components/TypingAnimation";
import { machines, MachineCard } from "./Machines";
import { sherlocks, SherlockCard } from "./Sherlocks";
import { hmvMachines, HMVCard } from "./HackMyVM";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/yoandyrd92/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/heindall92", label: "GitHub" },
  { icon: ExternalLink, href: "https://tryhackme.com/p/yoandy92", label: "TryHackMe" },
  { icon: ExternalLink, href: "https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa", label: "HackTheBox" },
];

const stats = [
  { label: "eJPT Preparation", value: 75 },
  { label: "TryHackMe Level", value: 80 },
  { label: "TryHackMe Streak", value: 65 },
  { label: "Master's Progress", value: 50 },
];

const skillCategories = [
  { icon: Shield, title: "Offensive Security", skills: ["Kali Linux", "Metasploit", "Nmap", "Burp Suite", "Wireshark", "Gobuster", "FFuf", "Netcat"] },
  { icon: Terminal, title: "Scripting & OS", skills: ["Python", "Bash", "Linux", "Windows"] },
  { icon: Wrench, title: "Tools & Platforms", skills: ["Obsidian", "Git", "TryHackMe", "HackTheBox", "Docker"] },
];

const certifications = [
  { name: "eJPT (eLearnSecurity)", status: "in-progress", year: "2025" },
  { name: "Google IT Professional", status: "done", year: "2024" },
  { name: "Cisco Cyber Defense", status: "done", year: "2024" },
  { name: "IBM Cybersecurity Analyst", status: "done", year: "2024" },
  { name: "Master's Cybersec & AI", status: "in-progress", year: "2026" },
];

const projects = [
  { emoji: "🔴", name: "pentest-notes", description: "Metodologías, checklists y notas de pentesting organizadas para auditorías de seguridad.", tags: ["Markdown", "Pentesting", "Methodology"], url: "https://github.com/heindall92/pentest-notes" },
  { emoji: "📖", name: "tool-manuals", description: "Manuales técnicos detallados para herramientas de seguridad: Nmap, Metasploit, Burp Suite y más.", tags: ["Documentation", "Nmap", "Metasploit"], url: "https://github.com/heindall92/tool-manuals" },
  { emoji: "🛠️", name: "security-scripts", description: "Scripts de automatización en Python y Bash para tareas de reconocimiento y análisis.", tags: ["Python", "Bash", "Automation"], url: "https://github.com/heindall92/security-scripts" },
  { emoji: "🚩", name: "ctf-writeups", description: "Writeups de máquinas y retos CTF de HackTheBox y TryHackMe.", tags: ["CTF", "HackTheBox", "TryHackMe"], url: "https://github.com/heindall92/ctf-writeups" },
];


const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-16 flex items-center relative z-10 ${className}`}>
    <div className="container mx-auto px-4 max-w-5xl w-full animate-fade-in">{children}</div>
  </section>
);

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコ0123456789ABCDEF<>{}[]';
    const fontSize = 14;
    let cols = Math.floor(canvas.width / fontSize);
    let drops = Array(cols).fill(1);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.floor(canvas.width / fontSize);
      drops = Array(cols).fill(1);
    };
    window.addEventListener('resize', handleResize);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(10,14,26,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#4ade80';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 35);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.15 }}
    />
  );
};

const Index = () => {
  return (
    <div className="scroll-smooth relative">
      <MatrixRain />
      {/* ===== HOME ===== */}
      <Section id="home" className="relative overflow-hidden pt-24">
        <div className="absolute inset-0 scanlines pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--neon-green) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-green) / 0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto">
          <div className="relative flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden glow-green border-2 border-primary">
              <img src={profileImg} alt="Yoandy Ramírez Delgado" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -inset-3 rounded-full border border-primary/20 animate-pulse" />
          </div>
          <div className="text-center md:text-left space-y-4">
            <p className="font-mono text-sm text-muted-foreground">$ whoami</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Yoandy <span className="text-primary text-glow-green">Ramírez Delgado</span>
            </h1>
            <p className="text-lg font-display text-secondary tracking-wider">Offensive Security | Pentesting | Red Team</p>
            <div className="h-8">
              <TypingAnimation texts={["Cybersecurity & AI Master's Student", "eJPT Candidate", "CTF Player @ HTB & THM", "Linux Enthusiast", "Pentester in Training"]} />
            </div>
            <div className="flex gap-3 justify-center md:justify-start pt-4 flex-wrap">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-md neon-border neon-border-hover bg-muted/50 font-mono text-sm text-muted-foreground hover:text-primary transition-all duration-300">
                  <link.icon size={16} />
                  <span className="hidden sm:inline">{link.label}</span>
                </a>
              ))}
            </div>
            <Link to="/draft" className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 font-mono text-sm text-primary hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(120_100%_50%/0.2)] transition-all duration-300">
              🧪 <span>Ver nuevo diseño (borrador)</span>
            </Link>
            <Link to="/draft2" className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 font-mono text-sm text-primary hover:bg-primary/20 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(120_100%_50%/0.2)] transition-all duration-300">
              📱 <span>Ver borrador móvil (Draft 2)</span>
            </Link>
          </div>
        </div>
      </Section>

      {/* ===== ABOUT ===== */}
      <Section id="about">
        <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8">{">"} About Me</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300">
              <p className="text-foreground leading-relaxed mb-4">
                Cybersecurity professional focused on <span className="text-primary font-semibold">offensive security</span>, penetration testing, and red team operations. Currently pursuing a Master's in Cybersecurity & Artificial Intelligence.
              </p>
              <p className="text-foreground leading-relaxed">
                Passionate about ethical hacking, CTF challenges, and building security tools. Active contributor on HackTheBox and TryHackMe platforms.
              </p>
            </div>
            <div className="rounded-lg bg-background border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-neon-yellow" />
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-mono text-xs text-muted-foreground ml-2">terminal</span>
              </div>
              <div className="p-4 font-mono text-sm space-y-2">
                <p><span className="text-primary">$</span> whoami</p>
                <p className="text-muted-foreground">yoandy-ramirez-delgado</p>
                <p><span className="text-primary">$</span> cat location.txt</p>
                <p className="text-muted-foreground">Lepe, Huelva, España 🇪🇸</p>
                <p><span className="text-primary">$</span> cat interests.txt</p>
                <p className="text-muted-foreground">Pentesting, Red Team, CTFs, Linux, Python</p>
                <p className="text-primary animate-pulse">$ █</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card neon-border">
              <h3 className="font-display text-xl font-bold text-secondary text-glow-cyan mb-6">Progress Stats</h3>
              <div className="space-y-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm text-foreground">{stat.label}</span>
                      <span className="font-mono text-sm text-primary">{stat.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-1000" style={{ width: `${stat.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: "THM Level", value: "Level 8" }, { label: "THM Streak", value: "31+ days" }, { label: "Focus", value: "Offensive" }, { label: "Master's", value: "2024-2026" }].map((fact) => (
                <div key={fact.label} className="p-4 rounded-lg bg-card neon-border text-center neon-border-hover transition-all duration-300">
                  <p className="font-mono text-xs text-muted-foreground">{fact.label}</p>
                  <p className="font-display text-lg font-bold text-primary mt-1">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ===== SKILLS ===== */}
      <Section id="skills">
        <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8">{">"} Skills & Certifications</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {skillCategories.map((cat) => (
              <div key={cat.title} className="p-6 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <cat.icon size={20} className="text-secondary" />
                  <h3 className="font-display text-lg font-bold text-foreground">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full font-mono text-xs bg-muted text-primary border border-primary/20 hover:border-primary/60 transition-all duration-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-secondary text-glow-cyan mb-4">Certifications</h3>
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center gap-4 p-4 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300">
                {cert.status === "done" ? <CheckCircle size={20} className="text-primary flex-shrink-0" /> : <BookOpen size={20} className="text-neon-yellow flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-foreground truncate">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">{cert.year}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${cert.status === "done" ? "bg-primary/10 text-primary" : "bg-neon-yellow/10 text-neon-yellow"}`}>
                  {cert.status === "done" ? "✅ Done" : "📚 In Progress"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== PROJECTS ===== */}
      <Section id="projects">
        <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8">{">"} Projects & Repositories</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <a key={project.name} href={project.url} target="_blank" rel="noopener noreferrer" className="group block p-6 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{project.emoji}</span>
                  <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors">{project.name}</h3>
                </div>
                <Github size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full font-mono text-xs bg-muted text-secondary border border-secondary/20">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>

        {/* ===== PENTEST REPORTS / MÁQUINAS HTB ===== */}
        <h3 className="font-display text-xl font-bold text-secondary text-glow-cyan mt-12 mb-6">{">"} Máquinas HTB</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {machines.slice(0, 4).map((m, i) => <MachineCard key={m.slug} m={m} index={i} />)}
        </div>
        <div className="mt-8 text-center">
          <Link to="/machines" className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-card border border-border/50 font-mono text-sm text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_20px_hsl(120_100%_50%/0.15)] transition-all duration-500">
            <span>Ver todas las máquinas</span>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{machines.length}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* ===== HTB SHERLOCKS ===== */}
        <h3 className="font-display text-xl font-bold text-secondary text-glow-cyan mt-12 mb-6">{">"} HTB Sherlocks</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {sherlocks.slice(0, 4).map((s, i) => <SherlockCard key={s.slug} s={s} index={i} />)}
        </div>
        <div className="mt-8 text-center">
          <Link to="/sherlocks" className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-card border border-border/50 font-mono text-sm text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_20px_hsl(120_100%_50%/0.15)] transition-all duration-500">
            <span>Ver todos los Sherlocks</span>
            <span className="px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan text-xs">{sherlocks.length}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/* ===== HACKMYVM ===== */}
        <h3 className="font-display text-xl font-bold text-secondary text-glow-cyan mt-12 mb-6">{">"} HackMyVM</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {hmvMachines.slice(0, 4).map((m, i) => <HMVCard key={m.slug} m={m} index={i} />)}
        </div>
        <div className="mt-8 text-center">
          <Link to="/hackmyvm" className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-card border border-border/50 font-mono text-sm text-muted-foreground hover:text-primary hover:border-primary/40 hover:shadow-[0_0_20px_hsl(120_100%_50%/0.15)] transition-all duration-500">
            <span>Ver todas las máquinas HackMyVM</span>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{hmvMachines.length}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </Section>

    </div>
  );
};

export default Index;
