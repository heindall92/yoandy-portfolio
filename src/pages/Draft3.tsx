import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { machines } from "./Machines";
import { sherlocks } from "./Sherlocks";
import { hmvMachines } from "./HackMyVM";

const allWriteups = [
  ...machines.map((m) => ({ ...m, platform: "HTB" })),
  ...sherlocks.map((s) => ({ ...s, platform: "Sherlock", os: "N/A" })),
  ...hmvMachines.map((m) => ({ ...m, platform: "HackMyVM" })),
];
const totalMachines = allWriteups.length;

const phases = [
  { n: "01", title: "RECONOCIMIENTO", subtitle: "La superficie de ataque", body: "Cada operación comienza en la sombra. Escaneamos, enumeramos, cartografiamos. Cada puerto abierto es una puerta; cada servicio expuesto, una historia que contar. Nmap, Subfinder, Amass — las herramientas del reconocimiento no mienten.", quote: '"No puedes atacar lo que no conoces."', tools: ["Nmap", "Subfinder", "Amass", "dnsrecon", "theHarvester", "ffuf"] },
  { n: "02", title: "ENUMERACIÓN", subtitle: "Más allá de lo visible", body: "La enumeración separa al script kiddie del pentester. Directorios ocultos, credenciales por defecto, versiones vulnerables. Cada dato es una pieza del puzzle. La paciencia aquí define el éxito de toda la operación.", quote: '"La enumeración es el 80% del pentesting."', tools: ["Gobuster", "Nikto", "WhatWeb", "enum4linux", "SMBClient"] },
  { n: "03", title: "EXPLOTACIÓN", subtitle: "El punto de entrada", body: "SQLi, XSS, RCE, LFI — cada vulnerabilidad es un vector. Craft del payload, bypass de WAF, evasión de filtros. El momento donde el conocimiento se convierte en acceso. No hay atajos, solo preparación.", quote: '"Un exploit sin comprensión es solo ruido."', tools: ["Metasploit", "Burp Suite", "SQLMap", "jwt_tool", "Nuclei"] },
  { n: "04", title: "POST-EXPLOTACIÓN", subtitle: "Persistencia y escalada", body: "Acceso inicial no es victoria. Escalada de privilegios, movimiento lateral, exfiltración controlada. LinPEAS busca los SUID olvidados, los cron jobs mal configurados, los permisos que nadie revisó.", quote: '"Root no es el fin. Es donde empieza el informe."', tools: ["LinPEAS", "WinPEAS", "BloodHound", "Penelope", "hashcat"] },
  { n: "05", title: "DOCUMENTACIÓN", subtitle: "El arte del reporte", body: "Un pentester sin documentación es un hacker sin propósito. Cada hallazgo se documenta, cada paso se reproduce, cada recomendación se fundamenta. El reporte es lo que convierte el caos en valor.", quote: '"Si no lo documentaste, no existió."', tools: ["Markdown", "LaTeX", "Screenshots", "PoC Scripts"] },
  { n: "06", title: "EVOLUCIÓN", subtitle: "El ciclo nunca termina", body: "Nuevas CVEs cada día. Nuevas técnicas, nuevas defensas. El Red Team Operator estudia, practica, rompe y reconstruye. HTB, THM, CTFs — cada máquina es un maestro diferente.", quote: '"La seguridad no es un destino, es un proceso."', tools: ["HackTheBox", "TryHackMe", "CTFs", "Research", "Labs"] },
];

const stats = [
  { label: "Máquinas Resueltas", value: totalMachines + "+", ico: "🖥️" },
  { label: "Certificaciones", value: "6+", ico: "🎓" },
  { label: "Plataformas Activas", value: "4", ico: "🌐" },
  { label: "Herramientas Dominadas", value: "25+", ico: "⚡" },
];

const methodology = [
  { n: "01", tip: "🎯 Define el Alcance", desc: "Nunca ataques sin permiso. Define objetivos, límites y reglas de engagement." },
  { n: "02", tip: "🔍 Enumera Todo", desc: "Puertos, servicios, versiones, directorios. Cada detalle cuenta." },
  { n: "03", tip: "💉 Explota con Precisión", desc: "Un buen exploit es quirúrgico. Mínimo impacto, máximo resultado." },
  { n: "04", tip: "📈 Escala Privilegios", desc: "El acceso inicial es solo el comienzo. Busca el camino a root/SYSTEM." },
  { n: "05", tip: "📝 Documenta Siempre", desc: "Capturas, comandos, resultados. El reporte es tu producto final." },
  { n: "06", tip: "🔄 Itera y Aprende", desc: "Cada máquina enseña algo nuevo. Revisa, mejora, repite." },
];

