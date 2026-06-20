import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logAccess } from "@/lib/bifrost-config";

const SESSION_KEY = "protected_writeup_html";
const LOCKOUT_KEY = "writeup_lockout";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

interface Props {
  slug: string;
  sessionMinutes: number;
}

interface CachedSession {
  slug: string;
  html: string;
  title: string;
  expires: number;
}

const ProtectedReportRenderer = ({ slug, sessionMinutes }: Props) => {
  const sessionDuration = Math.max(1, sessionMinutes) * 60 * 1000;
  const [html, setHtml] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [devtoolsWarning, setDevtoolsWarning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Restore lockout
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(LOCKOUT_KEY);
      if (raw) {
        const { until, count } = JSON.parse(raw);
        if (Date.now() < until) {
          setLockoutUntil(until);
          setAttempts(count);
        } else sessionStorage.removeItem(LOCKOUT_KEY);
      }
    } catch { sessionStorage.removeItem(LOCKOUT_KEY); }
  }, []);

  // Restore cached HTML for this slug if still valid (session-only, cleared on unload)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw) as CachedSession;
      if (cached.slug === slug && cached.expires > Date.now()) {
        setHtml(cached.html);
        setRemaining(cached.expires - Date.now());
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch { sessionStorage.removeItem(SESSION_KEY); }
    const cleanup = () => sessionStorage.removeItem(SESSION_KEY);
    window.addEventListener("beforeunload", cleanup);
    return () => window.removeEventListener("beforeunload", cleanup);
  }, [slug]);

  // Lockout countdown
  useEffect(() => {
    if (lockoutUntil <= Date.now()) return;
    const t = setInterval(() => {
      if (Date.now() >= lockoutUntil) {
        setLockoutUntil(0); setAttempts(0);
        sessionStorage.removeItem(LOCKOUT_KEY);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [lockoutUntil]);

  // Session countdown
  useEffect(() => {
    if (!html) return;
    const t = setInterval(() => {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) { setHtml(null); setRemaining(0); return; }
      const cached = JSON.parse(raw) as CachedSession;
      const left = cached.expires - Date.now();
      if (left <= 0) {
        sessionStorage.removeItem(SESSION_KEY);
        setHtml(null); setRemaining(0);
      } else setRemaining(left);
    }, 1000);
    return () => clearInterval(t);
  }, [html]);

  // Anti-exfiltration when viewing
  useEffect(() => {
    if (!html) return;
    const blockEvent = (e: Event) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["p", "s", "u"].includes(e.key.toLowerCase())) { e.preventDefault(); return; }
      if (e.key === "F12") { e.preventDefault(); setDevtoolsWarning(true); setTimeout(() => setDevtoolsWarning(false), 3000); return; }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) {
        e.preventDefault(); setDevtoolsWarning(true); setTimeout(() => setDevtoolsWarning(false), 3000);
      }
    };
    document.addEventListener("copy", blockEvent, true);
    document.addEventListener("cut", blockEvent, true);
    document.addEventListener("dragstart", blockEvent, true);
    document.addEventListener("keydown", blockKeys, true);
    return () => {
      document.removeEventListener("copy", blockEvent, true);
      document.removeEventListener("cut", blockEvent, true);
      document.removeEventListener("dragstart", blockEvent, true);
      document.removeEventListener("keydown", blockKeys, true);
    };
  }, [html]);

  const isLockedOut = lockoutUntil > Date.now();
  const lockoutSecs = isLockedOut ? Math.ceil((lockoutUntil - Date.now()) / 1000) : 0;

  const formatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60); const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isLockedOut) { setError(`// BLOQUEADO: Espera ${formatTime(lockoutSecs * 1000)}`); return; }
    const trimmed = password.trim();
    if (!trimmed) { setError("// ERROR: Contraseña requerida"); return; }
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("serve-writeup", {
        body: { slug, password: trimmed },
      });
      if (fnError) {
        setError("// ERROR: No se pudo contactar con el servidor");
        toast.error("Error de conexión");
        return;
      }
      if (data?.ok && typeof data.html === "string") {
        const expires = Date.now() + sessionDuration;
        const cached: CachedSession = { slug, html: data.html, title: data.title ?? "", expires };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(cached));
        setHtml(data.html);
        setRemaining(sessionDuration);
        setAttempts(0);
        sessionStorage.removeItem(LOCKOUT_KEY);
        logAccess(slug, "GRANTED");
        toast.success("Acceso concedido");
        return;
      }
      const errMsg = data?.error || "Contraseña incorrecta";
      const isRateLimited = Boolean(data?.rateLimited);
      if (isRateLimited) {
        const until = Date.now() + LOCKOUT_MS;
        setLockoutUntil(until); setAttempts(MAX_ATTEMPTS);
        sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until, count: MAX_ATTEMPTS }));
        setError(`// BLOQUEADO: ${errMsg}`);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_MS;
          setLockoutUntil(until);
          sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until, count: newAttempts }));
          setError(`// BLOQUEADO: ${MAX_ATTEMPTS} intentos fallidos. Espera 5 minutos.`);
        } else {
          setError(`// ERROR: ${errMsg} (${newAttempts}/${MAX_ATTEMPTS})`);
        }
      }
      setPassword("");
      logAccess(slug, "DENIED");
    } catch {
      setError("// ERROR: Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (html) {
    return (
      <div className="relative" ref={contentRef} onContextMenu={(e) => e.preventDefault()}>
        <div style={{ position: "fixed", top: 80, right: 16, zIndex: 9999, background: "#0d0d0d", border: "1px solid #00ff41", borderRadius: 6, padding: "6px 14px", fontFamily: "monospace", fontSize: 13, color: "#00ff41", boxShadow: "0 0 12px rgba(0,255,65,0.15)" }}>
          ⏱ {formatTime(remaining)}
        </div>
        <div className="bg-background min-h-screen pt-20">
          <iframe
            title="Writeup protegido"
            srcDoc={html}
            sandbox="allow-scripts allow-same-origin"
            className="w-full border-none"
            style={{ height: "calc(100vh - 80px)" }}
          />
        </div>
        {devtoolsWarning && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", color: "#ff4444", fontSize: 20, letterSpacing: 3, textAlign: "center" }}>
            ⚠ HEINDALL: ACCESO A HERRAMIENTAS DE DESARROLLO DETECTADO ⚠
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{ background: "rgba(11,26,16,.85)", border: `1px solid ${isLockedOut ? "rgba(255,68,68,.3)" : "rgba(0,232,122,.12)"}`, backdropFilter: "blur(24px)", boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: isLockedOut ? "rgba(255,68,68,.08)" : "rgba(0,232,122,.08)", border: `1px solid ${isLockedOut ? "rgba(255,68,68,.2)" : "rgba(0,232,122,.2)"}` }}>
          <Lock size={24} style={{ color: isLockedOut ? "#e85050" : "#00e87a" }} />
        </div>
        <h2 className="mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", letterSpacing: ".15em", color: isLockedOut ? "#e85050" : "#00e87a" }}>
          {isLockedOut ? "ACCESO BLOQUEADO" : "ACCESO RESTRINGIDO"}
        </h2>
        <p className="mb-6" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "rgba(255,255,255,.4)" }}>
          {isLockedOut ? `Espera ${formatTime(lockoutSecs * 1000)} para intentar de nuevo` : "El contenido se descarga sólo tras validar la contraseña"}
        </p>
        <div className="flex flex-col gap-4">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña" autoFocus disabled={isLockedOut || loading} autoComplete="current-password"
            className="w-full rounded-lg px-4 py-3 outline-none"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".85rem", background: "rgba(0,232,122,.05)", border: `1px solid ${isLockedOut ? "rgba(255,68,68,.3)" : "rgba(0,232,122,.15)"}`, color: "#e0e0e0", opacity: isLockedOut ? 0.5 : 1 }} />
          {error && (<p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".75rem", color: "#e85050", textAlign: "left", whiteSpace: "pre-wrap" }}>{error}</p>)}
          {!isLockedOut && attempts > 0 && attempts < MAX_ATTEMPTS && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".7rem", color: "#ffaa00" }}>⚠ Intentos: {attempts}/{MAX_ATTEMPTS}</p>
          )}
          <button type="submit" disabled={loading || !password || isLockedOut} className="w-full rounded-lg py-3 font-semibold transition-all"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: ".85rem", background: isLockedOut ? "rgba(255,68,68,.1)" : loading ? "rgba(0,232,122,.15)" : "rgba(0,232,122,.2)", border: `1px solid ${isLockedOut ? "rgba(255,68,68,.3)" : "rgba(0,232,122,.3)"}`, color: isLockedOut ? "#e85050" : "#00e87a", cursor: loading || isLockedOut ? "not-allowed" : "pointer", letterSpacing: ".1em", opacity: isLockedOut ? 0.5 : 1 }}>
            {isLockedOut ? "BLOQUEADO" : loading ? "Cargando…" : "VERIFICAR Y CARGAR"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProtectedReportRenderer;