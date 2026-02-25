import { Progress } from "@/components/ui/progress";

const stats = [
  { label: "eJPT Preparation", value: 75, color: "bg-primary" },
  { label: "HTB Academy Level", value: 80, color: "bg-secondary" },
  { label: "TryHackMe Streak", value: 65, color: "bg-neon-magenta" },
  { label: "Master's Progress", value: 50, color: "bg-neon-yellow" },
];

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="font-display text-3xl font-bold text-primary text-glow-green mb-8">
          {">"} About Me
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bio */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card neon-border neon-border-hover transition-all duration-300">
              <p className="text-foreground leading-relaxed mb-4">
                Cybersecurity professional focused on <span className="text-primary font-semibold">offensive security</span>, 
                penetration testing, and red team operations. Currently pursuing a Master's in 
                Cybersecurity & Artificial Intelligence.
              </p>
              <p className="text-foreground leading-relaxed">
                Passionate about ethical hacking, CTF challenges, and building security tools.
                Active contributor on HackTheBox and TryHackMe platforms, constantly sharpening 
                skills through hands-on labs and real-world scenarios.
              </p>
            </div>

            {/* Terminal block */}
            <div className="rounded-lg bg-background border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-neon-yellow" />
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="font-mono text-xs text-muted-foreground ml-2">terminal</span>
              </div>
              <div className="p-4 font-mono text-sm space-y-2">
                <p><span className="text-primary">$</span> whoami</p>
                <p className="text-muted-foreground">yoandy-rodriguez</p>
                <p><span className="text-primary">$</span> cat location.txt</p>
                <p className="text-muted-foreground">Lepe, Huelva, España 🇪🇸</p>
                <p><span className="text-primary">$</span> cat interests.txt</p>
                <p className="text-muted-foreground">Pentesting, Red Team, CTFs, Linux, Python</p>
                <p><span className="text-primary">$</span> cat status.txt</p>
                <p className="text-muted-foreground">Master's Student | eJPT Candidate</p>
                <p className="text-primary animate-pulse">$ █</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-card neon-border">
              <h3 className="font-display text-xl font-bold text-secondary text-glow-cyan mb-6">
                Progress Stats
              </h3>
              <div className="space-y-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm text-foreground">{stat.label}</span>
                      <span className="font-mono text-sm text-primary">{stat.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stat.color} transition-all duration-1000`}
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "HTB Academy", value: "Level 8" },
                { label: "THM Streak", value: "31+ days" },
                { label: "Focus", value: "Offensive" },
                { label: "Master's", value: "2024-2026" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="p-4 rounded-lg bg-card neon-border text-center neon-border-hover transition-all duration-300"
                >
                  <p className="font-mono text-xs text-muted-foreground">{fact.label}</p>
                  <p className="font-display text-lg font-bold text-primary mt-1">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