const Draft3 = () => {
  const [entered, setEntered] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [counter, setCounter] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const orbCanvasRef = useRef<HTMLCanvasElement>(null);

  /* Orb canvas animation */
  useEffect(() => {
    if (!entered) return;
    const oc = orbCanvasRef.current;
    if (!oc) return;
    const ox = oc.getContext("2d");
    if (!ox) return;
    let oW = oc.offsetWidth, oH = oc.offsetHeight;
    oc.width = oW; oc.height = oH;
    const onResize = () => { oW = oc.offsetWidth; oH = oc.offsetHeight; oc.width = oW; oc.height = oH; };
    window.addEventListener("resize", onResize);
    let ot = 0;
    let raf: number;
    const animOrb = () => {
      raf = requestAnimationFrame(animOrb);
      ot += 0.007;
      ox.clearRect(0, 0, oW, oH);
      const cx = oW / 2, cy = oH / 2, R = Math.min(oW, oH) * 0.44;
      // outer glow
      const grd = ox.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 1.1);
      grd.addColorStop(0, "rgba(0,232,122,.06)");
      grd.addColorStop(1, "rgba(0,232,122,0)");
      ox.beginPath(); ox.arc(cx, cy, R * 1.1, 0, Math.PI * 2);
      ox.fillStyle = grd; ox.fill();
      // rings
      [1, 0.75, 0.52].forEach((s, i) => {
        ox.save(); ox.translate(cx, cy); ox.rotate(ot * (i % 2 === 0 ? 1 : -1) * (1 + i * 0.3));
        ox.beginPath(); ox.arc(0, 0, R * s, 0, Math.PI * 2);
        ox.setLineDash(i === 0 ? [5, 14] : i === 1 ? [3, 10] : []);
        ox.strokeStyle = `rgba(0,232,122,${[0.18, 0.12, 0.07][i]})`;
        ox.lineWidth = 1; ox.stroke(); ox.restore();
      });
      ox.setLineDash([]);
      // outer nodes
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2 + ot;
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        const b = (Math.sin(ot * 2.5 + i * 1.1) + 1) / 2;
        ox.beginPath(); ox.arc(x, y, 2.5 + b * 2, 0, Math.PI * 2);
        ox.fillStyle = `rgba(0,232,122,${0.25 + b * 0.55})`; ox.fill();
        ox.beginPath(); ox.moveTo(cx, cy); ox.lineTo(x, y);
        ox.strokeStyle = "rgba(0,232,122,.04)"; ox.lineWidth = 1; ox.stroke();
      }
      // mid ring nodes
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - ot * 0.85;
        const x = cx + Math.cos(a) * R * 0.75, y = cy + Math.sin(a) * R * 0.75;
        ox.beginPath(); ox.arc(x, y, 2, 0, Math.PI * 2);
        ox.fillStyle = "rgba(0,232,122,.22)"; ox.fill();
      }
      // core glow
      const cg = ox.createRadialGradient(cx, cy, 0, cx, cy, R * 0.42);
      cg.addColorStop(0, "rgba(0,232,122,.22)");
      cg.addColorStop(0.5, "rgba(0,40,15,.7)");
      cg.addColorStop(1, "rgba(0,20,8,.9)");
      ox.beginPath(); ox.arc(cx, cy, R * 0.42, 0, Math.PI * 2);
      ox.fillStyle = cg; ox.fill();
      ox.strokeStyle = "rgba(0,232,122,.3)"; ox.lineWidth = 1.5; ox.stroke();
      // inner ring
      ox.beginPath(); ox.arc(cx, cy, R * 0.28, 0, Math.PI * 2);
      ox.strokeStyle = "rgba(0,232,122,.08)"; ox.lineWidth = 1; ox.stroke();
      // YRD text
      const pulse = 0.65 + Math.sin(ot * 1.8) * 0.2;
      ox.font = `${Math.round(R * 0.28)}px Bebas Neue`;
      ox.textAlign = "center"; ox.textBaseline = "middle";
      ox.shadowColor = "rgba(0,232,122,.7)"; ox.shadowBlur = 18 + Math.sin(ot * 2) * 6;
      ox.fillStyle = `rgba(0,232,122,${pulse})`;
      ox.fillText("YRD", cx, cy + 2);
      ox.shadowBlur = 0;
    };
    animOrb();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [entered]);

  /* Loading animation */
  useEffect(() => {
    const iv = setInterval(() => setLoadPct((p) => (p >= 100 ? (clearInterval(iv), 100) : p + 2)), 30);
    return () => clearInterval(iv);
  }, []);

  /* Counter */
  useEffect(() => {
    if (!entered) return;
    let n = 0;
    const iv = setInterval(() => { n++; setCounter(n); if (n >= totalMachines) clearInterval(iv); }, 40);
    return () => clearInterval(iv);
  }, [entered]);

  /* Scroll reveal + active phase tracking */
  useEffect(() => {
    if (!entered) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("d3-visible");
          const idx = sectionsRef.current.indexOf(e.target as HTMLDivElement);
          if (idx >= 0) setActivePhase(idx);
        }
      });
    }, { threshold: 0.3 });
    sectionsRef.current.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, [entered]);

  if (!entered) {
    return (
      <>
        <style>{`
          .d3-loader{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0b1a10;font-family:'Bebas Neue',sans-serif;cursor:pointer;overflow:hidden}
          .d3-loader::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(0,232,122,.08) 0%,transparent 70%);animation:d3pulse 3s ease-in-out infinite}
          .d3-loader-title{font-size:clamp(2rem,6vw,5rem);color:#00e87a;letter-spacing:.3em;margin-bottom:1rem;text-shadow:0 0 40px rgba(0,232,122,.4)}
          .d3-loader-sub{font-size:.9rem;color:rgba(0,232,122,.5);letter-spacing:.5em;text-transform:uppercase;margin-bottom:3rem;font-family:'JetBrains Mono',monospace}
          .d3-bar-wrap{width:min(300px,60vw);height:2px;background:rgba(0,232,122,.15);border-radius:2px;overflow:hidden;margin-bottom:2rem}
          .d3-bar-fill{height:100%;background:#00e87a;transition:width .1s linear;box-shadow:0 0 10px #00e87a}
          .d3-enter{font-size:1rem;color:#00e87a;letter-spacing:.4em;text-transform:uppercase;border:1px solid rgba(0,232,122,.3);padding:.8rem 2.5rem;cursor:pointer;background:transparent;transition:all .4s;font-family:'JetBrains Mono',monospace}
          .d3-enter:hover{background:rgba(0,232,122,.1);border-color:#00e87a;box-shadow:0 0 30px rgba(0,232,122,.2)}
          .d3-scanline{position:absolute;top:0;left:0;right:0;height:100%;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,232,122,.015) 2px,rgba(0,232,122,.015) 4px);pointer-events:none}
          @keyframes d3pulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.15);opacity:.8}}
        `}</style>
        <div className="d3-loader" onClick={() => loadPct >= 100 && setEntered(true)}>
          <div className="d3-scanline" />
          <div className="d3-loader-title">HEINDALL</div>
          <div className="d3-loader-sub">Offensive Security Portfolio</div>
          <div className="d3-bar-wrap"><div className="d3-bar-fill" style={{ width: `${loadPct}%` }} /></div>
          {loadPct >= 100 && <button className="d3-enter" onClick={() => setEntered(true)}>Acceder al Sistema</button>}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
/* ═══ DRAFT 3 — IMMERSIVE CYBERSEC PORTFOLIO ═══ */
*{box-sizing:border-box;margin:0;padding:0}
.d3{--bg:#0b1a10;--fg:#e8f5e9;--neon:#00e87a;--neon-dim:rgba(0,232,122,.35);--neon-ghost:rgba(0,232,122,.08);--dark:#060d08;font-family:'Inter',sans-serif;background:var(--bg);color:var(--fg);overflow-x:hidden;scroll-behavior:smooth}

/* ── Side progress tracker ── */
.d3-progress{position:fixed;right:2rem;top:50%;transform:translateY(-50%);z-index:100;display:flex;flex-direction:column;gap:1.2rem;align-items:center}
.d3-pdot{width:10px;height:10px;border-radius:50%;border:1.5px solid var(--neon-dim);background:transparent;transition:all .4s;cursor:pointer}
.d3-pdot.active{background:var(--neon);box-shadow:0 0 12px var(--neon);transform:scale(1.3)}
@media(max-width:768px){.d3-progress{right:.8rem;gap:.8rem}.d3-pdot{width:7px;height:7px}}

/* ── Nav ── */
.d3-nav{position:fixed;top:0;left:0;right:0;z-index:90;padding:1.5rem 3rem;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(180deg,rgba(11,26,16,.95) 0%,transparent 100%);backdrop-filter:blur(8px)}
.d3-nav-logo{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;color:var(--neon);letter-spacing:.15em;text-decoration:none}
.d3-nav-links{display:flex;gap:2rem}
.d3-nav-links a{color:var(--fg);opacity:.6;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;transition:all .3s;font-family:'JetBrains Mono',monospace}
.d3-nav-links a:hover{opacity:1;color:var(--neon)}
.d3-nav-back{color:var(--neon);font-size:.8rem;letter-spacing:.15em;text-decoration:none;border:1px solid var(--neon-dim);padding:.4rem 1.2rem;transition:all .3s;font-family:'JetBrains Mono',monospace}
.d3-nav-back:hover{background:rgba(0,232,122,.1)}
@media(max-width:768px){.d3-nav{padding:1rem 1.5rem}.d3-nav-links{display:none}}

/* ── Hero ── */
.d3-hero{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;padding:2rem 3rem;overflow:hidden}
.d3-hero-canvas{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}
.d3-hero-inner{display:flex;align-items:center;justify-content:space-between;width:100%;max-width:1100px;gap:2rem;position:relative;z-index:10}
.d3-h-left{flex:1;max-width:520px}
.d3-h-eyebrow{font-family:'JetBrains Mono',monospace;font-size:.65rem;color:var(--neon-dim);letter-spacing:3px;margin-bottom:1rem}
.d3-h-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(3.5rem,6vw,5.5rem);line-height:.9;letter-spacing:.03em;color:var(--fg)}
.d3-h-name span{color:var(--neon);text-shadow:0 0 30px rgba(0,232,122,.25)}
.d3-h-role{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:rgba(232,245,233,.5);letter-spacing:2px;margin-top:1rem;line-height:1.8}
.d3-h-desc{font-family:'DM Sans',sans-serif;font-size:.88rem;color:rgba(232,245,233,.35);line-height:1.9;margin-top:1rem;max-width:420px}
.d3-h-stats{display:flex;gap:2rem;margin-top:1.8rem}
.d3-hstat{display:flex;flex-direction:column;gap:.2rem}
.d3-hstat-n{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;color:var(--neon);letter-spacing:.05em;line-height:1;text-shadow:0 0 15px rgba(0,232,122,.2)}
.d3-hstat-l{font-family:'JetBrains Mono',monospace;font-size:.58rem;color:var(--neon-dim);letter-spacing:2px}
.d3-h-btns{display:flex;gap:.8rem;margin-top:2rem;flex-wrap:wrap}
.d3-btn-p{background:rgba(0,232,122,.1);border:1px solid rgba(0,232,122,.3);color:var(--neon);padding:.65rem 1.6rem;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:2px;cursor:pointer;text-decoration:none;transition:.25s}
.d3-btn-p:hover{background:rgba(0,232,122,.18);box-shadow:0 0 20px rgba(0,232,122,.15);transform:translateY(-2px)}
.d3-btn-s{border:1px solid rgba(232,245,233,.22);color:rgba(232,245,233,.5);padding:.65rem 1.6rem;background:transparent;border-radius:6px;font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:2px;cursor:pointer;text-decoration:none;transition:.25s}
.d3-btn-s:hover{border-color:rgba(232,245,233,.5);color:var(--fg);transform:translateY(-2px)}
.d3-h-right{flex-shrink:0;position:relative;display:flex;align-items:center;justify-content:center}
.d3-h-right canvas{width:380px;height:380px}
.d3-h-status{position:fixed;bottom:2.5rem;left:2.5rem;z-index:20;display:flex;align-items:center;gap:.5rem;font-family:'JetBrains Mono',monospace;font-size:.62rem;color:rgba(232,245,233,.4);letter-spacing:2px}
.d3-sdot{width:7px;height:7px;border-radius:50%;background:var(--neon);box-shadow:0 0 8px var(--neon);animation:d3sdot-pulse 1.8s infinite;flex-shrink:0}
@keyframes d3sdot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}
.d3-h-scroll{position:fixed;bottom:2.5rem;right:2.5rem;z-index:20;font-family:'JetBrains Mono',monospace;font-size:.58rem;color:var(--neon-dim);letter-spacing:3px;display:flex;flex-direction:column;align-items:center;gap:.5rem;animation:d3float 2.5s ease-in-out infinite}
.d3-h-scroll::after{content:'';width:1px;height:32px;background:linear-gradient(to bottom,rgba(232,245,233,.2),transparent)}
@media(max-width:900px){.d3-hero-inner{flex-direction:column;text-align:center}.d3-h-left{max-width:100%}.d3-h-stats{justify-content:center}.d3-h-btns{justify-content:center}.d3-h-right canvas{width:260px;height:260px}.d3-h-status,.d3-h-scroll{display:none}}
@keyframes d3float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

/* ── Sections (phases) ── */
.d3-section{min-height:100vh;display:flex;align-items:center;padding:6rem 3rem;position:relative;opacity:0;transform:translateY(60px);transition:all .8s cubic-bezier(.22,1,.36,1)}
.d3-section.d3-visible{opacity:1;transform:translateY(0)}
.d3-section:nth-child(even){background:var(--dark)}
.d3-section-inner{max-width:1100px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
.d3-section:nth-child(even) .d3-section-inner{direction:rtl}
.d3-section:nth-child(even) .d3-section-inner > *{direction:ltr}
@media(max-width:900px){.d3-section-inner{grid-template-columns:1fr;gap:2rem}.d3-section{padding:4rem 1.5rem}}

/* Section left (text) */
.d3-s-num{font-family:'Bebas Neue',sans-serif;font-size:clamp(4rem,8vw,7rem);color:var(--neon);opacity:.15;line-height:1;margin-bottom:.5rem}
.d3-s-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3.5rem);color:var(--fg);letter-spacing:.05em;margin-bottom:.5rem}
.d3-s-sub{font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--neon);letter-spacing:.3em;text-transform:uppercase;margin-bottom:1.5rem;opacity:.7}
.d3-s-body{font-size:clamp(.85rem,1.1vw,.95rem);color:rgba(232,245,233,.7);line-height:1.8;margin-bottom:1.5rem}
.d3-s-quote{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.1rem,2vw,1.4rem);color:var(--neon);border-left:2px solid var(--neon-dim);padding-left:1.2rem;margin-top:1rem;line-height:1.4}

