import { Shield, Terminal, Wrench, CheckCircle, BookOpen } from "lucide-react";

const skillCategories = [
  {
    icon: Shield,
    title: "Offensive Security",
    skills: ["Kali Linux", "Metasploit", "Nmap", "Burp Suite", "Wireshark", "Gobuster", "FFuf", "Netcat"],
  },
  {
    icon: Terminal,
    title: "Scripting & OS",
    skills: ["Python", "Bash", "Linux", "Windows"],
  },
  {
    icon: Wrench,
    title: "Tools & Platforms",
    skills: ["Obsidian", "Git", "TryHackMe", "HackTheBox", "Docker"],
  },
];

const certifications = [
  { name: "eJPT (eLearnSecurity)", status: "in-progress", year: "2025" },
  { name: "Google IT Professional", status: "done", year: "2024" },
  { name: "Cisco Cyber Defense", status: "done", year: "2024" },
  { name: "IBM Cybersecurity Analyst", status: "done", year: "2024" },
  { name: "Master's Cybersec & AI", status: "in-progress", year: "2026" },
];

const Skills = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8">
          {">"} Skills & Certifications
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Skills */}
          <div className="space-y-6">
            {skillCategories.map((cat) => (
              <div
                key={cat.title}
                className="p-6 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <cat.icon size={20} className="text-secondary" />
                  <h3 className="font-display text-lg font-bold text-foreground">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full font-mono text-xs bg-muted text-primary border border-primary/20 hover:border-primary/60 hover:glow-green transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-secondary text-glow-cyan mb-4">
              Certifications
            </h3>
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-center gap-4 p-4 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300"
              >
                {cert.status === "done" ? (
                  <CheckCircle size={20} className="text-primary flex-shrink-0" />
                ) : (
                  <BookOpen size={20} className="text-neon-yellow flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-foreground truncate">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">{cert.year}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                    cert.status === "done"
                      ? "bg-primary/10 text-primary"
                      : "bg-neon-yellow/10 text-neon-yellow"
                  }`}
                >
                  {cert.status === "done" ? "✅ Done" : "📚 In Progress"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
