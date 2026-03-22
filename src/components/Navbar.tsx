import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import { machines } from "@/pages/Machines";
import { sherlocks } from "@/pages/Sherlocks";
import { hmvMachines } from "@/pages/HackMyVM";

const navItems = [
  { href: "#about", label: "about" },
  { href: "#skills", label: "skills" },
  { href: "#writeups", label: "writeups" },
  { href: "#certs", label: "certs" },
  { href: "#contact", label: "contact" },
];

type SearchResult = {
  slug: string;
  name: string;
  emoji: string;
  platform: string;
  difficulty: string;
};

const allItems: SearchResult[] = [
  ...machines.map((m) => ({ slug: m.slug, name: m.name, emoji: m.emoji, platform: "HTB", difficulty: m.difficulty })),
  ...sherlocks.map((s) => ({ slug: s.slug, name: s.name, emoji: s.emoji, platform: "Sherlock", difficulty: s.difficulty })),
  ...hmvMachines.map((m) => ({ slug: m.slug, name: m.name, emoji: m.emoji, platform: "HackMyVM", difficulty: m.difficulty })),
];

const platforms = ["HTB", "Sherlock", "HackMyVM"] as const;
const difficulties = ["VERY EASY", "EASY", "MEDIUM", "HARD"] as const;

const diffChipColors: Record<string, string> = {
  "VERY EASY": "bg-[hsl(300,100%,60%)]/15 text-[hsl(300,100%,60%)] border-[hsl(300,100%,60%)]/30",
  "EASY": "bg-[hsl(120,100%,50%)]/15 text-[hsl(120,100%,50%)] border-[hsl(120,100%,50%)]/30",
  "MEDIUM": "bg-[hsl(43,96%,56%)]/15 text-[hsl(43,96%,56%)] border-[hsl(43,96%,56%)]/30",
  "HARD": "bg-[hsl(0,85%,60%)]/15 text-[hsl(0,85%,60%)] border-[hsl(0,85%,60%)]/30",
};

