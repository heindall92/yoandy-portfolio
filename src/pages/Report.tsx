import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ReportPasswordGate from "@/components/ReportPasswordGate";
import WriteupGuard from "@/components/WriteupGuard";
import { reports } from "@/lib/reports-registry";
import { isWriteupProtected } from "@/lib/bifrost-config";

const Report = () => {
  const { slug } = useParams<{ slug: string }>();
  const report = slug ? reports[slug] : null;

  useEffect(() => {
    if (report) document.title = report.title;
  }, [report]);

  if (!report || !slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-xl font-mono mb-4">Informe no encontrado</p>
          <Link to="/" className="text-primary font-mono text-sm hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const effectiveProtected = isWriteupProtected(slug, !!report.protected);

  return (
    <ReportPasswordGate>
      <WriteupGuard isProtected={effectiveProtected} slug={slug}>
        <div className="bg-background min-h-screen pt-20">
          <iframe
            src={report.file}
            title={report.title}
            className="w-full border-none"
            style={{ height: "calc(100vh - 80px)" }}
          />
        </div>
      </WriteupGuard>
    </ReportPasswordGate>
  );
};

export default Report;
