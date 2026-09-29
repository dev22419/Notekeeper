import type { ReactNode } from "react";

export function Row({ title, detail, action }: { title: string; detail: string; action: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-[13.5px] font-medium text-ink">{title}</p>
        <p className="text-[12px] text-muted">{detail}</p>
      </div>
      {action}
    </div>
  );
}

/** The bordered button used for actions in Settings. */
export const settingsButton =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-panel px-3 text-[12.5px] font-medium text-ink-2 transition-colors hover:border-line-strong hover:bg-window";
