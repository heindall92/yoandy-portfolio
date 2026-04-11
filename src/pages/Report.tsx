import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import WriteupGuard from "@/components/WriteupGuard";
import { reports } from "@/lib/reports-registry";
import { getRemoteWriteupSecurityConfig, resolveWriteupProtection } from "@/lib/bifrost-config";

interface ReportSecurityState {
  loading: boolean;
  error: boolean;
  isProtected: boolean;
  sessionMinutes: number;
}

const Report = () => {
  const { slug } = useParams<{ slug: string }>();
  const report = slug ? reports[slug] : null;
  const [securityState, setSecurityState] = useState<ReportSecurityState>({
    loading: true,
    error: false,
    isProtected: !!report?.protected,
    sessionMinutes: 10,
  });

  useEffect(() => {
    if (report) document.title = report.title;
  }, [report]);

  useEffect(() => {
    let cancelled = false;

    if (!report || !slug) return;

    setSecurityState((current) => ({ ...current, loading: true, error: false }));

    void getRemoteWriteupSecurityConfig()
      .then((config) => {
        if (cancelled) return;

        setSecurityState({
          loading: false,
          error: false,
          isProtected: resolveWriteupProtection(slug, !!report.protected, config),
          sessionMinutes: config.sessionMinutes,
        });
      })
      .catch(() => {
        if (cancelled) return;

        setSecurityState((current) => ({ ...current, loading: false, error: true }));
      });

    return () => {
      cancelled = true;
    };
  }, [report, slug]);

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

  if (securityState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <p className="text-xl font-mono mb-2">Verificando protección…</p>
          <p className="text-sm text-muted-foreground font-mono">Cargando reglas seguras del writeup</p>
        </div>
      </div>
    );
  }

  if (securityState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
        <div className="text-center max-w-md">
          <p className="text-xl font-mono mb-2">No se pudo verificar el acceso</p>
          <p className="text-sm text-muted-foreground font-mono mb-4">Por seguridad, este informe no se abrirá hasta recuperar la configuración.</p>
          <Link to="/" className="text-primary font-mono text-sm hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <WriteupGuard isProtected={securityState.isProtected} slug={slug} sessionMinutes={securityState.sessionMinutes}>
      <div className="bg-background min-h-screen pt-20">
        <iframe
          src={report.file}
          title={report.title}
          className="w-full border-none"
          style={{ height: "calc(100vh - 80px)" }}
        />
      </div>
    </WriteupGuard>
  );
};

export default Report;
