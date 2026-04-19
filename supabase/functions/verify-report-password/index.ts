import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { buildCorsHeaders } from "../_shared/cors.ts";

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
        function_name: "verify-report-password",
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
      p_function: "verify-report-password",
      p_max_attempts: 3,
      p_window_seconds: 300,
    });

    if (rlError) console.error("Rate limit DB error:", rlError);

    if (allowed === false) {
      await audit("rate_limited");
      return new Response(
        JSON.stringify({ error: "Demasiados intentos. Espera 5 minutos." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const password = body?.password;

    if (!password || typeof password !== "string" || password.length > 200) {
      await audit("error", "invalid password input");
      return new Response(
        JSON.stringify({ error: "Password required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const correctPassword = Deno.env.get("REPORT_ACCESS_PASSWORD");

    if (correctPassword && password === correctPassword) {
      await audit("granted");
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await audit("denied");
    return new Response(
      JSON.stringify({ error: "Contraseña incorrecta" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    await audit("error", "exception");
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
