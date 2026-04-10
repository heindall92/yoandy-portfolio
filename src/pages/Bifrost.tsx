import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { reports } from "@/lib/reports-registry";
import {
  getProtectionConfig,
  setProtectionConfig,
  getTotpMinutes,
  setTotpMinutes,
  getAccentColor,
  setAccentColor,
  getBifrostFont,
  setBifrostFont,
  getAccessLog,
  type ProtectionConfig,
  type AccessLogEntry,
} from "@/lib/bifrost-config";

const SESSION_KEY = "bifrost_admin";
const SESSION_DURATION = 7200000; // 2 hours
const LOCKOUT_KEY = "bifrost_lockout";
const MAX_ATTEMPTS = 3;

const sectionLabel: Record<string, string> = {
  htb: "HTB",
  sherlocks: "Sherlocks",
  hackmyvm: "HackMyVM",
  thl: "THL",
  certs: "Certs",
};

const inputStyle: React.CSSProperties = {
  background: "#0a0a0a",
  border: "1px solid #333",
  borderRadius: 4,
  padding: "8px 12px",
  color: "#00ff41",
  fontFamily: "monospace",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  padding: "10px 20px",
  background: "transparent",
  border: "1px solid #00ff41",
  borderRadius: 4,
  color: "#00ff41",
  fontFamily: "monospace",
  fontSize: 12,
  letterSpacing: 2,
  cursor: "pointer",
  transition: "all 0.2s",
};

