import { RiGoogleFill, RiLogoutBoxRLine, RiMailSendLine } from "@remixicon/react";
import { useEffect, useState, type FormEvent } from "react";
import { useAccount } from "../../sync/account";
import { loadAuth } from "../../sync/boot";
import { GOOGLE_ENABLED } from "../../sync/config";
import { cn } from "../../lib/util";
import { GhostButton } from "../ui/Buttons";
import { settingsButton } from "./SettingsRow";

const input =
  "h-8 min-w-0 flex-1 rounded-lg border border-line bg-panel/70 px-2.5 text-[13px] text-ink transition-colors duration-150 outline-none placeholder:text-subtle focus:border-line-strong focus:bg-panel";

/** Settings → Account: sign in with an emailed link, see who is signed in, sign out. */
export function AccountSection() {
  const status = useAccount((s) => s.status);
  const signedInEmail = useAccount((s) => s.email);
  const message = useAccount((s) => s.message);
  const [email, setEmail] = useState("");

  // Opening Settings is the moment to fetch supabase-js, so sending a link is instant.
  useEffect(() => {
    void loadAuth().then((m) => m.start());
  }, []);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (address) await (await loadAuth()).sendLink(address);
  };

  let body;
  if (status === "loading") {
    body = <p className="text-[12px] text-muted">Checking your account…</p>;
  } else if (status === "signed-in") {
    body = (
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[13px] text-ink-2">{signedInEmail}</p>
          <p className="text-[12px] text-muted">Signed in on this device.</p>
        </div>
        <button type="button" className={settingsButton} onClick={async () => (await loadAuth()).signOut()}>
          <RiLogoutBoxRLine size={15} /> Sign out
        </button>
      </div>
    );
  } else if (status === "link-sent") {
    body = (
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12.5px] text-ink-2">Check your email. The link signs you in on this device.</p>
        <GhostButton className="h-7 text-[12.5px]" onClick={() => useAccount.setState({ status: "signed-out" })}>
          Use a different email
        </GhostButton>
      </div>
    );
  } else {
    body = (
      <>
        <form onSubmit={send} className="flex flex-wrap gap-2">
          <input
            type="email"
            required
            autoComplete="email"
            aria-label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={input}
          />
          <button type="submit" disabled={status === "sending"} className={cn(settingsButton, "disabled:opacity-60")}>
            <RiMailSendLine size={15} /> {status === "sending" ? "Sending…" : "Send sign-in link"}
          </button>
        </form>
        {GOOGLE_ENABLED && (
          <button
            type="button"
            className={cn(settingsButton, "mt-2 w-full justify-center")}
            onClick={async () => (await loadAuth()).signInWithGoogle()}
          >
            <RiGoogleFill size={15} /> Continue with Google
          </button>
        )}
      </>
    );
  }

  return (
    <section aria-labelledby="account-title" className="py-3">
      <p id="account-title" className="text-[13.5px] font-medium text-ink">
        Account
      </p>
      <p className="mb-2.5 text-[12px] text-muted">
        Sync your notes across devices. They're stored unencrypted in this app's Supabase project, whose owner can
        read them.
      </p>
      {body}
      {message && (
        <p role="status" className="mt-2 text-[12px] text-danger">
          {message}
        </p>
      )}
    </section>
  );
}
