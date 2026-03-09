import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const reports: Record<string, { title: string; file: string }> = {
  "vaccine-htb": {
    title: "Writeup — Vaccine (HTB)",
    file: "/reports/vaccine-htb.html",
  },
  "archetype-htb": {
    title: "Writeup — Archetype (HTB)",
    file: "/reports/archetype-htb.html",
  },
  "oopsie-htb": {
    title: "Writeup — Oopsie (HTB)",
    file: "/reports/oopsie-htb.html",
  },
  "pterodactyl-htb": {
    title: "Writeup — Pterodactyl (HTB)",
    file: "/reports/pterodactyl-htb.html",
  },
  "unified-htb": {
    title: "Writeup — Unified (HTB)",
    file: "/reports/unified-htb.html",
  },
  "crownjewel1-sherlock": {
    title: "Sherlock — CrownJewel-1 (HTB)",
    file: "/reports/crownjewel1-sherlock.html",
  },
  "dreamjob1-sherlock": {
    title: "Sherlock — Dream Job-1 (HTB)",
    file: "/reports/dreamjob1-sherlock.html",
  },
  "dreamjob2-sherlock": {
    title: "Sherlock — Dream Job-2 (HTB)",
    file: "/reports/dreamjob2-sherlock.html",
  },
  "romcom-sherlock": {
    title: "Sherlock — RomCom (HTB)",
    file: "/reports/romcom-sherlock.html",
  },
  "brutus-sherlock": {
    title: "Sherlock — Brutus (HTB)",
    file: "/reports/brutus-sherlock.html",
  },
  "eighteen-htb": {
    title: "Writeup — Eighteen (HTB)",
    file: "/reports/eighteen-htb.html",
  },
  "twomillion-htb": {
    title: "Writeup — TwoMillion (HTB)",
    file: "/reports/twomillion-htb.html",
  },
  "interpreter-htb": {
    title: "Writeup — Interpreter (HTB)",
    file: "/reports/interpreter-htb.html",
  },
  "cctv-htb": {
    title: "Writeup — CCTV (HTB)",
    file: "/reports/cctv-htb.html",
  },
  "airtouch-htb": {
    title: "Writeup — AirTouch (HTB)",
    file: "/reports/airtouch-htb.html",
  },
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

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="fixed top-16 left-0 right-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Link
          to="/#projects"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm"
        >
          <ArrowLeft size={16} />
          Back
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
