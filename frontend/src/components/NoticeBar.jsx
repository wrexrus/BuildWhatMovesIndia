import React, { useState } from "react";
import { Bell, X } from "lucide-react";

const NoticeBar = ({
  message = "System maintenance is scheduled for Aug 24th, 2026 between 10:00 pm and 1:00 am.",
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-6 py-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber/15 text-amber">
          <Bell size={14} />
        </span>
        <p className="flex-1 text-[0.87rem] text-ink">{message}</p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-navy/5 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export default NoticeBar;