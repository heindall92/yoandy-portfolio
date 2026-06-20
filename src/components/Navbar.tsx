import { useState, useEffect, useRef } from "react";
import { sanitizeSearch } from "@/lib/security";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { X, Search, LogOut, Sun, Moon, Languages } from "lucide-react";
import { machines } from "@/pages/Machines";
import { sherlocks } from "@/pages/Sherlocks";
import { hmvMachines } from "@/pages/HackMyVM";
import { useAuth } from "@/contexts/AuthContext";
import { useUI } from "@/contexts/UIContext";

const navItemsByLang: Record<"es" | "en", { href: string; label: string }[]> = {
  es: [
    { href: "#about", label: "sobre mí" },
    { href: "#skills", label: "skills" },
    { href: "#writeups", label: "writeups" },
    { href: "#certs", label: "certs" },
    { href: "#contact", label: "contacto" },
  ],
  en: [
    { href: "#about", label: "about" },
    { href: "#skills", label: "skills" },
    { href: "#writeups", label: "writeups" },
    { href: "#certs", label: "certs" },
    { href: "#contact", label: "contact" },
  ],
};

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
  
  { slug: "pirates-htb", name: "Pirates", emoji: "⚓", platform: "HTB", difficulty: "HARD" },
  { slug: "hammer-thm", name: "Hammer", emoji: "🔨", platform: "TryHackMe", difficulty: "MEDIUM" },
];

