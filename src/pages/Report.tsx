import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const reports: Record<string, { title: string; file: string }> = {
  "vaccine-htb": {
    title: "Pentest Report — Vaccine (HTB)",
    file: "/reports/vaccine-htb.html",
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
