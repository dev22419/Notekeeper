/** What a sign-in link (or Google) sent back in the URL. */
export interface AuthCallback {
  /** PKCE code to exchange for a session. */
  code?: string;
  /** Set when Supabase refused the link, e.g. `otp_expired`. */
  error?: string;
}

const PARAMS = ["code", "error", "error_code", "error_description"];

/**
 * Finds sign-in parameters in a URL and returns them with the URL minus them,
 * or null when there are none. Supabase puts them in the query, except for some
 * errors, which arrive in the hash.
 */
export function parseAuthCallback(href: string): { callback: AuthCallback; cleanUrl: string } | null {
  const url = new URL(href);
  const hash = new URLSearchParams(url.hash.slice(1));
  const hashError = hash.get("error_code") ?? hash.get("error");
  const code = url.searchParams.get("code") ?? undefined;
  const error = url.searchParams.get("error_code") ?? url.searchParams.get("error") ?? hashError ?? undefined;
  if (!code && !error) return null;

  for (const p of PARAMS) url.searchParams.delete(p);
  if (hashError) url.hash = "";
  return { callback: { code, error }, cleanUrl: url.pathname + url.search + url.hash };
}
