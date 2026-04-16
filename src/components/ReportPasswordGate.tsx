import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";

const SESSION_KEY = "report_access_granted";
const LOCKOUT_KEY = "report_pw_lockout";
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 5 * 60 * 1000;

const ReportPasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [granted, setGranted] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setGranted(true);
    }
    // Restore lockout
    try {
      const raw = sessionStorage.getItem(LOCKOUT_KEY);
      if (raw) {
        const { until, count } = JSON.parse(raw);
        if (Date.now() < until) {
          setLockoutUntil(until);
          setAttempts(count);
        } else {
          sessionStorage.removeItem(LOCKOUT_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(LOCKOUT_KEY);
    }
  }, []);

  // Lockout countdown
  useEffect(() => {
    if (lockoutUntil <= Date.now()) return;
    const interval = setInterval(() => {
      if (Date.now() >= lockoutUntil) {
        setLockoutUntil(0);
        setAttempts(0);
        sessionStorage.removeItem(LOCKOUT_KEY);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  const isLockedOut = lockoutUntil > Date.now();
  const lockoutSecs = isLockedOut ? Math.ceil((lockoutUntil - Date.now()) / 1000) : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLockedOut) {
      setError(`Bloqueado. Espera ${formatTime(lockoutSecs)}`);
      return;
    }

    setLoading(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "verify-report-password",
        { body: { password } }
      );

      if (fnError || !data?.success) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_MS;
          setLockoutUntil(until);
          sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until, count: newAttempts }));
          setError(`Bloqueado: ${MAX_ATTEMPTS} intentos fallidos. Espera 5 minutos.`);
        } else {
          setError(`${data?.error || "Contraseña incorrecta"} (${newAttempts}/${MAX_ATTEMPTS})`);
        }
      } else {
        sessionStorage.setItem(SESSION_KEY, "true");
        setGranted(true);
        setAttempts(0);
        sessionStorage.removeItem(LOCKOUT_KEY);
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
          border: `1px solid ${isLockedOut ? "rgba(255,68,68,.3)" : "rgba(0,232,122,.12)"}`,
          backdropFilter: "blur(24px)",
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: isLockedOut ? "rgba(255,68,68,.08)" : "rgba(0,232,122,.08)", border: `1px solid ${isLockedOut ? "rgba(255,68,68,.2)" : "rgba(0,232,122,.2)"}` }}
        >
          <Lock size={24} style={{ color: isLockedOut ? "#e85050" : "#00e87a" }} />
        </div>

        <h2
          className="mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: ".15em", color: isLockedOut ? "#e85050" : "#00e87a" }}
        >
          {isLockedOut ? "ACCESO BLOQUEADO" : "ACCESO RESTRINGIDO"}
        </h2>
        <p
          className="mb-6"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "rgba(255,255,255,.4)" }}
        >
          {isLockedOut ? `Espera ${formatTime(lockoutSecs)} para intentar de nuevo` : "Introduce la contraseña de los informes"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            autoFocus
            disabled={isLockedOut || loading}
            className="w-full rounded-lg px-4 py-3 outline-none"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: ".85rem",
              background: "rgba(0,232,122,.05)",
              border: `1px solid ${isLockedOut ? "rgba(255,68,68,.3)" : "rgba(0,232,122,.15)"}`,
              color: "#e0e0e0",
              opacity: isLockedOut ? 0.5 : 1,
            }}
          />

          {error && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "#e85050" }}>
              {error}
            </p>
          )}

          {!isLockedOut && attempts > 0 && attempts < MAX_ATTEMPTS && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".7rem", color: "#ffaa00" }}>
              ⚠ Intentos: {attempts}/{MAX_ATTEMPTS}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password || isLockedOut}
            className="w-full rounded-lg py-3 font-semibold transition-all"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: ".85rem",
              background: isLockedOut ? "rgba(255,68,68,.1)" : loading ? "rgba(0,232,122,.15)" : "rgba(0,232,122,.2)",
              border: `1px solid ${isLockedOut ? "rgba(255,68,68,.3)" : "rgba(0,232,122,.3)"}`,
              color: isLockedOut ? "#e85050" : "#00e87a",
              cursor: loading || isLockedOut ? "not-allowed" : "pointer",
              letterSpacing: ".1em",
              opacity: isLockedOut ? 0.5 : 1,
            }}
          >
            {isLockedOut ? "BLOQUEADO" : loading ? "Verificando…" : "ACCEDER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportPasswordGate;
