import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle, FileCheck2, Calculator, Clock, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const CopilotHeroCard = () => {
  const [userGoal, setUserGoal] = useState('');
  const { user, isLoggedIn } = useAuth();
  const { t } = useLanguage();

  const handleLaunchGoal = (goalPrompt) => {
    const promptToSend = goalPrompt || userGoal;
    if (!promptToSend.trim()) return;

    window.dispatchEvent(
      new CustomEvent('open-gst-copilot', {
        detail: { query: promptToSend.trim() }
      })
    );
    setUserGoal('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLaunchGoal(userGoal);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-10 font-sans">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200/90 text-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-navy via-navy-hover to-amber" />

        <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 pt-1">
          <div className="flex-1 flex flex-col justify-between max-w-xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-navy text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('copilotBadge')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight">
                {t('copilotTitle')}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                {isLoggedIn && user ? (
                  <>
                    {t('copilotWelcome')}, <span className="font-bold text-navy">{user.name}</span>! I analyzed your account: 14 invoices matched, 4 require review, and ₹6,800 ITC is currently blocked.
                  </>
                ) : (
                  t('copilotSubtitle')
                )}
              </p>
            </div>

            <div className="mt-6">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t('copilotQuickTitle')}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleLaunchGoal("What are my pending GST filing issues this month?")}
                  className="bg-slate-50 hover:bg-navy/5 border border-slate-200 hover:border-navy/35 text-navy text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:translate-y-px"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{t('copilotChip1')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchGoal("Explain my ₹24,300 net tax liability calculation")}
                  className="bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-navy text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:translate-y-px"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t('copilotChip2')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchGoal("Why is Asian Paints bill #AP/2026/045 unfiled?")}
                  className="bg-slate-50 hover:bg-navy/5 border border-slate-200 hover:border-navy/35 text-navy text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:translate-y-px"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-navy shrink-0" />
                  <span>{t('copilotChip3')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchGoal("What is the GSTR-3B filing due date and late fee rules?")}
                  className="bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 text-navy text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:translate-y-px"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{t('copilotChip4')}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
            <label htmlFor="copilot-hero-goal-input" className="block text-xs font-bold text-navy mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-navy" />
              <span>{t('copilotTitle')}</span>
            </label>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 flex-1">
              <textarea
                id="copilot-hero-goal-input"
                rows={3}
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder={t('copilotPlaceholder')}
                className="w-full text-sm sm:text-base p-3.5 rounded-xl border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 font-medium placeholder-slate-400 bg-white text-slate-800 shadow-inner resize-none font-sans"
              />

              <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
                <button
                  type="submit"
                  disabled={!userGoal.trim()}
                  className="flex-1 bg-navy hover:bg-navy-hover disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 active:translate-y-px"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('copilotButton')}</span>
                  <ArrowRight className="w-4 h-4 text-amber" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLaunchGoal("What should I do next for my GSTR-3B filing and pending actions?")}
                  className="bg-amber hover:bg-amber-500 text-navy font-black text-xs sm:text-sm py-3 px-4 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 active:translate-y-px shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-navy shrink-0 fill-navy" />
                  <span>{t('copilotWhatNext')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopilotHeroCard;