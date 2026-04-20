-- Allow public (anon) read access to protection status so the gate works for visitors
CREATE POLICY "Public can read protection overrides"
ON public.writeup_protection_overrides
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read security settings"
ON public.writeup_security_settings
FOR SELECT
TO anon, authenticated
USING (true);