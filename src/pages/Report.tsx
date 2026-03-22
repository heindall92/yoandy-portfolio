import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { machines } from "./Machines";
import { sherlocks } from "./Sherlocks";
import { hmvMachines } from "./HackMyVM";

/* ── All writeups for search ── */
type SearchItem = {
  slug: string;
  name: string;
  emoji: string;
  platform: string;
  difficulty: string;
};

const allItems: SearchItem[] = [
  ...machines.map((m) => ({ slug: m.slug, name: m.name, emoji: m.emoji, platform: "HTB", difficulty: m.difficulty })),
  ...sherlocks.map((s) => ({ slug: s.slug, name: s.name, emoji: s.emoji, platform: "Sherlock", difficulty: s.difficulty })),
  ...hmvMachines.map((m) => ({ slug: m.slug, name: m.name, emoji: m.emoji, platform: "HackMyVM", difficulty: m.difficulty })),
];

const platforms = ["HTB", "Sherlock", "HackMyVM"] as const;
const difficulties = ["VERY EASY", "EASY", "MEDIUM", "HARD"] as const;

const reports: Record<string, { title: string; file: string; section: string }> = {
  "meow-htb": { title: "Writeup — Meow (HTB)", file: "/reports/meow-htb.html", section: "htb" },
  "fawn-htb": { title: "Writeup — Fawn (HTB)", file: "/reports/fawn-htb.html", section: "htb" },
  "dancing-htb": { title: "Writeup — Dancing (HTB)", file: "/reports/dancing-htb.html", section: "htb" },
  "redeemer-htb": { title: "Writeup — Redeemer (HTB)", file: "/reports/redeemer-htb.html", section: "htb" },
  "appointment-htb": { title: "Writeup — Appointment (HTB)", file: "/reports/appointment-htb.html", section: "htb" },
  "vaccine-htb": { title: "Writeup — Vaccine (HTB)", file: "/reports/vaccine-htb.html", section: "htb" },
  "archetype-htb": { title: "Writeup — Archetype (HTB)", file: "/reports/archetype-htb.html", section: "htb" },
  "oopsie-htb": { title: "Writeup — Oopsie (HTB)", file: "/reports/oopsie-htb.html", section: "htb" },
  "pterodactyl-htb": { title: "Writeup — Pterodactyl (HTB)", file: "/reports/pterodactyl-htb.html", section: "htb" },
  "unified-htb": { title: "Writeup — Unified (HTB)", file: "/reports/unified-htb.html", section: "htb" },
  "bike-htb": { title: "Writeup — Bike (HTB)", file: "/reports/bike-htb.html", section: "htb" },
  "ignition-htb": { title: "Writeup — Ignition (HTB)", file: "/reports/ignition-htb.html", section: "htb" },
  "explosion-htb": { title: "Writeup — Explosion (HTB)", file: "/reports/explosion-htb.html", section: "htb" },
  "preignition-htb": { title: "Writeup — Preignition (HTB)", file: "/reports/preignition-htb.html", section: "htb" },
  "mongod-htb": { title: "Writeup — Mongod (HTB)", file: "/reports/mongod-htb.html", section: "htb" },
  "synced-htb": { title: "Writeup — Synced (HTB)", file: "/reports/synced-htb.html", section: "htb" },
  "funnel-htb": { title: "Writeup — Funnel (HTB)", file: "/reports/funnel-htb.html", section: "htb" },
  "eighteen-htb": { title: "Writeup — Eighteen (HTB)", file: "/reports/eighteen-htb.html", section: "htb" },
  "twomillion-htb": { title: "Writeup — TwoMillion (HTB)", file: "/reports/twomillion-htb.html", section: "htb" },
  "interpreter-htb": { title: "Writeup — Interpreter (HTB)", file: "/reports/interpreter-htb.html", section: "htb" },
  "cctv-htb": { title: "Writeup — CCTV (HTB)", file: "/reports/cctv-htb.html", section: "htb" },
  "airtouch-htb": { title: "Writeup — AirTouch (HTB)", file: "/reports/airtouch-htb.html", section: "htb" },
  "steamcloud-htb": { title: "Writeup — SteamCloud (HTB)", file: "/reports/steamcloud-htb.html", section: "htb" },
  "precious-htb": { title: "Writeup — Precious (HTB)", file: "/reports/precious-htb.html", section: "htb" },
  "devvortex-htb": { title: "Writeup — Devvortex (HTB)", file: "/reports/devvortex-htb.html", section: "htb" },
  "crownjewel1-sherlock": { title: "Sherlock — CrownJewel-1 (HTB)", file: "/reports/crownjewel1-sherlock.html", section: "sherlocks" },
  "dreamjob1-sherlock": { title: "Sherlock — Dream Job-1 (HTB)", file: "/reports/dreamjob1-sherlock.html", section: "sherlocks" },
  "dreamjob2-sherlock": { title: "Sherlock — Dream Job-2 (HTB)", file: "/reports/dreamjob2-sherlock.html", section: "sherlocks" },
  "romcom-sherlock": { title: "Sherlock — RomCom (HTB)", file: "/reports/romcom-sherlock.html", section: "sherlocks" },
  "brutus-sherlock": { title: "Sherlock — Brutus (HTB)", file: "/reports/brutus-sherlock.html", section: "sherlocks" },
  "dc01-hmv": { title: "Writeup — DC01 (HackMyVM)", file: "/reports/dc01-hmv.html", section: "hackmyvm" },
  "dc01-v2-hmv": { title: "Writeup — DC01 v2 (HackMyVM)", file: "/reports/dc01-v2-hmv.html", section: "hackmyvm" },
  "tripladvisor-hmv": { title: "Writeup — TriplAdvisor (HackMyVM)", file: "/reports/tripladvisor-hmv.html", section: "hackmyvm" },
  "devoops-hmv": { title: "Writeup — Devoops (HackMyVM)", file: "/reports/devoops-hmv.html", section: "hackmyvm" },
};

