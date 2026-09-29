// Loaded on demand (see boot.ts): the only module that imports supabase-js.
import { createClient, type Session } from "@supabase/supabase-js";
import { MESSAGES, useAccount } from "./account";
import type { AuthCallback } from "./callback";
import { AUTH_STORAGE_KEY } from "./config";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: {
      flowType: "pkce",
      storageKey: AUTH_STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      // boot.ts takes the code out of the URL before the router sees it, and hands it to start().
      detectSessionInUrl: false,
    },
  },
);

const set = useAccount.setState;

/** Links and Google return here, keeping the page the person was on. */
const redirectTo = () => window.location.origin + window.location.pathname;

const signedIn = (session: Session) =>
  set({ status: "signed-in", email: session.user.email ?? null, message: null });

/** True while the person is signing out on purpose, so it isn't reported as an expired session. */
let signingOut = false;

let started: Promise<void> | null = null;

/** Restores the session, or finishes a sign-in from `callback`. Safe to call more than once. */
export function start(callback?: AuthCallback) {
  return (started ??= init(callback));
}

async function init(callback?: AuthCallback) {
  supabase.auth.onAuthStateChange((event, session) => {
    // No awaiting supabase calls in here: supabase-js holds a lock while it runs.
    if (session) {
      signedIn(session);
    } else if (event === "SIGNED_OUT") {
      set({ status: "signed-out", email: null, message: signingOut ? null : MESSAGES.sessionExpired });
      signingOut = false;
    }
  });

  if (callback?.error) {
    set({ status: "signed-out", message: MESSAGES.linkExpired });
  } else if (callback?.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(callback.code);
    if (error) {
      console.error("Sign-in link failed", error);
      set({ status: "signed-out", message: MESSAGES.linkFailed });
    }
  }

  const { data } = await supabase.auth.getSession();
  if (data.session) signedIn(data.session);
  else if (useAccount.getState().status === "loading") set({ status: "signed-out" });
}

export async function sendLink(email: string) {
  set({ status: "sending", message: null });
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
  if (error) {
    set({ status: "signed-out", message: `Couldn't send the link: ${error.message}` });
    return;
  }
  set({ status: "link-sent", email });
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirectTo() } });
  if (error) set({ message: `Couldn't open Google sign-in: ${error.message}` });
}

/**
 * Ends the session on this device. Notes stay: nothing syncs yet, so they exist
 * only here. Pushing pending changes and clearing the device (AUTH-4) come with
 * the sync engine.
 */
export async function signOut() {
  signingOut = true;
  // "local" still signs out when offline; the server session just expires on its own.
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) {
    signingOut = false;
    set({ message: `Couldn't sign out: ${error.message}` });
  }
}
