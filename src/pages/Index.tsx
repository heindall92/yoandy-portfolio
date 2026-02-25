import { Github, Linkedin, ExternalLink } from "lucide-react";
import profileImg from "@/assets/profile.jpg";
import TypingAnimation from "@/components/TypingAnimation";

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/in/yoandyrd92/", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/heindall92", label: "GitHub" },
  { icon: ExternalLink, href: "https://tryhackme.com/p/yoandy92", label: "TryHackMe" },
  { icon: ExternalLink, href: "https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa", label: "HackTheBox" },
];

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--neon-green) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon-green) / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 max-w-4xl mx-auto">
          {/* Profile photo */}
          <div className="relative flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden glow-green border-2 border-primary">
              <img src={profileImg} alt="Yoandy Rodríguez" className="w-full h-full object-cover" />
            </div>
            {/* Decorative ring */}
            <div className="absolute -inset-3 rounded-full border border-primary/20 animate-pulse" />
          </div>

          {/* Info */}
          <div className="text-center md:text-left space-y-4">
            <p className="font-mono text-sm text-muted-foreground">$ whoami</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              Yoandy <span className="text-primary text-glow-green">Rodríguez</span>
            </h1>
            <p className="text-lg font-display text-secondary tracking-wider">
              Offensive Security | Pentesting | Red Team
            </p>

            <div className="h-8">
              <TypingAnimation
                texts={[
                  "Cybersecurity & AI Master's Student",
                  "eJPT Candidate",
                  "CTF Player @ HTB & THM",
                  "Linux Enthusiast",
                  "Pentester in Training",
                ]}
              />
            </div>

            {/* Social buttons */}
            <div className="flex gap-3 justify-center md:justify-start pt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md neon-border neon-border-hover bg-muted/50 font-mono text-sm text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  <link.icon size={16} />
                  <span className="hidden sm:inline">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
