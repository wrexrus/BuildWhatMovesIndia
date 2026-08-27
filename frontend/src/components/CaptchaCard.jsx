import React from "react";
import { RefreshCcw, Volume2, ShieldCheck } from "lucide-react";

const CaptchaCard = ({ value, onChange }) => {
  return (
    <div className="min-w-0">
      <label
        htmlFor="captcha"
        className="mb-2 block break-words text-[0.9rem] font-semibold text-navy sm:text-[0.95rem]"
      >
        Type the characters you see in the image below
        <span className="ml-1 text-red-500">*</span>
      </label>

      <input
        id="captcha"
        value={value}
        onChange={onChange}
        placeholder="Enter characters shown below"
        className="h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-[0.9rem] outline-none transition-all focus:border-navy focus:ring-4 focus:ring-navy/10 sm:px-4 sm:text-[0.95rem]"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex h-16 w-full min-w-0 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-slate-100 sm:w-auto sm:min-w-[220px]">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(90deg,#64748b_1px,transparent_1px),linear-gradient(#64748b_1px,transparent_1px)] [background-size:10px_10px]" />

          <span className="relative flex select-none gap-0.5 text-2xl font-black text-slate-700">
            <span className="-rotate-3">7</span>
            <span className="rotate-2">F</span>
            <span className="-rotate-1">2</span>
            <span className="rotate-3">K</span>
            <span className="-rotate-2">9</span>
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Listen to CAPTCHA"
            className="grid h-11 w-11 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition-colors hover:border-navy hover:text-navy"
          >
            <Volume2 size={17} />
          </button>

          <button
            type="button"
            aria-label="Refresh CAPTCHA"
            className="grid h-11 w-11 place-items-center rounded-md border border-slate-300 bg-white text-slate-600 transition-colors hover:border-navy hover:text-navy"
          >
            <RefreshCcw size={17} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex min-w-0 items-start gap-2 text-xs text-slate-500">
        <ShieldCheck size={14} className="mt-0.5 shrink-0" />
        Security verification required
      </div>
    </div>
  );
};

export default CaptchaCard;