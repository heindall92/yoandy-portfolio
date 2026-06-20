import { useState } from "react";
import { ArrowUpRight, Search, Shield, Terminal, Activity, BarChart3, MessageSquare, Settings, LogOut, ChevronDown, Lock, Sparkles, Cpu, Database, FileText } from "lucide-react";

// CRISTAL — Glassmorphism showcase / sandbox page.
// Self-contained: every style is scoped via the `.cristal-root` class so it never
// bleeds into the rest of the portfolio. Forest-green palette only.

const Cristal = () => {
  const [activeKey, setActiveKey] = useState<string>("Analytics");
  const [expression, setExpression] = useState("(SOC × AI)");
  const [result, setResult] = useState("= 12,454");

  const navItems = [
    { label: "Analytics", icon: BarChart3 },
    { label: "Operations", icon: Terminal },
    { label: "Threats", icon: Shield },
    { label: "Reports", icon: FileText },
    { label: "Settings", icon: Settings },
  ];

  const calcKeys = [
    ["AC", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["0", ".", "←", "="],
  ];

  const handleKey = (k: string) => {
    if (k === "AC") { setExpression(""); setResult("= 0"); return; }
    if (k === "=")  { setResult("= " + (Math.floor(Math.random() * 90000) + 10000).toLocaleString()); return; }
    if (k === "←") { setExpression((e) => e.slice(0, -1)); return; }
    setExpression((e) => (e + k).slice(0, 24));
  };

  const projects = [
    { title: "VALHALLA SOC", tag: "BLUE TEAM", desc: "Honeypot Cowrie + Wazuh SIEM + Ollama AI triage. Detección, clasificación y respuesta automatizada con reportes PDF/CSV.", kpi: "12+ reglas MITRE" },
    { title: "BIFROST", tag: "INFRA", desc: "Panel de administración protegido por TOTP server-side + RLS. Gestión de write-ups, métricas y configuración del portfolio.", kpi: "TOTP · RLS · Audit" },
    { title: "HEINDALL", tag: "PORTFOLIO", desc: "Repositorio público de write-ups: HTB, Sherlocks, HackMyVM, TryHackMe. Bilingüe, detallado, mapeado a CVEs.", kpi: "50+ writeups" },
  ];

  const stats = [
    { value: "247", label: "MACHINES PWNED", icon: Cpu },
    { value: "98.7%", label: "DETECTION RATE", icon: Activity },
    { value: "12K", label: "EVENTS / DAY", icon: Database },
    { value: "A+", label: "SECURITY GRADE", icon: Shield },
  ];

  return (
    <div className="cristal-root">
      <style>{`
        .cristal-root {
          --forest-deep: #050d08;
          --forest: #0b1a10;
          --forest-2: #0f2316;
          --moss: #1a3c2a;
          --neon: #00e87a;
          --neon-soft: rgba(0,232,122,.18);
          --neon-glow: 0 0 0 1px rgba(255,255,255,.08), 0 20px 60px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.12);
          --glass-bg: rgba(255,255,255,.012);
          --glass-bg-strong: rgba(255,255,255,.022);
          --glass-border: rgba(255,255,255,.10);
          --glass-highlight: inset 0 1px 0 rgba(255,255,255,.12), inset 0 0 0 1px rgba(255,255,255,.02);
          --hairline: 1px solid rgba(0,232,122,.10);
          --text: #e6f2eb;
          --text-muted: rgba(230,242,235,.55);
          --text-dim: rgba(230,242,235,.35);
          color: var(--text);
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          background: var(--forest-deep);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }
        .cristal-root *, .cristal-root *::before, .cristal-root *::after { box-sizing: border-box; }
        .cristal-root::before {
          /* extra static color wash so blobs ALWAYS sit behind glass */
          content: ""; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(circle at 18% 22%, rgba(0,232,122,.45), transparent 35%),
            radial-gradient(circle at 82% 18%, rgba(120,255,180,.30), transparent 40%),
            radial-gradient(circle at 70% 78%, rgba(0,180,100,.40), transparent 45%),
            radial-gradient(circle at 25% 85%, rgba(0,232,122,.30), transparent 40%);
        }

        /* ===== Animated organic background — the canvas the glass refracts ===== */
        .cristal-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse at top, rgba(0,232,122,.08), transparent 60%),
            radial-gradient(ellipse at bottom, rgba(26,60,42,.35), transparent 70%),
            var(--forest-deep);
          overflow: hidden;
        }
        .cr-blob {
          position: absolute; border-radius: 50%; filter: blur(120px);
          will-change: transform;
        }
        .cr-blob.b1 { width: 680px; height: 680px; background: radial-gradient(circle, #00ff88 0%, transparent 70%); opacity: .75; top: -140px; left: -120px; animation: crFloat 22s ease-in-out infinite; }
        .cr-blob.b2 { width: 600px; height: 600px; background: radial-gradient(circle, #2dd4a0 0%, transparent 70%); opacity: .70; top: 25%; right: -160px; animation: crFloat 28s ease-in-out infinite reverse; }
        .cr-blob.b3 { width: 760px; height: 760px; background: radial-gradient(circle, #00b56a 0%, transparent 70%); opacity: .80; bottom: -220px; left: 28%; animation: crFloat 34s ease-in-out infinite; }
        .cr-blob.b4 { width: 460px; height: 460px; background: radial-gradient(circle, #7dffba 0%, transparent 70%); opacity: .55; top: 50%; left: 6%; animation: crFloat 26s ease-in-out infinite reverse; }
        .cr-blob.b5 { width: 520px; height: 520px; background: radial-gradient(circle, #00e87a 0%, transparent 70%); opacity: .55; top: 8%; left: 42%; animation: crFloat 30s ease-in-out infinite; filter: blur(140px); }
        @keyframes crFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(60px, -40px) scale(1.08); }
          66%      { transform: translate(-50px, 50px) scale(.95); }
        }
        .cr-grain {
          position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: .06; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }

        /* ===== Layout ===== */
        .cr-wrap { position: relative; z-index: 2; max-width: 1240px; margin: 0 auto; padding: 28px 28px 120px; }

        /* ===== Navbar glass ===== */
        .cr-nav {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 22px; border-radius: 22px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--neon-glow), var(--glass-highlight);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          position: sticky; top: 18px; z-index: 10;
        }
        .cr-logo { display: flex; align-items: center; gap: 10px; font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: .2em; color: var(--neon); text-shadow: 0 0 16px rgba(0,232,122,.4); }
        .cr-logo .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--neon); box-shadow: 0 0 12px var(--neon); }
        .cr-nav-links { display: flex; gap: 6px; }
        .cr-nav-link {
          padding: 8px 14px; border-radius: 12px; font-size: 11px; letter-spacing: .12em;
          color: var(--text-muted); cursor: pointer; transition: all .25s ease;
          background: transparent; border: 1px solid transparent;
        }
        .cr-nav-link:hover { color: var(--text); background: rgba(0,232,122,.06); border-color: rgba(0,232,122,.10); }
        .cr-nav-link.active {
          color: var(--neon); background: rgba(0,232,122,.10);
          border-color: rgba(0,232,122,.22);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
        }
        .cr-search {
          display: flex; align-items: center; gap: 10px; padding: 8px 14px;
          border-radius: 14px; background: rgba(0,0,0,.28);
          border: 1px solid rgba(0,232,122,.10);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
          color: var(--text-dim); font-size: 11px; min-width: 240px;
        }
        .cr-search kbd { margin-left: auto; padding: 2px 8px; border-radius: 6px; background: rgba(0,232,122,.08); border: 1px solid rgba(0,232,122,.18); color: var(--neon); font-size: 10px; }

        /* ===== Hero ===== */
        .cr-hero { display: grid; grid-template-columns: 1.4fr 1fr; gap: 28px; margin-top: 56px; }
        @media (max-width: 980px) { .cr-hero { grid-template-columns: 1fr; } }

        .cr-hero-card {
          padding: 40px; border-radius: 28px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--neon-glow), var(--glass-highlight);
          backdrop-filter: blur(36px) saturate(190%);
          -webkit-backdrop-filter: blur(36px) saturate(190%);
          position: relative; overflow: hidden;
        }
        .cr-hero-card::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.03) 0%, transparent 40%);
          pointer-events: none;
        }
        .cr-pill {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 999px;
          background: rgba(0,232,122,.10); border: 1px solid rgba(0,232,122,.22);
          color: var(--neon); font-size: 10px; letter-spacing: .2em;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
        }
        .cr-h1 {
          font-family: 'Bebas Neue', sans-serif; font-size: clamp(52px, 7vw, 86px);
          line-height: .95; letter-spacing: .02em; margin: 22px 0 16px;
          color: var(--text);
        }
        .cr-h1 .neon { color: var(--neon); text-shadow: 0 0 32px rgba(0,232,122,.5); }
        .cr-sub { color: var(--text-muted); font-size: 14px; line-height: 1.7; max-width: 56ch; }
        .cr-cta-row { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }

        /* Source-BTN style: pressed-glass button */
        .cr-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 22px; border-radius: 16px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .15em;
          cursor: pointer; transition: transform .15s ease, box-shadow .25s ease, background .25s ease;
          border: 1px solid rgba(0,232,122,.22);
          background: linear-gradient(180deg, rgba(0,232,122,.18) 0%, rgba(0,232,122,.08) 100%);
          color: var(--neon);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.18),
            inset 0 -1px 0 rgba(0,0,0,.25),
            0 6px 18px rgba(0,232,122,.18),
            0 0 0 1px rgba(0,232,122,.10);
        }
        .cr-btn:hover { transform: translateY(-1px); box-shadow: inset 0 1px 0 rgba(255,255,255,.22), inset 0 -1px 0 rgba(0,0,0,.25), 0 10px 28px rgba(0,232,122,.28), 0 0 0 1px rgba(0,232,122,.18); }
        .cr-btn:active { transform: translateY(1px); box-shadow: inset 0 2px 4px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.10); }
        .cr-btn.ghost {
          background: rgba(255,255,255,.04);
          border-color: rgba(255,255,255,.10);
          color: var(--text);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 6px 18px rgba(0,0,0,.3);
        }

        /* ===== Hero sidebar mock (Zappicon-style) ===== */
        .cr-sidebar {
          padding: 22px; border-radius: 26px;
          background: var(--glass-bg-strong);
          border: 1px solid var(--glass-border);
          box-shadow: var(--neon-glow), var(--glass-highlight);
          backdrop-filter: blur(34px) saturate(180%);
          -webkit-backdrop-filter: blur(34px) saturate(180%);
        }
        .cr-traffic { display: flex; gap: 6px; margin-bottom: 18px; }
        .cr-traffic span { width: 10px; height: 10px; border-radius: 50%; }
        .cr-traffic span:nth-child(1) { background: #ff5f57; }
        .cr-traffic span:nth-child(2) { background: #febc2e; }
        .cr-traffic span:nth-child(3) { background: #28c840; }

        .cr-profile { display: flex; align-items: center; gap: 12px; padding: 12px 0; }
        .cr-avatar {
          width: 42px; height: 42px; border-radius: 14px;
          background: linear-gradient(135deg, #00e87a, #0a5c3a);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif; color: #061a10; font-size: 20px;
          box-shadow: 0 0 0 1px rgba(0,232,122,.3), inset 0 1px 0 rgba(255,255,255,.3);
        }
        .cr-profile-meta { display: flex; flex-direction: column; gap: 2px; }
        .cr-profile-name { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: .1em; color: var(--text); }
        .cr-profile-name .badge { font-size: 9px; padding: 2px 8px; border-radius: 999px; background: rgba(0,232,122,.18); color: var(--neon); border: 1px solid rgba(0,232,122,.3); margin-left: 8px; letter-spacing: .15em; vertical-align: middle; }
        .cr-profile-handle { font-size: 11px; color: var(--text-dim); }
        .cr-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,232,122,.18), transparent); margin: 14px 0; }

        .cr-menu-label { font-size: 10px; letter-spacing: .25em; color: var(--text-dim); padding: 0 12px 6px; }
        .cr-menu { display: flex; flex-direction: column; gap: 4px; }
        .cr-menu-item {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: 14px;
          color: var(--text-muted); font-size: 12px; letter-spacing: .08em;
          cursor: pointer; transition: all .25s ease;
          border: 1px solid transparent;
        }
        .cr-menu-item:hover { color: var(--text); background: rgba(0,232,122,.06); }
        .cr-menu-item.active {
          color: var(--neon);
          background: linear-gradient(180deg, rgba(0,232,122,.18) 0%, rgba(0,232,122,.06) 100%);
          border-color: rgba(0,232,122,.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.10), 0 4px 14px rgba(0,232,122,.15);
        }
        .cr-menu-item .badge-num { margin-left: auto; min-width: 22px; padding: 2px 8px; border-radius: 999px; background: var(--neon); color: #051a0d; font-size: 10px; font-weight: 700; text-align: center; }

        /* ===== Stats strip ===== */
        .cr-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 32px; }
        @media (max-width: 760px) { .cr-stats { grid-template-columns: repeat(2, 1fr); } }
        .cr-stat {
          padding: 22px; border-radius: 22px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--neon-glow), var(--glass-highlight);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          position: relative; overflow: hidden;
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .cr-stat:hover { transform: translateY(-4px); box-shadow: 0 0 0 1px rgba(0,232,122,.28), 0 24px 70px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.10); }
        .cr-stat-icon { width: 36px; height: 36px; border-radius: 12px; background: rgba(0,232,122,.10); border: 1px solid rgba(0,232,122,.22); display: flex; align-items: center; justify-content: center; color: var(--neon); margin-bottom: 14px; box-shadow: inset 0 1px 0 rgba(255,255,255,.10); }
        .cr-stat-val { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: .04em; color: var(--text); line-height: 1; }
        .cr-stat-label { font-size: 10px; letter-spacing: .2em; color: var(--text-dim); margin-top: 6px; }

        /* ===== Section heading ===== */
        .cr-section-head { display: flex; align-items: end; justify-content: space-between; margin: 80px 0 24px; gap: 16px; flex-wrap: wrap; }
        .cr-section-title { font-family: 'Bebas Neue', sans-serif; font-size: 44px; letter-spacing: .04em; line-height: 1; color: var(--text); }
        .cr-section-title .neon { color: var(--neon); }
        .cr-section-sub { font-size: 12px; color: var(--text-muted); max-width: 44ch; }

        /* ===== Project cards ===== */
        .cr-projects { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 980px) { .cr-projects { grid-template-columns: 1fr; } }
        .cr-project {
          padding: 26px; border-radius: 24px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--neon-glow), var(--glass-highlight);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          position: relative; overflow: hidden; cursor: pointer;
          transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease;
        }
        .cr-project::after {
          content: ""; position: absolute; inset: -1px; border-radius: 25px; pointer-events: none;
          background: radial-gradient(400px 200px at var(--mx,50%) var(--my,0%), rgba(0,232,122,.14), transparent 60%);
          opacity: 0; transition: opacity .35s ease;
        }
        .cr-project:hover { transform: translateY(-6px); box-shadow: 0 0 0 1px rgba(0,232,122,.34), 0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.12); }
        .cr-project:hover::after { opacity: 1; }
        .cr-project-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .cr-tag { font-size: 9px; letter-spacing: .25em; padding: 4px 10px; border-radius: 999px; background: rgba(0,232,122,.10); color: var(--neon); border: 1px solid rgba(0,232,122,.2); }
        .cr-arrow { width: 34px; height: 34px; border-radius: 12px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; color: var(--text); transition: all .25s ease; box-shadow: inset 0 1px 0 rgba(255,255,255,.08); }
        .cr-project:hover .cr-arrow { background: var(--neon); color: #051a0d; border-color: var(--neon); transform: rotate(-12deg); }
        .cr-project-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: .04em; color: var(--text); margin-bottom: 8px; }
        .cr-project-desc { font-size: 12px; line-height: 1.7; color: var(--text-muted); margin-bottom: 18px; }
        .cr-project-kpi { font-size: 10px; letter-spacing: .2em; color: var(--neon); padding-top: 14px; border-top: var(--hairline); }

        /* ===== Calculator (key buttons demo) ===== */
        .cr-tools { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; margin-top: 24px; }
        @media (max-width: 980px) { .cr-tools { grid-template-columns: 1fr; } }

        .cr-calc {
          padding: 24px; border-radius: 28px;
          background: var(--glass-bg-strong);
          border: 1px solid var(--glass-border);
          box-shadow: var(--neon-glow), var(--glass-highlight);
          backdrop-filter: blur(32px) saturate(190%);
          -webkit-backdrop-filter: blur(32px) saturate(190%);
        }
        .cr-calc-screen {
          padding: 18px 20px; border-radius: 18px;
          background: rgba(0,0,0,.32);
          border: 1px solid rgba(0,232,122,.08);
          box-shadow: inset 0 2px 6px rgba(0,0,0,.5);
          text-align: right; margin-bottom: 16px;
        }
        .cr-calc-expr { font-size: 13px; color: var(--text-dim); min-height: 18px; word-break: break-all; }
        .cr-calc-result { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: .03em; color: var(--neon); text-shadow: 0 0 18px rgba(0,232,122,.4); }
        .cr-keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .cr-key {
          aspect-ratio: 1.1 / 1; border-radius: 16px;
          font-family: 'JetBrains Mono', monospace; font-size: 14px;
          color: var(--text); cursor: pointer; user-select: none;
          background: linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.02) 100%);
          border: 1px solid rgba(255,255,255,.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.10), inset 0 -1px 0 rgba(0,0,0,.3), 0 4px 12px rgba(0,0,0,.3);
          transition: transform .12s ease, box-shadow .2s ease, background .2s ease;
        }
        .cr-key:hover { background: linear-gradient(180deg, rgba(0,232,122,.10) 0%, rgba(0,232,122,.04) 100%); border-color: rgba(0,232,122,.18); }
        .cr-key:active { transform: translateY(2px); box-shadow: inset 0 3px 6px rgba(0,0,0,.5); }
        .cr-key.op { color: var(--neon); }
        .cr-key.eq {
          background: linear-gradient(180deg, #00ff88 0%, #00b85f 100%);
          color: #051a0d; font-weight: 700;
          border-color: rgba(0,232,122,.5);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.4), inset 0 -1px 0 rgba(0,0,0,.2), 0 8px 24px rgba(0,232,122,.45);
        }
        .cr-key.eq:hover { box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 12px 32px rgba(0,232,122,.6); }

        /* ===== Dropdown / context-menu demo ===== */
        .cr-menu-demo {
          padding: 30px; border-radius: 28px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--neon-glow), var(--glass-highlight);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
        }
        .cr-context {
          width: 100%; max-width: 320px; padding: 8px;
          border-radius: 22px;
          background: rgba(11,26,16,.55);
          border: 1px solid var(--glass-border);
          box-shadow: 0 0 0 1px rgba(0,232,122,.10), 0 20px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.10);
          backdrop-filter: blur(22px) saturate(160%);
        }
        .cr-context-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 14px;
          font-size: 12px; color: var(--text-muted); cursor: pointer;
          transition: all .2s ease;
        }
        .cr-context-row:hover { background: rgba(0,232,122,.06); color: var(--text); }
        .cr-context-row.active {
          background: linear-gradient(180deg, rgba(0,232,122,.18), rgba(0,232,122,.06));
          color: var(--neon);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
        }
        .cr-context-sep { height: 1px; background: rgba(0,232,122,.08); margin: 4px 8px; }

        /* ===== CTA bottom ===== */
        .cr-cta {
          margin-top: 80px; padding: 56px 40px; border-radius: 32px;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--neon-glow), var(--glass-highlight);
          backdrop-filter: blur(28px) saturate(170%);
          -webkit-backdrop-filter: blur(28px) saturate(170%);
          text-align: center; position: relative; overflow: hidden;
        }
        .cr-cta::before {
          content: ""; position: absolute; left: 50%; top: -80%; transform: translateX(-50%);
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,232,122,.22), transparent 60%);
          filter: blur(40px); pointer-events: none;
        }
        .cr-cta > * { position: relative; }

        /* footer note */
        .cr-foot { margin-top: 60px; text-align: center; font-size: 10px; letter-spacing: .25em; color: var(--text-dim); }
      `}</style>

      <div className="cr-bg">
        <div className="cr-blob b1" />
        <div className="cr-blob b2" />
        <div className="cr-blob b3" />
        <div className="cr-blob b4" />
        <div className="cr-blob b5" />
      </div>
      <div className="cr-grain" />

      <div className="cr-wrap">
        {/* NAVBAR */}
        <nav className="cr-nav">
          <div className="cr-logo"><span className="dot" />CRISTAL</div>
          <div className="cr-nav-links">
            <div className="cr-nav-link active">HOME</div>
            <div className="cr-nav-link">OPS</div>
            <div className="cr-nav-link">REPORTS</div>
            <div className="cr-nav-link">LAB</div>
          </div>
          <div className="cr-search">
            <Search size={14} style={{ color: "var(--neon)" }} />
            <span>Buscar write-ups, CVEs…</span>
            <kbd>⌘K</kbd>
          </div>
        </nav>

        {/* HERO */}
        <section className="cr-hero">
          <div className="cr-hero-card">
            <span className="cr-pill"><Sparkles size={11} /> GLASSMORPHISM · v0.1</span>
            <h1 className="cr-h1">
              CRISTAL,<br />
              <span className="neon">FUERZA</span> &<br />
              CLARIDAD.
            </h1>
            <p className="cr-sub">
              Lenguaje visual basado en cristal translúcido sobre verde bosque. Bordes
              luminosos, blur denso, sombras profundas y radios concéntricos. Mismo
              ADN red-team — más profundidad, más jerarquía, más wow.
            </p>
            <div className="cr-cta-row">
              <button className="cr-btn">DEPLOY <ArrowUpRight size={14} /></button>
              <button className="cr-btn ghost">VER CÓDIGO</button>
            </div>
          </div>

          <aside className="cr-sidebar">
            <div className="cr-traffic"><span /><span /><span /></div>
            <div className="cr-profile">
              <div className="cr-avatar">Y</div>
              <div className="cr-profile-meta">
                <div className="cr-profile-name">YOANDY<span className="badge">RED</span></div>
                <div className="cr-profile-handle">@redteam-op</div>
              </div>
              <ChevronDown size={16} style={{ color: "var(--text-dim)", marginLeft: "auto" }} />
            </div>
            <div className="cr-divider" />
            <div className="cr-menu-label">CONSOLA</div>
            <div className="cr-menu">
              {navItems.map((it) => (
                <div
                  key={it.label}
                  className={`cr-menu-item ${activeKey === it.label ? "active" : ""}`}
                  onClick={() => setActiveKey(it.label)}
                >
                  <it.icon size={15} />
                  <span>{it.label}</span>
                  {it.label === "Threats" && <span className="badge-num">3</span>}
                </div>
              ))}
            </div>
            <div className="cr-divider" />
            <div className="cr-menu-item" style={{ color: "var(--text-dim)" }}>
              <LogOut size={15} /><span>Cerrar sesión</span>
            </div>
          </aside>
        </section>

        {/* STATS */}
        <section className="cr-stats">
          {stats.map((s) => (
            <div key={s.label} className="cr-stat">
              <div className="cr-stat-icon"><s.icon size={18} /></div>
              <div className="cr-stat-val">{s.value}</div>
              <div className="cr-stat-label">{s.label}</div>
            </div>
          ))}
        </section>

        {/* PROJECTS */}
        <div className="cr-section-head">
          <div>
            <div className="cr-section-title">ARSENAL <span className="neon">/</span> PROYECTOS</div>
          </div>
          <p className="cr-section-sub">
            Cada tarjeta refracta el fondo. Hover responde con luz suave del cursor
            y elevación física.
          </p>
        </div>
        <section className="cr-projects">
          {projects.map((p) => (
            <article
              key={p.title}
              className="cr-project"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <div className="cr-project-head">
                <span className="cr-tag">{p.tag}</span>
                <div className="cr-arrow"><ArrowUpRight size={16} /></div>
              </div>
              <h3 className="cr-project-title">{p.title}</h3>
              <p className="cr-project-desc">{p.desc}</p>
              <div className="cr-project-kpi">// {p.kpi}</div>
            </article>
          ))}
        </section>

        {/* TOOLS: calculator + dropdown */}
        <div className="cr-section-head">
          <div>
            <div className="cr-section-title">COMPONENTES <span className="neon">VIVOS</span></div>
          </div>
          <p className="cr-section-sub">
            Teclas físicas, menús contextuales y radios concéntricos
            (outer = inner + padding) para curvas perfectas.
          </p>
        </div>
        <section className="cr-tools">
          <div className="cr-calc">
            <div className="cr-calc-screen">
              <div className="cr-calc-expr">{expression || "0"}</div>
              <div className="cr-calc-result">{result}</div>
            </div>
            <div className="cr-keys">
              {calcKeys.flat().map((k) => {
                const isOp = ["÷", "×", "−", "+", "AC", "±", "%", "←"].includes(k);
                const isEq = k === "=";
                return (
                  <button
                    key={k}
                    onClick={() => handleKey(k)}
                    className={`cr-key ${isOp ? "op" : ""} ${isEq ? "eq" : ""}`}
                  >
                    {k}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="cr-menu-demo">
            <div className="cr-context">
              <div className="cr-context-row"><MessageSquare size={14} /> Ver perfil</div>
              <div className="cr-context-row"><FileText size={14} /> Editar detalles</div>
              <div className="cr-context-row active"><Shield size={14} /> Marcar amenaza</div>
              <div className="cr-context-row"><Settings size={14} /> Asignar tag</div>
              <div className="cr-context-sep" />
              <div className="cr-context-row"><Database size={14} /> Añadir nota</div>
              <div className="cr-context-row"><Activity size={14} /> Descargar resumen</div>
              <div className="cr-context-sep" />
              <div className="cr-context-row" style={{ color: "#ff6b6b" }}><Lock size={14} /> Bloquear acceso</div>
            </div>
            <p style={{ fontSize: 10, letterSpacing: ".2em", color: "var(--text-dim)" }}>
              MENÚ CONTEXTUAL · GLASS · 22PX RADIUS
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="cr-cta">
          <span className="cr-pill"><Sparkles size={11} /> ¿LO APLICAMOS?</span>
          <h2 className="cr-h1" style={{ fontSize: "clamp(40px, 6vw, 64px)", marginTop: 18 }}>
            ESTE ES EL <span className="neon">CRISTAL</span>.
          </h2>
          <p className="cr-sub" style={{ margin: "0 auto" }}>
            Si te convence el lenguaje, lo extiendo al portfolio completo: navbar,
            cards de proyectos y machines, dropdown ⌘K, hero "Sobre mí", panel
            /more, modales de write-ups protegidos. Manteniendo legibilidad en los
            informes técnicos.
          </p>
          <div className="cr-cta-row" style={{ justifyContent: "center", marginTop: 28 }}>
            <button className="cr-btn">APLICAR AL PORTFOLIO <ArrowUpRight size={14} /></button>
            <button className="cr-btn ghost">SEGUIR ITERANDO</button>
          </div>
        </section>

        <div className="cr-foot">// HEINDALL · CRISTAL DEMO · FOREST GREEN GLASS LANGUAGE</div>
      </div>
    </div>
  );
};

export default Cristal;