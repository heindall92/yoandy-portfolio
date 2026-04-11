CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.writeup_security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton BOOLEAN NOT NULL DEFAULT true,
  global_enabled BOOLEAN NOT NULL DEFAULT true,
  session_minutes INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT writeup_security_settings_singleton_unique UNIQUE (singleton)
);

CREATE TABLE IF NOT EXISTS public.writeup_protection_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  is_protected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.validate_writeup_security_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.session_minutes < 1 OR NEW.session_minutes > 120 THEN
    RAISE EXCEPTION 'session_minutes must be between 1 and 120';
  END IF;

  IF NEW.singleton IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'writeup_security_settings only supports a single row';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_writeup_security_settings_trigger ON public.writeup_security_settings;
CREATE TRIGGER validate_writeup_security_settings_trigger
BEFORE INSERT OR UPDATE ON public.writeup_security_settings
FOR EACH ROW
EXECUTE FUNCTION public.validate_writeup_security_settings();

DROP TRIGGER IF EXISTS set_writeup_security_settings_updated_at ON public.writeup_security_settings;
CREATE TRIGGER set_writeup_security_settings_updated_at
BEFORE UPDATE ON public.writeup_security_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_writeup_protection_overrides_updated_at ON public.writeup_protection_overrides;
CREATE TRIGGER set_writeup_protection_overrides_updated_at
BEFORE UPDATE ON public.writeup_protection_overrides
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

INSERT INTO public.writeup_security_settings (singleton, global_enabled, session_minutes)
VALUES (true, true, 10)
ON CONFLICT (singleton) DO NOTHING;

ALTER TABLE public.writeup_security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writeup_protection_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view writeup security settings" ON public.writeup_security_settings;
CREATE POLICY "Anyone can view writeup security settings"
ON public.writeup_security_settings
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone can view writeup protection overrides" ON public.writeup_protection_overrides;
CREATE POLICY "Anyone can view writeup protection overrides"
ON public.writeup_protection_overrides
FOR SELECT
USING (true);