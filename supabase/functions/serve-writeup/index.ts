import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { buildCorsHeaders } from "../_shared/cors.ts";
import { PROTECTED_REPORTS } from "./_data.ts";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

Deno.serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceRoleKey);

  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent")?.slice(0, 200) || "unknown";

  const audit = async (result: string, detail?: string) => {
    try {
      await sb.from("access_audit_log").insert({
        function_name: "serve-writeup",
        client_ip: clientIP,
        user_agent: userAgent,
        result,
        detail: detail?.slice(0, 500) ?? null,
      });
    } catch (e) {
      console.error("audit insert failed:", e);
    }
  };

  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const { data: allowed } = await sb.rpc("check_rate_limit", {
      p_ip: clientIP,
      p_function: "serve-writeup",
      p_max_attempts: 8,
      p_window_seconds: 300,
    });
    if (allowed === false) {
      await audit("rate_limited");
      return json(200, { ok: false, error: "Demasiados intentos. Espera 5 minutos.", rateLimited: true });
    }

    const body = await req.json().catch(() => ({}));
    const slug = typeof body?.slug === "string" ? body.slug : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!/^[a-z0-9-]{1,64}$/.test(slug)) {
      await audit("error", "invalid slug");
      return json(200, { ok: false, error: "Slug inválido" });
    }
    if (password.length === 0 || password.length > 200) {
      await audit("error", "invalid password");
      return json(200, { ok: false, error: "Contraseña requerida" });
    }

    const entry = PROTECTED_REPORTS[slug];
    if (!entry) {
      await audit("error", `unknown slug ${slug}`);
      return json(200, { ok: false, error: "Writeup no encontrado" });
    }

    const expected = Deno.env.get("GLOBAL_ACCESS_PASSWORD");
    if (!expected) {
      await audit("error", "secret not configured");
      return json(200, { ok: false, error: "Error de configuración del servidor" });
    }

    const valid = timingSafeEqual(password, expected);
    if (!valid) {
      await audit("denied", `slug=${slug}`);
      return json(200, { ok: false, error: "Contraseña incorrecta" });
    }

    await audit("granted", `slug=${slug}`);
    return json(200, { ok: true, title: entry.title, html: entry.html });
  } catch (err) {
    console.error("serve-writeup error:", err);
    await audit("error", String(err).slice(0, 200));
    return json(200, { ok: false, error: "No se pudo cargar el writeup" });
  }
});