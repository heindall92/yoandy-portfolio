import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Persistent DB-backed rate limiting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceRoleKey);

    const { data: allowed, error: rlError } = await sb.rpc("check_rate_limit", {
      p_ip: clientIP,
      p_function: "verify-report-password",
      p_max_attempts: 3,
      p_window_seconds: 300,
    });

    if (rlError) {
      console.error("Rate limit DB error:", rlError);
    }

    if (allowed === false) {
      return new Response(
        JSON.stringify({ error: "Demasiados intentos. Espera 5 minutos." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const password = body?.password;

    if (!password || typeof password !== "string" || password.length > 200) {
      return new Response(
        JSON.stringify({ error: "Password required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const correctPassword = Deno.env.get("REPORT_ACCESS_PASSWORD");

    if (password === correctPassword) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Contraseña incorrecta" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
