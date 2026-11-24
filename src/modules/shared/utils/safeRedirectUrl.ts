const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

/**
 * Resolves a redirect target coming from tenant data (theme, page modules,
 * preview messages) into something safe to assign to `window.location`.
 *
 * - Same-origin paths (`/wallet`, `/auth/signIn?x=1`) are returned as is.
 * - Absolute URLs are accepted only with the http or https scheme.
 * - Anything else (`javascript:`, `data:`, `vbscript:`, malformed values,
 *   empty strings) returns `null`, so the caller simply does not redirect.
 */
export function getSafeRedirectUrl(
  input: string | null | undefined,
  origin: string
): string | null {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (!value) return null;

  // Relative path on the current origin ("//host" is protocol-relative, not a path).
  if (value.startsWith('/') && !value.startsWith('//')) return value;

  try {
    const url = new URL(value, origin);
    if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
    return url.href;
  } catch {
    return null;
  }
}