const Bifrost = () => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [adminRemaining, setAdminRemaining] = useState(0);

  // Panel state
  const [protectionConfig, setProtectionConfigState] = useState<ProtectionConfig>({});
  const [totpMin, setTotpMin] = useState(10);
  const [accent, setAccent] = useState("#00ff41");
  const [font, setFont] = useState("Orbitron");
  const [logs, setLogs] = useState<AccessLogEntry[]>([]);
  const [saved, setSaved] = useState(false);

  const bifrostKey = import.meta.env.VITE_BIFROST_KEY;

  // Add noindex meta
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "BIFROST // ADMIN";
    return () => { document.head.removeChild(meta); };
  }, []);

  // Check session
  const checkAdminSession = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const { expires } = JSON.parse(raw);
        const left = expires - Date.now();
        if (left > 0) {
          setAuthed(true);
          setAdminRemaining(left);
          return true;
        }
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    return false;
  }, []);

  // Check lockout
  useEffect(() => {
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
    } catch {}
  }, []);

  useEffect(() => {
    if (checkAdminSession()) {
      loadConfig();
    }
  }, [checkAdminSession]);

  // Admin session countdown
  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) { setAuthed(false); return; }
      const { expires } = JSON.parse(raw);
      const left = expires - Date.now();
      if (left <= 0) {
        sessionStorage.removeItem(SESSION_KEY);
        setAuthed(false);
      } else {
        setAdminRemaining(left);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [authed]);

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

  // Refresh logs every 2s
  useEffect(() => {
    if (!authed) return;
    const interval = setInterval(() => setLogs([...getAccessLog()]), 2000);
    return () => clearInterval(interval);
  }, [authed]);

  const loadConfig = () => {
    setProtectionConfigState(getProtectionConfig());
    setTotpMin(getTotpMinutes());
    setAccent(getAccentColor());
    setFont(getBifrostFont());
    setLogs([...getAccessLog()]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (lockoutUntil > Date.now()) {
      const secs = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setLoginError(`BLOQUEADO: Espera ${secs}s`);
      return;
    }

    if (!bifrostKey) {
      setLoginError("BIFROST: Variable VITE_BIFROST_KEY no configurada en .env");
      return;
    }

    if (password === bifrostKey) {
      const expires = Date.now() + SESSION_DURATION;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ expires }));
      setAuthed(true);
      setAdminRemaining(SESSION_DURATION);
      setAttempts(0);
      sessionStorage.removeItem(LOCKOUT_KEY);
      loadConfig();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Date.now() + 300000; // 5 min
        setLockoutUntil(until);
        sessionStorage.setItem(LOCKOUT_KEY, JSON.stringify({ until, count: newAttempts }));
        setLoginError(`BLOQUEADO: 3 intentos fallidos. Espera 5 minutos.`);
      } else {
        setLoginError(`// ERROR: Contraseña incorrecta (${newAttempts}/${MAX_ATTEMPTS})`);
      }
      setPassword("");
    }
  };

  const toggleProtection = (slug: string) => {
    setProtectionConfigState((prev) => {
      const current = slug in prev ? prev[slug] : !!reports[slug]?.protected;
      return { ...prev, [slug]: !current };
    });
  };

  const toggleGlobal = () => {
    setProtectionConfigState((prev) => ({
      ...prev,
      _global_enabled: prev._global_enabled === false ? true : false,
    }));
  };

  const saveAll = () => {
    setProtectionConfig(protectionConfig);
    setTotpMinutes(totpMin);
    setAccentColor(accent);
    setBifrostFont(font);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetProtection = () => {
    const fresh: ProtectionConfig = {};
    setProtectionConfigState(fresh);
    setProtectionConfig(fresh);
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isSlugProtected = (slug: string): boolean => {
    if (slug in protectionConfig && typeof protectionConfig[slug] === "boolean") return protectionConfig[slug] as boolean;
    return !!reports[slug]?.protected;
  };

  const secret = import.meta.env.VITE_TOTP_SECRET || "";
  const maskedSecret = secret ? secret.slice(0, 4) + "***" : "NO CONFIGURADO";

  // Not authed → redirect silently or show login
  if (!authed) {
    // If no bifrost key and no session, redirect
    if (!bifrostKey && !password) {
      // Still show login so the error message is visible
    }

    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", fontFamily: "'JetBrains Mono', monospace" }}>
        <form onSubmit={handleLogin} style={{ background: "#111", border: "1px solid #00ff41", borderRadius: 8, padding: "48px 40px", maxWidth: 420, width: "100%", textAlign: "center", boxShadow: "0 0 30px rgba(0,255,65,0.08)" }}>
          <div style={{ width: 48, height: 48, margin: "0 auto 20px", border: "2px solid #00ff41", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#00ff41", fontSize: 22, boxShadow: "0 0 16px rgba(0,255,65,0.3)" }}>
            🌉
          </div>
          <h2 style={{ color: "#00ff41", fontSize: 18, letterSpacing: 2, marginBottom: 8, textShadow: "0 0 8px rgba(0,255,65,0.4)" }}>
            // BIFROST
          </h2>
          <p style={{ color: "#555", fontSize: 12, marginBottom: 28 }}>Contraseña maestra requerida</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            disabled={lockoutUntil > Date.now()}
            style={{ ...inputStyle, width: "100%", textAlign: "center", fontSize: 18, letterSpacing: 6, marginBottom: 4 }}
          />

          {loginError && (
            <p style={{ color: loginError.includes("BLOQUEADO") ? "#ffaa00" : loginError.includes("BIFROST") ? "#ffaa00" : "#ff4444", fontSize: 11, marginTop: 12, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {loginError}
            </p>
          )}

          <button type="submit" disabled={lockoutUntil > Date.now()} style={{ ...btnStyle, width: "100%", marginTop: 20, opacity: lockoutUntil > Date.now() ? 0.4 : 1 }}>
            ACCEDER →
          </button>
        </form>
      </div>
    );
  }

  // Authenticated panel
  const sortedSlugs = Object.keys(reports).sort((a, b) => {
    const sa = reports[a].section;
    const sb = reports[b].section;
    if (sa !== sb) return sa.localeCompare(sb);
    return a.localeCompare(b);
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#00ff41", fontFamily: "'JetBrains Mono', monospace", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, borderBottom: "1px solid #1a1a1a", paddingBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 20, letterSpacing: 3, textShadow: "0 0 8px rgba(0,255,65,0.4)", margin: 0 }}>// BIFROST CONTROL PANEL</h1>
          <p style={{ color: "#555", fontSize: 11, marginTop: 4 }}>Panel de administración HEINDALL</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#555" }}>Sesión: <span style={{ color: "#00ff41" }}>{formatTime(adminRemaining)}</span></span>
          <button onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); navigate("/"); }} style={{ ...btnStyle, fontSize: 11, padding: "6px 12px", color: "#ff4444", borderColor: "#ff4444" }}>
            CERRAR SESIÓN
          </button>
        </div>
      </div>

      {/* SECTION 1: Protection Management */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: "#555", fontSize: 12, marginBottom: 16, letterSpacing: 2 }}>// ──────── SECCIÓN 1: GESTIÓN DE PROTECCIONES ────────</p>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button onClick={saveAll} style={{ ...btnStyle, fontSize: 11 }}>
            {saved ? "✓ GUARDADO" : "GUARDAR CAMBIOS"}
          </button>
          <button onClick={resetProtection} style={{ ...btnStyle, fontSize: 11, color: "#ffaa00", borderColor: "#ffaa00" }}>
            RESETEAR TODO
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#555" }}>SLUG</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#555" }}>TÍTULO</th>
                <th style={{ textAlign: "left", padding: "8px 12px", color: "#555" }}>PLATAFORMA</th>
                <th style={{ textAlign: "center", padding: "8px 12px", color: "#555" }}>PROTEGIDO</th>
                <th style={{ textAlign: "center", padding: "8px 12px", color: "#555" }}>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {sortedSlugs.map((slug) => {
                const r = reports[slug];
                const prot = isSlugProtected(slug);
                return (
                  <tr key={slug} style={{ borderBottom: "1px solid #111" }}>
                    <td style={{ padding: "8px 12px", color: "#888", fontSize: 11 }}>{slug}</td>
                    <td style={{ padding: "8px 12px" }}>{r.title}</td>
                    <td style={{ padding: "8px 12px", color: "#888" }}>{sectionLabel[r.section] || r.section}</td>
                    <td style={{ textAlign: "center", padding: "8px 12px" }}>
                      <button
                        onClick={() => toggleProtection(slug)}
                        style={{
                          width: 44, height: 22, borderRadius: 11, border: "none",
                          background: prot ? "#00ff41" : "#333", cursor: "pointer",
                          position: "relative", transition: "background 0.2s",
                        }}
                      >
                        <div style={{
                          width: 16, height: 16, borderRadius: "50%", background: "#0a0a0a",
                          position: "absolute", top: 3,
                          left: prot ? 24 : 4, transition: "left 0.2s",
                        }} />
                      </button>
                    </td>
                    <td style={{ textAlign: "center", padding: "8px 12px" }}>
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 3,
                        background: prot ? "rgba(0,255,65,0.1)" : "rgba(255,255,255,0.05)",
                        color: prot ? "#00ff41" : "#555", border: `1px solid ${prot ? "#00ff4133" : "#222"}`,
                      }}>
                        {prot ? "PROTEGIDO" : "ABIERTO"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: TOTP Config */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: "#555", fontSize: 12, marginBottom: 16, letterSpacing: 2 }}>// ──────── SECCIÓN 2: CONFIGURACIÓN TOTP ────────</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 500 }}>
          <div>
            <label style={{ color: "#555", fontSize: 11, display: "block", marginBottom: 4 }}>SECRET TOTP (enmascarado)</label>
            <div style={{ ...inputStyle, color: "#888", cursor: "default" }}>{maskedSecret}</div>
          </div>

          <div>
            <label style={{ color: "#555", fontSize: 11, display: "block", marginBottom: 4 }}>DURACIÓN SESIÓN TOTP (minutos)</label>
            <input
              type="number"
              min={1}
              max={120}
              value={totpMin}
              onChange={(e) => setTotpMin(Math.max(1, Math.min(120, parseInt(e.target.value) || 10)))}
              style={{ ...inputStyle, width: 120 }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ color: "#555", fontSize: 11 }}>PROTECCIONES GLOBALES</label>
            <button
              onClick={toggleGlobal}
              style={{
                width: 44, height: 22, borderRadius: 11, border: "none",
                background: protectionConfig._global_enabled !== false ? "#00ff41" : "#ff4444",
                cursor: "pointer", position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: "50%", background: "#0a0a0a",
                position: "absolute", top: 3,
                left: protectionConfig._global_enabled !== false ? 24 : 4,
                transition: "left 0.2s",
              }} />
            </button>
            <span style={{ fontSize: 10, color: protectionConfig._global_enabled !== false ? "#00ff41" : "#ff4444" }}>
              {protectionConfig._global_enabled !== false ? "ACTIVO" : "DESACTIVADO"}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Aesthetics */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: "#555", fontSize: 12, marginBottom: 16, letterSpacing: 2 }}>// ──────── SECCIÓN 3: CONFIGURACIÓN ESTÉTICA ────────</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 500 }}>
          <div>
            <label style={{ color: "#555", fontSize: 11, display: "block", marginBottom: 4 }}>COLOR DE ACENTO</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} style={{ width: 40, height: 32, border: "1px solid #333", borderRadius: 4, background: "transparent", cursor: "pointer" }} />
              <span style={{ fontSize: 12, color: "#888" }}>{accent}</span>
            </div>
          </div>

          <div>
            <label style={{ color: "#555", fontSize: 11, display: "block", marginBottom: 4 }}>FUENTE DE TÍTULOS</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Orbitron", "Share Tech Mono", "VT323"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFont(f)}
                  style={{
                    ...btnStyle,
                    fontSize: 11,
                    padding: "6px 14px",
                    fontFamily: f,
                    background: font === f ? "rgba(0,255,65,0.15)" : "transparent",
                    borderColor: font === f ? "#00ff41" : "#333",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Access Logs */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: "#555", fontSize: 12, marginBottom: 16, letterSpacing: 2 }}>// ──────── SECCIÓN 4: LOGS DE ACCESO ────────</p>

        {logs.length === 0 ? (
          <p style={{ color: "#333", fontSize: 12 }}>Sin registros de acceso en esta sesión.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, maxWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #222" }}>
                <th style={{ textAlign: "left", padding: "6px 12px", color: "#555" }}>TIMESTAMP</th>
                <th style={{ textAlign: "left", padding: "6px 12px", color: "#555" }}>WRITE-UP</th>
                <th style={{ textAlign: "center", padding: "6px 12px", color: "#555" }}>RESULTADO</th>
              </tr>
            </thead>
            <tbody>
              {[...logs].reverse().map((log, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "6px 12px", color: "#888" }}>{log.timestamp}</td>
                  <td style={{ padding: "6px 12px" }}>{log.slug}</td>
                  <td style={{ textAlign: "center", padding: "6px 12px" }}>
                    <span style={{ fontSize: 10, color: log.result === "GRANTED" ? "#00ff41" : "#ff4444" }}>
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer save bar */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16, display: "flex", gap: 12 }}>
        <button onClick={saveAll} style={btnStyle}>
          {saved ? "✓ CAMBIOS GUARDADOS" : "💾 GUARDAR TODO"}
        </button>
        <button onClick={() => navigate("/")} style={{ ...btnStyle, color: "#555", borderColor: "#333" }}>
          ← VOLVER AL SITIO
        </button>
      </div>
    </div>
  );
};

export default Bifrost;
