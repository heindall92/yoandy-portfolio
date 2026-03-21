import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

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

const sectionBackLinks: Record<string, { path: string; label: string }> = {
  htb: { path: "/machines", label: "Máquinas HTB" },
  sherlocks: { path: "/sherlocks", label: "Sherlocks" },
  hackmyvm: { path: "/hackmyvm", label: "HackMyVM" },
};

const Report = () => {
  const { slug } = useParams<{ slug: string }>();
  const report = slug ? reports[slug] : null;

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-2xl text-primary font-mono">Report not found</p>
          <Link to="/#projects" className="text-secondary hover:text-primary font-mono text-sm underline">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  const backLink = sectionBackLinks[report.section] || { path: "/#projects", label: "Portfolio" };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="fixed top-16 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Link
          to={backLink.path}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
        >
          <ArrowLeft size={16} />
          {backLink.label}
        </Link>
        <span className="text-primary font-mono text-sm">{report.title}</span>
      </div>
      <div className="pt-12">
        <iframe
          src={report.file}
          title={report.title}
          className="w-full border-0"
          style={{ height: "calc(100vh - 7rem)" }}
        />
      </div>
    </div>
  );
};

export default Report;
