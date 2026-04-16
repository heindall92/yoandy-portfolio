-- Table to persist rate limit attempts across serverless invocations
CREATE TABLE public.rate_limit_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_ip text NOT NULL,
  function_name text NOT NULL,
  attempt_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint so we have one row per ip+function
CREATE UNIQUE INDEX idx_rate_limit_ip_func ON public.rate_limit_attempts (client_ip, function_name);

-- Index for cleanup
CREATE INDEX idx_rate_limit_window ON public.rate_limit_attempts (window_start);

-- Enable RLS but block all public access (only service role / security definer can touch it)
ALTER TABLE public.rate_limit_attempts ENABLE ROW LEVEL SECURITY;

-- No RLS policies = no access from client SDK (only service_role or SECURITY DEFINER functions)

-- Function: atomically check and increment rate limit, returns whether the request is allowed
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_ip text,
  p_function text,
  p_max_attempts integer DEFAULT 3,
  p_window_seconds integer DEFAULT 300
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_window_start timestamptz;
BEGIN
  -- Try to get existing record
  SELECT attempt_count, window_start INTO v_count, v_window_start
  FROM rate_limit_attempts
  WHERE client_ip = p_ip AND function_name = p_function
  FOR UPDATE;

  IF FOUND THEN
    -- Check if window has expired
    IF now() > v_window_start + (p_window_seconds || ' seconds')::interval THEN
      -- Reset window
      UPDATE rate_limit_attempts
      SET attempt_count = 1, window_start = now()
      WHERE client_ip = p_ip AND function_name = p_function;
      RETURN true;
    END IF;

    -- Window still active
    IF v_count >= p_max_attempts THEN
      RETURN false; -- blocked
    END IF;

    -- Increment
    UPDATE rate_limit_attempts
    SET attempt_count = attempt_count + 1
    WHERE client_ip = p_ip AND function_name = p_function;
    RETURN true;
  ELSE
    -- First attempt: insert new record
    INSERT INTO rate_limit_attempts (client_ip, function_name, attempt_count, window_start)
    VALUES (p_ip, p_function, 1, now())
    ON CONFLICT (client_ip, function_name) DO UPDATE
    SET attempt_count = 1, window_start = now();
    RETURN true;
  END IF;
END;
$$;

-- Cleanup function: remove old entries (can be called periodically)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits(p_older_than_minutes integer DEFAULT 30)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM rate_limit_attempts
  WHERE window_start < now() - (p_older_than_minutes || ' minutes')::interval;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;