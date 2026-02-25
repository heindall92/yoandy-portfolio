import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    emoji: "🔴",
    name: "pentest-notes",
    description: "Metodologías, checklists y notas de pentesting organizadas para auditorías de seguridad.",
    tags: ["Markdown", "Pentesting", "Methodology"],
    url: "https://github.com/heindall92/pentest-notes",
  },
  {
    emoji: "📖",
    name: "tool-manuals",
    description: "Manuales técnicos detallados para herramientas de seguridad: Nmap, Metasploit, Burp Suite y más.",
    tags: ["Documentation", "Nmap", "Metasploit"],
    url: "https://github.com/heindall92/tool-manuals",
  },
  {
    emoji: "🛠️",
    name: "security-scripts",
    description: "Scripts de automatización en Python y Bash para tareas de reconocimiento y análisis.",
    tags: ["Python", "Bash", "Automation"],
    url: "https://github.com/heindall92/security-scripts",
  },
  {
    emoji: "🚩",
    name: "ctf-writeups",
    description: "Writeups de máquinas y retos CTF de HackTheBox y TryHackMe.",
    tags: ["CTF", "HackTheBox", "TryHackMe"],
    url: "https://github.com/heindall92/ctf-writeups",
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8">
          {">"} Projects & Repositories
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{project.emoji}</span>
                  <h3 className="font-mono text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                </div>
                <Github size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full font-mono text-xs bg-muted text-secondary border border-secondary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
