import { create } from "zustand";

export type AccountStatus = "loading" | "signed-out" | "sending" | "link-sent" | "signed-in";

interface AccountState {
  status: AccountStatus;
  email: string | null;
  /** A notice or error for the Account section, e.g. an expired link. */
  message: string | null;
  online: boolean;
}

/** Who is signed in on this device. Holds no notes; `useData` still owns those. */
export const useAccount = /* @__PURE__ */ create<AccountState>(() => ({
  status: "signed-out",
  email: null,
  message: null,
  online: typeof navigator === "undefined" ? true : navigator.onLine,
}));

export const MESSAGES = {
  linkExpired: "That sign-in link has expired. Send a new one.",
  linkFailed:
    "That sign-in link didn't work. It may have expired, or been opened in a different browser from the one you asked in. Send a new one.",
  sessionExpired: "You were signed out. Sign in again to keep syncing; your notes on this device are safe.",
} as const;
