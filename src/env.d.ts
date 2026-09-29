interface ImportMetaEnv {
  /** Supabase project URL. Cloud sync is off unless this and the key are set. */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase publishable (anon) key. Safe in the browser; row-level security guards the data. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  /** "true" shows Continue with Google; the provider must be enabled in Supabase. */
  readonly VITE_AUTH_GOOGLE?: string;
}

/** True when both Supabase variables are set at build time; defined in vite.config.ts. */
declare const __SYNC_ENABLED__: boolean;
