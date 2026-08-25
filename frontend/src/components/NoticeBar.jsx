import React, { useState } from "react";
import { Bell, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const NoticeBar = () => {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLanguage();

  if (dismissed) return null;

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-6 py-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber/15 text-amber">
          <Bell size={14} />
        </span>
        <div className="flex-1 text-[0.87rem] text-slate-800 font-medium">
          <span className="font-bold text-navy mr-1.5">{t('noticeTitle')}</span>
          <span>{t('noticeText')}</span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export default NoticeBar;