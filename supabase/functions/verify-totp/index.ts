import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { buildCorsHeaders } from "../_shared/cors.ts";

// TOTP validation entirely server-side — secret never reaches the browser

function base32Decode(encoded: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const cleaned = encoded.replace(/[\s=]+/g, "").toUpperCase();
  let bits = "";
  for (const ch of cleaned) {
    const val = alphabet.indexOf(ch);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  }
  return bytes;
}

async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return new Uint8Array(sig);
}

async function generateTOTP(secret: string, timeStep: number): Promise<string> {
  const key = base32Decode(secret);
  const time = Math.floor(Date.now() / 1000 / 30) + timeStep;
  const buffer = new Uint8Array(8);
  const view = new DataView(buffer.buffer);
  view.setUint32(4, time, false);

  const hash = await hmacSha1(key, buffer);

  const offset = hash[hash.length - 1] & 0x0f;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, "0");
}

async function verifyTOTP(token: string, secret: string, window = 1): Promise<boolean> {
  for (let i = -window; i <= window; i++) {
    if (await generateTOTP(secret, i) === token) return true;
  }
  return false;
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceRoleKey);

  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent")?.slice(0, 200) || "unknown";

  const audit = async (result: "granted" | "denied" | "rate_limited" | "error", detail?: string) => {
    try {
      await sb.from("access_audit_log").insert({
        function_name: "verify-totp",
        client_ip: clientIP,
        user_agent: userAgent,
        result,
        detail: detail?.slice(0, 500) ?? null,
      });
    } catch (e) {
      console.error("audit insert failed:", e);
    }
  };

  try {
    const { data: allowed, error: rlError } = await sb.rpc("check_rate_limit", {
      p_ip: clientIP,
      p_function: "verify-totp",
      p_max_attempts: 3,
      p_window_seconds: 300,
    });

    if (rlError) console.error("Rate limit DB error:", rlError);

    if (allowed === false) {
      await audit("rate_limited");
      return new Response(
        JSON.stringify({ valid: false, error: "Demasiados intentos. Espera 5 minutos." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const token = body?.token;
    const type = body?.type || "writeup";

    if (!token || typeof token !== "string" || !/^\d{6}$/.test(token)) {
      await audit("error", "invalid token format");
      return new Response(
        JSON.stringify({ valid: false, error: "Código debe ser 6 dígitos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (type !== "writeup" && type !== "bifrost") {
      await audit("error", "invalid type");
      return new Response(
        JSON.stringify({ valid: false, error: "Tipo inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const secretName = type === "bifrost" ? "BIFROST_TOTP_SECRET" : "TOTP_SECRET";
    const secret = Deno.env.get(secretName);
    if (!secret) {
      console.error(`${secretName} not configured`);
      await audit("error", "secret not configured");
      return new Response(
        JSON.stringify({ valid: false, error: "Error de configuración del servidor" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const valid = await verifyTOTP(token, secret);
    await audit(valid ? "granted" : "denied", `type=${type}`);

    return new Response(
      JSON.stringify({ valid }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("verify-totp error:", err);
    await audit("error", String(err).slice(0, 200));
    return new Response(
      JSON.stringify({ valid: false, error: "Solicitud inválida" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