/* Section right (visual) */
.d3-s-visual{position:relative;display:flex;flex-direction:column;gap:1rem}
.d3-tool-grid{display:flex;flex-wrap:wrap;gap:.6rem}
.d3-tool-chip{background:rgba(0,232,122,.08);border:1px solid rgba(0,232,122,.2);color:var(--neon);padding:.5rem 1rem;font-size:.75rem;letter-spacing:.1em;font-family:'JetBrains Mono',monospace;transition:all .3s}
.d3-tool-chip:hover{background:rgba(0,232,122,.15);border-color:var(--neon);box-shadow:0 0 15px rgba(0,232,122,.15)}
.d3-terminal-box{background:rgba(0,0,0,.4);border:1px solid rgba(0,232,122,.15);padding:1.5rem;font-family:'JetBrains Mono',monospace;font-size:.8rem;color:var(--neon);line-height:1.8;border-radius:4px}
.d3-terminal-box .prompt{color:rgba(0,232,122,.5)}

/* ── Stats bar ── */
.d3-stats{padding:4rem 3rem;background:var(--dark);border-top:1px solid rgba(0,232,122,.1);border-bottom:1px solid rgba(0,232,122,.1)}
.d3-stats-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center}
.d3-stat-ico{font-size:2rem;margin-bottom:.5rem}
.d3-stat-val{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,5vw,3.5rem);color:var(--neon);text-shadow:0 0 20px rgba(0,232,122,.3)}
.d3-stat-label{font-size:.7rem;color:rgba(232,245,233,.5);letter-spacing:.2em;text-transform:uppercase;font-family:'JetBrains Mono',monospace}
@media(max-width:768px){.d3-stats-grid{grid-template-columns:repeat(2,1fr);gap:1.5rem}}

