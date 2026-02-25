import { Github, Linkedin, ExternalLink, MapPin } from "lucide-react";

const links = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/yoandyrd92/",
    username: "yoandyrd92",
  },
  {
    icon: Github,
    label: "GitHub",
    url: "https://github.com/heindall92",
    username: "heindall92",
  },
  {
    icon: ExternalLink,
    label: "TryHackMe",
    url: "https://tryhackme.com/p/yoandy92",
    username: "yoandy92",
  },
  {
    icon: ExternalLink,
    label: "HackTheBox",
    url: "https://app.hackthebox.com/users/019c5812-b4ca-7315-b12f-14db6d2b42fa",
    username: "heindall92",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8 text-center">
          {">"} Contact & Links
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:glow-green transition-all duration-300">
                <link.icon size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {link.label}
                </p>
                <p className="font-mono text-xs text-muted-foreground">{link.username}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground font-mono text-sm">
          <MapPin size={16} className="text-primary" />
          <span>Lepe, Huelva, España 🇪🇸</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
