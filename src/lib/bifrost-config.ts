import { supabase } from "@/integrations/supabase/client";

// Bifrost configuration helpers — localStorage for UI prefs/logs, backend for protection rules

const PROTECTION_KEY = "bifrost_protection_config";
const TOTP_MINUTES_KEY = "bifrost_totp_minutes";
const ACCENT_KEY = "bifrost_accent_color";
const FONT_KEY = "bifrost_font";

export interface ProtectionConfig {
  _global_enabled?: boolean;
  [slug: string]: boolean | undefined;
}

export interface RemoteWriteupSecurityConfig {
  globalEnabled: boolean;
  sessionMinutes: number;
  overrides: Record<string, boolean>;
}

interface WriteupSecuritySettingsRow {
  global_enabled: boolean;
  session_minutes: number;
}

interface WriteupProtectionOverrideRow {
  slug: string;
  is_protected: boolean;
}

const DEFAULT_REMOTE_WRITEUP_SECURITY: RemoteWriteupSecurityConfig = {
  globalEnabled: true,
  sessionMinutes: 10,
  overrides: {},
};

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

export function resolveWriteupProtection(
  slug: string,
  hardcodedProtected: boolean,
  config: RemoteWriteupSecurityConfig,
): boolean {
  if (config.globalEnabled === false) return false;
  if (slug in config.overrides) return config.overrides[slug];
  return hardcodedProtected;
}

// Public-facing: resolve protection for a single slug via SECURITY DEFINER RPC.
// Falls back to defaults if the request fails (e.g., anon user without DB access).
export async function getRemoteWriteupSecurityConfig(slug?: string): Promise<RemoteWriteupSecurityConfig> {
  // Admin path: if the user is authenticated and allowed, the SELECT policies will let
  // them read the full tables. Otherwise we use the public RPC for a single slug.
  const settingsTable = supabase.from("writeup_security_settings" as never) as any;
  const overridesTable = supabase.from("writeup_protection_overrides" as never) as any;

  const [settingsRes, overridesRes] = await Promise.all([
    settingsTable.select("global_enabled, session_minutes").limit(1).maybeSingle(),
    overridesTable.select("slug, is_protected"),
  ]);

  const adminVisible =
    !settingsRes.error && !overridesRes.error && (settingsRes.data || (overridesRes.data?.length ?? 0) >= 0);

  if (adminVisible && (settingsRes.data || overridesRes.data)) {
    const securitySettings = (settingsRes.data as WriteupSecuritySettingsRow | null) ?? null;
    const protectionOverrides = ((overridesRes.data as WriteupProtectionOverrideRow[] | null) ?? []).reduce<
      Record<string, boolean>
    >((acc, entry) => {
      acc[entry.slug] = entry.is_protected;
      return acc;
    }, {});
    return {
      globalEnabled: securitySettings?.global_enabled ?? DEFAULT_REMOTE_WRITEUP_SECURITY.globalEnabled,
      sessionMinutes: securitySettings?.session_minutes ?? DEFAULT_REMOTE_WRITEUP_SECURITY.sessionMinutes,
      overrides: protectionOverrides,
    };
  }

  // Anonymous path: use the SECURITY DEFINER RPC scoped to a single slug.
  if (slug) {
    const { data, error } = await (supabase.rpc as any)("get_writeup_protection_status", { p_slug: slug });
    if (!error && Array.isArray(data) && data.length > 0) {
      const row = data[0] as { is_protected: boolean; session_minutes: number; global_enabled: boolean };
      return {
        globalEnabled: row.global_enabled,
        sessionMinutes: row.session_minutes,
        overrides: { [slug]: row.is_protected },
      };
    }
  }

  return { ...DEFAULT_REMOTE_WRITEUP_SECURITY };
}

export async function saveRemoteWriteupSecurityConfig(config: ProtectionConfig, sessionMinutes: number) {
  const settingsTable = supabase.from("writeup_security_settings" as never) as any;
  const overridesTable = supabase.from("writeup_protection_overrides" as never) as any;

  const { error: settingsError } = await settingsTable.upsert(
    {
      singleton: true,
      global_enabled: config._global_enabled !== false,
      session_minutes: sessionMinutes,
    },
    { onConflict: "singleton" },
  );

  if (settingsError) throw settingsError;

  const { error: clearOverridesError } = await overridesTable.delete().neq("slug", "");
  if (clearOverridesError) throw clearOverridesError;

  const overrideRows = Object.entries(config)
    .filter(([slug, value]) => slug !== "_global_enabled" && typeof value === "boolean")
    .map(([slug, value]) => ({ slug, is_protected: value }));

  if (overrideRows.length > 0) {
    const { error: overridesError } = await overridesTable.upsert(overrideRows, { onConflict: "slug" });
    if (overridesError) throw overridesError;
  }

  setProtectionConfig(config);
  setTotpMinutes(sessionMinutes);
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
