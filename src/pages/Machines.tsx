import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

const machines = [
  {
    slug: "vaccine-htb", emoji: "💉", name: "Vaccine",
    desc: "FTP anónimo → SQLi → RCE → Root. Máquina Starting Point con escalada completa.",
    tags: ["SQLi", "FTP", "PostgreSQL", "GTFOBins"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
  },
  {
    slug: "archetype-htb", emoji: "🏛️", name: "Archetype",
    desc: "SMB → MSSQL → xp_cmdshell → WinPEAS → Admin. Máquina Windows Starting Point.",
    tags: ["SMB", "MSSQL", "WinPEAS", "Windows"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
  },
  {
    slug: "oopsie-htb", emoji: "🐛", name: "Oopsie",
    desc: "IDOR → File Upload → Reverse Shell → SUID Escalation. Máquina Linux Starting Point.",
    tags: ["IDOR", "File Upload", "SUID", "Linux"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
  },
  {
    slug: "unified-htb", emoji: "🔗", name: "Unified",
    desc: "Log4Shell (CVE-2021-44228) en UniFi 6.4.54 vía inyección JNDI en el login. Shell inversa con RogueJNDI y manipulación de MongoDB para acceso root.",
    tags: ["Log4Shell", "CVE-2021-44228", "MongoDB", "JNDI"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
  },
  {
    slug: "eighteen-htb", emoji: "🔢", name: "Eighteen",
    desc: "Inyección SQL en el endpoint /add_expense para obtener ejecución de comandos vía xp_cmdshell, suplantación de identidad en MSSQL, acceso remoto con Evil-WinRM, explotación de BadSuccessor (CVE-2025-53779) para DCSync y escalada a Administrador del dominio. Windows Server 2025 AD DC.",
    tags: ["HTB", "Windows", "Active Directory", "CVE-2025-53779"],
    difficulty: "EASY", diffColor: "primary",
  },
  {
    slug: "twomillion-htb", emoji: "💰", name: "TwoMillion",
    desc: "Decodificación ROT13 del código de invitación de la API, registro de usuario y escalada a administrador mediante PUT, inyección de comandos para obtener shell SSH, y escalada de privilegios a Root explotando CVE-2023-0386 (OverlayFS). Ubuntu 22.04.",
    tags: ["HTB", "Linux", "API", "CVE-2023-0386"],
    difficulty: "EASY", diffColor: "primary",
  },
  {
    slug: "cctv-htb", emoji: "📹", name: "CCTV",
    desc: "Sistema de videovigilancia con ZoneMinder y credenciales por defecto. SQL Injection para extraer hashes, sniffing de red interna para capturar contraseñas, túnel SSH a MotionEye y RCE (CVE-2024-51482 / CVE-2025-60787) para obtener root.",
    tags: ["SQLi", "Sniffing", "CVE-2024-51482", "MotionEye"],
    difficulty: "EASY", diffColor: "primary",
  },
  {
    slug: "pterodactyl-htb", emoji: "🦕", name: "Pterodactyl",
    desc: "Máquina Medium con panel Pterodactyl. Enumeración, explotación web y escalada de privilegios.",
    tags: ["Web", "Pterodactyl", "Privesc", "Linux"],
    difficulty: "MEDIUM", diffColor: "neon-yellow",
  },
  {
    slug: "interpreter-htb", emoji: "🖥️", name: "Interpreter",
    desc: "Ejecución remota de código sin autenticación en Mirth Connect mediante CVE-2023-43208 (XStream), obtención de credenciales MySQL, inyección HL7 vía eval(), y escalada a Root aprovechando sudo python3 sin contraseña para asignar SUID a bash.",
    tags: ["HTB", "Linux", "CVE-2023-43208", "HL7"],
    difficulty: "MEDIUM", diffColor: "neon-yellow",
  },
  {
    slug: "airtouch-htb", emoji: "📡", name: "AirTouch",
    desc: "Entorno corporativo WiFi con múltiples SSIDs. Captura de handshakes WPA2-PSK, descifrado de tráfico HTTP, explotación web del router interno y ataque Evil Twin 802.1X para hashes MSCHAPv2 y root.",
    tags: ["HTB", "Linux", "Wi-Fi", "WPA2", "Evil Twin", "802.1X"],
    difficulty: "MEDIUM", diffColor: "neon-yellow",
  },
];

const MachineCard = ({ m }: { m: typeof machines[0] }) => (
  <Link
    to={`/report/${m.slug}`}
    className="group block p-6 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300 hover:-translate-y-1"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{m.emoji}</span>
        <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors">{m.name}</h3>
      </div>
      <FileText size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{m.desc}</p>
    <div className="flex flex-wrap gap-2 mb-3">
      {m.tags.map((tag) => (
        <span key={tag} className="px-2 py-0.5 rounded-full font-mono text-xs bg-muted text-secondary border border-secondary/20">{tag}</span>
      ))}
    </div>
    <div className="flex items-center gap-3 font-mono text-xs">
      <span className={`px-2 py-0.5 rounded bg-${m.diffColor}/10 text-${m.diffColor} border border-${m.diffColor}/20`}>{m.difficulty}</span>
      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">ROOTED ✓</span>
    </div>
  </Link>
);

export { machines, MachineCard };

const Machines = () => (
  <div className="min-h-screen pt-24 pb-16 relative z-10">
    <div className="container mx-auto px-4 max-w-5xl">
      <Link to="/#projects" className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} /> Volver
      </Link>
      <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8">{">"} Máquinas HTB</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {machines.map((m) => <MachineCard key={m.slug} m={m} />)}
      </div>
    </div>
  </div>
);

export default Machines;
