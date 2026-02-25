import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={(e) => scrollTo(e, "#home")} className="flex items-center gap-2 text-primary font-display text-lg font-bold text-glow-green">
          <Shield size={24} />
          <span>YRD</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => scrollTo(e, item.href)}
              className="px-4 py-2 rounded-md font-mono text-sm text-muted-foreground hover:text-primary hover:text-glow-green transition-all duration-300"
            >
              {item.label}
            </button>
          ))}
        </div>

        <button className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