const Report = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const report = slug ? reports[slug] : null;

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selPlatforms, setSelPlatforms] = useState<string[]>([]);
  const [selDiffs, setSelDiffs] = useState<string[]>([]);
  const [navSolid, setNavSolid] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggle = (arr: string[], val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const hasFilters = query.length > 0 || selPlatforms.length > 0 || selDiffs.length > 0;

  const results = allItems.filter(item => {
    const mq = !query || item.name.toLowerCase().includes(query.toLowerCase());
    const mp = selPlatforms.length === 0 || selPlatforms.includes(item.platform);
    const md = selDiffs.length === 0 || selDiffs.includes(item.difficulty);
    return mq && mp && md;
  });

  const goToReport = (s: string) => {
    setSearchOpen(false);
    setQuery("");
    setSelPlatforms([]);
    setSelDiffs([]);
    navigate(`/report/${s}`);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(p => !p); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Scroll-based nav background
  useEffect(() => {
    const h = () => setNavSolid(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  if (!report) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b1a10", color: "#c8f0dc" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", fontFamily: "'JetBrains Mono',monospace", marginBottom: 16 }}>Informe no encontrado</p>
          <Link to="/" style={{ color: "#00e87a", fontFamily: "'JetBrains Mono',monospace", fontSize: ".85rem" }}>← Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const diffColor = (d: string) => {
    const dl = d.toLowerCase();
    if (dl.includes("very easy")) return "#a78bfa";
    if (dl.includes("easy")) return "#00e87a";
    if (dl.includes("medium")) return "#f5a623";
    return "#f87171";
  };

  const platColor = (p: string) => {
    if (p === "HTB") return "#00e87a";
    if (p === "Sherlock") return "#38d9f5";
    return "#a78bfa";
  };

  return (
    <div style={{ background: "#0b1a10", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500&display=swap');
        .rp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 300;
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 52px; transition: all .4s;
        }
        .rp-nav.solid {
          background: rgba(11,26,16,.95); backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,232,122,.08); padding: 14px 52px;
        }
        .rp-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .rp-logo-h { font-family: 'Bebas Neue',sans-serif; font-size: 1.6rem; letter-spacing: .25em; color: #00e87a; line-height: 1; }
        .rp-logo-s { font-family: 'JetBrains Mono',monospace; font-size: .72rem; color: rgba(200,240,220,.25); letter-spacing: .2em; margin-top: 2px; }
        .rp-links { display: flex; gap: 32px; list-style: none; margin: 0; padding: 0; align-items: center; }
        .rp-links a { font-family: 'JetBrains Mono',monospace; font-size: .92rem; color: rgba(200,240,220,.35); text-decoration: none; letter-spacing: .12em; transition: color .3s; }
        .rp-links a:hover { color: #00e87a; }
        .rp-back { display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono',monospace; font-size: .8rem; color: rgba(200,240,220,.4); text-decoration: none; transition: color .3s; letter-spacing: .06em; }
        .rp-back:hover { color: #00e87a; }

        /* Search */
        .rp-search-btn {
          display: flex; align-items: center; gap: 8px; padding: 6px 14px;
          border-radius: 8px; border: 1px solid rgba(0,232,122,.15);
          background: rgba(0,232,122,.04); color: rgba(200,240,220,.4);
          font-family: 'JetBrains Mono',monospace; font-size: .78rem;
          cursor: pointer; transition: all .3s; letter-spacing: .06em;
        }
        .rp-search-btn:hover { border-color: rgba(0,232,122,.3); color: #00e87a; }
        .rp-search-btn kbd {
          padding: 1px 6px; border-radius: 3px; background: rgba(0,232,122,.08);
          border: 1px solid rgba(0,232,122,.12); font-size: .6rem; color: rgba(200,240,220,.3);
        }
        .rp-dd {
          position: absolute; right: 0; top: calc(100% + 8px); width: 440px;
          border-radius: 14px; border: 1px solid rgba(0,232,122,.12);
          background: rgba(13,34,21,.97); backdrop-filter: blur(20px);
          box-shadow: 0 30px 60px rgba(0,0,0,.5); overflow: hidden; z-index: 500;
        }
        .rp-dd-input {
          display: flex; align-items: center; gap: 10px; padding: 14px 18px;
          border-bottom: 1px solid rgba(0,232,122,.08);
        }
        .rp-dd-input input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'JetBrains Mono',monospace; font-size: .85rem;
          color: #c8f0dc; letter-spacing: .04em;
        }
        .rp-dd-input input::placeholder { color: rgba(200,240,220,.25); }
        .rp-filters {
          padding: 10px 18px; border-bottom: 1px solid rgba(0,232,122,.06);
          display: flex; flex-direction: column; gap: 8px;
        }
        .rp-filter-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .rp-filter-label {
          font-family: 'JetBrains Mono',monospace; font-size: .58rem;
          color: rgba(200,240,220,.25); text-transform: uppercase; letter-spacing: .15em; margin-right: 4px;
        }
        .rp-chip {
          padding: 3px 10px; border-radius: 20px; font-family: 'JetBrains Mono',monospace;
          font-size: .62rem; border: 1px solid rgba(0,232,122,.12); background: transparent;
          color: rgba(200,240,220,.35); cursor: pointer; transition: all .2s; letter-spacing: .04em;
        }
        .rp-chip:hover { border-color: rgba(0,232,122,.3); color: rgba(200,240,220,.6); }
        .rp-chip.on { background: rgba(0,232,122,.12); border-color: rgba(0,232,122,.3); color: #00e87a; }
        .rp-results { max-height: 320px; overflow-y: auto; }
        .rp-result {
          display: flex; align-items: center; gap: 12px; padding: 10px 18px;
          cursor: pointer; transition: background .2s; border: none; background: transparent;
          width: 100%; text-align: left; color: inherit;
        }
        .rp-result:hover { background: rgba(0,232,122,.06); }
        .rp-result-emoji { font-size: 1.1rem; }
        .rp-result-name { flex: 1; font-family: 'JetBrains Mono',monospace; font-size: .82rem; color: #c8f0dc; }
        .rp-result-badge {
          padding: 2px 8px; border-radius: 12px; font-family: 'JetBrains Mono',monospace;
          font-size: .55rem; letter-spacing: .06em; border: 1px solid;
        }
        .rp-no-results {
          padding: 40px 18px; text-align: center; font-family: 'JetBrains Mono',monospace;
          font-size: .75rem; color: rgba(200,240,220,.25);
        }
        .rp-count {
          padding: 6px 18px; font-family: 'JetBrains Mono',monospace;
          font-size: .6rem; color: rgba(200,240,220,.2);
        }

        @media(max-width:900px) {
          .rp-nav { padding: 14px 20px; }
          .rp-nav.solid { padding: 12px 20px; }
          .rp-links { gap: 16px; }
          .rp-links a { font-size: .75rem; }
          .rp-dd { width: calc(100vw - 40px); right: -10px; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`rp-nav ${navSolid ? "solid" : ""}`}>
        <Link to="/" className="rp-logo">
          <div>
            <span className="rp-logo-h">HEINDALL</span>
            <div className="rp-logo-s">GUARDIAN // OFFENSIVE SEC</div>
          </div>
        </Link>
        <ul className="rp-links">
          <li><Link to="/">home</Link></li>
          <li><Link to="/#about">about</Link></li>
          <li><Link to="/#writeups">writeups</Link></li>
          <li><Link to="/#certs">certs</Link></li>
          <li><Link to="/#contact">contact</Link></li>
          <li>
            <div ref={searchRef} style={{ position: "relative" }}>
              <button className="rp-search-btn" onClick={() => setSearchOpen(!searchOpen)}>
                🔍 Buscar... <kbd>⌘K</kbd>
              </button>
              {searchOpen && (
                <div className="rp-dd">
                  <div className="rp-dd-input">
                    <span style={{ color: "rgba(200,240,220,.3)", fontSize: ".85rem" }}>🔍</span>
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Buscar máquina o sherlock..."
                    />
                    {query && (
                      <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "rgba(200,240,220,.3)", cursor: "pointer", fontSize: ".8rem" }}>✕</button>
                    )}
                  </div>
                  <div className="rp-filters">
                    <div className="rp-filter-row">
                      <span className="rp-filter-label">Plataforma</span>
                      {platforms.map(p => (
                        <button key={p} className={`rp-chip ${selPlatforms.includes(p) ? "on" : ""}`} onClick={() => toggle(selPlatforms, p, setSelPlatforms)}>
                          {p}
                        </button>
                      ))}
                    </div>
                    <div className="rp-filter-row">
                      <span className="rp-filter-label">Dificultad</span>
                      {difficulties.map(d => (
                        <button key={d} className={`rp-chip ${selDiffs.includes(d) ? "on" : ""}`} onClick={() => toggle(selDiffs, d, setSelDiffs)}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rp-results">
                    {!hasFilters && (
                      <div className="rp-no-results">Escribe o filtra para buscar...</div>
                    )}
                    {hasFilters && results.length === 0 && (
                      <div className="rp-no-results">Sin resultados</div>
                    )}
                    {hasFilters && results.length > 0 && (
                      <>
                        <div className="rp-count">{results.length} resultado{results.length !== 1 ? "s" : ""}</div>
                        {results.map(r => (
                          <button key={r.slug} className="rp-result" onClick={() => goToReport(r.slug)}>
                            <span className="rp-result-emoji">{r.emoji}</span>
                            <span className="rp-result-name">{r.name}</span>
                            <span className="rp-result-badge" style={{ color: diffColor(r.difficulty), borderColor: diffColor(r.difficulty) + "40", background: diffColor(r.difficulty) + "10" }}>
                              {r.difficulty}
                            </span>
                            <span className="rp-result-badge" style={{ color: platColor(r.platform), borderColor: platColor(r.platform) + "40", background: platColor(r.platform) + "10" }}>
                              {r.platform}
                            </span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>

      {/* IFRAME */}
      <div style={{ paddingTop: 64 }}>
        <iframe
          src={report.file}
          title={report.title}
          style={{ width: "100%", border: "none", height: "calc(100vh - 64px)" }}
        />
      </div>
    </div>
  );
};

export default Report;
