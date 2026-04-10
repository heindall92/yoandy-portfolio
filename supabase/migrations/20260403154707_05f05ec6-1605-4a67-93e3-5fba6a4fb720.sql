CREATE TABLE public.allowed_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  note TEXT
);

ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can check allowed emails"
  ON public.allowed_emails
  FOR SELECT
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.is_email_allowed(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.allowed_emails WHERE email = lower(check_email)
  );
$$;