import { useState } from "react";
import { sanitizeSearch } from "@/lib/security";
import { useSeo } from "@/hooks/use-seo";
import { Link } from "react-router-dom";
import { FileText, Terminal, Server, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const machines = [
  {
    slug: "meow-htb", emoji: "🐱", name: "Meow",
    desc: "Servicio Telnet expuesto sin autenticación que permite acceso directo como root. Reconocimiento con Nmap para identificar el puerto 23 abierto y conexión directa sin credenciales.",
    tags: ["Telnet", "Enumeration", "Linux"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "fawn-htb", emoji: "🦌", name: "Fawn",
    desc: "Servidor FTP vsftpd 3.0.3 con login anónimo habilitado. Reconocimiento con Nmap para identificar el servicio y descarga directa de la flag mediante acceso anónimo al servidor FTP.",
    tags: ["FTP", "Anonymous Login", "Nmap"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "dancing-htb", emoji: "💃", name: "Dancing",
    desc: "Servidor SMB con sesión nula permitida. Enumeración de shares con smbclient para identificar recursos compartidos accesibles y exfiltración de la flag desde un share sin autenticación.",
    tags: ["SMB", "Null Session", "smbclient"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Windows",
  },
  {
    slug: "redeemer-htb", emoji: "🔑", name: "Redeemer",
    desc: "Base de datos Redis expuesta en el puerto 6379 sin autenticación. Conexión directa con redis-cli para enumerar bases de datos, listar claves y extraer la flag almacenada en texto plano.",
    tags: ["Redis", "NoSQL", "Enumeration"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "appointment-htb", emoji: "📅", name: "Appointment",
    desc: "Aplicación web con Apache 2.4.38 y backend PHP/MySQL. Inyección SQL en el formulario de login para bypass de autenticación mediante payload clásico de comilla simple y comentario SQL.",
    tags: ["SQLi", "Login Bypass", "Web"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "explosion-htb", emoji: "💥", name: "Explosion",
    desc: "Servicio RDP expuesto en Windows con la cuenta Administrator sin contraseña. Conexión remota con xfreerdp utilizando credenciales vacías para obtener acceso directo al escritorio y la flag.",
    tags: ["RDP", "xfreerdp", "Nmap", "Windows"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Windows",
  },
  {
    slug: "preignition-htb", emoji: "🔥", name: "Preignition",
    desc: "Servidor Nginx con panel de administración oculto. Directory brute-force con Gobuster para descubrir /admin.php y acceso mediante credenciales por defecto admin:admin.",
    tags: ["Web", "Gobuster", "Default Creds", "Nginx"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "mongod-htb", emoji: "🍃", name: "Mongod",
    desc: "MongoDB 3.6.8 expuesto en el puerto 27017 sin autenticación habilitada. Conexión directa con mongo shell para enumerar bases de datos, colecciones y volcado directo de la flag con mongoexport.",
    tags: ["MongoDB", "NoSQL", "Enumeration"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "synced-htb", emoji: "🔄", name: "Synced",
    desc: "Servicio rsync expuesto con share accesible sin autenticación. Listado de módulos disponibles y descarga directa de la flag desde el recurso compartido mediante rsync anónimo.",
    tags: ["rsync", "Anonymous", "Linux"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "funnel-htb", emoji: "🔧", name: "Funnel",
    desc: "FTP anónimo con credenciales de empleados expuestas. Acceso SSH con password spraying, port forwarding local para alcanzar PostgreSQL interno en puerto 5432 y extracción de la flag desde la base de datos.",
    tags: ["FTP", "SSH Tunnel", "PostgreSQL"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "bike-htb", emoji: "🏍️", name: "Bike",
    desc: "Server-Side Template Injection en aplicación Node.js con motor de plantillas Handlebars. Inyección de payload SSTI en campo de entrada web para lograr ejecución remota de código como root.",
    tags: ["SSTI", "Node.js", "Handlebars", "Web"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "vaccine-htb", emoji: "💉", name: "Vaccine",
    desc: "Acceso FTP anónimo para obtener un archivo ZIP cifrado. Cracking de contraseñas MD5 con hashcat, inyección SQL en panel web para RCE vía COPY FROM PROGRAM de PostgreSQL, y escalada a root abusando de permisos sudo sobre vi (GTFOBins).",
    tags: ["SQLi", "FTP", "PostgreSQL", "GTFOBins"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "archetype-htb", emoji: "🏛️", name: "Archetype",
    desc: "Enumeración SMB anónima para obtener credenciales de configuración MSSQL. Abuso de xp_cmdshell para ejecución remota de código y escalada de privilegios mediante historial de PowerShell que expone contraseñas de administrador.",
    tags: ["SMB", "MSSQL", "xp_cmdshell", "PowerShell"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Windows",
  },
  {
    slug: "oopsie-htb", emoji: "🐛", name: "Oopsie",
    desc: "Manipulación de cookies para escalada horizontal en aplicación web, abuso de IDOR para acceso como Super Admin, subida de PHP webshell para reverse shell, y escalada a root vía binario SUID con PATH hijacking.",
    tags: ["IDOR", "File Upload", "SUID", "PATH Hijack"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "unified-htb", emoji: "🔗", name: "Unified",
    desc: "Explotación de Log4Shell (CVE-2021-44228) en UniFi Network Application 6.4.54 mediante inyección JNDI en el campo remember del login. Shell inversa con RogueJNDI y modificación directa de contraseñas en MongoDB para comprometer la cuenta root.",
    tags: ["Log4Shell", "CVE-2021-44228", "MongoDB", "JNDI"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "precious-htb", emoji: "💎", name: "Precious",
    desc: "Inyección de comandos en pdfkit (CVE-2022-25765) a través de una aplicación Ruby/Sinatra de conversión web. Credenciales en archivos de configuración de Bundler para movimiento lateral y escalada a root mediante deserialización insegura de YAML con sudo.",
    tags: ["CVE-2022-25765", "pdfkit", "YAML", "Ruby"],
    difficulty: "EASY", diffColor: "primary",
    os: "Linux",
  },
  {
    slug: "ignition-htb", emoji: "🔥", name: "Ignition",
    desc: "Resolución de Virtual Host para acceder a panel de administración Magento oculto en servidor Nginx. Directory fuzzing con Gobuster y bypass de login con credenciales por defecto.",
    tags: ["Web", "Gobuster", "Magento", "Virtual Host"],
    difficulty: "VERY EASY", diffColor: "neon-magenta",
    os: "Linux",
  },
  {
    slug: "steamcloud-htb", emoji: "☁️", name: "SteamCloud",
    desc: "Clúster Kubernetes con Kubelet API sin autenticación en puerto 10250. Ejecución remota de comandos en pods existentes, extracción de ServiceAccount token, creación de pod privilegiado con hostPath mount y escape al filesystem del host como root.",
    tags: ["Kubernetes", "Kubelet", "Container Escape", "ServiceAccount"],
    difficulty: "EASY", diffColor: "primary",
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
    desc: "Explotación de dos CVEs en Pterodactyl Panel. Path Traversal (CVE-2025-49132) para leer configuraciones con credenciales MySQL, cracking de hashes bcrypt con John, y escalada a root mediante race condition en udisks2 con imagen XFS y SUID bash.",
    tags: ["CVE-2025-49132", "Pterodactyl", "udisks2", "bcrypt"],
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
  {
    slug: "devvortex-htb", emoji: "🌀", name: "Devvortex",
    desc: "Enumeración de subdominios con ffuf para descubrir Joomla 4.2.6 vulnerable a CVE-2023-23752 (fuga de credenciales API). Acceso al panel con credenciales filtradas, inyección de webshell PHP en template Cassiopeia para reverse shell, extracción de hashes bcrypt de MySQL y escalada a root mediante apport-cli (CVE-2023-1326).",
    tags: ["Joomla", "CVE-2023-23752", "CVE-2023-1326", "MySQL"],
    difficulty: "EASY", diffColor: "primary",
    os: "Linux",
  },
  {
    slug: "kobold-htb", emoji: "🐉", name: "Kobold",
    desc: "Explotación de CVE-2026-23744 en MCPJam Inspector expuesto en 0.0.0.0, permitiendo RCE no autenticado vía /api/mcp/connect. Escalada mediante sg docker aprovechando contraseña vacía en /etc/gshadow, seguida de Docker escape con montaje del filesystem del host.",
    tags: ["CVE-2026-23744", "MCP Inspector", "Docker Escape", "sg"],
    difficulty: "EASY", diffColor: "primary",
    os: "Linux",
  },
  {
    slug: "variatype-htb", emoji: "🔤", name: "VariaType",
    desc: "Cadena de tres CVEs: Git exposed para extraer credenciales, fontTools varLib path traversal (CVE-2025-66034) para webshell como www-data, FontForge ZIP filename injection (CVE-2024-25081) para escalar a steve, y setuptools path traversal (CVE-2025-47273) con sudo misconfiguration para root.",
    tags: ["CVE-2025-66034", "CVE-2024-25081", "CVE-2025-47273", "Git Exposed", "fontTools"],
    difficulty: "MEDIUM", diffColor: "neon-yellow",
    os: "Linux",
  },
  {
    slug: "pirates-htb", emoji: "⚓", name: "Pirates",
    desc: "Máquina Windows Active Directory Hard. Cadena de 8 técnicas avanzadas: Pre-W2K password abuse → gMSA hash extraction → Chisel SOCKS5 → NTLM Relay CVE-2019-1040 + RBCD → S4U2Proxy → LSA Secrets dump → ForceChangePassword → KCD + SPN Hijacking → DCSync. Dominio completamente comprometido.",
    tags: ["Active Directory", "CVE-2019-1040", "RBCD", "KCD", "DCSync", "gMSA", "Kerberos"],
    difficulty: "HARD", diffColor: "destructive",
    os: "Windows",
  },
  {
    slug: "writeup-htb", emoji: "✍️", name: "Writeup",
    desc: "CMS Made Simple 2.2.9.1 vulnerable a SQL Injection ciega basada en tiempo (CVE-2019-9053). Extracción de credenciales con script Python, acceso SSH y escalada de privilegios mediante PATH hijacking en un proceso ejecutado por root.",
    tags: ["CVE-2019-9053", "SQLi", "CMS Made Simple", "PATH Hijacking", "SSH"],
    difficulty: "EASY", diffColor: "neon-green",
    os: "Linux",
  },
  {
    slug: "silentium-htb", emoji: "🤫", name: "Silentium",
    desc: "Máquina Linux con Flowise 3.0.5 y Gogs 0.13.0 en Docker. Cadena de 3 CVEs: reset de contraseña sin auth (CVE-2025-58434) → RCE vía inyección en CustomMCP/Function() (CVE-2025-59528) → escape de contenedor mediante race condition de symlink en hooks de Git de Gogs (CVE-2025-8110).",
    tags: ["CVE-2025-58434", "CVE-2025-59528", "CVE-2025-8110", "Flowise", "Gogs", "Docker", "RCE"],
    difficulty: "EASY", diffColor: "neon-green",
    os: "Linux",
  },
  {
    slug: "boardlight-htb", emoji: "💡", name: "BoardLight",
    desc: "Cadena web Linux Easy: descubrimiento de VHost crm.board.htb con ffuf, login a Dolibarr 17.0.0 con admin:admin, RCE autenticado vía CVE-2023-30253 usando bypass del filtro PHP con mayúsculas (<?pHp), extracción de credenciales en texto plano de conf.php, password reuse para SSH como larissa y escalada a root explotando CVE-2022-37706 en el binario SUID enlightenment_sys.",
    tags: ["CVE-2023-30253", "CVE-2022-37706", "Dolibarr", "Enlightenment", "SUID", "VHost", "ffuf"],
    difficulty: "EASY", diffColor: "primary",
    os: "Linux",
  },
  {
    slug: "logging-htb", emoji: "📋", name: "Logging",
    desc: "Máquina ACTIVA Windows Server 2019 (DC). Cadena: credenciales filtradas en trace log del share SMB Logs con rotación de año (2025→2026), TGT Kerberos para svc_recovery (Protected Users), GenericWrite sobre la gMSA msa_health$ via BloodHound → dump del hash NT, Pass-the-Hash a WinRM, DLL Hijack 32-bit en UpdateChecker Agent para impersonar a jaylee.clifton (user.txt), plantilla ADCS UpdateSrv con ENROLLEE_SUPPLIES_SUBJECT para emitir cert TLS de wsus.logging.htb, DNS poisoning con SeMachineAccountPrivilege y servidor WSUS falso (wsuks) que entrega PsExec64 ejecutado como SYSTEM en el DC.",
    tags: ["Active Directory", "gMSA Abuse", "ADCS", "Rogue WSUS", "DLL Hijack", "DNS Poison", "Pass-the-Hash", "● ACTIVE"],
    difficulty: "MEDIUM", diffColor: "neon-amber",
    os: "Windows",
  },
];

const diffClass = (d: string) => {
  const dl = d.toLowerCase();
  if (dl.includes("very easy")) return "de";
  if (dl.includes("easy")) return "de";
  if (dl.includes("medium")) return "dm";
  if (dl.includes("hard")) return "dh";
  return "de";
};

const diffLabel = (d: string) => {
  const dl = d.toLowerCase();
  if (dl.includes("very easy")) return "VERY EASY";
  if (dl.includes("easy")) return "EASY";
  if (dl.includes("medium")) return "MEDIUM";
  if (dl.includes("hard")) return "HARD";
  return d.toUpperCase();
};

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
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.stripe} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
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

export { machines, MachineCard };

const Machines = () => {
  useSeo({
    title: "Máquinas HTB | Heindall — Write-ups Hack The Box",
    description: "Catálogo de write-ups de máquinas Hack The Box (Linux y Windows): enumeración, explotación y escalada de privilegios paso a paso.",
    path: "/machines",
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = machines.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.desc.toLowerCase().includes(q) ||
      m.tags.some((t) => t.toLowerCase().includes(q)) ||
      m.os.toLowerCase().includes(q) ||
      m.difficulty.toLowerCase().includes(q);

    const matchesFilter =
      filter === "all" ||
      (filter === "very-easy" && m.difficulty === "VERY EASY") ||
      (filter === "easy" && m.difficulty === "EASY") ||
      (filter === "medium" && m.difficulty === "MEDIUM") ||
      (filter === "hard" && m.difficulty === "HARD") ||
      (filter === "linux" && m.os === "Linux") ||
      (filter === "windows" && m.os === "Windows");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="machines-page">
      <style>{`
        .machines-page {
          --ink:#0b1a10;--forest:#0f2318;--pine:#163020;--moss:#1e4030;--sage:#2a6048;
          --green:#00e87a;--green2:rgba(0,232,122,.15);--green3:rgba(0,232,122,.06);
          --cream:#f2ede4;--cream2:#faf7f1;--cream3:#e8e0d0;
          --text-l:#1a2e20;--text-l2:rgba(26,46,32,.55);--text-l3:rgba(26,46,32,.3);
          --text-d:#c8f0dc;--text-d2:rgba(200,240,220,.5);
          --bb:'Bebas Neue',sans-serif;--dm:'DM Sans',sans-serif;--mo:'JetBrains Mono',monospace;
          font-family:var(--dm);
        }

        .m-hero {
          min-height:100vh;
          padding:100px 52px 80px;
          position:relative;
          overflow:hidden;
          background:var(--cream2);
          color:var(--text-l);
        }

        .m-bg-num {
          position:absolute;right:-20px;top:-40px;
          font-family:var(--bb);font-size:clamp(14rem,22vw,26rem);
          color:rgba(26,46,32,.04);line-height:1;pointer-events:none;user-select:none;letter-spacing:-.05em;
        }

        .m-top {
          display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:end;
          margin-bottom:60px;position:relative;z-index:2;
        }

        .m-h {
          font-family:var(--bb);font-size:clamp(3.5rem,6vw,6.5rem);
          line-height:.92;letter-spacing:.02em;color:var(--text-l);
        }
        .m-h em { font-style:normal;color:var(--sage); }

        .m-hdesc {
          font-size:1rem;color:var(--text-l2);line-height:1.8;font-weight:300;
        }

        .m-back {
          display:inline-flex;align-items:center;gap:8px;
          font-family:var(--mo);font-size:.75rem;color:var(--text-l3);
          text-decoration:none;letter-spacing:.08em;margin-bottom:20px;
          transition:color .3s;position:relative;z-index:2;
        }
        .m-back:hover { color:var(--sage); }

        .m-srch {
          position:relative;margin-bottom:14px;z-index:2;
        }
        .m-sin {
          width:100%;padding:16px 50px;background:white;
          border:2px solid rgba(26,46,32,.1);border-radius:10px;
          font-family:var(--mo);font-size:.9rem;color:var(--text-l);
          outline:none;letter-spacing:.04em;transition:all .3s;
          box-shadow:0 2px 8px rgba(0,0,0,.04);
        }
        .m-sin:focus { border-color:var(--sage);box-shadow:0 0 0 4px rgba(42,96,72,.08); }
        .m-sin::placeholder { color:var(--text-l3); }
        .m-sico {
          position:absolute;left:18px;top:50%;transform:translateY(-50%);
          font-size:.85rem;color:var(--text-l3);pointer-events:none;
        }

        .m-frow {
          display:flex;gap:8px;flex-wrap:wrap;margin-bottom:48px;position:relative;z-index:2;
        }
        .m-fb {
          padding:7px 18px;border-radius:20px;font-family:var(--mo);font-size:.72rem;
          border:1.5px solid rgba(26,46,32,.12);background:transparent;color:var(--text-l2);
          cursor:pointer;transition:all .3s;letter-spacing:.07em;
        }
        .m-fb:hover { border-color:var(--sage);color:var(--sage); }
        .m-fb.on { background:var(--sage);border-color:var(--sage);color:white; }

        .m-grid {
          display:grid;grid-template-columns:repeat(3,1fr);gap:20px;
          position:relative;z-index:2;
        }

        .m-card {
          background:white;border:1.5px solid rgba(26,46,32,.07);border-radius:16px;
          overflow:hidden;transition:all .4s cubic-bezier(.23,1,.32,1);
          box-shadow:0 2px 8px rgba(0,0,0,.04);text-decoration:none;display:block;
        }
        .m-card:hover {
          transform:translateY(-8px);border-color:rgba(42,96,72,.2);
          box-shadow:0 24px 48px rgba(0,0,0,.1);
        }

        .mc-top {
          height:148px;position:relative;display:flex;align-items:center;
          justify-content:center;overflow:hidden;
        }
        .mc-ico { font-size:3.2rem;position:relative;z-index:1; }
        .mc-tbg { position:absolute;inset:0; }
        .mc-diff {
          position:absolute;top:12px;right:12px;padding:4px 12px;border-radius:4px;
          font-family:var(--mo);font-size:.58rem;letter-spacing:.1em;font-weight:500;
        }
        .mc-os {
          position:absolute;bottom:12px;left:12px;font-family:var(--mo);font-size:.56rem;
          color:var(--text-l3);background:rgba(242,237,228,.88);padding:3px 10px;
          border-radius:3px;letter-spacing:.08em;
        }

        .mc-body { padding:20px; }
        .mc-name {
          font-family:var(--dm);font-weight:600;font-size:1rem;
          color:var(--text-l);margin-bottom:7px;
        }
        .mc-desc {
          font-size:.85rem;color:var(--text-l2);line-height:1.55;margin-bottom:13px;
          font-weight:300;display:-webkit-box;-webkit-line-clamp:2;
          -webkit-box-orient:vertical;overflow:hidden;
        }
        .mc-tags { display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px; }
        .mc-tag {
          padding:4px 10px;border-radius:3px;font-family:var(--mo);font-size:.68rem;
          background:rgba(42,96,72,.07);border:1px solid rgba(42,96,72,.14);
          color:var(--sage);letter-spacing:.04em;
        }
        .mc-foot { display:flex;align-items:center;justify-content:space-between; }
        .mc-link {
          font-family:var(--mo);font-size:.75rem;color:var(--sage);text-decoration:none;
          display:flex;align-items:center;gap:4px;transition:gap .25s;font-weight:500;
        }
        .mc-link:hover { gap:8px; }

        .mc-de { background:rgba(42,96,72,.1);color:var(--sage);border:1px solid rgba(42,96,72,.25); }
        .mc-dm { background:rgba(245,166,35,.1);color:#f5a623;border:1px solid rgba(245,166,35,.25); }
        .mc-dh { background:rgba(240,79,90,.1);color:#f04f5a;border:1px solid rgba(240,79,90,.25); }

        .m-empty {
          text-align:center;padding:80px;font-family:var(--mo);font-size:.8rem;color:var(--text-l3);
        }

        @media(max-width:1100px) {
          .m-top { grid-template-columns:1fr;gap:20px; }
          .m-grid { grid-template-columns:repeat(2,1fr); }
          .m-hero { padding:100px 24px 60px; }
        }
        @media(max-width:700px) {
          .m-grid { grid-template-columns:1fr; }
          .m-hero { padding:90px 16px 40px; }
        }
      `}</style>

      <div className="m-hero">
        <div className="m-bg-num">{machines.length}</div>

        <Link to="/" className="m-back">
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        <div className="m-top">
          <motion.h1
            className="m-h"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Máquinas<br /><em>HackTheBox</em>
          </motion.h1>
          <motion.p
            className="m-hdesc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {machines.length} máquinas comprometidas con metodología completa. Busca por técnica, sistema operativo o dificultad.
          </motion.p>
        </div>

        <div className="m-srch">
          <input
            type="text"
            className="m-sin"
            placeholder="SQLi · Kubernetes · SUID · Windows · RCE ..."
            value={search}
            onChange={(e) => setSearch(sanitizeSearch(e.target.value))}
          />
          <span className="m-sico">🔍</span>
        </div>

        <div className="m-frow">
          {[
            { key: "all", label: "Todos" },
            { key: "very-easy", label: "Very Easy" },
            { key: "easy", label: "Easy" },
            { key: "medium", label: "Medium" },
            { key: "hard", label: "Hard" },
            { key: "linux", label: "Linux" },
            { key: "windows", label: "Windows" },
          ].map((f) => (
            <button
              key={f.key}
              className={`m-fb ${filter === f.key ? "on" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="m-grid">
          {filtered.map((m) => {
            const dc = diffClass(m.difficulty);
            return (
              <motion.div
                key={m.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/report/${m.slug}`} className="m-card">
                  <div className="mc-top">
                    <div className="mc-tbg" style={{ background: "linear-gradient(135deg,#041810,#07281a)" }} />
                    <span className="mc-ico">{m.emoji}</span>
                    <span className={`mc-diff mc-${dc}`}>{diffLabel(m.difficulty)}</span>
                    <span className="mc-os">{m.os}</span>
                  </div>
                  <div className="mc-body">
                    <div className="mc-name">{m.name}</div>
                    <div className="mc-desc">{m.desc}</div>
                    <div className="mc-tags">
                      {m.tags.slice(0, 4).map((t) => (
                        <span className="mc-tag" key={t}>{t}</span>
                      ))}
                    </div>
                    <div className="mc-foot">
                      <span className="mc-link">Leer writeup →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="m-empty">
            <span style={{ display: "block", fontSize: "2rem", marginBottom: 10 }}>🔍</span>
            Sin resultados — prueba: linux · sqli · kubernetes · windows...
          </div>
        )}
      </div>
    </div>
  );
};

export default Machines;
