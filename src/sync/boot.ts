import { useAccount } from "./account";
import { parseAuthCallback } from "./callback";
import { AUTH_STORAGE_KEY } from "./config";

let auth: Promise<typeof import("./auth")> | null = null;

/** Loads supabase-js and the sign-in code in their own chunk, once. */
export const loadAuth = () => (auth ??= import("./auth"));

function hasStoredSession() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Runs before React renders. A sign-in link lands with `?code=`, and useUrlSync
 * rewrites the address on mount, which would drop it; so the code is taken out
 * of the URL here and handed to the auth module directly.
 */
export function startAccount() {
  const parsed = parseAuthCallback(window.location.href);
  if (parsed) window.history.replaceState(window.history.state, "", parsed.cleanUrl);

  // Signed-out devices never download supabase-js until the Account section opens.
  if (parsed || hasStoredSession()) {
    useAccount.setState({ status: "loading" });
    void loadAuth().then((m) => m.start(parsed?.callback));
  }

  const setOnline = () => useAccount.setState({ online: navigator.onLine });
  window.addEventListener("online", setOnline);
  window.addEventListener("offline", setOnline);
}
