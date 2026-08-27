import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const CopilotHeroCard = () => {
  const [userGoal, setUserGoal] = useState("");

  const { user, isLoggedIn } = useAuth();
  const { t } = useLanguage();

  const quickQuestions = [
    {
      label: t("copilotChip1"),
      query:
        "What are my pending GST filing issues this month?",
    },
    {
      label: t("copilotChip2"),
      query:
        "Explain my ₹24,300 net tax liability calculation",
    },
    {
      label: t("copilotChip3"),
      query:
        "Why is Asian Paints bill #AP/2026/045 unfiled?",
    },
    {
      label: t("copilotChip4"),
      query:
        "What is the GSTR-3B filing due date and late fee rules?",
    },
  ];

  const handleLaunchGoal = (goalPrompt) => {
    const promptToSend = goalPrompt || userGoal;

    if (!promptToSend.trim()) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("open-gst-copilot", {
        detail: {
          query: promptToSend.trim(),
        },
      })
    );

    setUserGoal("");
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleLaunchGoal(userGoal);
  };

  return (
    <section className="relative z-10 mx-auto -mt-5 mb-8 max-w-7xl px-3 font-sans sm:-mt-8 sm:mb-10 sm:px-6 lg:px-8">
      <div
        className="
          overflow-hidden
          rounded-[18px]
          border border-line/80
          bg-white
          shadow-[0_16px_45px_rgba(16,35,58,0.08)]
        "
      >
        <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
          {}
          <div className="p-5 sm:p-9 lg:p-10">
            <div className="flex items-center gap-2">
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-2 w-2 rounded-full bg-navy" />
                <span className="absolute h-5 w-5 rounded-full border border-navy/10" />
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                GST Copilot
              </span>
            </div>

            <h2 className="mt-5 max-w-xl font-serif text-[1.75rem] leading-[1.12] tracking-[-0.025em] text-ink sm:text-[2.35rem]">
              {t("copilotTitle")}
            </h2>

            <p className="mt-3 max-w-xl text-[14px] leading-6 text-muted sm:mt-4 sm:text-[15px] sm:leading-7">
              {isLoggedIn && user ? (
                <>
                  {t("copilotWelcome")},{" "}
                  <span className="font-semibold text-ink">
                    {user.name}
                  </span>
                  . I can use your available account
                  context to help with filings, invoice
                  reconciliation, tax calculations and
                  next steps.
                </>
              ) : (
                t("copilotSubtitle")
              )}
            </p>

            {isLoggedIn && (
              <div className="mt-5 inline-flex min-h-9 items-center gap-2 text-xs text-green sm:mt-6">
                <CheckCircle2 className="h-4 w-4" />
                <span>Account context available</span>
              </div>
            )}

            <div className="mt-7 sm:mt-9">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
                  Suggested
                </p>

                <span className="text-[10px] text-muted/60">
                  Start with a task
                </span>
              </div>

              <div className="mt-3 divide-y divide-line/70">
                {quickQuestions.map((question) => (
                  <button
                    key={question.label}
                    type="button"
                    onClick={() =>
                      handleLaunchGoal(question.query)
                    }
                    className="
                      group
                      flex w-full items-center justify-between
                      gap-3
                      py-3.5 sm:gap-5
                      text-left
                    "
                  >
                    <span className="text-sm font-medium leading-5 text-ink transition-colors duration-150 group-hover:text-navy">
                      {question.label}
                    </span>

                    <ArrowRight
                      className="
                        h-4 w-4 shrink-0
                        text-muted/70
                        transition-all duration-150
                        group-hover:translate-x-1
                        group-hover:text-navy
                      "
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="bg-shell/55 p-5 sm:p-8 lg:p-10">
            <div className="flex h-full flex-col justify-center">
              <div>
                <p className="text-[10px] font-semibold uppercase sm:text-[11px] tracking-[0.1em] text-navy/65">
                  Ask about your GST work
                </p>

                <h3 className="mt-2 text-lg font-semibold tracking-[-0.01em] text-ink">
                  What do you need help with?
                </h3>

                <p className="mt-1.5 max-w-md text-xs leading-5 text-muted">
                  Describe an issue, calculation, return or
                  invoice. Copilot will use the available context
                  to help you work through it.
                </p>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="mt-4 sm:mt-5"
              >
                <div
                  className="
                    overflow-hidden
                    rounded-[14px]
                    border border-line
                    bg-white
                    shadow-[0_5px_20px_rgba(16,35,58,0.04)]
                    transition-all duration-200
                    focus-within:border-navy/35
                    focus-within:shadow-[0_8px_25px_rgba(16,35,58,0.07)]
                  "
                >
                  <textarea
                    id="copilot-hero-goal-input"
                    rows={6}
                    value={userGoal}
                    onChange={(event) =>
                      setUserGoal(event.target.value)
                    }
                    placeholder={t(
                      "copilotPlaceholder"
                    )}
                    className="
                      block
                      min-h-[130px]
                      w-full sm:min-h-[170px]
                      resize-none
                      border-0
                      bg-transparent
                      px-4
                      py-3.5
                      text-sm sm:py-4
                      leading-6
                      text-ink
                      placeholder:text-muted/60
                      focus:outline-none
                      sm:min-h-[170px]
                    "
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/80 px-3 py-2.5">
                    <span className="text-[9px] leading-4 text-muted sm:text-[10px]">
                      Press the button to open Copilot
                    </span>

                    <button
                      type="submit"
                      disabled={!userGoal.trim()}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-[9px]
                        bg-navy
                        px-3.5
                        py-2.5
                        text-xs sm:px-4
                        font-semibold
                        text-white
                        transition-all
                        duration-150
                        hover:bg-navy-hover
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-35
                      "
                    >
                      {t("copilotButton")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleLaunchGoal(
                      "What should I do next for my GSTR-3B filing and pending actions?"
                    )
                  }
                  className="
                    mt-3
                    inline-flex min-h-9
                    items-center
                    gap-1.5
                    text-xs
                    font-medium
                    text-muted
                    transition-colors
                    hover:text-navy
                  "
                >
                  {t("copilotWhatNext")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CopilotHeroCard;