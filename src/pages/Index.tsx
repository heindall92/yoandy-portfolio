import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import profileImg from "@/assets/profile.jpg";
import { machines } from "./Machines";
import { sherlocks } from "./Sherlocks";
import { hmvMachines } from "./HackMyVM";

/* ── All writeups combined ── */
const allWriteups = [
  ...machines.map((m) => ({ ...m, platform: "HTB", type: "machine" })),
  ...sherlocks.map((s) => ({ ...s, platform: "Sherlock", type: "sherlock", os: "N/A" })),
  ...hmvMachines.map((m) => ({ ...m, platform: "HackMyVM", type: "hmv" })),
];

const totalMachines = allWriteups.length;

const socialLinks = [
  { label: "LINKEDIN", val: "/yoandyrd92", sub: "Conectar profesionalmente", href: "https://www.linkedin.com/in/yoandyrd92/", ico: "💼" },
  { label: "GITHUB", val: "/heindall92", sub: "Proyectos y herramientas", href: "https://github.com/heindall92", ico: "🐙" },
  { label: "HACK THE BOX", val: "/heindall", sub: "Perfil y ranking activo", href: "https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa", ico: "🟩" },
  { label: "TRYHACKME", val: "/yoandy92", sub: "Racha activa", href: "https://tryhackme.com/p/yoandy92", ico: "🔴" },
];

const certifications = [
  { ico: "🎯", org: "eLEARNSECURITY", name: "eJPT — Junior Penetration Tester", status: "EN CURSO", statusClass: "cs-w" },
  { ico: "🔵", org: "GOOGLE", name: "Cybersecurity Professional", status: "✓ DONE", statusClass: "cs-d" },
  { ico: "🌐", org: "CISCO", name: "Networking & Security", status: "✓ DONE", statusClass: "cs-d" },
  { ico: "💙", org: "IBM", name: "Cybersecurity Analyst", status: "✓ DONE", statusClass: "cs-d" },
  { ico: "🟩", org: "HTB ACADEMY", name: "Jr. Cybersecurity Analyst Path", status: "✓ FULL PATH", statusClass: "cs-d" },
  { ico: "🎓", org: "EVOLVE ACADEMY", name: "Master Ciberseguridad & AI", status: "EN CURSO", statusClass: "cs-w" },
  { ico: "🏆", org: "OFFSEC", name: "OSCP — Offensive Security", status: "2026", statusClass: "cs-p" },
  { ico: "⚡", org: "HTB", name: "CPTS — Certified Pentester", status: "2026", statusClass: "cs-p" },
];

const roadmap = [
  { n: "01", title: "HTB Jr. Cybersecurity Analyst", desc: "Full path completado · 2024", status: "done", badge: "DONE", badgeClass: "rbd" },
  { n: "02", title: "Google · IBM · Cisco · 6 certs", desc: "Fundamentos sólidos · Completadas", status: "done", badge: "DONE", badgeClass: "rbd" },
  { n: "03", title: "eJPT — Junior Penetration Tester", desc: "En preparación activa — 70% completado", status: "cur", badge: "ACTIVE", badgeClass: "rba" },
  { n: "04", title: "CPTS — HTB Certified Pentester", desc: "Certified Penetration Testing Specialist", status: "", badge: "2026", badgeClass: "rbp" },
  { n: "05", title: "OSCP — OffSec Certified Pro", desc: "El Asgard del offensive security", status: "", badge: "2026", badgeClass: "rbp" },
];

const skills = [
  { ico: "🎯", name: "Penetration Testing", desc: "Evaluaciones PTES/OWASP. Reconocimiento, explotación, post-explotación y reporte técnico.", tags: ["Metasploit", "Burp Suite", "Nmap", "Gobuster", "ffuf"], pct: "82%" },
  { ico: "🌐", name: "Web App Security", desc: "SQLi, XSS, SSRF, JWT attacks, IDOR, LFI/RFI — OWASP Top 10 completo.", tags: ["SQLMap", "Nikto", "jwt_tool", "Nuclei", "XSS Hunter"], pct: "78%" },
  { ico: "🔍", name: "Recon & OSINT", desc: "Enumeración activa/pasiva, DNS recon, subdomain takeover, análisis de superficie.", tags: ["Subfinder", "Amass", "dnsrecon", "unfurl", "Harvester"], pct: "85%" },
  { ico: "🐚", name: "Post-Explotación", desc: "PrivEsc Linux/Windows, cron hijacking, SUID abuse, pivoting y movimiento lateral.", tags: ["LinPEAS", "WinPEAS", "Penelope", "MSFVenom", "hashcat"], pct: "75%" },
  { ico: "🤖", name: "AI + Automation", desc: "MCP Hacking Server propio: 21 tools + Claude AI en flujos de pentesting.", tags: ["MCP Protocol", "Claude API", "Python", "Bash"], pct: "80%" },
  { ico: "🏴‍☠️", name: "CTF & Research", desc: `${totalMachines}+ máquinas en HTB, THM, HackMyVM. Serie de tutoriales ES/EN.`, tags: ["HackTheBox", "TryHackMe", "HackMyVM"], pct: "88%" },
];

const toolsRow1 = ["⚡ Metasploit", "🌐 Burp Suite", "🔍 Nmap", "💉 SQLMap", "📂 Gobuster", "🦊 ffuf", "🐍 Python", "🔐 hashcat", "🛡️ Nikto", "🔑 jwt_tool", "📡 Subfinder", "🕵️ theHarvester", "🤖 MCP+AI"];
const toolsRow2 = ["🧪 LinPEAS", "🪟 WinPEAS", "🔴 MSFVenom", "📡 Amass", "🔎 dnsrecon", "🔗 unfurl", "📜 Nuclei", "🐚 Penelope", "🖧 Wireshark", "🔀 John the Ripper", "🩸 BloodHound"];

/* ── Difficulty helpers ── */
const diffClass = (d: string) => {
  const dl = d.toLowerCase();
  if (dl.includes("very easy") || dl.includes("easy")) return "de";
  if (dl.includes("medium")) return "dm";
  return "dh";
};
const diffLabel = (d: string) => d.toUpperCase();

const marqueeItems = ["HEINDALL", "GUARDIAN OF BIFROST", "OFFENSIVE SECURITY", "PENETRATION TESTING", "RED TEAM OPS", "AI + HACKING", "CTF HUNTER"];

