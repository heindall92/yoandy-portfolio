-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can check allowed emails" ON public.allowed_emails;

-- Create a restrictive policy: users can only see their own email row
CREATE POLICY "Users can only check own email"
  ON public.allowed_emails
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(auth.email()));