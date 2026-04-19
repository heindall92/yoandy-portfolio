
-- 1) Restringir lectura pública de writeup_security_settings y _overrides
DROP POLICY IF EXISTS "Anyone can view writeup security settings" ON public.writeup_security_settings;
DROP POLICY IF EXISTS "Anyone can view writeup protection overrides" ON public.writeup_protection_overrides;

-- 2) Exponer la configuración pública necesaria mediante una función SECURITY DEFINER
--    Devuelve solo si un slug está protegido y los minutos de sesión globales.
CREATE OR REPLACE FUNCTION public.get_writeup_protection_status(p_slug text)
RETURNS TABLE(is_protected boolean, session_minutes integer, global_enabled boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(
      (SELECT o.is_protected FROM public.writeup_protection_overrides o WHERE o.slug = p_slug LIMIT 1),
      false
    ) AS is_protected,
    COALESCE(
      (SELECT s.session_minutes FROM public.writeup_security_settings s WHERE s.singleton = true LIMIT 1),
      10
    ) AS session_minutes,
    COALESCE(
      (SELECT s.global_enabled FROM public.writeup_security_settings s WHERE s.singleton = true LIMIT 1),
      true
    ) AS global_enabled;
$$;

REVOKE ALL ON FUNCTION public.get_writeup_protection_status(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_writeup_protection_status(text) TO anon, authenticated;

-- 3) Permitir que los admins permitidos vean toda la configuración (panel Bifrost)
CREATE POLICY "Admins can view writeup security settings"
ON public.writeup_security_settings
FOR SELECT
TO authenticated
USING (public.is_email_allowed(lower((auth.jwt() ->> 'email'::text))));

CREATE POLICY "Admins can view writeup protection overrides"
ON public.writeup_protection_overrides
FOR SELECT
TO authenticated
USING (public.is_email_allowed(lower((auth.jwt() ->> 'email'::text))));

-- 4) Tabla de auditoría server-side para intentos TOTP / acceso a writeups
CREATE TABLE IF NOT EXISTS public.access_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  function_name text NOT NULL,
  client_ip text,
  user_agent text,
  result text NOT NULL CHECK (result IN ('granted','denied','rate_limited','error')),
  detail text
);

ALTER TABLE public.access_audit_log ENABLE ROW LEVEL SECURITY;

-- Solo admins permitidos pueden leer el log
CREATE POLICY "Admins can read audit log"
ON public.access_audit_log
FOR SELECT
TO authenticated
USING (public.is_email_allowed(lower((auth.jwt() ->> 'email'::text))));

-- Nadie puede insertar/modificar desde el cliente (las edge functions usan service role y bypass RLS)
-- No se crean políticas de INSERT/UPDATE/DELETE intencionalmente.

CREATE INDEX IF NOT EXISTS idx_access_audit_log_created_at ON public.access_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_audit_log_function ON public.access_audit_log (function_name, created_at DESC);

-- 5) Hardening: revocar EXECUTE público de cleanup_rate_limits
REVOKE ALL ON FUNCTION public.cleanup_rate_limits(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_rate_limits(integer) FROM anon, authenticated;
-- service_role conserva acceso por defecto

-- 6) Documentar que rate_limit_attempts solo se accede vía función SECURITY DEFINER
COMMENT ON TABLE public.rate_limit_attempts IS 'Acceso únicamente vía check_rate_limit() / cleanup_rate_limits() SECURITY DEFINER. RLS habilitada sin políticas a propósito.';

-- 7) Constraint de unicidad faltante para que ON CONFLICT funcione en check_rate_limit
CREATE UNIQUE INDEX IF NOT EXISTS uq_rate_limit_ip_function
  ON public.rate_limit_attempts (client_ip, function_name);