const platforms = ["HTB", "Sherlock", "HackMyVM", "TryHackMe"] as const;
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
  "TryHackMe": "bg-[hsl(0,85%,60%)]/15 text-[hsl(0,85%,60%)] border-[hsl(0,85%,60%)]/30",
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
  const { user, signOut } = useAuth();
  const { theme, language, toggleTheme, toggleLanguage } = useUI();
  const navItems = navItemsByLang[language];

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
        .gnav .gsearch-btn{display:flex;align-items:center;gap:8px;padding:6px 14px;border-radius:8px;border:1px solid rgba(0,232,122,.18);background:#07130c;color:rgba(0,232,122,.65);font-family:'JetBrains Mono',monospace;font-size:.78rem;cursor:pointer;transition:all .3s;letter-spacing:.05em}
        .gnav .gsearch-btn:hover{border-color:rgba(0,232,122,.4);color:#00e87a;box-shadow:0 4px 12px rgba(0,0,0,.25)}
        .gnav .gsearch-btn kbd{font-size:.6rem;padding:2px 6px;border-radius:4px;background:rgba(0,232,122,.1);border:1px solid rgba(0,232,122,.18);color:rgba(0,232,122,.5)}
        .gnav-icon-btn{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:6px 10px;border-radius:8px;border:1px solid rgba(0,232,122,.18);background:#07130c;color:#00e87a;cursor:pointer;transition:all .3s}
        .gnav-icon-btn:hover{border-color:rgba(0,232,122,.4);box-shadow:0 4px 12px rgba(0,0,0,.25)}

        /* Theme Switch (glass pill) — green forest palette */
        .gnav-theme-switch{position:relative;width:84px;height:30px;border-radius:999px;cursor:pointer;border:1px solid rgba(0,232,122,.12);background:#07130c;display:flex;align-items:center;justify-content:space-between;padding:0 10px;font-family:'JetBrains Mono',monospace;font-size:.55rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(0,232,122,.55);box-shadow:inset 0 1px 2px rgba(0,232,122,.08),inset 0 -2px 6px rgba(0,0,0,.55),0 4px 12px rgba(0,0,0,.4);transition:background .5s ease,box-shadow .5s ease,color .35s ease,border-color .5s ease;overflow:hidden}
        .gnav-theme-switch .gts-label{position:relative;z-index:1;line-height:1;transition:opacity .35s ease,transform .45s cubic-bezier(.34,1.56,.64,1);user-select:none;pointer-events:none}
        .gnav-theme-switch .gts-bubble{position:absolute;top:2px;left:2px;width:34px;height:24px;border-radius:999px;background:linear-gradient(180deg,rgba(0,232,122,.40),rgba(0,232,122,.12));backdrop-filter:blur(10px) saturate(140%);-webkit-backdrop-filter:blur(10px) saturate(140%);border:1px solid rgba(0,232,122,.45);box-shadow:0 4px 14px rgba(0,0,0,.45),inset 0 1px 1px rgba(0,232,122,.35),inset 0 -2px 4px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;color:#00e87a;transition:transform .55s cubic-bezier(.34,1.56,.64,1),background .4s ease,color .4s ease;z-index:2}
        .gnav-theme-switch.is-dark .gts-bubble{transform:translateX(44px)}
        .gnav-theme-switch.is-light .gts-bubble{transform:translateX(0)}
        .gnav-theme-switch.is-dark .gts-light{opacity:0;transform:translateX(6px)}
        .gnav-theme-switch.is-light .gts-dark{opacity:0;transform:translateX(-6px)}
        :root.light .gnav-theme-switch,.gnav-theme-switch.is-light{background:#d4f0e0;color:rgba(6,40,22,.65);border-color:rgba(10,143,85,.18);box-shadow:inset 0 1px 2px rgba(255,255,255,.85),inset 0 -2px 6px rgba(0,0,0,.06),0 4px 12px rgba(0,0,0,.10)}
        :root.light .gnav-theme-switch .gts-bubble,.gnav-theme-switch.is-light .gts-bubble{color:#06582e;background:linear-gradient(180deg,rgba(255,255,255,.85),rgba(255,255,255,.45));border-color:rgba(0,232,122,.55);box-shadow:0 4px 12px rgba(0,0,0,.12),inset 0 1px 1px rgba(255,255,255,.95),inset 0 -2px 4px rgba(0,0,0,.04)}
        :root.light .gnav{background:rgba(220,238,225,.92);border-bottom:1px solid rgba(10,143,85,.16)}
        :root.light .gnav.solid{background:rgba(220,238,225,.96);border-bottom:1px solid rgba(10,143,85,.22)}
        :root.light .gnav .glogo-h{color:#0a8f55}
        :root.light .gnav .glogo-s{color:rgba(17,35,24,.55)}
        :root.light .gnav .glinks a,:root.light .gnav .glinks button.nav-link{color:rgba(17,35,24,.65)}
        :root.light .gnav .glinks a:hover,:root.light .gnav .glinks button.nav-link:hover{color:#0a8f55}
        :root.light .gnav-icon-btn{color:#06582e;border-color:rgba(10,143,85,.22);background:#d4f0e0}
        :root.light .gnav-icon-btn:hover{border-color:rgba(10,143,85,.4);color:#0a8f55}
        :root.light .gnav .gsearch-btn{color:rgba(6,40,22,.65);border-color:rgba(10,143,85,.22);background:#d4f0e0}
        :root.light .gnav .gsearch-btn:hover{color:#0a8f55;border-color:rgba(10,143,85,.4)}
        :root.light .gnav .gsearch-btn kbd{background:rgba(10,143,85,.1);border-color:rgba(10,143,85,.18);color:rgba(6,40,22,.45)}
        /* Search dropdown — green forest palette */
        .gsearch-dropdown{--gd-bg:#07130c;--gd-border:rgba(0,232,122,.18);--gd-border-subtle:rgba(0,232,122,.10);--gd-shadow:0 20px 60px rgba(0,0,0,.5);--gd-text:#00e87a;--gd-muted:rgba(0,232,122,.5);--gd-muted-subtle:rgba(0,232,122,.35);--gd-chip-border:rgba(0,232,122,.12);--gd-chip-bg:rgba(0,232,122,.05);--gd-chip-color:rgba(0,232,122,.5);--gd-hover:rgba(0,232,122,.06)}
        :root.light .gsearch-dropdown{--gd-bg:#d4f0e0;--gd-border:rgba(10,143,85,.2);--gd-border-subtle:rgba(10,143,85,.12);--gd-shadow:0 20px 60px rgba(0,0,0,.15);--gd-text:#06582e;--gd-muted:rgba(6,40,22,.55);--gd-muted-subtle:rgba(6,40,22,.4);--gd-chip-border:rgba(10,143,85,.15);--gd-chip-bg:rgba(10,143,85,.06);--gd-chip-color:rgba(6,40,22,.55);--gd-hover:rgba(10,143,85,.08)}
        .gsearch-dropdown input::placeholder{color:var(--gd-muted) !important}
        .gsearch-dropdown button[style*='background: transparent']:hover{background:var(--gd-hover) !important}
        .gmobile-toggle{display:none;background:none;border:none;color:#00e87a;cursor:pointer}
        .gnav .gback{display:flex;align-items:center;gap:6px;font-family:'JetBrains Mono',monospace;font-size:.78rem;color:rgba(255,255,255,.4);background:none;border:1px solid rgba(0,232,122,.15);border-radius:8px;padding:5px 14px;cursor:pointer;transition:all .3s;letter-spacing:.05em;margin-right:12px}
        .gnav .gback:hover{color:#00e87a;border-color:rgba(0,232,122,.35)}
        @media(max-width:900px){
          .gnav{padding:16px 20px}
          .gnav.solid{padding:14px 20px}
          .gnav .glogo-h{font-size:1.3rem;letter-spacing:.2em}
          .gnav .glogo-s{font-size:.6rem;letter-spacing:.15em}
          .gnav .glinks{display:none}
          .gmobile-toggle{display:block}
          .gnav .gback{font-size:.7rem;padding:4px 10px;margin-right:8px}
        }
        @media(max-width:480px){
          .gnav{padding:14px 14px}
          .gnav .glogo-h{font-size:1.1rem;letter-spacing:.15em}
          .gnav .glogo-s{font-size:.5rem;display:none}
        }
        .gmobile-menu{position:fixed;top:0;left:0;right:0;bottom:0;z-index:299;background:rgba(11,26,16,.97);backdrop-filter:blur(24px);display:flex;flex-direction:column;align-items:center;padding:80px 24px 40px;overflow-y:auto}
        .gmobile-menu a,.gmobile-menu button.nav-link{font-family:'JetBrains Mono',monospace;font-size:1.3rem;color:rgba(255,255,255,.5);text-decoration:none;letter-spacing:.15em;transition:color .3s;background:none;border:none;cursor:pointer;padding:12px 0}
        .gmobile-menu a:hover,.gmobile-menu button.nav-link:hover{color:#00e87a}
        .gmobile-search{width:100%;max-width:360px;margin-bottom:28px}
        .gmobile-search input{width:100%;padding:12px 16px;border-radius:10px;border:1px solid rgba(0,232,122,.15);background:rgba(0,232,122,.05);color:#e0e0e0;font-family:'JetBrains Mono',monospace;font-size:.85rem;outline:none}
        .gmobile-search input::placeholder{color:rgba(255,255,255,.3)}
        .gmobile-search input:focus{border-color:rgba(0,232,122,.35)}
        .gmobile-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;justify-content:center}
        .gmobile-chips button{padding:4px 12px;border-radius:20px;font-family:'JetBrains Mono',monospace;font-size:.7rem;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:rgba(255,255,255,.4);cursor:pointer;transition:all .2s}
        .gmobile-results{width:100%;max-width:360px;max-height:200px;overflow-y:auto;margin-bottom:16px}
        .gmobile-results button{width:100%;display:flex;align-items:center;gap:10px;padding:10px 12px;background:transparent;border:none;cursor:pointer;text-align:left;border-radius:8px;transition:background .2s}
        .gmobile-results button:active{background:rgba(0,232,122,.1)}
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
              <div className="glogo-s">RED TEAM // OFFENSIVE SEC</div>
            </div>
          </button>
        </div>

        <ul className="glinks">
          <li>
            <Link
              to="/projects"
              className="nav-link"
              style={{
                color: location.pathname.startsWith("/projects") ? "#00e87a" : "rgba(0,232,122,.85)",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >
              projects
              <span style={{
                fontSize: 9, letterSpacing: ".15em",
                color: "#00e87a", border: "1px solid #00e87a",
                padding: "1px 5px", borderRadius: 3, lineHeight: 1,
              }}>NEW</span>
            </Link>
          </li>
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
                <span>{language === "es" ? "Buscar..." : "Search..."}</span>
                <kbd>⌘K</kbd>
              </button>

              {searchOpen && (
                <div className="gsearch-dropdown" style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  width: "400px",
                  borderRadius: "12px",
                  border: "1px solid var(--gd-border)",
                  background: "var(--gd-bg)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "var(--gd-shadow)",
                  overflow: "hidden",
                  zIndex: 500,
                }}>
                  {/* Search input */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid var(--gd-border-subtle)" }}>
                    <Search size={16} style={{ color: "var(--gd-muted)", flexShrink: 0 }} />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(sanitizeSearch(e.target.value))}
                      placeholder="Buscar máquina o sherlock..."
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        color: "var(--gd-text)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: ".82rem",
                      }}
                    />
                    {query && (
                      <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: "var(--gd-muted)", cursor: "pointer" }}>
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
          <li>
            <button
              onClick={toggleLanguage}
              className="gnav-icon-btn"
              title={language === "es" ? "Switch to English" : "Cambiar a Español"}
              aria-label="Toggle language"
            >
              <Languages size={14} />
              <span style={{ marginLeft: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: ".68rem", letterSpacing: ".12em" }}>{language.toUpperCase()}</span>
            </button>
          </li>
          <li>
            <button
              onClick={toggleTheme}
              className={`gnav-theme-switch is-${theme}`}
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
              aria-label="Toggle theme"
              aria-pressed={theme === "light"}
            >
              <span className="gts-label gts-dark">Dark</span>
              <span className="gts-label gts-light">Light</span>
              <span className="gts-bubble" aria-hidden="true">
                {theme === "dark" ? <Moon size={12} /> : <Sun size={12} />}
              </span>
            </button>
          </li>
          {user && (
            <li>
              <button
                className="nav-link"
                onClick={async () => { sessionStorage.removeItem("report_access_granted"); await signOut(); }}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
                title="Cerrar sesión"
              >
                <LogOut size={14} />
                <span>salir</span>
              </button>
            </li>
          )}
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
          <button style={{ position: "absolute", top: "18px", right: "18px", background: "none", border: "none", color: "#00e87a", cursor: "pointer" }} onClick={() => setMobileOpen(false)}>
            <X size={28} />
          </button>

          {location.pathname.startsWith("/report/") && (
            <button
              onClick={() => { setMobileOpen(false); navigate("/"); }}
              style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'JetBrains Mono', monospace", fontSize: ".85rem", color: "#00e87a", background: "none", border: "1px solid rgba(0,232,122,.25)", borderRadius: "8px", padding: "8px 18px", cursor: "pointer" }}
            >
              ← Volver
            </button>
          )}

          {/* Mobile Search */}
          <div className="gmobile-search">
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,.3)" }} />
              <input
                value={query}
                onChange={(e) => setQuery(sanitizeSearch(e.target.value))}
                placeholder="Buscar máquina..."
                style={{ paddingLeft: "36px" }}
              />
            </div>
            <div className="gmobile-chips">
              {platforms.map((p) => {
                const active = selectedPlatforms.includes(p);
                const color = p === "HTB" ? "#00e87a" : p === "Sherlock" ? "#00c8ff" : "#c800ff";
                return (
                  <button key={p} onClick={() => toggleFilter(selectedPlatforms, p, setSelectedPlatforms)} style={active ? { borderColor: color, color, background: `${color}15` } : {}}>
                    {p}
                  </button>
                );
              })}
              {difficulties.map((d) => {
                const active = selectedDifficulties.includes(d);
                const color = d === "VERY EASY" ? "#c800ff" : d === "EASY" ? "#00e87a" : d === "MEDIUM" ? "#e8a800" : "#e85050";
                return (
                  <button key={d} onClick={() => toggleFilter(selectedDifficulties, d, setSelectedDifficulties)} style={active ? { borderColor: color, color, background: `${color}15` } : {}}>
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Results */}
          {hasFilters && (
            <div className="gmobile-results">
              {results.length === 0 ? (
                <p style={{ textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "rgba(255,255,255,.25)", padding: "16px" }}>Sin resultados</p>
              ) : (
                results.map((r) => (
                  <button key={r.slug} onClick={() => { setMobileOpen(false); goToReport(r.slug); }}>
                    <span style={{ fontSize: "1rem" }}>{r.emoji}</span>
                    <span style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: ".8rem", color: "#e0e0e0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".55rem", padding: "2px 6px", borderRadius: "20px", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.5)" }}>{r.difficulty}</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Nav links */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <Link
              to="/projects"
              className="nav-link"
              onClick={() => setMobileOpen(false)}
              style={{ color: location.pathname.startsWith("/projects") ? "#00e87a" : undefined }}
            >
              projects
            </Link>
            {navItems.map((item) => (
              <button key={item.href} className="nav-link" onClick={(e) => scrollTo(e, item.href)}>
                {item.label}
              </button>
            ))}
            {user && (
              <button
                className="nav-link"
                onClick={async () => { setMobileOpen(false); sessionStorage.removeItem("report_access_granted"); await signOut(); }}
                style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e85050", marginTop: "12px" }}
              >
                <LogOut size={16} />
                salir
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
