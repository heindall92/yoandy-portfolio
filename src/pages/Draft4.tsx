import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { machines } from "./Machines";
import { sherlocks } from "./Sherlocks";
import { hmvMachines } from "./HackMyVM";

/* ── Data ── */
const allWriteups = [
  ...machines.map((m) => ({ ...m, platform: "HTB", type: "machine" })),
  ...sherlocks.map((s) => ({ ...s, platform: "Sherlock", type: "sherlock", os: "N/A" })),
  ...hmvMachines.map((m) => ({ ...m, platform: "HackMyVM", type: "hmv" })),
  {
    slug: "ejptv2-cert", emoji: "🎯", name: "eJPTv2", platform: "Cert", type: "cert",
    desc: "Evaluación ofensiva completa de red híbrida DMZ + red interna.",
    tags: ["eJPTv2", "Pivoting", "Drupalgeddon2", "Metasploit", "SMB"],
    difficulty: "CERTIFICATION", diffColor: "primary", os: "Windows · Linux",
  },
];
const totalMachines = allWriteups.length;

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yoandyrd92/", ico: "Ln" },
  { label: "GitHub", href: "https://github.com/heindall92", ico: "Gh" },
  { label: "HackTheBox", href: "https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa", ico: "Htb" },
  { label: "TryHackMe", href: "https://tryhackme.com/p/yoandy92", ico: "Thm" },
];

const certifications = [
  { org: "eLEARNSECURITY", name: "eJPTv2", status: "Certified", cls: "done" },
  { org: "GOOGLE", name: "Cybersecurity Professional", status: "Done", cls: "done" },
  { org: "CISCO", name: "Networking & Security", status: "Done", cls: "done" },
  { org: "IBM", name: "Cybersecurity Analyst", status: "Done", cls: "done" },
  { org: "HTB ACADEMY", name: "Jr. Cybersecurity Analyst", status: "Full Path", cls: "done" },
  { org: "EVOLVE ACADEMY", name: "Master Ciberseguridad & AI", status: "En Curso", cls: "wip" },
  { org: "OFFSEC", name: "OSCP", status: "2026", cls: "plan" },
  { org: "HTB", name: "CPTS", status: "2026", cls: "plan" },
];

const skills = [
  { name: "Penetration Testing", pct: 82 },
  { name: "Web App Security", pct: 78 },
  { name: "Recon & OSINT", pct: 85 },
  { name: "Post-Exploitation", pct: 75 },
  { name: "Automation & Scripting", pct: 80 },
  { name: "CTF & Research", pct: 88 },
];

const diffClass = (d: string) => {
  const dl = d.toLowerCase();
  if (dl.includes("very easy") || dl.includes("easy")) return "d4-de";
  if (dl.includes("medium")) return "d4-dm";
  return "d4-dh";
};

