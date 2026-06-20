// Shared CORS helper — restricts origin to authorized hosts
const ALLOWED_ORIGIN_PATTERNS: RegExp[] = [
  /^https:\/\/yoandy-portfolio\.lovable\.app$/,
  /^https:\/\/(www\.)?yoandyramirez\.com$/,
  /^https:\/\/[a-z0-9-]+\.lovable\.app$/, // preview/staging subdomains
  /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/,
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
];

const BASE_HEADERS = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin",
};

export function buildCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin") ?? "";
  const isAllowed = ALLOWED_ORIGIN_PATTERNS.some((re) => re.test(origin));
  return {
    ...BASE_HEADERS,
    "Access-Control-Allow-Origin": isAllowed ? origin : "null",
  };
}
