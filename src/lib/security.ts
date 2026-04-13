/**
 * Security utilities — input sanitization and XSS prevention
 */

// Strip HTML tags and dangerous characters from user input
export function sanitizeInput(input: string, maxLength = 200): string {
  return input
    .slice(0, maxLength)
    .replace(/[<>'"&\\]/g, "") // strip HTML/script injection chars
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

// Sanitize search queries — allows alphanumeric, spaces, hyphens, dots
export function sanitizeSearch(query: string, maxLength = 100): string {
  return query
    .slice(0, maxLength)
    .replace(/[^\w\sáéíóúñü.\-]/gi, "")
    .trim();
}

// Validate that a string is a safe slug (alphanumeric + hyphens)
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 100;
}

// Encode output for safe HTML rendering
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (c) => map[c] || c);
}
