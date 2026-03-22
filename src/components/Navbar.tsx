import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shield, Search } from "lucide-react";
import { machines } from "@/pages/Machines";
import { sherlocks } from "@/pages/Sherlocks";
import { hmvMachines } from "@/pages/HackMyVM";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
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
  "VERY EASY": "bg-neon-magenta/15 text-neon-magenta border-neon-magenta/30",
  "EASY": "bg-primary/15 text-primary border-primary/30",
  "MEDIUM": "bg-neon-yellow/15 text-neon-yellow border-neon-yellow/30",
  "HARD": "bg-destructive/15 text-destructive border-destructive/30",
};

const platformChipColors: Record<string, string> = {
  "HTB": "bg-primary/15 text-primary border-primary/30",
  "Sherlock": "bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30",
  "HackMyVM": "bg-neon-magenta/15 text-neon-magenta border-neon-magenta/30",
};

const Navbar = () => {
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
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={(e) => scrollTo(e, "#home")} className="flex items-center gap-2 text-primary font-display text-lg font-bold text-glow-green">
          <Shield size={28} />
119:           <span className="text-xl">YRD</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => scrollTo(e, item.href)}
              className="px-4 py-2 rounded-md font-mono text-base text-muted-foreground hover:text-primary hover:text-glow-green transition-all duration-300"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/30 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300 font-mono text-sm"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted/60 border border-border/40 text-[10px] text-muted-foreground/60 font-mono">
                ⌘K
              </kbd>
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden z-50">
                {/* Search input */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                  <Search size={16} className="text-muted-foreground/60 shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar máquina o sherlock..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none font-mono"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} className="text-muted-foreground/40 hover:text-muted-foreground">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Filter chips */}
                <div className="px-4 py-2.5 border-b border-border/20 space-y-2">
                  {/* Platform filters */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider mr-1">Plataforma</span>
                    {platforms.map((p) => (
                      <button
                        key={p}
                        onClick={() => toggleFilter(selectedPlatforms, p, setSelectedPlatforms)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all duration-200 ${
                          selectedPlatforms.includes(p)
                            ? platformChipColors[p] + " opacity-100"
                            : "bg-muted/20 text-muted-foreground/50 border-border/30 hover:border-border/60"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Difficulty filters */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider mr-1">Dificultad</span>
                    {difficulties.map((d) => (
                      <button
                        key={d}
                        onClick={() => toggleFilter(selectedDifficulties, d, setSelectedDifficulties)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono border transition-all duration-200 ${
                          selectedDifficulties.includes(d)
                            ? diffChipColors[d] + " opacity-100"
                            : "bg-muted/20 text-muted-foreground/50 border-border/30 hover:border-border/60"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-64 overflow-y-auto">
                  {!hasFilters && (
                    <p className="px-4 py-6 text-center text-xs text-muted-foreground/50 font-mono">Escribe o filtra para buscar...</p>
                  )}
                  {hasFilters && results.length === 0 && (
                    <p className="px-4 py-6 text-center text-xs text-muted-foreground/50 font-mono">Sin resultados</p>
                  )}
                  {hasFilters && results.length > 0 && (
                    <>
                      <div className="px-4 pt-2 pb-1">
                        <span className="text-[10px] font-mono text-muted-foreground/40">{results.length} resultado{results.length !== 1 ? "s" : ""}</span>
                      </div>
                      {results.map((r) => (
                        <button
                          key={r.slug}
                          onClick={() => goToReport(r.slug)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 transition-colors text-left"
                        >
                          <span className="text-lg">{r.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-mono text-foreground block truncate">{r.name}</span>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${diffChipColors[r.difficulty] || "bg-muted/50 text-muted-foreground/60 border-border/30"}`}>
                            {r.difficulty}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${platformChipColors[r.platform] || "bg-muted/50 text-muted-foreground/60 border-border/30"}`}>
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

          <button className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden glassmorphism border-t border-border pb-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => scrollTo(e, item.href)}
              className="block w-full text-left px-6 py-3 font-mono text-sm text-muted-foreground hover:text-primary transition-all"
            >
              {">"} {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
