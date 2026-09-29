// Gate sync code with the literal `__SYNC_ENABLED__` (see vite.config.ts), not a
// constant re-exported from here: the bundler only drops code behind a literal
// `false`, and a build without Supabase keys must not ship any of it (DEV-1).

export const GOOGLE_ENABLED = __SYNC_ENABLED__ && import.meta.env.VITE_AUTH_GOOGLE === "true";

/** Where supabase-js keeps the session. Its presence means a signed-in device. */
export const AUTH_STORAGE_KEY = "notes.auth.v1";