/* ── Methodology section ── */
.d3-method{padding:6rem 3rem;max-width:1100px;margin:0 auto}
.d3-method-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);color:var(--fg);text-align:center;margin-bottom:1rem}
.d3-method-sub{text-align:center;color:rgba(232,245,233,.4);font-size:.85rem;margin-bottom:4rem;font-family:'JetBrains Mono',monospace}
.d3-method-list{display:flex;flex-direction:column;gap:0}
.d3-method-item{display:grid;grid-template-columns:60px 1fr;gap:1.5rem;padding:2rem 0;border-bottom:1px solid rgba(0,232,122,.08);align-items:start;opacity:0;transform:translateY(30px);transition:all .6s}
.d3-method-item.d3-visible{opacity:1;transform:translateY(0)}
.d3-method-n{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;color:var(--neon);opacity:.4}
.d3-method-tip{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.2rem,2vw,1.5rem);color:var(--fg);margin-bottom:.3rem}
.d3-method-desc{font-size:.85rem;color:rgba(232,245,233,.5);line-height:1.6}

/* ── Writeups showcase ── */
.d3-writeups{padding:6rem 3rem;background:var(--dark)}
.d3-writeups-inner{max-width:1100px;margin:0 auto}
.d3-writeups h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);color:var(--fg);margin-bottom:.5rem}
.d3-writeups-sub{color:rgba(232,245,233,.4);font-size:.85rem;margin-bottom:3rem;font-family:'JetBrains Mono',monospace}
.d3-wu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem}
.d3-wu-card{background:rgba(0,232,122,.03);border:1px solid rgba(0,232,122,.1);padding:1.5rem;transition:all .4s;cursor:pointer;text-decoration:none;color:var(--fg);display:block}
.d3-wu-card:hover{border-color:var(--neon);background:rgba(0,232,122,.06);transform:translateY(-4px);box-shadow:0 10px 40px rgba(0,232,122,.1)}
.d3-wu-card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:.8rem}
.d3-wu-name{font-family:'Bebas Neue',sans-serif;font-size:1.3rem;letter-spacing:.05em}
.d3-wu-diff{font-size:.65rem;padding:.25rem .6rem;border:1px solid;font-family:'JetBrains Mono',monospace;letter-spacing:.1em}
.d3-wu-diff.easy{color:#00e87a;border-color:rgba(0,232,122,.3)}
.d3-wu-diff.medium{color:#f5a623;border-color:rgba(245,166,35,.3)}
.d3-wu-diff.hard{color:#ff4757;border-color:rgba(255,71,87,.3)}
.d3-wu-desc{font-size:.8rem;color:rgba(232,245,233,.5);line-height:1.5;margin-bottom:.8rem}
.d3-wu-platform{font-size:.65rem;color:var(--neon);opacity:.6;letter-spacing:.15em;font-family:'JetBrains Mono',monospace}

/* ── CTA / Footer ── */
.d3-cta{padding:8rem 3rem;text-align:center;position:relative}
.d3-cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,var(--neon-ghost) 0%,transparent 60%)}
.d3-cta h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,6vw,4.5rem);color:var(--fg);margin-bottom:1rem;position:relative}
.d3-cta p{color:rgba(232,245,233,.5);max-width:500px;margin:0 auto 2.5rem;font-size:.9rem;line-height:1.7;position:relative}
.d3-cta-links{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;position:relative}
.d3-cta-link{border:1px solid rgba(0,232,122,.3);color:var(--neon);padding:.7rem 2rem;font-size:.8rem;letter-spacing:.2em;text-decoration:none;font-family:'JetBrains Mono',monospace;transition:all .3s}
.d3-cta-link:hover{background:rgba(0,232,122,.1);border-color:var(--neon);box-shadow:0 0 20px rgba(0,232,122,.15)}
.d3-footer{padding:2rem 3rem;text-align:center;border-top:1px solid rgba(0,232,122,.08);font-size:.7rem;color:rgba(232,245,233,.25);font-family:'JetBrains Mono',monospace;letter-spacing:.15em}

