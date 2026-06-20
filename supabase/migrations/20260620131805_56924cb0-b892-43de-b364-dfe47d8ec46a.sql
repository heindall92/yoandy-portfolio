-- 1) is_email_allowed: used by RLS policies (definer); no need for direct client access
REVOKE ALL ON FUNCTION public.is_email_allowed(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_email_allowed(text) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_email_allowed(text) TO service_role;

-- 2) check_rate_limit: called from edge functions with service role only
REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO service_role;

-- 3) cleanup_rate_limits: backend only
REVOKE ALL ON FUNCTION public.cleanup_rate_limits(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_rate_limits(integer) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_rate_limits(integer) TO service_role;

-- 4) rate_limit_attempts: explicit deny-all policies to silence RLS-no-policy linter
--    (table is only ever touched by SECURITY DEFINER functions; clients must never read/write it)
CREATE POLICY "Deny all direct access to rate_limit_attempts"
ON public.rate_limit_attempts
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);