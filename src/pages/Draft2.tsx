import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Home, Shield, User, BookOpen, ChevronRight } from "lucide-react";
import profileImg from "@/assets/profile.jpg";
import { machines } from "./Machines";
import { sherlocks } from "./Sherlocks";
import { hmvMachines } from "./HackMyVM";

const allWriteups = [
  ...machines.map((m) => ({ ...m, platform: "HTB", type: "machine" })),
  ...sherlocks.map((s) => ({ ...s, platform: "Sherlock", type: "sherlock", os: "N/A" })),
  ...hmvMachines.map((m) => ({ ...m, platform: "HackMyVM", type: "hmv" })),
];

const stats = [
  { label: "Machines Pwned", value: machines.length, ico: "🖥️" },
  { label: "Sherlocks", value: sherlocks.length, ico: "🔍" },
  { label: "HackMyVM", value: hmvMachines.length, ico: "🏴" },
  { label: "Total Writeups", value: allWriteups.length, ico: "📝" },
];

const quickSkills = [
  { name: "Pentesting", pct: 82, color: "from-emerald-400 to-cyan-400" },
  { name: "Web Security", pct: 78, color: "from-violet-400 to-purple-400" },
  { name: "OSINT", pct: 85, color: "from-amber-400 to-orange-400" },
  { name: "Post-Exploit", pct: 75, color: "from-rose-400 to-pink-400" },
];

const diffColor = (d: string) => {
  const dl = d.toLowerCase();
  if (dl.includes("very easy")) return "text-emerald-300 bg-emerald-500/20 border-emerald-500/30";
  if (dl.includes("easy")) return "text-green-300 bg-green-500/20 border-green-500/30";
  if (dl.includes("medium")) return "text-amber-300 bg-amber-500/20 border-amber-500/30";
  return "text-red-300 bg-red-500/20 border-red-500/30";
};

const platColor = (p: string) => {
  if (p === "HTB") return "text-emerald-300 bg-emerald-500/15";
  if (p === "Sherlock") return "text-blue-300 bg-blue-500/15";
  return "text-purple-300 bg-purple-500/15";
};

type Section = "home" | "writeups" | "skills" | "about";

