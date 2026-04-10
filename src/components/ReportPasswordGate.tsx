import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

const SESSION_KEY = "report_access_granted";

const ReportPasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [granted, setGranted] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setGranted(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "verify-report-password",
        { body: { password } }
      );

      if (fnError || !data?.success) {
        setError(data?.error || "Contraseña incorrecta");
      } else {
        sessionStorage.setItem(SESSION_KEY, "true");
        setGranted(true);
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (granted) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{
          background: "rgba(11,26,16,.85)",
          border: "1px solid rgba(0,232,122,.12)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "rgba(0,232,122,.08)", border: "1px solid rgba(0,232,122,.2)" }}
        >
          <Lock size={24} style={{ color: "#00e87a" }} />
        </div>

        <h2
          className="mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: ".15em", color: "#00e87a" }}
        >
          ACCESO RESTRINGIDO
        </h2>
        <p
          className="mb-6"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "rgba(255,255,255,.4)" }}
        >
          Introduce la contraseña de los informes
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            className="w-full rounded-lg px-4 py-3 outline-none"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: ".85rem",
              background: "rgba(0,232,122,.05)",
              border: "1px solid rgba(0,232,122,.15)",
              color: "#e0e0e0",
            }}
          />

          {error && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "#e85050" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg py-3 font-semibold transition-all"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: ".85rem",
              background: loading ? "rgba(0,232,122,.15)" : "rgba(0,232,122,.2)",
              border: "1px solid rgba(0,232,122,.3)",
              color: "#00e87a",
              cursor: loading ? "wait" : "pointer",
              letterSpacing: ".1em",
            }}
          >
            {loading ? "Verificando…" : "ACCEDER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPasswordGate;
