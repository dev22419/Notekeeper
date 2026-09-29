import { RiCloudLine, RiCloudOffLine } from "@remixicon/react";
import { useAccount } from "../../sync/account";
import { useUI } from "../../store/ui";
import { IconButton } from "../ui/Buttons";

/**
 * The cloud beside Settings while signed in. It shows only online and offline
 * for now; the syncing, paused and error states arrive with the sync engine.
 */
export function SyncStatus() {
  const status = useAccount((s) => s.status);
  const email = useAccount((s) => s.email);
  const online = useAccount((s) => s.online);
  if (status !== "signed-in") return null;

  const label = online ? `Signed in as ${email}` : "Offline · changes will sync when you're back online";
  return (
    <IconButton
      aria-label={label}
      title={label}
      onClick={() => useUI.getState().set({ settingsOpen: true, drawerOpen: false })}
    >
      {online ? <RiCloudLine size={16} /> : <RiCloudOffLine size={16} />}
    </IconButton>
  );
}