const Draft2 = () => {
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [search, setSearch] = useState("");
  const [platFilter, setPlatFilter] = useState<string[]>([]);
  const [diffFilter, setDiffFilter] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let c = 0;
    const target = allWriteups.length;
    const step = Math.ceil(target / 40);
    const iv = setInterval(() => {
      c += step;
      if (c >= target) { c = target; clearInterval(iv); }
      setCounter(c);
    }, 30);
    return () => clearInterval(iv);
  }, []);

  const toggleArr = (arr: string[], v: string, set: React.Dispatch<React.SetStateAction<string[]>>) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const filtered = allWriteups.filter(w => {
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (platFilter.length && !platFilter.includes(w.platform)) return false;
    if (diffFilter.length) {
      const dl = w.difficulty.toLowerCase();
      const match = diffFilter.some(f => {
        if (f === "Easy") return dl.includes("easy") && !dl.includes("very");
        if (f === "Very Easy") return dl.includes("very easy");
        return dl.includes(f.toLowerCase());
      });
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white font-sans pb-20 relative overflow-hidden">
      <style>{`
        .d2-orb {
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #7c3aed, #3b82f6 40%, #06b6d4 70%, #0a0a12 100%);
          box-shadow: 0 0 60px rgba(124,58,237,0.4), 0 0 120px rgba(59,130,246,0.2), inset 0 0 30px rgba(6,182,212,0.3);
          animation: d2-float 6s ease-in-out infinite, d2-glow 4s ease-in-out infinite alternate;
          position: relative;
        }
        .d2-orb::after {
          content: ''; position: absolute; inset: -8px;
          border-radius: 50%;
          border: 1.5px solid rgba(124,58,237,0.3);
          animation: d2-ring 8s linear infinite;
        }
        .d2-orb::before {
          content: ''; position: absolute; inset: -20px;
          border-radius: 50%;
          border: 1px solid rgba(59,130,246,0.15);
          animation: d2-ring 12s linear infinite reverse;
        }
        @keyframes d2-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes d2-glow { 0% { box-shadow: 0 0 60px rgba(124,58,237,0.4), 0 0 120px rgba(59,130,246,0.2); } 100% { box-shadow: 0 0 80px rgba(124,58,237,0.6), 0 0 160px rgba(59,130,246,0.35); } }
        @keyframes d2-ring { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .d2-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          transition: all 0.3s;
        }
        .d2-card:hover { border-color: rgba(124,58,237,0.3); box-shadow: 0 8px 32px rgba(124,58,237,0.15); transform: translateY(-2px); }
        .d2-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
        }
        .d2-chip { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; }
        .d2-chip.active { box-shadow: 0 0 12px rgba(124,58,237,0.3); }
        .d2-section { animation: d2-fadein 0.4s ease-out; }
        @keyframes d2-fadein { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .d2-bar-track { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08); overflow: hidden; }
        .d2-bar-fill { height: 100%; border-radius: 3px; transition: width 1s ease-out; }
        .d2-bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
          background: rgba(10,10,18,0.92); backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 8px 0 max(8px, env(safe-area-inset-bottom));
        }
        .d2-particles { position: absolute; width: 100%; height: 100%; overflow: hidden; pointer-events: none; }
        .d2-particle {
          position: absolute; width: 3px; height: 3px; border-radius: 50%;
          background: rgba(124,58,237,0.4);
          animation: d2-drift 10s linear infinite;
        }
        @keyframes d2-drift {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(-20vh) scale(1); opacity: 0; }
        }
      `}</style>

      {/* Particles */}
      <div className="d2-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="d2-particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 6}s`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: i % 3 === 0 ? 'rgba(59,130,246,0.3)' : i % 3 === 1 ? 'rgba(124,58,237,0.3)' : 'rgba(6,182,212,0.25)',
          }} />
        ))}
      </div>

      {/* ─── HOME ─── */}
      {activeSection === "home" && (
        <div className="d2-section px-5 pt-14">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs text-white/40 tracking-widest uppercase">Portfolio</p>
              <h1 className="text-2xl font-bold tracking-tight mt-1">HEINDALL</h1>
            </div>
            <Link to="/" className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1 hover:border-white/30 transition-colors">← Back</Link>
          </div>

          {/* Orb */}
          <div className="flex justify-center my-10" ref={heroRef}>
            <div className="d2-orb flex items-center justify-center">
              <span className="text-4xl font-bold text-white/90 z-10">{counter}</span>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center mb-10">
            <h2 className="text-lg font-semibold">Cybersecurity Analyst</h2>
            <p className="text-sm text-white/40 mt-1">Offensive Security · Pentesting · CTF</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {stats.map(s => (
              <div key={s.label} className="d2-card p-4 text-center">
                <span className="text-2xl">{s.ico}</span>
                <p className="text-xl font-bold mt-2">{s.value}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick CTA */}
          <button
            onClick={() => setActiveSection("writeups")}
            className="w-full d2-card p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Explorar Writeups</p>
                <p className="text-xs text-white/40">{allWriteups.length} informes técnicos</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
          </button>
        </div>
      )}

      {/* ─── WRITEUPS ─── */}
      {activeSection === "writeups" && (
        <div className="d2-section px-5 pt-14">
          <h2 className="text-xl font-bold mb-4">Writeups</h2>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar máquina..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Platform chips */}
          <div className="flex gap-2 flex-wrap mb-3">
            {["HTB", "Sherlock", "HackMyVM"].map(p => (
              <button
                key={p}
                onClick={() => toggleArr(platFilter, p, setPlatFilter)}
                className={`d2-chip ${platFilter.includes(p) ? "active bg-violet-500/20 border-violet-500/40 text-violet-300" : "bg-white/5 text-white/50 border-white/10"}`}
              >{p}</button>
            ))}
          </div>

          {/* Difficulty chips */}
          <div className="flex gap-2 flex-wrap mb-5">
            {["Very Easy", "Easy", "Medium", "Hard"].map(d => (
              <button
                key={d}
                onClick={() => toggleArr(diffFilter, d, setDiffFilter)}
                className={`d2-chip ${diffFilter.includes(d) ? "active bg-violet-500/20 border-violet-500/40 text-violet-300" : "bg-white/5 text-white/50 border-white/10"}`}
              >{d}</button>
            ))}
          </div>

          {/* Results */}
          <p className="text-xs text-white/30 mb-3">{filtered.length} resultados</p>
          <div className="space-y-3 pb-4">
            {filtered.map(w => (
              <Link
                key={w.slug}
                to={`/report/${w.slug}`}
                className="d2-card p-4 flex items-center gap-4 block"
              >
                <span className="text-2xl">{w.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{w.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${platColor(w.platform)}`}>{w.platform}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${diffColor(w.difficulty)}`}>{w.difficulty}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ─── SKILLS ─── */}
      {activeSection === "skills" && (
        <div className="d2-section px-5 pt-14">
          <h2 className="text-xl font-bold mb-6">Skills</h2>
          <div className="space-y-5">
            {quickSkills.map(sk => (
              <div key={sk.name} className="d2-card p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-sm">{sk.name}</p>
                  <span className="text-xs text-white/50">{sk.pct}%</span>
                </div>
                <div className="d2-bar-track">
                  <div className={`d2-bar-fill bg-gradient-to-r ${sk.color}`} style={{ width: `${sk.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Certs */}
          <h3 className="text-lg font-bold mt-8 mb-4">Certificaciones</h3>
          <div className="space-y-3">
            {[
              { name: "eJPT", org: "eLearnSecurity", status: "En curso", statusCls: "text-amber-300 bg-amber-500/15" },
              { name: "Google Cybersecurity", org: "Google", status: "✓ Done", statusCls: "text-emerald-300 bg-emerald-500/15" },
              { name: "Cisco Security", org: "Cisco", status: "✓ Done", statusCls: "text-emerald-300 bg-emerald-500/15" },
              { name: "IBM Analyst", org: "IBM", status: "✓ Done", statusCls: "text-emerald-300 bg-emerald-500/15" },
              { name: "OSCP", org: "OffSec", status: "2026", statusCls: "text-violet-300 bg-violet-500/15" },
            ].map(c => (
              <div key={c.name} className="d2-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-white/35">{c.org}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${c.statusCls}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── ABOUT ─── */}
      {activeSection === "about" && (
        <div className="d2-section px-5 pt-14">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-violet-500/40 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
              <img src={profileImg} alt="Yoandy" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold mt-4">Yoandy Rodríguez</h2>
            <p className="text-sm text-white/40">Cybersecurity Analyst & Pentester</p>
          </div>

          <div className="d2-card p-5 mb-4">
            <p className="text-sm text-white/60 leading-relaxed">
              Analista de ciberseguridad en formación activa con enfoque ofensivo. Preparando eJPT con miras a OSCP.
              Experiencia práctica en +{allWriteups.length} máquinas y retos en plataformas como HackTheBox, TryHackMe y HackMyVM.
            </p>
          </div>

          <h3 className="text-lg font-bold mt-6 mb-4">Contacto</h3>
          <div className="space-y-3">
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/in/yoandyrd92/", ico: "💼" },
              { label: "GitHub", href: "https://github.com/heindall92", ico: "🐙" },
              { label: "HackTheBox", href: "https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa", ico: "🟩" },
              { label: "TryHackMe", href: "https://tryhackme.com/p/yoandy92", ico: "🔴" },
            ].map(l => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                className="d2-card p-4 flex items-center gap-3 block">
                <span className="text-xl">{l.ico}</span>
                <span className="font-semibold text-sm">{l.label}</span>
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ─── BOTTOM NAV ─── */}
      <nav className="d2-bottom-nav">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {([
            { id: "home" as Section, icon: Home, label: "Home" },
            { id: "writeups" as Section, icon: BookOpen, label: "Writeups" },
            { id: "skills" as Section, icon: Shield, label: "Skills" },
            { id: "about" as Section, icon: User, label: "About" },
          ]).map(nav => (
            <button
              key={nav.id}
              onClick={() => setActiveSection(nav.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeSection === nav.id
                  ? "text-violet-400"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              <nav.icon className={`w-5 h-5 ${activeSection === nav.id ? "drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]" : ""}`} />
              <span className="text-[10px] font-semibold">{nav.label}</span>
              {activeSection === nav.id && (
                <div className="w-1 h-1 rounded-full bg-violet-400 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Draft2;
