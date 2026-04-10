import { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { verifySync } from "otplib";
import { getTotpMinutes, logAccess } from "@/lib/bifrost-config";

const SESSION_KEY = "totp_meow";

interface WriteupGuardProps {
  isProtected: boolean;
  slug?: string;
  children: ReactNode;
}

const WriteupGuard = ({ isProtected, slug = "unknown", children }: WriteupGuardProps) => {
  const sessionDuration = getTotpMinutes() * 60 * 1000;

  const [granted, setGranted] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [devtoolsWarning, setDevtoolsWarning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const childrenBackupRef = useRef<Node[]>([]);

  const secret = import.meta.env.VITE_TOTP_SECRET;

  const checkSession = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const { expires } = JSON.parse(raw);
        const left = expires - Date.now();
        if (left > 0) {
          setGranted(true);
          setRemaining(left);
          return true;
        }
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    return false;
  }, []);

  useEffect(() => {
    if (!isProtected) return;
    checkSession();

    const cleanup = () => sessionStorage.removeItem(SESSION_KEY);
    window.addEventListener("beforeunload", cleanup);
    return () => window.removeEventListener("beforeunload", cleanup);
  }, [isProtected, checkSession]);

  // Countdown timer
  useEffect(() => {
    if (!granted || !isProtected) return;
    const interval = setInterval(() => {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) { setGranted(false); return; }
      const { expires } = JSON.parse(raw);
      const left = expires - Date.now();
      if (left <= 0) {
        sessionStorage.removeItem(SESSION_KEY);
        setGranted(false);
        setRemaining(0);
      } else {
        setRemaining(left);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [granted, isProtected]);

  // Anti-exfiltration protections
  useEffect(() => {
    if (!isProtected || !granted) return;

    const container = contentRef.current;
    const blockEvent = (e: Event) => e.preventDefault();

    const blockKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["p", "s", "u"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && container?.contains(e.target as Node)) {
        e.preventDefault();
        return;
      }
      if (e.key === "F12") {
        e.preventDefault();
        setDevtoolsWarning(true);
        setTimeout(() => setDevtoolsWarning(false), 3000);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setDevtoolsWarning(true);
        setTimeout(() => setDevtoolsWarning(false), 3000);
        return;
      }
    };

    const handleBeforePrint = () => {
      if (container) {
        childrenBackupRef.current = Array.from(container.childNodes).map(n => n.cloneNode(true));
        while (container.firstChild) container.removeChild(container.firstChild);
      }
    };
    const handleAfterPrint = () => {
      if (container && childrenBackupRef.current.length > 0) {
        childrenBackupRef.current.forEach(n => container.appendChild(n));
        childrenBackupRef.current = [];
      }
    };

    document.addEventListener("copy", blockEvent, true);
    document.addEventListener("cut", blockEvent, true);
    document.addEventListener("dragstart", blockEvent, true);
    document.addEventListener("keydown", blockKeys, true);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      document.removeEventListener("copy", blockEvent, true);
      document.removeEventListener("cut", blockEvent, true);
      document.removeEventListener("dragstart", blockEvent, true);
      document.removeEventListener("keydown", blockKeys, true);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [isProtected, granted]);

  if (!isProtected) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!secret) {
      setError("SISTEMA: Configura VITE_TOTP_SECRET en Lovable Settings > Environment Variables con un secret base32. Genera uno con generateSecret() de otplib.");
      return;
    }

    const trimmed = code.trim();
    if (trimmed.length !== 6 || !/^\d{6}$/.test(trimmed)) {
      setError("// ERROR: Código debe ser 6 dígitos");
      return;
    }

    const valid = verifySync({ token: trimmed, secret });
    if (valid) {
      const expires = Date.now() + sessionDuration;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expires }));
      setGranted(true);
      setRemaining(sessionDuration);
      logAccess(slug, "GRANTED");
    } else {
      setError("// ERROR: Código TOTP inválido o expirado");
      setCode("");
      logAccess(slug, "DENIED");
    }
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const sessionTimestamp = new Date().toLocaleString("es-ES");
  const watermarkText = `HEINDALL // CONFIDENCIAL // ${sessionTimestamp} // SOLO LECTURA    `;

  if (granted) {
    return (
      <div className="relative" style={{ position: "relative" }}>
        <style>{`
          @media print {
            .writeup-protected-content { display: none !important; }
            .writeup-print-block { display: flex !important; }
          }
          .writeup-protected-content {
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
          }
          .writeup-protected-content iframe,
          .writeup-protected-content p,
          .writeup-protected-content span,
          .writeup-protected-content h1,
          .writeup-protected-content h2,
          .writeup-protected-content h3,
          .writeup-protected-content pre,
          .writeup-protected-content code {
            pointer-events: none;
          }
          .writeup-protected-content {
            pointer-events: auto;
            overflow: auto;
          }
        `}</style>

        <div style={{ position: "fixed", top: 80, right: 16, zIndex: 9999, background: "#0d0d0d", border: "1px solid #00ff41", borderRadius: 6, padding: "6px 14px", fontFamily: "monospace", fontSize: 13, color: "#00ff41", boxShadow: "0 0 12px rgba(0,255,65,0.15)" }}>
          ⏱ {formatTime(remaining)}
        </div>

        <div className="writeup-print-block" style={{ display: "none", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#0d0d0d", color: "#00ff41", fontFamily: "monospace", fontSize: 24, textAlign: "center", letterSpacing: 2 }}>
          CONTENIDO PROTEGIDO — IMPRESIÓN NO AUTORIZADA
        </div>

        <div ref={contentRef} className="writeup-protected-content" onContextMenu={(e) => e.preventDefault()} style={{ position: "relative" }}>
          {children}

          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 9998, overflow: "hidden", opacity: 0.06 }}>
            <div style={{ position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%", transform: "rotate(-35deg)", display: "flex", flexWrap: "wrap", alignContent: "flex-start", fontFamily: "monospace", fontSize: 14, color: "#00ff41", lineHeight: "48px", letterSpacing: 2, whiteSpace: "nowrap", wordBreak: "keep-all" }}>
              {Array.from({ length: 200 }, (_, i) => (
                <span key={i} style={{ padding: "0 24px" }}>{watermarkText}</span>
              ))}
            </div>
          </div>
        </div>

        {devtoolsWarning && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.92)", zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", color: "#ff4444", fontSize: 20, letterSpacing: 3, textAlign: "center", textShadow: "0 0 20px rgba(255,68,68,0.5)" }}>
            ⚠ HEINDALL: ACCESO A HERRAMIENTAS DE DESARROLLO DETECTADO ⚠
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0d0d0d", fontFamily: "'JetBrains Mono', monospace" }}>
      <form onSubmit={handleSubmit} style={{ background: "#111", border: "1px solid #00ff41", borderRadius: 8, padding: "48px 40px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 0 30px rgba(0,255,65,0.08), 0 0 60px rgba(0,255,65,0.04)" }}>
        <div style={{ width: 48, height: 48, margin: "0 auto 20px", border: "2px solid #00ff41", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#00ff41", fontSize: 22, boxShadow: "0 0 16px rgba(0,255,65,0.3)" }}>
          🔒
        </div>
        <h2 style={{ color: "#00ff41", fontSize: 18, letterSpacing: 2, marginBottom: 8, textShadow: "0 0 8px rgba(0,255,65,0.4)" }}>
          // ACCESO RESTRINGIDO
        </h2>
        <p style={{ color: "#555", fontSize: 12, marginBottom: 28 }}>
          Autenticación TOTP requerida (Google Authenticator)
        </p>

        <input type="text" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" autoFocus
          style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 6, padding: "14px 16px", color: "#00ff41", fontSize: 24, textAlign: "center", letterSpacing: 12, fontFamily: "'JetBrains Mono', monospace", outline: "none", boxSizing: "border-box" }}
          onFocus={(e) => (e.target.style.borderColor = "#00ff41")}
          onBlur={(e) => (e.target.style.borderColor = "#333")}
        />

        {error && (
          <p style={{ color: error.startsWith("SISTEMA") ? "#ffaa00" : "#ff4444", fontSize: 11, marginTop: 12, textAlign: "left", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {error}
          </p>
        )}

        <button type="submit" style={{ width: "100%", marginTop: 20, padding: "12px", background: "transparent", border: "1px solid #00ff41", borderRadius: 6, color: "#00ff41", fontSize: 13, letterSpacing: 2, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,65,0.1)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,65,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
        >
          VERIFICAR ACCESO →
        </button>
      </form>
    </div>
  );
};

export default WriteupGuard;
