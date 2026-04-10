import { useState, useEffect, useCallback, type ReactNode } from "react";
import { verifySync } from "otplib";

const SESSION_KEY = "totp_meow";
const SESSION_DURATION = 600000; // 10 minutes

interface WriteupGuardProps {
  isProtected: boolean;
  children: ReactNode;
}

const WriteupGuard = ({ isProtected, children }: WriteupGuardProps) => {
  const [granted, setGranted] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(0);

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

  if (!isProtected) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!secret) {
      setError("SISTEMA: Configura VITE_TOTP_SECRET en Lovable Settings > Environment Variables con un secret base32. Genera uno con authenticator.generateSecret() de otplib.");
      return;
    }

    const trimmed = code.trim();
    if (trimmed.length !== 6 || !/^\d{6}$/.test(trimmed)) {
      setError("// ERROR: Código debe ser 6 dígitos");
      return;
    }

    const valid = verifySync({ token: trimmed, secret });
    if (valid) {
      const expires = Date.now() + SESSION_DURATION;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expires }));
      setGranted(true);
      setRemaining(SESSION_DURATION);
    } else {
      setError("// ERROR: Código TOTP inválido o expirado");
      setCode("");
    }
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  if (granted) {
    return (
      <div className="relative">
        <div
          style={{
            position: "fixed",
            top: 80,
            right: 16,
            zIndex: 9999,
            background: "#0d0d0d",
            border: "1px solid #00ff41",
            borderRadius: 6,
            padding: "6px 14px",
            fontFamily: "monospace",
            fontSize: 13,
            color: "#00ff41",
            boxShadow: "0 0 12px rgba(0,255,65,0.15)",
          }}
        >
          ⏱ {formatTime(remaining)}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d0d",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#111",
          border: "1px solid #00ff41",
          borderRadius: 8,
          padding: "48px 40px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 0 30px rgba(0,255,65,0.08), 0 0 60px rgba(0,255,65,0.04)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            margin: "0 auto 20px",
            border: "2px solid #00ff41",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#00ff41",
            fontSize: 22,
            boxShadow: "0 0 16px rgba(0,255,65,0.3)",
          }}
        >
          🔒
        </div>

        <h2
          style={{
            color: "#00ff41",
            fontSize: 18,
            letterSpacing: 2,
            marginBottom: 8,
            textShadow: "0 0 8px rgba(0,255,65,0.4)",
          }}
        >
          // ACCESO RESTRINGIDO
        </h2>
        <p style={{ color: "#555", fontSize: 12, marginBottom: 28 }}>
          Autenticación TOTP requerida (Google Authenticator)
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          autoFocus
          style={{
            width: "100%",
            background: "#0a0a0a",
            border: "1px solid #333",
            borderRadius: 6,
            padding: "14px 16px",
            color: "#00ff41",
            fontSize: 24,
            textAlign: "center",
            letterSpacing: 12,
            fontFamily: "'JetBrains Mono', monospace",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00ff41")}
          onBlur={(e) => (e.target.style.borderColor = "#333")}
        />

        {error && (
          <p
            style={{
              color: error.startsWith("SISTEMA") ? "#ffaa00" : "#ff4444",
              fontSize: 11,
              marginTop: 12,
              textAlign: "left",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: 20,
            padding: "12px",
            background: "transparent",
            border: "1px solid #00ff41",
            borderRadius: 6,
            color: "#00ff41",
            fontSize: 13,
            letterSpacing: 2,
            fontFamily: "'JetBrains Mono', monospace",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(0,255,65,0.1)";
            e.currentTarget.style.boxShadow = "0 0 16px rgba(0,255,65,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          VERIFICAR ACCESO →
        </button>
      </form>
    </div>
  );
};

export default WriteupGuard;
