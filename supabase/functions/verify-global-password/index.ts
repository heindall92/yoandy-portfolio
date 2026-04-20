import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { buildCorsHeaders } from "../_shared/cors.ts";

// Constant-time string comparison to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
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
        function_name: "verify-global-password",
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
      p_function: "verify-global-password",
      p_max_attempts: 5,
      p_window_seconds: 300,
    });

    if (rlError) console.error("Rate limit DB error:", rlError);

    if (allowed === false) {
      await audit("rate_limited");
      return new Response(
        JSON.stringify({ valid: false, error: "Demasiados intentos. Espera 5 minutos.", rateLimited: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const password = body?.password;
    const type = body?.type || "writeup";

    if (!password || typeof password !== "string" || password.length > 200) {
      await audit("error", "invalid password format");
      return new Response(
        JSON.stringify({ valid: false, error: "Contraseña requerida" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (type !== "writeup" && type !== "bifrost") {
      await audit("error", "invalid type");
      return new Response(
        JSON.stringify({ valid: false, error: "Tipo inválido" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const expected = Deno.env.get("GLOBAL_ACCESS_PASSWORD");
    if (!expected) {
      console.error("GLOBAL_ACCESS_PASSWORD not configured");
      await audit("error", "secret not configured");
      return new Response(
        JSON.stringify({ valid: false, error: "Error de configuración del servidor" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const valid = timingSafeEqual(password, expected);
    await audit(valid ? "granted" : "denied", `type=${type}`);

    return new Response(
      JSON.stringify({ valid, error: valid ? undefined : "Contraseña incorrecta" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("verify-global-password error:", err);
    await audit("error", String(err).slice(0, 200));
    return new Response(
      JSON.stringify({ valid: false, error: "No se pudo verificar la contraseña" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