const Index = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [counter, setCounter] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  /* Counter animation */
  useEffect(() => {
    let n = 0;
    const iv = setInterval(() => {
      n++;
      setCounter(n);
      if (n >= totalMachines) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, []);

  /* Reveal on scroll */
  useEffect(() => {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("v");
            e.target.querySelectorAll<HTMLElement>(".skf").forEach((b) => {
              if (!b.dataset.a) {
                b.dataset.a = "1";
                setTimeout(() => (b.style.width = b.dataset.w || "0"), 200);
              }
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".rev,.revr").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  /* Nav solid on scroll */
  useEffect(() => {
    const handler = () => {
      const nav = document.getElementById("main-nav");
      if (nav) nav.classList.toggle("solid", window.scrollY > 60);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* Filter writeups */
  const filtered = allWriteups.filter((w) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      w.name.toLowerCase().includes(q) ||
      w.desc.toLowerCase().includes(q) ||
      w.tags.some((t) => t.toLowerCase().includes(q));

    let matchFilter = true;
    if (filter === "htb") matchFilter = w.platform === "HTB";
    else if (filter === "sherlock") matchFilter = w.platform === "Sherlock";
    else if (filter === "hmv") matchFilter = w.platform === "HackMyVM";
    else if (filter === "easy") matchFilter = w.difficulty.toLowerCase().includes("easy");
    else if (filter === "medium") matchFilter = w.difficulty.toLowerCase().includes("medium");
    else if (filter === "hard") matchFilter = w.difficulty.toLowerCase() === "hard";

    return matchSearch && matchFilter;
  });

  return (
    <div className="draft-page">
      <style>{`
        /* ─── MAIN PAGE STYLES ─── */
        .draft-page{
          --ink:#0b1a10;--forest:#0f2318;--pine:#163020;--moss:#1e4030;--sage:#2a6048;
          --green:#00e87a;--green2:rgba(0,232,122,.15);--green3:rgba(0,232,122,.06);
          --cream:#f2ede4;--cream2:#faf7f1;--cream3:#e8e0d0;
          --text-d:#c8f0dc;--text-d2:rgba(200,240,220,.5);--text-d3:rgba(200,240,220,.25);
          --text-l:#1a2e20;--text-l2:rgba(26,46,32,.55);--text-l3:rgba(26,46,32,.3);
          --blue:#38d9f5;--amber:#f5a623;--red:#f04f5a;
          --bb:'Bebas Neue',sans-serif;--dm:'DM Sans',sans-serif;--mo:'JetBrains Mono',monospace;
          font-family:var(--dm);background:var(--ink);color:var(--text-d);overflow-x:hidden;font-size:16px;
        }
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@300;400;500&display=swap');

        /* NAV */
        .dnav{position:fixed;top:0;left:0;right:0;z-index:300;display:flex;justify-content:space-between;align-items:center;padding:22px 52px;transition:all .4s}
        .dnav.solid{background:rgba(11,26,16,.92);backdrop-filter:blur(24px);border-bottom:1px solid rgba(0,232,122,.08);padding:15px 52px}
        .nlogo{display:flex;align-items:center;gap:12px;text-decoration:none}
        .nlogo-h{font-family:var(--bb);font-size:1.3rem;letter-spacing:.25em;color:var(--green);line-height:1}
        .nlogo-s{font-family:var(--mo);font-size:.6rem;color:var(--text-d3);letter-spacing:.2em;margin-top:2px}
        .nlinks{display:flex;gap:28px;list-style:none;margin:0;padding:0}
        .nlinks a{font-family:var(--mo);font-size:.75rem;color:var(--text-d3);text-decoration:none;letter-spacing:.12em;transition:color .3s}
        .nlinks a:hover{color:var(--green)}

        /* HERO */
        .draft-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:100px 52px 80px}
        .h-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% 55%,var(--forest) 0%,var(--ink) 70%)}
        .h-bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,232,122,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,232,122,.03) 1px,transparent 1px);background-size:56px 56px}

        /* Main card */
        .main-card{position:relative;z-index:10;width:100%;max-width:1160px;background:linear-gradient(135deg,var(--pine) 0%,var(--forest) 100%);border-radius:28px;overflow:hidden;box-shadow:0 60px 120px rgba(0,0,0,.6),0 0 0 1px rgba(0,232,122,.12),inset 0 1px 0 rgba(0,232,122,.1);display:grid;grid-template-columns:1.1fr 1fr;min-height:600px}
        .card-left{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:44px}
        .cl-top{display:flex;justify-content:space-between;align-items:flex-start;position:relative;z-index:5}
        .cl-brand{font-family:var(--bb);font-size:.95rem;letter-spacing:.25em;color:var(--green);display:flex;align-items:center;gap:8px}
        .cl-brand-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 10px var(--green);animation:pd 1.2s infinite alternate}
        @keyframes pd{to{opacity:.2;transform:scale(.5)}}
        .cl-slash{font-family:var(--bb);font-size:.95rem;letter-spacing:.2em;color:rgba(0,232,122,.3)}

        /* Orb */
        .orb-wrap{position:absolute;top:42%;left:50%;transform:translate(-50%,-50%);width:300px;height:300px;z-index:2}
        .orb{width:100%;height:100%;position:relative;display:flex;align-items:center;justify-content:center}
        .orb-ring{position:absolute;border-radius:50%;border:1px solid;animation:ring-spin linear infinite;transform-origin:center}
        .orb-ring-1{width:330px;height:330px;border-color:rgba(0,232,122,.08);animation-duration:30s}
        .orb-ring-2{width:280px;height:280px;border-color:rgba(0,232,122,.12);animation-duration:20s;animation-direction:reverse;border-style:dashed}
        .orb-ring-3{width:230px;height:230px;border-color:rgba(0,232,122,.15);animation-duration:15s}
        @keyframes ring-spin{to{transform:rotate(360deg)}}
        .orb-aura{position:absolute;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(0,232,122,.18) 0%,rgba(0,232,122,.08) 35%,transparent 70%);animation:aura-pulse 4s ease-in-out infinite}
        @keyframes aura-pulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.1);opacity:1}}
        .orb-core{width:160px;height:160px;border-radius:50%;background:radial-gradient(circle at 38% 35%,rgba(0,232,122,.35) 0%,rgba(15,48,32,.8) 50%,rgba(11,26,16,.95) 100%);border:1px solid rgba(0,232,122,.3);box-shadow:0 0 60px rgba(0,232,122,.2),0 0 120px rgba(0,232,122,.08),inset 0 0 40px rgba(0,232,122,.1);position:relative;z-index:3;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .orb-core::before{content:'';position:absolute;top:10%;left:15%;width:40%;height:30%;border-radius:50%;background:rgba(255,255,255,.12);filter:blur(8px)}
        .orb-rune{font-family:var(--bb);font-size:3.2rem;color:rgba(0,232,122,.7);text-shadow:0 0 30px var(--green);position:relative;z-index:2;animation:rune-glow 3s ease-in-out infinite}
        @keyframes rune-glow{0%,100%{text-shadow:0 0 20px var(--green),0 0 40px rgba(0,232,122,.4)}50%{text-shadow:0 0 40px var(--green),0 0 80px rgba(0,232,122,.6)}}
        .orb-scan{position:absolute;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,rgba(0,232,122,.5),transparent);animation:oscan 3s linear infinite;z-index:4;pointer-events:none}
        @keyframes oscan{0%{top:5%;opacity:0}10%{opacity:.8}90%{opacity:.5}100%{top:95%;opacity:0}}
        .particle{position:absolute;width:3px;height:3px;border-radius:50%;background:var(--green);box-shadow:0 0 6px var(--green);animation:particle-float linear infinite}
        .p1{top:15%;left:25%;animation-duration:6s}.p2{top:25%;right:18%;animation-duration:8s;animation-delay:-2s;width:4px;height:4px}.p3{bottom:20%;left:30%;animation-duration:7s;animation-delay:-4s}.p4{bottom:30%;right:25%;animation-duration:9s;animation-delay:-1s;opacity:.6}.p5{top:45%;left:10%;animation-duration:5s;animation-delay:-3s;opacity:.4}.p6{top:55%;right:12%;animation-duration:7s;animation-delay:-5s;opacity:.7}
        @keyframes particle-float{0%{transform:translateY(0) scale(1);opacity:1}33%{transform:translateY(-12px) translateX(8px) scale(1.3);opacity:.7}66%{transform:translateY(-6px) translateX(-10px) scale(.8);opacity:.9}100%{transform:translateY(0) scale(1);opacity:1}}

        .cl-bottom{position:relative;z-index:5;margin-top:auto;padding-top:24px}
        .cl-tag{font-family:var(--mo);font-size:.72rem;color:rgba(0,232,122,.45);letter-spacing:.15em;margin-bottom:12px}
        .cl-headline{font-family:var(--bb);font-size:clamp(3.2rem,5.5vw,5.5rem);line-height:.92;letter-spacing:.02em;color:var(--text-d)}
        .cl-headline span{color:var(--green);display:block}
        .cl-sub{font-family:var(--dm);font-size:.95rem;color:var(--text-d2);margin-top:14px;font-weight:300;line-height:1.6;max-width:400px}

        /* Right card */
        .card-right{background:var(--cream2);display:flex;flex-direction:column;justify-content:space-between;padding:40px 44px;position:relative;overflow:hidden}
        .cr-deco{position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:rgba(0,232,122,.06);pointer-events:none}
        .cr-deco2{position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;border-radius:50%;background:rgba(0,232,122,.04);pointer-events:none}
        .cr-label{font-family:var(--mo);font-size:.72rem;color:var(--text-l3);letter-spacing:.2em;margin-bottom:14px;text-transform:uppercase}
        .cr-big-num{font-family:var(--bb);font-size:clamp(4.5rem,9vw,7.5rem);color:var(--text-l);line-height:.9;letter-spacing:.02em}
        .cr-big-num span{color:var(--sage);font-size:60%}
        .cr-desc{font-size:.95rem;color:var(--text-l2);line-height:1.65;margin-top:14px;font-weight:300;max-width:320px}
        .cr-badges{display:flex;flex-direction:column;gap:10px}
        .cr-badge{display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:10px;background:var(--cream);border:1px solid rgba(26,46,32,.08)}
        .cb-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .cb-g{background:var(--sage);box-shadow:0 0 8px rgba(42,96,72,.5)}
        .cb-b{background:#3aafa9;box-shadow:0 0 8px rgba(58,175,169,.5)}
        .cb-a{background:var(--amber);box-shadow:0 0 8px rgba(245,166,35,.5)}
        .cb-txt{font-family:var(--dm);font-size:.9rem;color:var(--text-l);flex:1;font-weight:500}
        .cb-val{font-family:var(--bb);font-size:1.15rem;color:var(--text-l);letter-spacing:.05em}
        .cr-btn{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;background:var(--ink);border-radius:10px;text-decoration:none;transition:all .4s;cursor:pointer}
        .cr-btn:hover{background:var(--forest);transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.3)}
        .cr-btn-txt{font-family:var(--bb);font-size:1.15rem;letter-spacing:.12em;color:var(--green)}
        .cr-btn-ico{width:36px;height:36px;border-radius:8px;background:var(--green);display:flex;align-items:center;justify-content:center;font-size:.9rem}

        /* Marquee */
        .mq{background:var(--green);overflow:hidden;padding:13px 0;position:relative;z-index:50}
        .mq-t{display:flex;animation:mqa 22s linear infinite;white-space:nowrap}
        .mq-i{font-family:var(--bb);font-size:.82rem;letter-spacing:.28em;color:var(--ink);padding:0 40px;flex-shrink:0}
        .mq-sep{color:rgba(11,26,16,.3);flex-shrink:0;font-size:.7rem}
        @keyframes mqa{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

        /* Sections */
        .sec{padding:100px 52px;position:relative;z-index:10}
        .sec-dark{background:var(--ink)}
        .sec-mid{background:var(--forest)}
        .stag{display:flex;align-items:center;gap:14px;font-family:var(--mo);font-size:.72rem;letter-spacing:.22em;margin-bottom:56px;color:var(--green)}
        .stag::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 10px var(--green);flex-shrink:0}
        .stag::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(0,232,122,.2),transparent)}
        .bh{font-family:var(--bb);font-size:clamp(3.5rem,6vw,7rem);line-height:.92;letter-spacing:.02em;color:var(--text-d)}
        .bh em{font-style:normal;color:var(--green)}

        /* About */
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
        .about-p{font-size:1rem;color:var(--text-d2);line-height:1.9;margin-bottom:16px;font-weight:300}
        .about-p strong{color:var(--text-d);font-weight:500}
        .hl{color:var(--green)}
        .quote-block{margin-top:36px;padding:24px 28px;background:var(--green3);border-left:2px solid rgba(0,232,122,.4);border-radius:0 10px 10px 0}
        .qb-rune{font-family:var(--mo);font-size:.58rem;color:var(--green);letter-spacing:.2em;margin-bottom:8px;opacity:.6}
        .qb-txt{font-size:.92rem;color:var(--text-d2);line-height:1.8;font-style:italic;font-weight:300}

        /* Terminal */
        .term{background:rgba(5,14,8,.9);border:1px solid rgba(0,232,122,.1);border-radius:14px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,.5)}
        .t-bar{background:rgba(10,22,14,.9);padding:12px 20px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(0,232,122,.07)}
        .td{width:11px;height:11px;border-radius:50%}.tdr{background:#ff5f57}.tdy{background:#febc2e}.tdg{background:#28c840}
        .t-ttl{font-family:var(--mo);font-size:.62rem;color:var(--text-d3);margin-left:auto;margin-right:auto}
        .t-bod{padding:24px;font-family:var(--mo);font-size:.85rem;line-height:2.2}
        .tl2{display:flex;gap:10px;flex-wrap:wrap}
        .tp{color:var(--green)}.tc{color:#6ee7b7}.ts{color:var(--text-d3)}.tv{color:var(--text-d)}.tk{color:var(--amber)}.te{color:var(--red)}
        .tcur{display:inline-block;width:7px;height:.85em;background:var(--green);vertical-align:middle;animation:blink 1s infinite}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}

        /* Timeline */
        .tl-wrap{margin-top:48px;padding-left:20px;border-left:1px solid rgba(0,232,122,.1);position:relative}
        .tl-item2{margin-bottom:30px;position:relative;padding-left:20px}
        .tl-dot2{position:absolute;left:-29px;top:5px;width:10px;height:10px;border-radius:50%;border:1.5px solid var(--green);background:var(--ink)}
        .tl-yr2{font-family:var(--mo);font-size:.6rem;color:var(--green);letter-spacing:.12em;margin-bottom:5px;opacity:.7}
        .tl-ti2{font-family:var(--dm);font-size:.88rem;color:var(--text-d);font-weight:500;margin-bottom:4px}
        .tl-de2{font-size:.76rem;color:var(--text-d3);font-weight:300}

        /* Skills */
        .sk-intro{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:end;margin-bottom:72px}
        .sk-desc{font-size:.88rem;color:var(--text-d2);line-height:1.8;font-weight:300}
        .sk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:rgba(0,232,122,.06);border-radius:18px;overflow:hidden;margin-bottom:56px}
        .skc{background:var(--forest);padding:30px 26px;transition:all .4s;position:relative;overflow:hidden}
        .skc::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--green),transparent);transform:scaleX(0);transform-origin:left;transition:transform .4s}
        .skc:hover{background:rgba(0,232,122,.04);transform:translateY(-4px) scale(1.01)}
        .skc:hover::after{transform:scaleX(1)}
        .skc-ico{font-size:1.5rem;margin-bottom:14px;display:block}
        .skc-n{font-family:var(--bb);font-size:1.05rem;letter-spacing:.08em;color:var(--text-d);margin-bottom:8px}
        .skc-d{font-size:.76rem;color:var(--text-d2);line-height:1.6;margin-bottom:16px;font-weight:300}
        .skc-ts{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:16px}
        .skt{padding:3px 9px;border-radius:4px;font-family:var(--mo);font-size:.58rem;color:rgba(0,232,122,.7);border:1px solid rgba(0,232,122,.15);background:rgba(0,232,122,.04);letter-spacing:.04em}
        .skb{height:2px;background:rgba(255,255,255,.05);border-radius:1px;overflow:hidden}
        .skf{height:100%;background:linear-gradient(90deg,var(--green),rgba(0,232,122,.3));width:0;transition:width 1.4s cubic-bezier(.23,1,.32,1)}

        /* Tools scroll */
        .tscr{overflow:hidden;mask-image:linear-gradient(90deg,transparent,black 6%,black 94%,transparent);margin-bottom:14px}
        .ttrk{display:flex;gap:12px;animation:mqa 28s linear infinite;width:max-content}
        .ttrk2{animation-direction:reverse}
        .tpill{display:flex;align-items:center;gap:7px;padding:8px 16px;border-radius:8px;background:rgba(0,232,122,.04);border:1px solid rgba(0,232,122,.09);font-family:var(--mo);font-size:.65rem;color:var(--text-d3);white-space:nowrap;letter-spacing:.04em;flex-shrink:0;transition:all .3s}
        .tpill:hover{border-color:var(--green);color:var(--green)}

        /* Writeups */
        .wu-hero{padding:100px 52px;position:relative;overflow:hidden;background:var(--cream2);color:var(--text-l)}
        .wu-bg-num{position:absolute;right:-20px;top:-40px;font-family:var(--bb);font-size:clamp(14rem,22vw,26rem);color:rgba(26,46,32,.04);line-height:1;pointer-events:none;user-select:none;letter-spacing:-.05em}
        .wu-top{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:end;margin-bottom:60px;position:relative;z-index:2}
        .wu-h{font-family:var(--bb);font-size:clamp(3.5rem,6vw,6.5rem);line-height:.92;letter-spacing:.02em;color:var(--text-l)}
        .wu-h em{font-style:normal;color:var(--sage)}
        .wu-hdesc{font-size:.88rem;color:var(--text-l2);line-height:1.8;font-weight:300}

        .srch{position:relative;margin-bottom:14px}
        .sin{width:100%;padding:15px 50px;background:white;border:2px solid rgba(26,46,32,.1);border-radius:10px;font-family:var(--mo);font-size:.8rem;color:var(--text-l);outline:none;letter-spacing:.04em;transition:all .3s;box-shadow:0 2px 8px rgba(0,0,0,.04)}
        .sin:focus{border-color:var(--sage);box-shadow:0 0 0 4px rgba(42,96,72,.08)}
        .sin::placeholder{color:var(--text-l3)}
        .sico{position:absolute;left:18px;top:50%;transform:translateY(-50%);font-size:.85rem;color:var(--text-l3);pointer-events:none}
        .frow{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:48px;position:relative;z-index:2}
        .fb{padding:6px 16px;border-radius:20px;font-family:var(--mo);font-size:.62rem;border:1.5px solid rgba(26,46,32,.12);background:transparent;color:var(--text-l2);cursor:pointer;transition:all .3s;letter-spacing:.07em}
        .fb:hover{border-color:var(--sage);color:var(--sage)}
        .fb.on{background:var(--sage);border-color:var(--sage);color:white}

        .wug{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;position:relative;z-index:2}
        .wuc{background:white;border:1.5px solid rgba(26,46,32,.07);border-radius:16px;overflow:hidden;transition:all .4s cubic-bezier(.23,1,.32,1);box-shadow:0 2px 8px rgba(0,0,0,.04);text-decoration:none;display:block}
        .wuc:hover{transform:translateY(-8px);border-color:rgba(42,96,72,.2);box-shadow:0 24px 48px rgba(0,0,0,.1)}
        .wtop{height:148px;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
        .wico{font-size:3.2rem;position:relative;z-index:1}
        .wtbg{position:absolute;inset:0}
        .wdiff{position:absolute;top:12px;right:12px;padding:4px 12px;border-radius:4px;font-family:var(--mo);font-size:.58rem;letter-spacing:.1em;font-weight:500}
        .de{background:rgba(42,96,72,.1);color:var(--sage);border:1px solid rgba(42,96,72,.25)}
        .dm{background:rgba(245,166,35,.1);color:var(--amber);border:1px solid rgba(245,166,35,.25)}
        .dh{background:rgba(240,79,90,.1);color:var(--red);border:1px solid rgba(240,79,90,.25)}
        .wplat{position:absolute;bottom:12px;left:12px;font-family:var(--mo);font-size:.56rem;color:var(--text-l3);background:rgba(242,237,228,.88);padding:3px 10px;border-radius:3px;letter-spacing:.08em}
        .wb{padding:20px}
        .wti{font-family:var(--dm);font-weight:600;font-size:.88rem;color:var(--text-l);margin-bottom:7px}
        .wde{font-size:.76rem;color:var(--text-l2);line-height:1.55;margin-bottom:13px;font-weight:300;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .wtags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px}
        .wtag{padding:3px 9px;border-radius:3px;font-family:var(--mo);font-size:.58rem;background:rgba(42,96,72,.07);border:1px solid rgba(42,96,72,.14);color:var(--sage);letter-spacing:.04em}
        .wft{display:flex;align-items:center;justify-content:space-between}
        .wlnk{font-family:var(--mo);font-size:.65rem;color:var(--sage);text-decoration:none;display:flex;align-items:center;gap:4px;transition:gap .25s;font-weight:500}
        .wlnk:hover{gap:8px}

        /* Certs */
        .cert-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:64px}
        .cc{background:var(--pine);border:1px solid rgba(0,232,122,.08);border-radius:16px;padding:24px 20px;text-align:center;transition:all .4s;position:relative;overflow:hidden}
        .cc::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,transparent,var(--green),transparent);opacity:0;transition:opacity .3s}
        .cc:hover{transform:translateY(-6px);border-color:rgba(0,232,122,.2)}
        .cc:hover::after{opacity:1}
        .cc-ico{font-size:1.5rem;margin-bottom:12px;display:block}
        .cc-org{font-family:var(--mo);font-size:.54rem;color:rgba(0,232,122,.45);letter-spacing:.2em;margin-bottom:7px}
        .cc-n{font-family:var(--dm);font-size:.8rem;font-weight:500;color:var(--text-d);line-height:1.3}
        .ccs{display:inline-block;margin-top:10px;padding:3px 12px;border-radius:20px;font-family:var(--mo);font-size:.55rem;letter-spacing:.1em}
        .cs-d{background:rgba(0,232,122,.08);border:1px solid rgba(0,232,122,.2);color:var(--green)}
        .cs-w{background:rgba(56,217,245,.08);border:1px solid rgba(56,217,245,.18);color:var(--blue)}
        .cs-p{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:var(--text-d3)}

        /* Roadmap */
        .rm-wrap{display:grid;grid-template-columns:1fr 1fr;gap:60px}
        .rm-h{font-family:var(--bb);font-size:clamp(2.5rem,4vw,4.5rem);line-height:.95;letter-spacing:.02em;margin-bottom:10px}
        .rm-h em{font-style:normal;color:var(--green)}
        .rm-sub{font-size:.85rem;color:var(--text-d2);line-height:1.7;font-weight:300;margin-bottom:40px}
        .rm-steps{display:flex;flex-direction:column;gap:0}
        .rm-step{display:flex;gap:20px;padding:22px 0;border-bottom:1px solid rgba(0,232,122,.06)}
        .rm-step:last-child{border-bottom:none}
        .rm-n{font-family:var(--bb);font-size:2rem;color:rgba(0,232,122,.1);line-height:1;flex-shrink:0;width:46px}
        .rm-step.done .rm-n{color:var(--green)}
        .rm-step.cur .rm-n{color:rgba(0,232,122,.5)}
        .rm-b{flex:1}
        .rm-t{font-family:var(--dm);font-weight:600;font-size:.87rem;color:var(--text-d);margin-bottom:4px}
        .rm-step.done .rm-t{color:rgba(0,232,122,.8)}
        .rm-d{font-size:.75rem;color:var(--text-d3);font-weight:300}
        .rmbg{padding:4px 12px;border-radius:20px;font-family:var(--mo);font-size:.55rem;letter-spacing:.1em;flex-shrink:0;align-self:flex-start;margin-top:4px}
        .rbd{background:rgba(0,232,122,.07);border:1px solid rgba(0,232,122,.18);color:var(--green)}
        .rba{background:rgba(56,217,245,.07);border:1px solid rgba(56,217,245,.2);color:var(--blue);animation:agl 2s infinite}
        @keyframes agl{0%,100%{box-shadow:0 0 0 rgba(56,217,245,0)}50%{box-shadow:0 0 10px rgba(56,217,245,.3)}}
        .rbp{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);color:var(--text-d3)}

        /* Contact */
        .contact-sec{background:linear-gradient(160deg,var(--pine) 0%,var(--forest) 60%,var(--ink) 100%);padding:100px 52px;position:relative;overflow:hidden}
        .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:2}
        .c-h{font-family:var(--bb);font-size:clamp(3rem,5.5vw,6rem);line-height:.92;letter-spacing:.02em;margin-bottom:20px;color:var(--text-d)}
        .c-h em{font-style:normal;color:var(--green)}
        .c-desc{font-size:.88rem;color:var(--text-d2);line-height:1.8;margin-bottom:36px;font-weight:300}
        .cbtns{display:flex;gap:12px;flex-wrap:wrap}
        .bp{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:var(--green);color:var(--ink);font-family:var(--mo);font-size:.7rem;font-weight:500;letter-spacing:.1em;text-decoration:none;border-radius:6px;transition:all .3s;border:1.5px solid var(--green)}
        .bp:hover{background:transparent;color:var(--green);box-shadow:0 0 30px rgba(0,232,122,.2)}
        .bo{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border:1.5px solid rgba(0,232,122,.25);color:var(--text-d2);font-family:var(--mo);font-size:.7rem;letter-spacing:.1em;text-decoration:none;border-radius:6px;transition:all .3s}
        .bo:hover{border-color:var(--green);color:var(--green)}
        .ccards{display:flex;flex-direction:column;gap:14px}
        .ccard{display:flex;align-items:center;gap:16px;padding:17px 22px;background:rgba(0,232,122,.04);border:1px solid rgba(0,232,122,.1);border-radius:12px;text-decoration:none;transition:all .4s;color:inherit}
        .ccard:hover{background:rgba(0,232,122,.08);border-color:rgba(0,232,122,.25);transform:translateX(6px)}
        .cc-ico2{width:40px;height:40px;border-radius:9px;background:rgba(0,232,122,.08);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
        .cc-inf{flex:1}
        .cc-lbl{font-family:var(--mo);font-size:.54rem;color:var(--text-d3);letter-spacing:.18em;margin-bottom:4px}
        .cc-val2{font-family:var(--dm);font-weight:600;font-size:.87rem;color:var(--green)}
        .cc-sub{font-family:var(--mo);font-size:.58rem;color:var(--text-d3);margin-top:2px}
        .cc-arr{color:var(--text-d3);font-family:var(--mo);font-size:.8rem;transition:all .3s}
        .ccard:hover .cc-arr{color:var(--green);transform:translateX(4px)}

        /* Footer */
        .draft-footer{background:var(--ink);padding:32px 52px;border-top:1px solid rgba(0,232,122,.07);display:flex;justify-content:space-between;align-items:center;position:relative}
        .draft-footer::before{content:'';position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,var(--green),transparent)}
        .flogo{font-family:var(--bb);font-size:.95rem;letter-spacing:.3em;color:var(--green)}
        .fmid{font-family:var(--mo);font-size:.58rem;color:var(--text-d3);text-align:center;line-height:2;letter-spacing:.04em}
        .fmid span{color:var(--green)}
        .flinks2{display:flex;gap:20px}
        .flinks2 a{font-family:var(--mo);font-size:.58rem;color:var(--text-d3);text-decoration:none;letter-spacing:.08em;transition:color .3s}
        .flinks2 a:hover{color:var(--green)}

        /* Reveal */
        .rev{opacity:0;transform:translateY(36px);transition:opacity .85s cubic-bezier(.23,1,.32,1),transform .85s cubic-bezier(.23,1,.32,1)}
        .revr{opacity:0;transform:translateX(36px);transition:opacity .85s cubic-bezier(.23,1,.32,1),transform .85s cubic-bezier(.23,1,.32,1)}
        .rev.v,.revr.v{opacity:1;transform:none}
        .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}.d5{transition-delay:.5s}

        /* Responsive */
        @media(max-width:1100px){
          .main-card{grid-template-columns:1fr;min-height:auto}
          .orb-wrap{width:260px;height:260px}
          .orb-ring-1{width:250px;height:250px}.orb-ring-2{width:210px;height:210px}.orb-ring-3{width:175px;height:175px}
          .orb-aura{width:200px;height:200px}.orb-core{width:120px;height:120px}
          .card-left{min-height:500px}
          .about-grid,.sk-intro,.rm-wrap,.contact-grid,.wu-top{grid-template-columns:1fr}
          .cert-grid{grid-template-columns:repeat(2,1fr)}
          .sec{padding:80px 28px}
          .wu-hero,.contact-sec{padding:80px 28px}
          .draft-hero{padding:80px 28px}
          .dnav{padding:18px 28px}
        }
        @media(max-width:640px){
          .draft-hero{padding:90px 20px 70px}
          .sec,.wu-hero,.contact-sec{padding:60px 20px}
          .wug,.sk-grid{grid-template-columns:1fr}
          .cert-grid{grid-template-columns:repeat(2,1fr)}
          .draft-footer{flex-direction:column;gap:14px;text-align:center;padding:28px 20px}
          .main-card{border-radius:20px}
          .card-left,.card-right{padding:32px 28px}
        }
      `}</style>

      {/* NAV */}
      <nav className="dnav" id="main-nav">
        <a href="#home" className="nlogo">
          <div>
            <span className="nlogo-h">HEINDALL</span>
            <div className="nlogo-s">GUARDIAN // OFFENSIVE SEC</div>
          </div>
        </a>
        <ul className="nlinks">
          <li><a href="#about">about</a></li>
          <li><a href="#skills">skills</a></li>
          <li><a href="#writeups">writeups</a></li>
          <li><a href="#certs">certs</a></li>
          <li><a href="#contact">contact</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="draft-hero" id="home" ref={heroRef}>
        <div className="h-bg" />
        <div className="h-bg-grid" />

        <div className="main-card rev">
          <div className="card-left">
            <div className="cl-top">
              <div className="cl-brand">
                <span className="cl-brand-dot" />
                HEINDALL/
              </div>
              <div className="cl-slash">/OFFENSIVE SEC</div>
            </div>

            {/* ORB */}
            <div className="orb-wrap">
              <div className="orb">
                <div className="orb-ring orb-ring-1" />
                <div className="orb-ring orb-ring-2" />
                <div className="orb-ring orb-ring-3" />
                <div className="orb-aura" />
                <div className="orb-core">
                  <span className="orb-rune">ᚺ</span>
                </div>
                <div className="orb-scan" />
                <div className="particle p1" />
                <div className="particle p2" />
                <div className="particle p3" />
                <div className="particle p4" />
                <div className="particle p5" />
                <div className="particle p6" />
              </div>
            </div>

            <div className="cl-bottom">
              <div className="cl-tag">// GUARDIAN OF BIFROST · OFFENSIVE SECURITY</div>
              <div className="cl-headline">
                YOANDY<br />
                <span>RAMÍREZ</span>
                DELGADO
              </div>
              <div className="cl-sub">
                Pentester · Red Team · AI-Augmented Security. Alias <strong style={{ color: "var(--green)" }}>Heindall</strong> — el guardián que todo lo ve.
              </div>
            </div>
          </div>

          <div className="card-right">
            <div className="cr-deco" />
            <div className="cr-deco2" />

            <div className="cr-top" style={{ position: "relative", zIndex: 2 }}>
              <div className="cr-label">MACHINES PWNED</div>
              <div className="cr-big-num">{counter}<span>+</span></div>
              <div className="cr-desc">Máquinas comprometidas en HTB, HackMyVM y Sherlocks. Cada una, un writeup técnico.</div>
            </div>

            <div className="cr-badges" style={{ position: "relative", zIndex: 2 }}>
              <div className="cr-badge"><div className="cb-dot cb-g" /><div className="cb-txt">HTB Status</div><div className="cb-val">ACTIVE</div></div>
              <div className="cr-badge"><div className="cb-dot cb-b" /><div className="cb-txt">eJPT Prep</div><div className="cb-val">70%</div></div>
              <div className="cr-badge"><div className="cb-dot cb-a" /><div className="cb-txt">Certifications</div><div className="cb-val">8+</div></div>
            </div>

            <a href="#writeups" className="cr-btn" style={{ position: "relative", zIndex: 2 }}>
              <span className="cr-btn-txt">VER WRITEUPS</span>
              <div className="cr-btn-ico">→</div>
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mq">
        <div className="mq-t">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>
              <span className="mq-i">{item}</span>
              <span className="mq-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="sec sec-dark">
        <div className="stag rev">01 // SOBRE HEINDALL</div>
        <div className="about-grid">
          <div>
            <h2 className="bh rev d1" style={{ marginBottom: 28 }}>El <em>Guardián</em><br />que Todo<br />lo Ve</h2>
            <p className="about-p rev d2">Soy <strong>Yoandy Ramírez Delgado</strong>, alias <span className="hl">Heindall</span> — como el dios nórdico que vigila el Bifrost con ojos que ven en la oscuridad. En ciberseguridad: <strong>encuentro lo que otros no ven.</strong></p>
            <p className="about-p rev d3">+4 años en IT. Construí un <span className="hl">MCP Hacking Server</span> personalizado con 21 herramientas de pentesting integradas con Claude AI. Master en Ciberseguridad & AI — Evolve Academy. Objetivo: <strong>OSCP · CPTS · Red Team</strong>.</p>
            <div className="quote-block rev d4">
              <div className="qb-rune">ᚺᛖᛁᚾᛞᚨᛚᛚ — EDDA PROSAICA</div>
              <p className="qb-txt">"Heindall vigila el Bifrost con ojos que ven en la oscuridad y oídos que escuchan crecer la hierba. El guardián nunca duerme."</p>
            </div>
          </div>
          <div>
            <div className="term revr d1">
              <div className="t-bar"><div className="td tdr" /><div className="td tdy" /><div className="td tdg" /><span className="t-ttl">heindall@kali:~$</span></div>
              <div className="t-bod">
                <div className="tl2"><span className="tp">❯ </span><span className="tc">cat</span><span className="ts"> ~/.heindall/identity</span></div>
                <div className="tl2"><span className="tk">alias  :</span><span className="tv"> Heindall · Guardian of Bifrost</span></div>
                <div className="tl2"><span className="tk">role   :</span><span className="tv"> Offensive Security Specialist</span></div>
                <div className="tl2"><span className="tk">base   :</span><span className="tv"> Lepe, Huelva, Spain</span></div>
                <div className="tl2"><span className="tk">os     :</span><span className="tv"> Kali Linux 2024.x</span></div>
                <div className="tl2"><span className="tk">mcp    :</span><span className="tv"> 21 custom tools + Claude AI</span></div>
                <div className="tl2">&nbsp;</div>
                <div className="tl2"><span className="tp">❯ </span><span className="tc">nmap</span><span className="ts"> -A -sV -p- target.htb</span></div>
                <div className="tl2"><span style={{ color: "var(--green)" }}>22/tcp  </span><span className="ts">open </span><span className="tv">ssh OpenSSH 9.2</span></div>
                <div className="tl2"><span style={{ color: "var(--green)" }}>80/tcp  </span><span className="ts">open </span><span className="tv">http Apache 2.4.57</span></div>
                <div className="tl2"><span className="te">[!] SQLi on /api/auth — exploiting...</span></div>
                <div className="tl2"><span className="tp">❯ </span><span className="tcur" /></div>
              </div>
            </div>
            <div className="tl-wrap revr d2">
              <div className="tl-item2"><div className="tl-dot2" /><div className="tl-yr2">2025 — HOY</div><div className="tl-ti2">Master Ciberseguridad & AI</div><div className="tl-de2">Evolve Academy · eJPT en progreso</div></div>
              <div className="tl-item2"><div className="tl-dot2" /><div className="tl-yr2">2024</div><div className="tl-ti2">MCP Hacking Server · HTB Full Path</div><div className="tl-de2">21 tools · Claude AI · Jr. Analyst completado</div></div>
              <div className="tl-item2"><div className="tl-dot2" /><div className="tl-yr2">2020+</div><div className="tl-ti2">IT Specialist · 4+ años</div><div className="tl-de2">Redes · Sistemas · Automatización</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="sec sec-mid">
        <div className="stag rev">02 // ARSENAL OFENSIVO</div>
        <div className="sk-intro">
          <h2 className="bh rev d1">Arsenal<br /><em>Táctico</em></h2>
          <p className="sk-desc rev d2">El toolkit de Heindall — herramientas dominadas en CTFs, labs y pentests reales. Cada vector de ataque documentado y probado.</p>
        </div>
        <div className="sk-grid">
          {skills.map((s) => (
            <div className="skc rev" key={s.name}>
              <span className="skc-ico">{s.ico}</span>
              <div className="skc-n">{s.name}</div>
              <div className="skc-d">{s.desc}</div>
              <div className="skc-ts">
                {s.tags.map((t) => <span className="skt" key={t}>{t}</span>)}
              </div>
              <div className="skb"><div className="skf" data-w={s.pct} /></div>
            </div>
          ))}
        </div>
        <div className="tscr rev">
          <div className="ttrk">
            {[...toolsRow1, ...toolsRow1].map((t, i) => <span className="tpill" key={i}>{t}</span>)}
          </div>
        </div>
        <div className="tscr" style={{ marginTop: 12 }}>
          <div className="ttrk ttrk2">
            {[...toolsRow2, ...toolsRow2].map((t, i) => <span className="tpill" key={i}>{t}</span>)}
          </div>
        </div>
      </section>

      {/* WRITEUPS */}
      <section id="writeups" className="wu-hero">
        <div className="wu-bg-num">03</div>
        <div className="wu-top">
          <h2 className="wu-h rev d1">Brechas<br /><em>Documentadas</em></h2>
          <p className="wu-hdesc rev d2">Cada máquina comprometida con metodología completa. Busca por técnica, plataforma o dificultad.</p>
        </div>
        <div className="srch rev">
          <input
            type="text"
            className="sin"
            placeholder="SQLi · JWT · LFI · Windows · RCE · HTB · Easy ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="sico">🔍</span>
        </div>
        <div className="frow rev d1">
          {[
            { key: "all", label: "Todos" },
            { key: "htb", label: "HackTheBox" },
            { key: "sherlock", label: "Sherlocks" },
            { key: "hmv", label: "HackMyVM" },
            { key: "easy", label: "Easy" },
            { key: "medium", label: "Medium" },
            { key: "hard", label: "Hard" },
          ].map((f) => (
            <button key={f.key} className={`fb ${filter === f.key ? "on" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="wug">
          {filtered.map((w) => {
            const bgGrad = w.platform === "HTB"
              ? "linear-gradient(135deg,#041810,#07281a)"
              : w.platform === "Sherlock"
              ? "linear-gradient(135deg,#12051e,#200838)"
              : "linear-gradient(135deg,#1a0808,#350d0d)";
            return (
              <Link to={`/report/${w.slug}`} className="wuc" key={w.slug}>
                <div className="wtop">
                  <div className="wtbg" style={{ background: bgGrad }} />
                  <span className="wico">{w.emoji}</span>
                  <span className={`wdiff ${diffClass(w.difficulty)}`}>{diffLabel(w.difficulty)}</span>
                  <span className="wplat">{w.platform}</span>
                </div>
                <div className="wb">
                  <div className="wti">{w.name}</div>
                  <div className="wde">{w.desc}</div>
                  <div className="wtags">
                    {w.tags.slice(0, 4).map((t) => <span className="wtag" key={t}>{t}</span>)}
                  </div>
                  <div className="wft">
                    <span className="wlnk">Leer writeup →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, fontFamily: "var(--mo)", fontSize: ".8rem", color: "var(--text-l3)" }}>
            <span style={{ display: "block", fontSize: "2rem", marginBottom: 10 }}>🔍</span>
            Sin resultados — prueba: linux · sqli · jwt · htb...
          </div>
        )}
      </section>

      {/* CERTS */}
      <section id="certs" className="sec sec-dark">
        <div className="stag rev">04 // CERTIFICATIONS & ROADMAP</div>
        <div className="cert-grid">
          {certifications.map((c, i) => (
            <div className={`cc rev ${i > 0 ? `d${Math.min(i, 5)}` : ""}`} key={c.name}>
              <span className="cc-ico">{c.ico}</span>
              <div className="cc-org">{c.org}</div>
              <div className="cc-n">{c.name}</div>
              <span className={`ccs ${c.statusClass}`}>{c.status}</span>
            </div>
          ))}
        </div>
        <div className="rm-wrap">
          <div>
            <h3 className="rm-h rev d1">Roadmap<br /><em>Bifrost</em></h3>
            <p className="rm-sub rev d2">La ruta de Heindall hacia las certificaciones élite del offensive security.</p>
          </div>
          <div className="rm-steps">
            {roadmap.map((r) => (
              <div className={`rm-step ${r.status} rev`} key={r.n}>
                <div className="rm-n">{r.n}</div>
                <div className="rm-b"><div className="rm-t">{r.title}</div><div className="rm-d">{r.desc}</div></div>
                <span className={`rmbg ${r.badgeClass}`}>{r.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-sec">
        <div className="contact-grid">
          <div>
            <div className="stag rev" style={{ marginBottom: 36 }}>05 // CONTACT</div>
            <h2 className="c-h rev d1">¿Cruzamos<br />el <em>Bifrost</em>?</h2>
            <p className="c-desc rev d2">Disponible para roles en Pentesting y Red Team, colaboraciones técnicas y proyectos de ciberseguridad.</p>
            <div className="cbtns rev d3">
              <a href="https://www.linkedin.com/in/yoandyrd92/" className="bp" target="_blank" rel="noopener noreferrer">Contactar en LinkedIn</a>
              <a href="https://github.com/heindall92" className="bo" target="_blank" rel="noopener noreferrer">Ver GitHub →</a>
            </div>
          </div>
          <div className="ccards">
            {socialLinks.map((s, i) => (
              <a href={s.href} className={`ccard revr d${i + 1}`} key={s.label} target="_blank" rel="noopener noreferrer">
                <div className="cc-ico2">{s.ico}</div>
                <div className="cc-inf">
                  <div className="cc-lbl">{s.label}</div>
                  <div className="cc-val2">{s.val}</div>
                  <div className="cc-sub">{s.sub}</div>
                </div>
                <span className="cc-arr">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="draft-footer">
        <span className="flogo">HEINDALL</span>
        <div className="fmid">
          <div>© 2025 Yoandy Ramírez Delgado · Alias <span>Heindall</span> · Lepe, España</div>
          <div style={{ fontSize: ".5rem", marginTop: 3, opacity: .4 }}>Todo el contenido es para fines educativos y entornos autorizados ⚠️</div>
        </div>
        <div className="flinks2">
          <a href="https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa" target="_blank" rel="noopener noreferrer">HTB</a>
          <a href="https://www.linkedin.com/in/yoandyrd92/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/heindall92" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
