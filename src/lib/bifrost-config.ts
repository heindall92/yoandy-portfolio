// Bifrost configuration helpers — all localStorage-based

const PROTECTION_KEY = "bifrost_protection_config";
const TOTP_MINUTES_KEY = "bifrost_totp_minutes";
const ACCENT_KEY = "bifrost_accent_color";
const FONT_KEY = "bifrost_font";

export interface ProtectionConfig {
  _global_enabled?: boolean;
  [slug: string]: boolean | undefined;
}

export function getProtectionConfig(): ProtectionConfig {
  try {
    const raw = localStorage.getItem(PROTECTION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setProtectionConfig(config: ProtectionConfig) {
  localStorage.setItem(PROTECTION_KEY, JSON.stringify(config));
}

export function isWriteupProtected(slug: string, hardcodedProtected: boolean): boolean {
  const config = getProtectionConfig();
  // Global kill switch
  if (config._global_enabled === false) return false;
  // Per-slug override
  if (slug in config && typeof config[slug] === "boolean") return config[slug] as boolean;
  return hardcodedProtected;
}

export function getTotpMinutes(): number {
  try {
    const raw = localStorage.getItem(TOTP_MINUTES_KEY);
    if (raw) {
      const n = parseInt(raw, 10);
      if (n > 0 && n <= 120) return n;
    }
  } catch {}
  return 10;
}

export function setTotpMinutes(minutes: number) {
  localStorage.setItem(TOTP_MINUTES_KEY, String(minutes));
}

export function getAccentColor(): string {
  return localStorage.getItem(ACCENT_KEY) || "#00ff41";
}

export function setAccentColor(color: string) {
  localStorage.setItem(ACCENT_KEY, color);
}

export function getBifrostFont(): string {
  return localStorage.getItem(FONT_KEY) || "Orbitron";
}

export function setBifrostFont(font: string) {
  localStorage.setItem(FONT_KEY, font);
}

// Access log (in-memory, exposed globally)
export interface AccessLogEntry {
  timestamp: string;
  slug: string;
  result: "GRANTED" | "DENIED";
}

declare global {
  interface Window {
    bifrostAccessLog?: AccessLogEntry[];
  }
}

export function logAccess(slug: string, result: "GRANTED" | "DENIED") {
  if (!window.bifrostAccessLog) window.bifrostAccessLog = [];
  window.bifrostAccessLog.push({
    timestamp: new Date().toLocaleString("es-ES"),
    slug,
    result,
  });
}

export function getAccessLog(): AccessLogEntry[] {
  return window.bifrostAccessLog || [];
}
