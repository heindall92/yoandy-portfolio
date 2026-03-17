import { Link } from "react-router-dom";
import { FileText, ArrowLeft, Terminal, Server } from "lucide-react";
import { motion } from "framer-motion";

const machines = [
  {
    slug: "meow-htb", emoji: "🐱", name: "Meow",
    desc: "Acceso Telnet sin autenticación al servidor. Enumeración básica y obtención de flag como root.",
    tags: ["Telnet", "Enumeration", "Linux"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "fawn-htb", emoji: "🦌", name: "Fawn",
    desc: "Login anónimo en servidor FTP para descargar la flag directamente. Reconocimiento con Nmap.",
    tags: ["FTP", "Anonymous Login", "Nmap"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "dancing-htb", emoji: "💃", name: "Dancing",
    desc: "Sesión nula en SMB para enumerar shares y obtener la flag desde un recurso compartido abierto.",
    tags: ["SMB", "Null Session", "smbclient"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Windows",
  },
  {
    slug: "redeemer-htb", emoji: "🔑", name: "Redeemer",
    desc: "Acceso no autenticado a Redis. Enumeración de bases de datos y extracción de la flag almacenada.",
    tags: ["Redis", "NoSQL", "Enumeration"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "appointment-htb", emoji: "📅", name: "Appointment",
    desc: "SQL Injection en formulario de login para bypass de autenticación y obtención de la flag.",
    tags: ["SQLi", "Login Bypass", "Web"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "explosion-htb", emoji: "💥", name: "Explosion",
    desc: "Acceso RDP con credenciales vacías al usuario Administrator. Enumeración de servicios y flag directa.",
    tags: ["RDP", "WinRM", "Nmap", "Windows"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Windows",
  },
  {
    slug: "preignition-htb", emoji: "🔥", name: "Preignition",
    desc: "Panel de administración Nginx con credenciales por defecto. Fuzzing de directorios con Gobuster.",
    tags: ["Web", "Gobuster", "Default Creds", "Nginx"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "mongod-htb", emoji: "🍃", name: "Mongod",
    desc: "MongoDB sin autenticación expuesto en el puerto 27017. Enumeración de bases de datos y extracción de la flag.",
    tags: ["MongoDB", "NoSQL", "Enumeration"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "synced-htb", emoji: "🔄", name: "Synced",
    desc: "rsync con acceso anónimo. Enumeración de shares y descarga directa de la flag desde el recurso compartido.",
    tags: ["rsync", "Anonymous", "Linux"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "funnel-htb", emoji: "🔧", name: "Funnel",
    desc: "FTP anónimo con credenciales, SSH tunneling a PostgreSQL interno y extracción de flag desde la base de datos.",
    tags: ["FTP", "SSH Tunnel", "PostgreSQL"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "bike-htb", emoji: "🏍️", name: "Bike",
    desc: "SSTI en Node.js/Handlebars. Inyección de plantillas del lado del servidor para ejecución de código remoto.",
    tags: ["SSTI", "Node.js", "Handlebars", "Web"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "vaccine-htb", emoji: "💉", name: "Vaccine",
    desc: "FTP anónimo → SQLi → RCE → Root. Máquina Starting Point con escalada completa.",
    tags: ["SQLi", "FTP", "PostgreSQL", "GTFOBins"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "archetype-htb", emoji: "🏛️", name: "Archetype",
    desc: "SMB → MSSQL → xp_cmdshell → WinPEAS → Admin. Máquina Windows Starting Point.",
    tags: ["SMB", "MSSQL", "WinPEAS", "Windows"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Windows",
  },
  {
    slug: "oopsie-htb", emoji: "🐛", name: "Oopsie",
    desc: "IDOR → File Upload → Reverse Shell → SUID Escalation. Máquina Linux Starting Point.",
    tags: ["IDOR", "File Upload", "SUID", "Linux"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "unified-htb", emoji: "🔗", name: "Unified",
    desc: "Log4Shell (CVE-2021-44228) en UniFi 6.4.54 vía inyección JNDI en el login. Shell inversa con RogueJNDI y manipulación de MongoDB para acceso root.",
    tags: ["Log4Shell", "CVE-2021-44228", "MongoDB", "JNDI"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "ignition-htb", emoji: "🔥", name: "Ignition",
    desc: "Enumeración de vhosts y directory fuzzing con Gobuster contra servidor Nginx. Bypass de login con credenciales por defecto en panel Magento.",
    tags: ["Web", "Gobuster", "Magento", "Default Creds"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "eighteen-htb", emoji: "🔢", name: "Eighteen",
    desc: "Inyección SQL en el endpoint /add_expense para obtener ejecución de comandos vía xp_cmdshell, suplantación de identidad en MSSQL, acceso remoto con Evil-WinRM, explotación de BadSuccessor (CVE-2025-53779) para DCSync y escalada a Administrador del dominio. Windows Server 2025 AD DC.",
    tags: ["HTB", "Windows", "Active Directory", "CVE-2025-53779"],
    difficulty: "EASY", diffColor: "primary",
    os: "Windows",
  },
  {
    slug: "twomillion-htb", emoji: "💰", name: "TwoMillion",
    desc: "Decodificación ROT13 del código de invitación de la API, registro de usuario y escalada a administrador mediante PUT, inyección de comandos para obtener shell SSH, y escalada de privilegios a Root explotando CVE-2023-0386 (OverlayFS). Ubuntu 22.04.",
    tags: ["HTB", "Linux", "API", "CVE-2023-0386"],
    difficulty: "EASY", diffColor: "primary",
    os: "Linux",
  },
  {
    slug: "cctv-htb", emoji: "📹", name: "CCTV",
    desc: "Sistema de videovigilancia con ZoneMinder y credenciales por defecto. SQL Injection para extraer hashes, sniffing de red interna para capturar contraseñas, túnel SSH a MotionEye y RCE (CVE-2024-51482 / CVE-2025-60787) para obtener root.",
    tags: ["SQLi", "Sniffing", "CVE-2024-51482", "MotionEye"],
    difficulty: "EASY", diffColor: "primary",
    os: "Linux",
  },
  {
    slug: "pterodactyl-htb", emoji: "🦕", name: "Pterodactyl",
    desc: "Máquina Medium con panel Pterodactyl. Enumeración, explotación web y escalada de privilegios.",
    tags: ["Web", "Pterodactyl", "Privesc", "Linux"],
    difficulty: "MEDIUM", diffColor: "neon-yellow",
    os: "Linux",
  },
  {
    slug: "interpreter-htb", emoji: "🖥️", name: "Interpreter",
    desc: "Ejecución remota de código sin autenticación en Mirth Connect mediante CVE-2023-43208 (XStream), obtención de credenciales MySQL, inyección HL7 vía eval(), y escalada a Root aprovechando sudo python3 sin contraseña para asignar SUID a bash.",
    tags: ["HTB", "Linux", "CVE-2023-43208", "HL7"],
    difficulty: "MEDIUM", diffColor: "neon-yellow",
    os: "Linux",
  },
  {
    slug: "airtouch-htb", emoji: "📡", name: "AirTouch",
    desc: "Entorno corporativo WiFi con múltiples SSIDs. Captura de handshakes WPA2-PSK, descifrado de tráfico HTTP, explotación web del router interno y ataque Evil Twin 802.1X para hashes MSCHAPv2 y root.",
    tags: ["HTB", "Linux", "Wi-Fi", "WPA2", "Evil Twin", "802.1X"],
    difficulty: "MEDIUM", diffColor: "neon-yellow",
    os: "Linux",
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

const MachineCard = ({ m, index = 0 }: { m: typeof machines[0]; index?: number }) => {
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
            <Terminal size={12} className="text-muted-foreground/60" />
            <span className="font-mono text-xs text-muted-foreground/60 truncate">root@htb:~/{m.slug}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Server size={12} className="text-muted-foreground/40" />
            <span className="font-mono text-[10px] text-muted-foreground/40">{m.os}</span>
          </div>
        </div>

        {/* Content */}
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

          {/* Bottom status bar */}
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

export { machines, MachineCard };

const Machines = () => (
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
        {">"} Máquinas HTB
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-mono text-sm text-muted-foreground mb-10"
      >
        {machines.length} máquinas completadas — ordenadas por dificultad
      </motion.p>
      <div className="grid md:grid-cols-2 gap-6">
        {machines.map((m, i) => <MachineCard key={m.slug} m={m} index={i} />)}
      </div>
    </div>
  </div>
);

export default Machines;