const Draft4 = () => {
  const [entered, setEntered] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [counter, setCounter] = useState(0);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalWrapRef = useRef<HTMLDivElement>(null);

  /* Loading */
  useEffect(() => {
    if (entered) return;
    const iv = setInterval(() => setLoadPct(p => Math.min(p + Math.random() * 12 + 3, 100)), 100);
    return () => clearInterval(iv);
  }, [entered]);

  /* Enter → reveal hero words with stagger */
  useEffect(() => {
    if (!entered) return;
    setTimeout(() => setHeroRevealed(true), 100);
  }, [entered]);

  /* Counter */
  useEffect(() => {
    if (!entered) return;
    let n = 0;
    const iv = setInterval(() => { n++; setCounter(n); if (n >= totalMachines) clearInterval(iv); }, 40);
    return () => clearInterval(iv);
  }, [entered]);

  /* Custom cursor */
  useEffect(() => {
    if (!entered) return;
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;
    let cx = 0, cy = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener("mousemove", onMove);
    let raf: number;
    const lerp = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
      dot.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`;
      raf = requestAnimationFrame(lerp);
    };
    lerp();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove); };
  }, [entered]);

  /* Scroll reveal */
  useEffect(() => {
    if (!entered) return;
    const ro = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("d4-vis"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".d4-r").forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, [entered]);

  /* Horizontal scroll for writeups */
  useEffect(() => {
    if (!entered) return;
    const wrap = horizontalWrapRef.current;
    const track = horizontalRef.current;
    if (!wrap || !track) return;

    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const wrapH = wrap.offsetHeight;
      const viewH = window.innerHeight;
      const scrollable = wrapH - viewH;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const trackW = track.scrollWidth - window.innerWidth;
      track.style.transform = `translateX(${-progress * trackW}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entered]);

  /* Parallax elements */
  useEffect(() => {
    if (!entered) return;
    const onScroll = () => {
      document.querySelectorAll<HTMLElement>(".d4-plx").forEach(el => {
        const speed = parseFloat(el.dataset.speed || "0.3");
        const rect = el.getBoundingClientRect();
        const offset = (rect.top - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [entered]);

  return (
    <div className="d4-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@200;300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap');

        .d4-page {
          --ink: #0b1a10; --forest: #0f2318; --pine: #163020;
          --green: #00e87a; --green2: rgba(0,232,122,.12); --green3: rgba(0,232,122,.05);
          --cream: #f2ede4; --cream2: #faf7f1; --sage: #2a6048;
          --td: #c8f0dc; --td2: rgba(200,240,220,.5); --td3: rgba(200,240,220,.2);
          --tl: #1a2e20; --tl2: rgba(26,46,32,.55);
          --bb: 'Bebas Neue', sans-serif; --dm: 'DM Sans', sans-serif; --mo: 'JetBrains Mono', monospace;
          font-family: var(--dm); background: var(--ink); color: var(--td);
          overflow-x: hidden; cursor: none;
        }
        .d4-page *, .d4-page a, .d4-page button { cursor: none; }

        /* ═══ CUSTOM CURSOR ═══ */
        .d4-cursor {
          position: fixed; top: 0; left: 0; z-index: 9999;
          width: 40px; height: 40px; border-radius: 50%;
          border: 1px solid rgba(0,232,122,.4);
          pointer-events: none; transition: width .3s, height .3s, border-color .3s;
          mix-blend-mode: difference;
        }
        .d4-cursor-dot {
          position: fixed; top: 0; left: 0; z-index: 9999;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green); pointer-events: none;
        }

        /* ═══ PRELOADER ═══ */
        .d4-pre {
          position: fixed; inset: 0; z-index: 999; background: var(--ink);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: opacity 1s cubic-bezier(.4,0,.2,1), visibility 1s;
        }
        .d4-pre.gone { opacity: 0; visibility: hidden; pointer-events: none; }
        .d4-pre-title {
          font-family: var(--bb); font-size: clamp(3rem,8vw,6rem);
          letter-spacing: .08em; color: var(--td); margin-bottom: 40px;
          overflow: hidden;
        }
        .d4-pre-title span {
          display: inline-block; transform: translateY(100%);
          animation: d4-slideUp .6s cubic-bezier(.16,1,.3,1) forwards;
        }
        .d4-pre-title span:nth-child(2) { animation-delay: .15s; color: var(--green); }
        @keyframes d4-slideUp { to { transform: translateY(0); } }

        .d4-pre-bar {
          width: 240px; height: 1px; background: rgba(0,232,122,.1);
          margin-bottom: 40px; position: relative; overflow: hidden;
        }
        .d4-pre-fill { height: 100%; background: var(--green); box-shadow: 0 0 12px var(--green); transition: width .1s; }
        .d4-pre-pct {
          font-family: var(--mo); font-size: .65rem; color: var(--td3);
          letter-spacing: .3em; margin-bottom: 32px;
        }
        .d4-pre-enter {
          font-family: var(--mo); font-size: .7rem; letter-spacing: .5em;
          color: var(--green); background: none; border: none;
          padding: 16px 48px; position: relative; overflow: hidden;
          opacity: 0; transform: translateY(20px);
          transition: opacity .5s .2s, transform .5s .2s, letter-spacing .3s;
        }
        .d4-pre-enter.show { opacity: 1; transform: translateY(0); }
        .d4-pre-enter::before {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 1px; background: var(--green); transform: scaleX(0);
          transition: transform .6s cubic-bezier(.16,1,.3,1);
        }
        .d4-pre-enter:hover { letter-spacing: .7em; }
        .d4-pre-enter:hover::before { transform: scaleX(1); }

        /* ═══ NAV ═══ */
        .d4-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 500;
          display: flex; justify-content: space-between; align-items: center;
          padding: 28px 48px; mix-blend-mode: difference;
        }
        .d4-nav-logo {
          font-family: var(--bb); font-size: 1.2rem; letter-spacing: .25em;
          color: white; text-decoration: none;
        }
        .d4-nav-links { display: flex; gap: 28px; list-style: none; margin: 0; padding: 0; }
        .d4-nav-links a {
          font-family: var(--mo); font-size: .65rem; color: rgba(255,255,255,.5);
          text-decoration: none; letter-spacing: .15em; transition: color .3s;
          position: relative;
        }
        .d4-nav-links a::after {
          content: ''; position: absolute; bottom: -4px; left: 0; width: 100%;
          height: 1px; background: white; transform: scaleX(0);
          transform-origin: right; transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        .d4-nav-links a:hover { color: white; }
        .d4-nav-links a:hover::after { transform: scaleX(1); transform-origin: left; }
        .d4-nav-toggle {
          display: none; background: none; border: none; color: white;
          font-family: var(--mo); font-size: .7rem; letter-spacing: .2em;
        }
        @media(max-width:900px) {
          .d4-nav-links { display: none; }
          .d4-nav-toggle { display: block; }
        }

        /* Mobile overlay */
        .d4-mobile-menu {
          position: fixed; inset: 0; z-index: 499; background: var(--ink);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px;
        }
        .d4-mobile-menu a {
          font-family: var(--bb); font-size: 2.5rem; color: var(--td);
          text-decoration: none; letter-spacing: .1em; transition: color .3s;
        }
        .d4-mobile-menu a:hover { color: var(--green); }

        /* ═══ HERO ═══ */
        .d4-hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; position: relative; overflow: hidden;
        }
        .d4-hero-words {
          display: flex; flex-direction: column; align-items: center;
          position: relative; z-index: 2;
        }
        .d4-hero-word {
          font-family: var(--bb); font-size: clamp(6rem, 15vw, 18rem);
          line-height: .85; letter-spacing: .04em; color: var(--td);
          overflow: hidden; display: block;
        }
        .d4-hero-word span {
          display: block; transform: translateY(110%);
          transition: transform 1.2s cubic-bezier(.16,1,.3,1);
        }
        .d4-hero-word.revealed span { transform: translateY(0); }
        .d4-hero-word:nth-child(1) span { transition-delay: .1s; }
        .d4-hero-word:nth-child(2) span { transition-delay: .3s; color: var(--green); text-shadow: 0 0 80px rgba(0,232,122,.15); }
        .d4-hero-word:nth-child(3) span { transition-delay: .5s; }

        .d4-hero-sub {
          font-family: var(--mo); font-size: .62rem; letter-spacing: .4em;
          color: var(--td3); margin-top: 36px; overflow: hidden;
        }
        .d4-hero-sub span {
          display: block; transform: translateY(100%);
          transition: transform .8s cubic-bezier(.16,1,.3,1) .9s;
        }
        .d4-hero-sub.revealed span { transform: translateY(0); }

        .d4-hero-scroll {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          font-family: var(--mo); font-size: .5rem; letter-spacing: .3em;
          color: var(--td3); display: flex; flex-direction: column; align-items: center; gap: 12px;
          opacity: 0; transition: opacity 1s 1.5s;
        }
        .d4-hero-scroll.revealed { opacity: 1; }
        .d4-hero-scroll::after {
          content: ''; width: 1px; height: 48px;
          background: linear-gradient(to bottom, rgba(0,232,122,.3), transparent);
          animation: d4-scrollPulse 2s ease-in-out infinite;
        }
        @keyframes d4-scrollPulse {
          0%, 100% { opacity: .3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.3); }
        }

        /* Decorative lines behind hero */
        .d4-hero-lines {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden;
        }
        .d4-hero-line {
          position: absolute; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(0,232,122,.04) 30%, rgba(0,232,122,.04) 70%, transparent);
        }

        /* ═══ INTRO SECTION (Dogstudio-style split text) ═══ */
        .d4-intro {
          padding: 200px 80px; display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: start; position: relative;
        }
        .d4-intro-big {
          font-family: var(--dm); font-size: clamp(1.8rem, 3vw, 3rem);
          font-weight: 200; line-height: 1.5; color: var(--td);
        }
        .d4-intro-big strong { font-weight: 500; color: var(--green); }
        .d4-intro-right {
          font-size: .92rem; color: var(--td2); line-height: 2; font-weight: 300;
          padding-top: 12px;
        }

        /* ═══ STATS BAR ═══ */
        .d4-stats-bar {
          display: flex; justify-content: center; gap: 80px; padding: 80px 48px;
          border-top: 1px solid rgba(0,232,122,.06);
          border-bottom: 1px solid rgba(0,232,122,.06);
        }
        .d4-stat { text-align: center; }
        .d4-stat-n {
          font-family: var(--bb); font-size: clamp(3rem, 5vw, 5rem);
          color: var(--green); line-height: 1;
          text-shadow: 0 0 40px rgba(0,232,122,.15);
        }
        .d4-stat-l {
          font-family: var(--mo); font-size: .5rem; color: var(--td3);
          letter-spacing: .25em; margin-top: 8px;
        }

        /* ═══ FEATURED WRITEUPS (horizontal scroll) ═══ */
        .d4-hz-wrap {
          position: relative;
          height: ${Math.max(300, allWriteups.length * 55)}vh;
        }
        .d4-hz-sticky {
          position: sticky; top: 0; height: 100vh; overflow: hidden;
          display: flex; flex-direction: column; justify-content: center;
        }
        .d4-hz-header {
          padding: 0 80px; margin-bottom: 48px;
        }
        .d4-hz-title {
          font-family: var(--bb); font-size: clamp(2rem, 4vw, 4rem);
          letter-spacing: .04em; color: var(--td);
        }
        .d4-hz-title em { font-style: normal; color: var(--green); }
        .d4-hz-sub {
          font-family: var(--mo); font-size: .6rem; color: var(--td3);
          letter-spacing: .2em; margin-top: 8px;
        }
        .d4-hz-track {
          display: flex; gap: 32px; padding: 0 80px;
          will-change: transform;
        }
        .d4-hz-card {
          flex-shrink: 0; width: 420px; text-decoration: none;
          display: flex; flex-direction: column; position: relative;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        .d4-hz-card:hover { transform: translateY(-12px); }
        .d4-hz-img {
          width: 100%; height: 280px; border-radius: 8px; overflow: hidden;
          position: relative; margin-bottom: 20px;
        }
        .d4-hz-img-bg {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .d4-hz-emoji { font-size: 4.5rem; position: relative; z-index: 1; transition: transform .4s; }
        .d4-hz-card:hover .d4-hz-emoji { transform: scale(1.15) rotate(-5deg); }
        .d4-hz-diff {
          position: absolute; top: 14px; right: 14px; padding: 4px 14px;
          border-radius: 4px; font-family: var(--mo); font-size: .55rem;
          letter-spacing: .12em; font-weight: 500; z-index: 2;
        }
        .d4-de { background: rgba(0,232,122,.12); color: var(--green); border: 1px solid rgba(0,232,122,.25); }
        .d4-dm { background: rgba(245,166,35,.12); color: #f5a623; border: 1px solid rgba(245,166,35,.25); }
        .d4-dh { background: rgba(240,79,90,.12); color: #f04f5a; border: 1px solid rgba(240,79,90,.25); }
        .d4-hz-plat {
          position: absolute; bottom: 14px; left: 14px; font-family: var(--mo);
          font-size: .52rem; color: var(--td3); background: rgba(11,26,16,.8);
          padding: 4px 12px; border-radius: 3px; letter-spacing: .1em; z-index: 2;
        }
        .d4-hz-name {
          font-family: var(--dm); font-size: 1.1rem; font-weight: 500;
          color: var(--td); margin-bottom: 6px;
        }
        .d4-hz-desc {
          font-size: .82rem; color: var(--td2); line-height: 1.5; font-weight: 300;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 12px;
        }
        .d4-hz-link {
          font-family: var(--mo); font-size: .65rem; color: var(--green);
          letter-spacing: .1em; display: flex; align-items: center; gap: 6px;
          transition: gap .3s;
        }
        .d4-hz-card:hover .d4-hz-link { gap: 12px; }

        /* ═══ SKILLS (minimal bars) ═══ */
        .d4-skills {
          padding: 160px 80px; position: relative;
        }
        .d4-sk-title {
          font-family: var(--bb); font-size: clamp(3rem, 5vw, 6rem);
          letter-spacing: .04em; color: var(--td); margin-bottom: 80px;
        }
        .d4-sk-title em { font-style: normal; color: var(--green); }
        .d4-sk-list { max-width: 800px; }
        .d4-sk-item {
          display: flex; align-items: center; gap: 32px;
          padding: 28px 0; border-bottom: 1px solid rgba(0,232,122,.06);
        }
        .d4-sk-name {
          font-family: var(--mo); font-size: .75rem; color: var(--td);
          letter-spacing: .1em; width: 220px; flex-shrink: 0;
        }
        .d4-sk-bar {
          flex: 1; height: 2px; background: rgba(0,232,122,.08);
          border-radius: 1px; overflow: hidden; position: relative;
        }
        .d4-sk-fill {
          height: 100%; background: var(--green);
          box-shadow: 0 0 8px rgba(0,232,122,.3);
          width: 0; transition: width 1.8s cubic-bezier(.16,1,.3,1);
        }
        .d4-vis .d4-sk-fill { width: var(--pct); }
        .d4-sk-pct {
          font-family: var(--mo); font-size: .6rem; color: var(--td3);
          letter-spacing: .1em; width: 40px; text-align: right; flex-shrink: 0;
        }

        /* ═══ CERTS (list style like Dogstudio cases) ═══ */
        .d4-certs {
          padding: 160px 80px; background: var(--forest);
        }
        .d4-certs-title {
          font-family: var(--bb); font-size: clamp(3rem, 5vw, 6rem);
          letter-spacing: .04em; color: var(--td); margin-bottom: 60px;
        }
        .d4-certs-title em { font-style: normal; color: var(--green); }
        .d4-cert-list { max-width: 900px; }
        .d4-cert-item {
          display: flex; align-items: center; gap: 24px;
          padding: 24px 0; border-bottom: 1px solid rgba(0,232,122,.06);
          transition: all .3s;
        }
        .d4-cert-item:hover { padding-left: 16px; }
        .d4-cert-org {
          font-family: var(--mo); font-size: .55rem; color: var(--td3);
          letter-spacing: .2em; width: 160px; flex-shrink: 0;
        }
        .d4-cert-name {
          font-family: var(--dm); font-size: 1rem; color: var(--td);
          font-weight: 400; flex: 1;
        }
        .d4-cert-status {
          font-family: var(--mo); font-size: .55rem; letter-spacing: .15em;
          padding: 4px 14px; border-radius: 20px; flex-shrink: 0;
        }
        .d4-cert-item.done .d4-cert-status {
          color: var(--green); border: 1px solid rgba(0,232,122,.2);
          background: rgba(0,232,122,.06);
        }
        .d4-cert-item.wip .d4-cert-status {
          color: #38d9f5; border: 1px solid rgba(56,217,245,.2);
          background: rgba(56,217,245,.06);
        }
        .d4-cert-item.plan .d4-cert-status {
          color: var(--td3); border: 1px solid rgba(200,240,220,.08);
        }

        /* ═══ CONTACT (full-screen CTA like Dogstudio) ═══ */
        .d4-contact {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          padding: 100px 48px; position: relative;
        }
        .d4-contact-title {
          font-family: var(--bb); font-size: clamp(4rem, 10vw, 12rem);
          line-height: .85; letter-spacing: .03em; color: var(--td);
          margin-bottom: 32px;
        }
        .d4-contact-title em { font-style: normal; color: var(--green); }
        .d4-contact-sub {
          font-family: var(--dm); font-size: 1rem; color: var(--td2);
          font-weight: 300; line-height: 1.8; max-width: 500px; margin-bottom: 40px;
        }
        .d4-contact-btn {
          font-family: var(--mo); font-size: .7rem; letter-spacing: .4em;
          color: var(--green); text-decoration: none; padding: 18px 48px;
          border: 1px solid rgba(0,232,122,.3); transition: all .4s;
          position: relative; overflow: hidden;
        }
        .d4-contact-btn::before {
          content: ''; position: absolute; inset: 0; background: var(--green);
          transform: scaleX(0); transform-origin: left;
          transition: transform .5s cubic-bezier(.16,1,.3,1);
        }
        .d4-contact-btn:hover { color: var(--ink); }
        .d4-contact-btn:hover::before { transform: scaleX(1); }
        .d4-contact-btn span { position: relative; z-index: 1; }

        .d4-social {
          display: flex; gap: 28px; margin-top: 60px;
        }
        .d4-social a {
          font-family: var(--mo); font-size: .6rem; color: var(--td3);
          text-decoration: none; letter-spacing: .15em; transition: color .3s;
          position: relative;
        }
        .d4-social a::after {
          content: ''; position: absolute; bottom: -3px; left: 0; width: 100%;
          height: 1px; background: var(--green); transform: scaleX(0);
          transform-origin: right; transition: transform .4s cubic-bezier(.16,1,.3,1);
        }
        .d4-social a:hover { color: var(--green); }
        .d4-social a:hover::after { transform: scaleX(1); transform-origin: left; }

        /* ═══ FOOTER ═══ */
        .d4-footer {
          padding: 40px 80px; display: flex; justify-content: space-between;
          align-items: center; border-top: 1px solid rgba(0,232,122,.06);
          font-family: var(--mo); font-size: .55rem; color: var(--td3);
          letter-spacing: .1em;
        }
        .d4-footer-logo {
          font-family: var(--bb); font-size: 1rem; letter-spacing: .2em; color: var(--green);
        }
        .d4-footer-cities { display: flex; gap: 24px; }
        .d4-footer-city { display: flex; align-items: center; gap: 6px; }
        .d4-footer-dot {
          width: 4px; height: 4px; border-radius: 50%; background: var(--green);
          box-shadow: 0 0 6px var(--green);
        }

        /* ═══ REVEAL ═══ */
        .d4-r {
          opacity: 0; transform: translateY(50px);
          transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
        }
        .d4-r.d4-vis { opacity: 1; transform: translateY(0); }
        .d4-r.d1 { transition-delay: .1s; }
        .d4-r.d2 { transition-delay: .2s; }
        .d4-r.d3 { transition-delay: .3s; }
        .d4-r.d4 { transition-delay: .4s; }

        /* ═══ RESPONSIVE ═══ */
        @media(max-width: 900px) {
          .d4-page { cursor: auto; }
          .d4-page *, .d4-page a, .d4-page button { cursor: auto; }
          .d4-cursor, .d4-cursor-dot { display: none; }
          .d4-intro { grid-template-columns: 1fr; padding: 120px 32px; gap: 40px; }
          .d4-stats-bar { gap: 32px; flex-wrap: wrap; padding: 60px 32px; }
          .d4-hz-card { width: 300px; }
          .d4-hz-header, .d4-hz-track { padding: 0 32px; }
          .d4-skills, .d4-certs { padding: 100px 32px; }
          .d4-sk-item { flex-direction: column; gap: 12px; align-items: flex-start; }
          .d4-sk-name { width: auto; }
          .d4-cert-item { flex-direction: column; gap: 8px; align-items: flex-start; }
          .d4-cert-org { width: auto; }
          .d4-footer { flex-direction: column; gap: 16px; text-align: center; padding: 40px 32px; }
          .d4-footer-cities { flex-wrap: wrap; justify-content: center; }
          .d4-contact { padding: 80px 24px; }
        }
      `}</style>

      {/* ═══ CURSOR ═══ */}
      {entered && (
        <>
          <div ref={cursorRef} className="d4-cursor" />
          <div ref={cursorDotRef} className="d4-cursor-dot" />
        </>
      )}

      {/* ═══ PRELOADER ═══ */}
      <div className={`d4-pre ${entered ? "gone" : ""}`}>
        <div className="d4-pre-title">
          <span>HACK</span>{" "}<span>WELL</span>
        </div>
        <div className="d4-pre-bar">
          <div className="d4-pre-fill" style={{ width: `${loadPct}%` }} />
        </div>
        <div className="d4-pre-pct">{Math.round(loadPct)}%</div>
        <button
          className={`d4-pre-enter ${loadPct >= 100 ? "show" : ""}`}
          onClick={() => setEntered(true)}
        >
          ENTER
        </button>
      </div>

      {entered && (
        <>
          {/* ═══ NAV ═══ */}
          <nav className="d4-nav">
            <a href="#" className="d4-nav-logo">HEINDALL</a>
            <ul className="d4-nav-links">
              <li><a href="#intro">About</a></li>
              <li><a href="#writeups">Cases</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#certs">Certs</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
            <button className="d4-nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? "CLOSE" : "MENU"}
            </button>
          </nav>

          {menuOpen && (
            <div className="d4-mobile-menu" onClick={() => setMenuOpen(false)}>
              <a href="#intro">About</a>
              <a href="#writeups">Cases</a>
              <a href="#skills">Skills</a>
              <a href="#certs">Certs</a>
              <a href="#contact">Contact</a>
            </div>
          )}

          {/* ═══ HERO ═══ */}
          <section className="d4-hero">
            {/* Vertical lines */}
            <div className="d4-hero-lines">
              {[15, 30, 50, 70, 85].map(p => (
                <div key={p} className="d4-hero-line" style={{ left: `${p}%` }} />
              ))}
            </div>

            <div className="d4-hero-words">
              {["HACK", "WELL", "HEINDALL"].map((word, i) => (
                <div key={word} className={`d4-hero-word ${heroRevealed ? "revealed" : ""}`}>
                  <span>{word}</span>
                </div>
              ))}
            </div>

            <div className={`d4-hero-sub ${heroRevealed ? "revealed" : ""}`}>
              <span>RED TEAM OPERATOR · PENTESTER · eJPTv2 CERTIFIED</span>
            </div>

            <div className={`d4-hero-scroll ${heroRevealed ? "revealed" : ""}`}>
              SCROLL
            </div>
          </section>

          {/* ═══ INTRO ═══ */}
          <section id="intro" className="d4-intro">
            <div className="d4-intro-big d4-r">
              Estudio creativo de <strong>ciberseguridad ofensiva</strong> que tiene lugar
              justo donde el <strong>hacking ético</strong>, la investigación y la
              <strong> documentación técnica</strong> se juntan.
            </div>
            <div className="d4-intro-right d4-r d1">
              Tenemos la mirada fija en comprometer sistemas de forma ética y documentar
              cada vector de ataque con metodología PTES/OWASP. Cada máquina, cada
              vulnerabilidad, cada técnica — investigada, explotada y reportada.
            </div>
          </section>

          {/* ═══ STATS ═══ */}
          <div className="d4-stats-bar d4-r">
            <div className="d4-stat">
              <div className="d4-stat-n">{counter}+</div>
              <div className="d4-stat-l">MÁQUINAS</div>
            </div>
            <div className="d4-stat">
              <div className="d4-stat-n">8</div>
              <div className="d4-stat-l">HTB LEVEL</div>
            </div>
            <div className="d4-stat">
              <div className="d4-stat-n">✓</div>
              <div className="d4-stat-l">eJPTv2</div>
            </div>
            <div className="d4-stat">
              <div className="d4-stat-n">4+</div>
              <div className="d4-stat-l">AÑOS EXP</div>
            </div>
          </div>

          {/* ═══ HORIZONTAL WRITEUPS ═══ */}
          <div id="writeups" className="d4-hz-wrap" ref={horizontalWrapRef}>
            <div className="d4-hz-sticky">
              <div className="d4-hz-header">
                <div className="d4-hz-title">Proyectos <em>Destacados</em></div>
                <div className="d4-hz-sub">SCROLL PARA EXPLORAR · {totalMachines} WRITEUPS</div>
              </div>
              <div className="d4-hz-track" ref={horizontalRef}>
                {allWriteups.map(w => {
                  const bgGrad = w.platform === "HTB" ? "linear-gradient(135deg,#041810,#07281a)"
                    : w.platform === "Sherlock" ? "linear-gradient(135deg,#12051e,#200838)"
                    : w.platform === "Cert" ? "linear-gradient(135deg,#0a1628,#0d2040)"
                    : "linear-gradient(135deg,#1a0808,#350d0d)";
                  return (
                    <Link to={`/report/${w.slug}`} className="d4-hz-card" key={w.slug}>
                      <div className="d4-hz-img">
                        <div className="d4-hz-img-bg" style={{ background: bgGrad }}>
                          <span className="d4-hz-emoji">{w.emoji}</span>
                        </div>
                        <span className={`d4-hz-diff ${diffClass(w.difficulty)}`}>
                          {w.difficulty.toUpperCase()}
                        </span>
                        <span className="d4-hz-plat">{w.platform}</span>
                      </div>
                      <div className="d4-hz-name">{w.name}</div>
                      <div className="d4-hz-desc">{w.desc}</div>
                      <span className="d4-hz-link">Leer writeup →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══ SKILLS ═══ */}
          <section id="skills" className="d4-skills">
            <div className="d4-sk-title d4-r">Arsenal<br /><em>Táctico</em></div>
            <div className="d4-sk-list">
              {skills.map(s => (
                <div className="d4-sk-item d4-r" key={s.name}>
                  <div className="d4-sk-name">{s.name}</div>
                  <div className="d4-sk-bar">
                    <div className="d4-sk-fill" style={{ "--pct": `${s.pct}%` } as React.CSSProperties} />
                  </div>
                  <div className="d4-sk-pct">{s.pct}%</div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ CERTS ═══ */}
          <section id="certs" className="d4-certs">
            <div className="d4-certs-title d4-r">Certifications<br />&amp; <em>Roadmap</em></div>
            <div className="d4-cert-list">
              {certifications.map(c => (
                <div className={`d4-cert-item ${c.cls} d4-r`} key={c.name}>
                  <div className="d4-cert-org">{c.org}</div>
                  <div className="d4-cert-name">{c.name}</div>
                  <div className="d4-cert-status">{c.status}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ═══ CONTACT ═══ */}
          <section id="contact" className="d4-contact">
            <div className="d4-contact-title d4-r">
              ¿<em>Comenzamos</em>?
            </div>
            <div className="d4-contact-sub d4-r d1">
              Disponible para roles en Pentesting y Red Team, colaboraciones
              técnicas y proyectos de ciberseguridad ofensiva.
            </div>
            <a href="https://www.linkedin.com/in/yoandyrd92/" className="d4-contact-btn d4-r d2" target="_blank" rel="noopener noreferrer">
              <span>CONTACTAR</span>
            </a>
            <div className="d4-social d4-r d3">
              {socialLinks.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </section>

          {/* ═══ FOOTER ═══ */}
          <footer className="d4-footer">
            <div className="d4-footer-logo">HEINDALL</div>
            <div className="d4-footer-cities">
              <span className="d4-footer-city"><span className="d4-footer-dot" /> Lepe, España</span>
            </div>
            <div>© 2025 Yoandy Ramírez Delgado</div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Draft4;