const platformChipColors: Record<string, string> = {
  "HTB": "bg-[hsl(120,100%,50%)]/15 text-[hsl(120,100%,50%)] border-[hsl(120,100%,50%)]/30",
  "Sherlock": "bg-[hsl(187,85%,53%)]/15 text-[hsl(187,85%,53%)] border-[hsl(187,85%,53%)]/30",
  "HackMyVM": "bg-[hsl(300,100%,60%)]/15 text-[hsl(300,100%,60%)] border-[hsl(300,100%,60%)]/30",
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleFilter = (arr: string[], val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const results = allItems.filter((item) => {
    const matchesQuery = query.length === 0 || item.name.toLowerCase().includes(query.toLowerCase());
    const matchesPlatform = selectedPlatforms.length === 0 || selectedPlatforms.includes(item.platform);
    const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(item.difficulty);
    return matchesQuery && matchesPlatform && matchesDifficulty;
  });

  const hasFilters = query.length > 0 || selectedPlatforms.length > 0 || selectedDifficulties.length > 0;

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + href);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToReport = (slug: string) => {
    setSearchOpen(false);
    setQuery("");
    setSelectedPlatforms([]);
    setSelectedDifficulties([]);
    navigate(`/report/${slug}`);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;600&display=swap');
        .gnav{position:fixed;top:0;left:0;right:0;z-index:300;display:flex;justify-content:space-between;align-items:center;padding:28px 52px;transition:all .4s;background:rgba(11,26,16,.85);backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,232,122,.06)}
        .gnav.solid{background:rgba(11,26,16,.95);backdrop-filter:blur(24px);border-bottom:1px solid rgba(0,232,122,.1);padding:22px 52px}
        .gnav .glogo{display:flex;align-items:center;gap:12px;text-decoration:none;cursor:pointer;background:none;border:none}
        .gnav .glogo-h{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:.25em;color:#00e87a;line-height:1}
        .gnav .glogo-s{font-family:'JetBrains Mono',monospace;font-size:.72rem;color:rgba(255,255,255,.35);letter-spacing:.2em;margin-top:2px}
        .gnav .glinks{display:flex;gap:32px;list-style:none;margin:0;padding:0;align-items:center}
        .gnav .glinks a,.gnav .glinks button.nav-link{font-family:'JetBrains Mono',monospace;font-size:.92rem;color:rgba(255,255,255,.35);text-decoration:none;letter-spacing:.12em;transition:color .3s;background:none;border:none;cursor:pointer;padding:0}
        .gnav .glinks a:hover,.gnav .glinks button.nav-link:hover{color:#00e87a}
        .gnav .gsearch-btn{display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:8px;border:1px solid rgba(0,232,122,.15);background:rgba(0,232,122,.05);color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace;font-size:.78rem;cursor:pointer;transition:all .3s;letter-spacing:.05em}
        .gnav .gsearch-btn:hover{border-color:rgba(0,232,122,.3);color:#00e87a}
        .gnav .gsearch-btn kbd{font-size:.6rem;padding:2px 6px;border-radius:4px;background:rgba(0,232,122,.08);border:1px solid rgba(0,232,122,.1);color:rgba(255,255,255,.3)}
        .gmobile-toggle{display:none;background:none;border:none;color:#00e87a;cursor:pointer}
        .gnav .gback{display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:.78rem;color:rgba(255,255,255,.4);background:none;border:1px solid rgba(0,232,122,.15);border-radius:8px;padding:5px 14px;cursor:pointer;transition:all .3s;letter-spacing:.05em;margin-right:12px}
        .gnav .gback:hover{color:#00e87a;border-color:rgba(0,232,122,.35)}
        @media(max-width:900px){
          .gnav{padding:18px 28px}
          .gnav.solid{padding:14px 28px}
          .gnav .glinks{display:none}
          .gmobile-toggle{display:block}
        }
        @media(max-width:640px){
          .gnav{padding:14px 18px}
        }
        .gmobile-menu{position:fixed;top:0;left:0;right:0;bottom:0;z-index:299;background:rgba(11,26,16,.97);backdrop-filter:blur(24px);display:flex;flex-direction:column;justify-content:center;align-items:center;gap:24px}
        .gmobile-menu a,.gmobile-menu button.nav-link{font-family:'JetBrains Mono',monospace;font-size:1.2rem;color:rgba(255,255,255,.5);text-decoration:none;letter-spacing:.15em;transition:color .3s;background:none;border:none;cursor:pointer}
        .gmobile-menu a:hover,.gmobile-menu button.nav-link:hover{color:#00e87a}
      `}</style>

      <nav className={`gnav${scrolled ? " solid" : ""}`}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {location.pathname.startsWith("/report/") && (
            <button className="gback" onClick={() => navigate("/")}>
              ← Volver
            </button>
          )}
          <button className="glogo" onClick={(e) => scrollTo(e, "#home")}>
            <div>
              <span className="glogo-h">HEINDALL</span>
              <div className="glogo-s">GUARDIAN // OFFENSIVE SEC</div>
            </div>
          </button>
        </div>

        <ul className="glinks">
          {navItems.map((item) => (
            <li key={item.href}>
              <button className="nav-link" onClick={(e) => scrollTo(e, item.href)}>
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <div ref={searchRef} style={{ position: "relative" }}>
              <button className="gsearch-btn" onClick={() => setSearchOpen(!searchOpen)}>
                <Search size={14} />
                <span>Buscar...</span>
                <kbd>⌘K</kbd>
              </button>

              {searchOpen && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: "400px",
                  borderRadius: "12px",
                  border: "1px solid rgba(0,232,122,.12)",
                  background: "rgba(11,26,16,.96)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 20px 60px rgba(0,0,0,.5)",
                  overflow: "hidden",
                  zIndex: 500,
                }}>
                  {/* Search input */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid rgba(0,232,122,.08)" }}>
                    <Search size={16} style={{ color: "rgba(255,255,255,.3)", flexShrink: 0 }} />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar máquina o sherlock..."
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "#e0e0e0",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: ".82rem",
                      }}
                    />
                    {query && (
                      <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,.3)", cursor: "pointer" }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Filter chips */}
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(0,232,122,.06)", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".6rem", color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginRight: "4px" }}>Plataforma</span>
                      {platforms.map((p) => (
                        <button
                          key={p}
                          onClick={() => toggleFilter(selectedPlatforms, p, setSelectedPlatforms)}
                          style={{
                            padding: "2px 10px",
                            borderRadius: "20px",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: ".65rem",
                            border: `1px solid ${selectedPlatforms.includes(p) ? (p === "HTB" ? "rgba(0,232,122,.4)" : p === "Sherlock" ? "rgba(0,200,255,.4)" : "rgba(200,0,255,.4)") : "rgba(255,255,255,.1)"}`,
                            background: selectedPlatforms.includes(p) ? (p === "HTB" ? "rgba(0,232,122,.12)" : p === "Sherlock" ? "rgba(0,200,255,.12)" : "rgba(200,0,255,.12)") : "rgba(255,255,255,.03)",
                            color: selectedPlatforms.includes(p) ? (p === "HTB" ? "#00e87a" : p === "Sherlock" ? "#00c8ff" : "#c800ff") : "rgba(255,255,255,.4)",
                            cursor: "pointer",
                            transition: "all .2s",
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".6rem", color: "rgba(255,255,255,.3)", letterSpacing: ".1em", textTransform: "uppercase", marginRight: "4px" }}>Dificultad</span>
                      {difficulties.map((d) => {
                        const colors: Record<string, { active: string; border: string; bg: string }> = {
                          "VERY EASY": { active: "#c800ff", border: "rgba(200,0,255,.4)", bg: "rgba(200,0,255,.12)" },
                          "EASY": { active: "#00e87a", border: "rgba(0,232,122,.4)", bg: "rgba(0,232,122,.12)" },
                          "MEDIUM": { active: "#e8a800", border: "rgba(232,168,0,.4)", bg: "rgba(232,168,0,.12)" },
                          "HARD": { active: "#e85050", border: "rgba(232,80,80,.4)", bg: "rgba(232,80,80,.12)" },
                        };
                        const c = colors[d];
                        return (
                          <button
                            key={d}
                            onClick={() => toggleFilter(selectedDifficulties, d, setSelectedDifficulties)}
                            style={{
                              padding: "2px 10px",
                              borderRadius: "20px",
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: ".65rem",
                              border: `1px solid ${selectedDifficulties.includes(d) ? c.border : "rgba(255,255,255,.1)"}`,
                              background: selectedDifficulties.includes(d) ? c.bg : "rgba(255,255,255,.03)",
                              color: selectedDifficulties.includes(d) ? c.active : "rgba(255,255,255,.4)",
                              cursor: "pointer",
                              transition: "all .2s",
                            }}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Results */}
                  <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                    {!hasFilters && (
                      <p style={{ padding: "24px 16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "rgba(255,255,255,.25)" }}>Escribe o filtra para buscar...</p>
                    )}
                    {hasFilters && results.length === 0 && (
                      <p style={{ padding: "24px 16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "rgba(255,255,255,.25)" }}>Sin resultados</p>
                    )}
                    {hasFilters && results.length > 0 && (
                      <>
                        <div style={{ padding: "8px 16px 4px" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".65rem", color: "rgba(255,255,255,.2)" }}>{results.length} resultado{results.length !== 1 ? "s" : ""}</span>
                        </div>
                        {results.map((r) => (
                          <button
                            key={r.slug}
                            onClick={() => goToReport(r.slug)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "10px 16px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "background .2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,232,122,.06)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <span style={{ fontSize: "1.1rem" }}>{r.emoji}</span>
                            <span style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: ".82rem", color: "#e0e0e0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                            <span style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: ".6rem",
                              padding: "2px 8px",
                              borderRadius: "20px",
                              border: "1px solid rgba(255,255,255,.1)",
                              color: "rgba(255,255,255,.5)",
                            }}>{r.difficulty}</span>
                            <span style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: ".6rem",
                              padding: "2px 8px",
                              borderRadius: "20px",
                              border: `1px solid ${r.platform === "HTB" ? "rgba(0,232,122,.3)" : r.platform === "Sherlock" ? "rgba(0,200,255,.3)" : "rgba(200,0,255,.3)"}`,
                              color: r.platform === "HTB" ? "#00e87a" : r.platform === "Sherlock" ? "#00c8ff" : "#c800ff",
                            }}>{r.platform}</span>
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

        <button className="gmobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={28} /> : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="gmobile-menu">
          <button style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "#00e87a", cursor: "pointer" }} onClick={() => setMobileOpen(false)}>
            <X size={28} />
          </button>
          {navItems.map((item) => (
            <button key={item.href} className="nav-link" onClick={(e) => scrollTo(e, item.href)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
