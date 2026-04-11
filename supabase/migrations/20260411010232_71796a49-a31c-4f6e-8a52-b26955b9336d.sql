DROP POLICY IF EXISTS "Allowed admins can manage writeup security settings" ON public.writeup_security_settings;
CREATE POLICY "Allowed admins can manage writeup security settings"
ON public.writeup_security_settings
FOR ALL
TO authenticated
USING (public.is_email_allowed(lower(auth.jwt() ->> 'email')))
WITH CHECK (public.is_email_allowed(lower(auth.jwt() ->> 'email')));

DROP POLICY IF EXISTS "Allowed admins can manage writeup protection overrides" ON public.writeup_protection_overrides;
CREATE POLICY "Allowed admins can manage writeup protection overrides"
ON public.writeup_protection_overrides
FOR ALL
TO authenticated
USING (public.is_email_allowed(lower(auth.jwt() ->> 'email')))
WITH CHECK (public.is_email_allowed(lower(auth.jwt() ->> 'email')));