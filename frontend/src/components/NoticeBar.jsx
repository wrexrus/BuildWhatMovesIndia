import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, X, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const NoticeBar = () => {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLanguage();

  if (dismissed) return null;

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-w-0 max-w-[1440px] items-start gap-2 px-4 py-2.5 sm:items-center sm:gap-3 sm:px-6">
        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full sm:mt-0 bg-amber/15 text-amber">
          <Bell size={14} />
        </span>
        <div className="min-w-0 flex-1 break-words text-[0.8rem] font-medium leading-5 text-slate-800 sm:text-[0.87rem]">
          <span className="font-bold text-navy mr-1.5">{t('noticeTitle')}</span>
          <span>{t('noticeText')}</span>
          <Link
            to="/news-and-updates"
            className="ml-2 inline-flex items-center gap-1 font-semibold text-navy hover:underline text-[0.78rem]"
          >
            <span>View Advisories</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss notice"
          className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full sm:mt-0 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

export default NoticeBar;