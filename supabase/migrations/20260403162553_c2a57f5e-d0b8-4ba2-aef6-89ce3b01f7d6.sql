-- Remove the current SELECT policy
DROP POLICY IF EXISTS "Users can only check own email" ON public.allowed_emails;

-- Deny all direct SELECT - use is_email_allowed() RPC instead
CREATE POLICY "No direct read access"
  ON public.allowed_emails
  FOR SELECT
  TO authenticated
  USING (false);