/* ── Marquee ── */
.d3-marquee{overflow:hidden;padding:1.5rem 0;border-top:1px solid rgba(0,232,122,.08);border-bottom:1px solid rgba(0,232,122,.08);background:var(--dark)}
.d3-marquee-track{display:flex;gap:3rem;animation:d3scroll 20s linear infinite;width:max-content}
.d3-marquee-item{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.2rem,2vw,1.8rem);color:var(--neon);opacity:.3;white-space:nowrap;letter-spacing:.15em}
.d3-marquee-sep{color:rgba(0,232,122,.15);font-size:1.5rem}
@keyframes d3scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ── Orb (mini version) ── */
.d3-orb-wrap{display:flex;justify-content:center;align-items:center;height:200px;position:relative}
.d3-orb{width:120px;height:120px;border-radius:50%;background:radial-gradient(circle at 35% 35%,rgba(0,232,122,.25),rgba(0,232,122,.05) 60%,transparent 80%);box-shadow:0 0 60px rgba(0,232,122,.2),inset 0 0 30px rgba(0,232,122,.1);animation:d3orb-spin 8s linear infinite;position:relative}
.d3-orb::after{content:'';position:absolute;inset:-15px;border-radius:50%;border:1px solid rgba(0,232,122,.15);animation:d3orb-spin 12s linear infinite reverse}
@keyframes d3orb-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
      `}</style>

      <div className="d3">
        {/* Nav */}
        <nav className="d3-nav">
          <Link to="/" className="d3-nav-logo">HEINDALL</Link>
          <div className="d3-nav-links">
            <a href="#phases">Fases</a>
            <a href="#stats">Stats</a>
            <a href="#methodology">Método</a>
            <a href="#writeups">Writeups</a>
            <a href="#contact">Contacto</a>
          </div>
          <Link to="/" className="d3-nav-back">← VOLVER</Link>
        </nav>

        {/* Side progress dots */}
        <div className="d3-progress">
          {phases.map((_, i) => (
            <div key={i} className={`d3-pdot${activePhase === i ? " active" : ""}`} onClick={() => sectionsRef.current[i]?.scrollIntoView({ behavior: "smooth" })} />
          ))}
        </div>

        {/* Hero */}
        <section className="d3-hero">
          <div className="d3-hero-inner">
            {/* Text Left */}
            <div className="d3-h-left">
              <div className="d3-h-eyebrow">// RED TEAM OPERATOR · SEGURIDAD OFENSIVA</div>
              <div className="d3-h-name">
                YOANDY<br/>
                <span>RAMÍREZ</span><br/>
                DELGADO
              </div>
              <div className="d3-h-role">Junior Security Analyst &nbsp;·&nbsp; Pentester &nbsp;·&nbsp; eJPT Candidate</div>
              <div className="d3-h-desc">Ethical Hacking | Offensive Cybersecurity | Máster en Ciberseguridad & IA — Evolve Academy 2026. Construyendo el arsenal Nordic Tools.</div>
              <div className="d3-h-stats">
                <div className="d3-hstat"><div className="d3-hstat-n">{counter}+</div><div className="d3-hstat-l">MÁQUINAS</div></div>
                <div className="d3-hstat"><div className="d3-hstat-n">8</div><div className="d3-hstat-l">HTB LVL</div></div>
                <div className="d3-hstat"><div className="d3-hstat-n">70%</div><div className="d3-hstat-l">eJPT PREP</div></div>
                <div className="d3-hstat"><div className="d3-hstat-n">4+</div><div className="d3-hstat-l">AÑOS EXP</div></div>
              </div>
              <div className="d3-h-btns">
                <a href="#writeups" className="d3-btn-p">VER WRITEUPS</a>
                <a href="#contact" className="d3-btn-s">CONTACTO</a>
              </div>
            </div>
            {/* Orb Right */}
            <div className="d3-h-right">
              <canvas ref={orbCanvasRef} />
            </div>
          </div>
        </section>
        {/* Status badge & scroll hint */}
        <div className="d3-h-status"><div className="d3-sdot" />OPEN TO WORK · LEPE, HUELVA 🇪🇸</div>
        <div className="d3-h-scroll">SCROLL</div>

        {/* Marquee */}
        <div className="d3-marquee">
          <div className="d3-marquee-track">
            {[...Array(2)].map((_, rep) =>
              ["HEINDALL", "RED TEAM", "PENTESTING", "OWASP TOP 10", "CVE HUNTER", "ETHICAL HACKING", "CTF PLAYER", "OFFENSIVE SEC"].map((t, i) => (
                <span key={`${rep}-${i}`}>
                  <span className="d3-marquee-item">{t}</span>
                  <span className="d3-marquee-sep"> ◆ </span>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Phases */}
        <div id="phases">
          {phases.map((p, i) => (
            <section key={i} className="d3-section" ref={(el: HTMLDivElement | null) => { sectionsRef.current[i] = el; }}>
              <div className="d3-section-inner">
                <div>
                  <div className="d3-s-num">{p.n}</div>
                  <h2 className="d3-s-title">{p.title}</h2>
                  <div className="d3-s-sub">{p.subtitle}</div>
                  <p className="d3-s-body">{p.body}</p>
                  <div className="d3-s-quote">{p.quote}</div>
                </div>
                <div className="d3-s-visual">
                  {i % 2 === 0 && (
                    <div className="d3-orb-wrap"><div className="d3-orb" /></div>
                  )}
                  {i % 2 !== 0 && (
                    <div className="d3-terminal-box">
                      <div><span className="prompt">heindall@kali:~$</span> {p.tools[0]?.toLowerCase()} --help</div>
                      <div><span className="prompt">[*]</span> Cargando módulo {p.title.toLowerCase()}...</div>
                      <div><span className="prompt">[+]</span> {p.tools.length} herramientas disponibles</div>
                      <div><span className="prompt">[✓]</span> Fase {p.n} lista para ejecución</div>
                    </div>
                  )}
                  <div className="d3-tool-grid">
                    {p.tools.map((t) => <div key={t} className="d3-tool-chip">{t}</div>)}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Stats */}
        <section id="stats" className="d3-stats">
          <div className="d3-stats-grid">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="d3-stat-ico">{s.ico}</div>
                <div className="d3-stat-val">{i === 0 ? `${counter}+` : s.value}</div>
                <div className="d3-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section id="methodology" className="d3-method">
          <h2 className="d3-method-title">METODOLOGÍA OFENSIVA</h2>
          <p className="d3-method-sub">El proceso detrás de cada operación</p>
          <div className="d3-method-list">
            {methodology.map((m, i) => (
              <div key={i} className="d3-method-item d3-visible">
                <div className="d3-method-n">{m.n}</div>
                <div>
                  <div className="d3-method-tip">{m.tip}</div>
                  <div className="d3-method-desc">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Writeups showcase */}
        <section id="writeups" className="d3-writeups">
          <div className="d3-writeups-inner">
            <h2>WRITEUPS & CTF</h2>
            <p className="d3-writeups-sub">{totalMachines} máquinas documentadas en múltiples plataformas</p>
            <div className="d3-wu-grid">
              {allWriteups.slice(0, 12).map((w) => {
                const dl = w.difficulty.toLowerCase();
                const dc = dl.includes("easy") ? "easy" : dl.includes("medium") ? "medium" : "hard";
                return (
                  <Link key={w.slug} to={`/report/${w.slug}`} className="d3-wu-card">
                    <div className="d3-wu-card-top">
                      <span className="d3-wu-name">{w.emoji} {w.name}</span>
                      <span className={`d3-wu-diff ${dc}`}>{w.difficulty.toUpperCase()}</span>
                    </div>
                    <div className="d3-wu-desc">{w.desc}</div>
                    <div className="d3-wu-platform">{w.platform}</div>
                  </Link>
                );
              })}
            </div>
            {allWriteups.length > 12 && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Link to="/machines" className="d3-cta-link">Ver todos los writeups →</Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="d3-cta">
          <h2>¿COMENZAMOS<br />LA OPERACIÓN?</h2>
          <p>Si buscas un pentester comprometido con la seguridad ofensiva, hablemos. Cada vulnerabilidad encontrada es una defensa fortalecida.</p>
          <div className="d3-cta-links">
            <a href="https://www.linkedin.com/in/yoandyrd92/" target="_blank" rel="noreferrer" className="d3-cta-link">LINKEDIN</a>
            <a href="https://github.com/heindall92" target="_blank" rel="noreferrer" className="d3-cta-link">GITHUB</a>
            <a href="https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa" target="_blank" rel="noreferrer" className="d3-cta-link">HACK THE BOX</a>
          </div>
        </section>

        {/* Footer */}
        <div className="d3-footer">
          © 2025 HEINDALL — YOANDY RAMÍREZ DELGADO — RED TEAM OPERATOR
        </div>
      </div>
    </>
  );
};

export default Draft3;
