import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import { useLocation } from "react-router-dom";

import {
  MessageSquare,
  X,
  Send,
  ChevronRight,
  HelpCircle,
  UserCheck,
  AlertCircle,
  Volume2,
  VolumeX,
  PhoneCall,
  ArrowRight,
} from "lucide-react";

import {
  sendCopilotQuery,
  fetchAccountHarness,
  resolveMismatch,
} from "../utils/api";

import {
  SUPPORTED_LANGUAGES,
  WELCOME_MESSAGES,
  QUICK_ACTIONS,
  UI_LABELS,
} from "../config/chatbotConfig";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import {
  speakTextInLanguage,
  stopSpeech,
} from "../utils/speechUtils";

const ChatbotWidget = () => {
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast() || {};
  const { language: globalLanguage } =
    useLanguage();

  const location = useLocation();



  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chatLanguage, setChatLanguage] =
    useState(globalLanguage || "HI");

  const [explanationMode, setExplanationMode] =
    useState("SHOPKEEPER");

  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] =
    useState(false);

  const [showQuickActions, setShowQuickActions] =
    useState(true);

  const [speakingIndex, setSpeakingIndex] =
    useState(null);

  const [harnessContext, setHarnessContext] =
    useState(null);

  const [dynamicChips, setDynamicChips] =
    useState([]);



  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const handleSendQueryRef = useRef(null);
  const streamingIntervalRef = useRef(null);

  const scrollToBottom = (smooth = false) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      setSpeakingIndex(null);
    }
  }, [isOpen]);

  const labels =
    UI_LABELS[chatLanguage] ||
    UI_LABELS.EN;

  const getWelcomeMessage = (langCode) => {
    return (
      WELCOME_MESSAGES[langCode] ||
      WELCOME_MESSAGES.HI ||
      "नमस्ते! मैं आपका GST साथी Copilot हूँ।"
    );
  };

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: getWelcomeMessage(
        globalLanguage || "HI"
      ),
      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    },
  ]);

  const handleChatLanguageChange = (
    nextLanguage
  ) => {
    stopSpeech();
    setSpeakingIndex(null);
    setChatLanguage(nextLanguage);

    setMessages((previous) => {
      if (!previous.length) {
        return [
          {
            sender: "bot",
            text: getWelcomeMessage(
              nextLanguage
            ),
            time: new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
          },
        ];
      }

      const updated = [...previous];

      if (updated[0].sender === "bot") {
        updated[0] = {
          ...updated[0],
          text: getWelcomeMessage(
            nextLanguage
          ),
        };
      }

      return updated;
    });
  };

  useEffect(() => {
    if (globalLanguage) {
      handleChatLanguageChange(globalLanguage);
    }
  }, [globalLanguage]);



  useEffect(() => {
    let isMounted = true;

    if (isOpen && isLoggedIn) {
      fetchAccountHarness()
        .then((response) => {
          if (!isMounted || !response) return;

          const data =
            response.data || response;

          if (data.harness) {
            setHarnessContext(
              data.harness
            );

            if (
              data.harness
                .dynamicActionChips
            ) {
              setDynamicChips(
                data.harness
                  .dynamicActionChips
              );
            }
          }
        })
        .catch(() => { });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, isLoggedIn]);



  useEffect(() => {
    handleSendQueryRef.current = handleSendQuery;
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        stopSpeech();
        setSpeakingIndex(null);
      }
    };

    const handleOpenCopilotEvent = (
      event
    ) => {
      const targetQuery =
        event.detail?.query;

      setIsOpen(true);
      stopSpeech();
      setSpeakingIndex(null);

      if (targetQuery) {
        if (streamingIntervalRef.current) {
          window.clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
        setIsStreaming(false);
        setLoading(false);

        setTimeout(() => {
          if (handleSendQueryRef.current) {
            handleSendQueryRef.current(targetQuery);
          }
        }, 50);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    window.addEventListener(
      "open-gst-copilot",
      handleOpenCopilotEvent
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      window.removeEventListener(
        "open-gst-copilot",
        handleOpenCopilotEvent
      );
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    scrollToBottom(false);

    const timer = setTimeout(() => {
      scrollToBottom(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [messages, loading, isStreaming, isOpen]);



  const streamBotResponse = (
    fullText,
    status,
    source
  ) => {
    if (streamingIntervalRef.current) {
      window.clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
    setIsStreaming(true);

    const words = fullText.split(" ");
    let currentText = "";

    const time =
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    setMessages((previous) => [
      ...previous,
      {
        sender: "bot",
        text: "",
        time,
        status,
        source,
      },
    ]);

    let index = 0;

    streamingIntervalRef.current = window.setInterval(
      () => {
        if (index < words.length) {
          currentText +=
            (index === 0 ? "" : " ") +
            words[index];

          const nextText = currentText;

          setMessages((previous) => {
            const updated = [...previous];
            const lastIndex =
              updated.length - 1;

            if (
              lastIndex >= 0 &&
              updated[lastIndex].sender ===
              "bot"
            ) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                text: nextText,
              };
            }

            return updated;
          });

          scrollToBottom(false);
          index += 1;
          return;
        }

        if (streamingIntervalRef.current) {
          window.clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
        setIsStreaming(false);
        scrollToBottom(false);
      },
      30
    );
  };



  const handleSendQuery = async (
    queryText
  ) => {
    const textToSend = queryText || query;

    if (!textToSend.trim()) {
      return;
    }

    if (queryText) {
      if (streamingIntervalRef.current) {
        window.clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }
      setIsStreaming(false);
      setLoading(false);
    } else if (loading || isStreaming) {
      return;
    }

    stopSpeech();
    setSpeakingIndex(null);
    setQuery("");

    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text: textToSend.trim(),
        time: new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      },
    ]);

    setLoading(true);

    try {
      const response = await sendCopilotQuery(
        textToSend.trim(),
        chatLanguage,
        location.pathname,
        user ? user.gstin : null,
        explanationMode
      );

      const botText =
        response.data?.answer ||
        getWelcomeMessage(chatLanguage);

      setLoading(false);

      streamBotResponse(
        botText,
        response.data?.status,
        response.data?.source
      );
    } catch (error) {
      setLoading(false);

      setMessages((previous) => [
        ...previous,
        {
          sender: "bot",
          text:
            chatLanguage === "HI"
              ? "क्षमा करें, GST साथी Copilot सर्वर से जुड़ने में समस्या हो रही है। कृपया पुनः प्रयास करें।"
              : "Sorry, I am having trouble reaching the GST Copilot server. Please try again.",
          time: new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
          isError: true,
        },
      ]);
    }
  };



  const handleActionCardClick = async (
    actionType,
    payload
  ) => {
    if (actionType === "CALL_SUPPLIER") {
      if (showToast) {
        showToast(
          `Reminder sent to ${payload.supplier || "supplier"
          }'s GSTR-1 accounts desk.`,
          "info",
          "Supplier reminder"
        );
      }
      return;
    }

    if (actionType === "DEFER_ITC") {
      try {
        await resolveMismatch(
          "INV-002",
          "AP/2026/045",
          "DEFER_TO_NEXT_MONTH"
        );

        if (showToast) {
          showToast(
            "₹4,500 ITC deferred to next month.",
            "success",
            "ITC resolution"
          );
        }

        handleSendQuery(
          "Show my updated GSTR-3B tax payable breakdown."
        );
      } catch (error) {
        if (showToast) {
          showToast(
            "Failed to defer ITC.",
            "error"
          );
        }
      }
    }
  };

  const handleSpeak = (text, index) => {
    if (speakingIndex === index) {
      stopSpeech();
      setSpeakingIndex(null);
    } else {
      stopSpeech();
      setSpeakingIndex(index);
      const cleanText = text.replace(/<[^>]*>/g, '').trim();
      speakTextInLanguage(
        cleanText,
        chatLanguage,
        () => setSpeakingIndex(null),
        () => setSpeakingIndex(null)
      );
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleSendQuery(query);
  };

  const activeQuickActions =
    dynamicChips?.length
      ? dynamicChips
      : QUICK_ACTIONS[chatLanguage] ||
      QUICK_ACTIONS.EN;

  const hasPendingActions = Boolean(
    harnessContext?.pendingToDos?.length
  );


  const renderFormattedMessage = (content) => {
    if (!content) return null;

    const lines = content.split("\n");

    const formatInline = (str) => {
      const parts = str.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong
              key={pIdx}
              className="font-bold text-navy"
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    return (
      <div className="space-y-2 text-[12.5px] leading-relaxed text-slate-800 font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1.5" />;

          const isHeader =
            (trimmed.endsWith(":") && trimmed.length < 65) ||
            trimmed.startsWith("##") ||
            trimmed.startsWith("###");

          const isBullet =
            trimmed.startsWith("•") ||
            trimmed.startsWith("* ") ||
            trimmed.startsWith("- ");

          const isNumbered = /^\d+\.\s/.test(trimmed);

          if (isHeader) {
            return (
              <div
                key={idx}
                className="font-extrabold text-navy text-[13px] mt-2 mb-1 border-b border-slate-100 pb-1"
              >
                {formatInline(trimmed.replace(/^#+\s*/, ""))}
              </div>
            );
          }

          if (isBullet) {
            const bulletText = trimmed.replace(/^[•*\-]\s*/, "");
            return (
              <div
                key={idx}
                className="flex items-start gap-2 pl-1.5 my-1"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-navy/70 mt-2 shrink-0" />
                <span className="flex-1">{formatInline(bulletText)}</span>
              </div>
            );
          }

          if (isNumbered) {
            const match = trimmed.match(/^(\d+\.)\s*(.*)/);
            return (
              <div
                key={idx}
                className="flex items-start gap-2 pl-1 my-1"
              >
                <span className="font-bold text-navy text-xs shrink-0">
                  {match ? match[1] : "•"}
                </span>
                <span className="flex-1">
                  {formatInline(match ? match[2] : trimmed)}
                </span>
              </div>
            );
          }

          return (
            <p key={idx} className="my-1">
              {formatInline(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="
        fixed
        bottom-[max(16px,env(safe-area-inset-bottom))]
        right-[max(16px,env(safe-area-inset-right))]
        z-50
        font-sans
      "
    >
      { }
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open GST Copilot"
          title="Open GST Copilot"
          className="
          cursor-pointer
            group
            relative
            flex
            items-center
            gap-2.5
            rounded-[15px]
            border-[0.25px]
            border-gray-50
            bg-navy
            px-3.5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-[0_10px_30px_rgba(8,54,95,0.20)]
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-navy-hover
            hover:shadow-[0_14px_34px_rgba(8,54,95,0.24)]
            active:translate-y-px
          "
        >
          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-[10px]
              bg-white/10
            "
            aria-hidden="true"
          >
            <MessageSquare
              className="h-4 w-4 text-white"
              strokeWidth={1.8}
            />
          </span>

          <span>GST Copilot</span>
        </button>
      )}

      { }
      {isOpen && (
        <section
          aria-label="GST Copilot"
          className="
            flex
            w-[calc(100vw-24px)] max-w-[420px]
            max-h-[calc(100dvh-24px)]
            flex-col
            overflow-hidden
            rounded-[16px] sm:w-[min(420px,calc(100vw-32px))] sm:max-h-[calc(100dvh-30px)]
            border
            border-line/80
            bg-white
            shadow-[0_22px_60px_rgba(16,35,58,0.15)]
          "
          style={{
            height: "min(610px, calc(100dvh - 24px))",
          }}
        >
          { }
          <header className="shrink-0 bg-white">
            <div className="flex items-start justify-between gap-2 bg-navy px-3 py-3 text-white sm:px-4 sm:py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-[8px]
        bg-white/12
      "
                >
                  <MessageSquare
                    className="h-4 w-4 text-white"
                    strokeWidth={1.7}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-white">
                      GST Copilot
                    </h2>

                    <span
                      className="
            flex
            items-center
            gap-1.5
            text-[9px]
            font-medium
            text-emerald-200
          "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      Available
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-[9px] text-white/70">
                    GST assistance for this page
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-1.5">
                <select
                  value={chatLanguage}
                  onChange={(event) =>
                    handleChatLanguageChange(event.target.value)
                  }
                  className="
        h-7
        rounded-[7px]
        border
        border-white/15
        bg-white/10
        px-2
        text-[10px]
        font-medium
        text-white
        focus:border-white/30
        focus:outline-none
      "
                  aria-label="Assistant language"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className="text-ink"
                    >
                      {lang.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    stopSpeech();
                    setSpeakingIndex(null);
                  }}
                  className="
        flex
        h-7
        w-7
        cursor-pointer
        items-center
        justify-center
        rounded-[7px]
        text-white/70
        transition-colors
        hover:bg-white/10
        hover:text-white
      "
                  aria-label="Close GST Copilot"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-line/70 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[9px] text-muted">
                  <span className="font-medium text-ink">
                    Context
                  </span>
                  <span className="text-line">/</span>
                  <span className="truncate">
                    {location.pathname
                      .replace(/^\//, "")
                      .replace(/\//g, " / ") ||
                      "Current page"}
                  </span>
                </div>

                {isLoggedIn && user && (
                  <span className="flex items-center gap-1 text-[9px] text-green">
                    <UserCheck className="h-3 w-3" />
                    Account linked
                  </span>
                )}
              </div>
            </div>
          </header>

          {showQuickActions ? (
            <div className="shrink-0 border-b border-line bg-shell/65 px-4 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-navy/80" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.07em] text-ink/65">
                    {isLoggedIn
                      ? labels.harnessTitle
                      : labels.quickTitle}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQuickActions(false)}
                  className="
          cursor-pointer
          rounded-[4px]
          px-1.5
          py-0.5
          text-[9px]
          font-medium
          text-muted
          transition-colors
          hover:bg-white/70
          hover:text-ink
        "
                >
                  Hide
                </button>
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {activeQuickActions
                  .slice(0, 3)
                  .map((action, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSendQuery(action.query)}
                      disabled={loading || isStreaming}
                      className="
              group
              inline-flex
              min-w-0
              items-center
              gap-1
              rounded-[4px]
              border-b
              border-transparent
              py-0.5
              text-left
              text-[10px]
              font-medium
              leading-5
              text-navy
              transition-all
              duration-150
              hover:border-navy/25
              hover:text-navy-hover
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
                    >
                      <span className="truncate">
                        {action.label}
                      </span>

                      <ChevronRight
                        className="
                h-3 w-3
                shrink-0
                text-muted/70
                transition-transform
                duration-150
                group-hover:translate-x-0.5
              "
                      />
                    </button>
                  ))}
              </div>
            </div>
          ) : (
            <div className="shrink-0 border-b border-line bg-shell/45 px-4 py-1.5">
              <button
                type="button"
                onClick={() => setShowQuickActions(true)}
                className="
        inline-flex
        cursor-pointer
        items-center
        gap-1.5
        rounded-[5px]
        px-1.5
        py-1
        text-[9px]
        font-semibold
        text-navy
        transition-colors
        hover:bg-white/70
        hover:text-navy-hover
      "
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Show quick actions</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          )}

          { }
          <div
            ref={messagesContainerRef}
            className="min-h-0 flex-1 overflow-y-auto bg-[#fbfcfd] px-3 py-4 sm:px-4 sm:py-5 overscroll-contain"
          >
            <div className="mx-auto max-w-[65ch]">
              <div className="space-y-6">
                {messages.map((message, index) => {
                  const textLower = message.text.toLowerCase();

                  const isAsianPaints =
                    textLower.includes("asian paints") ||
                    textLower.includes("unfiled");

                  const isUser = message.sender === "user";

                  return (
                    <article
                      key={index}
                      className={
                        isUser
                          ? "ml-3 border-l-2 border-navy/15 pl-2 sm:ml-8 sm:pl-3"
                          : ""
                      }
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span
                          className={`
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.09em]
                            ${isUser
                              ? "text-navy"
                              : "text-muted"
                            }
                          `}
                        >
                          {isUser ? "You" : "GST Copilot"}
                        </span>

                        <span className="text-[9px] text-muted/60 font-mono">
                          {message.time}
                        </span>
                      </div>

                      <div
                        className={`
                          p-3
                          rounded-xl
                          border
                          ${isUser
                            ? "bg-navy/5 border-navy/10"
                            : message.isError
                              ? "bg-red-50/70 border-red-200"
                              : "bg-white border-line/80 shadow-2xs"
                          }
                        `}
                      >
                        {renderFormattedMessage(message.text)}
                      </div>

                      { }
                      {message.sender === "bot" &&
                        !message.isError &&
                        isAsianPaints && (
                          <div
                            className="
                              mt-3
                              overflow-hidden
                              rounded-[12px]
                              border
                              border-navy/10
                              bg-white
                              shadow-[0_2px_8px_rgba(16,35,58,0.035)]
                            "
                          >
                            <div className="flex items-center justify-between border-b border-line bg-shell/45 px-3.5 py-2">
                              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">
                                Available actions
                              </span>
                              <span className="text-[9px] text-muted/65">
                                Review before applying
                              </span>
                            </div>

                            <div className="p-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleActionCardClick("DEFER_ITC")
                                }
                                className="
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  min-h-10 rounded-[9px]
                                  bg-navy
                                  px-3
                                  py-2.5
                                  text-left
                                  text-[11px]
                                  font-semibold
                                  text-white
                                  transition-colors
                                  hover:bg-navy-hover
                                "
                              >
                                <span>Defer ₹4,500 ITC</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleActionCardClick("CALL_SUPPLIER", {
                                    supplier: "Asian Paints",
                                  })
                                }
                                className="
                                  mt-1
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  rounded-[9px]
                                  px-3
                                  py-2
                                  text-left
                                  text-[10px]
                                  font-medium
                                  text-ink
                                  transition-colors
                                  hover:bg-shell
                                "
                              >
                                <span className="flex items-center gap-2">
                                  <PhoneCall className="h-3.5 w-3.5 text-navy" />
                                  {labels.remindSupplier}
                                </span>
                                <ChevronRight className="h-3.5 w-3.5 text-muted" />
                              </button>
                            </div>
                          </div>
                        )}

                      { }
                      {message.sender === "bot" &&
                        !message.isError &&
                        message.text.length > 0 && (
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                handleSpeak(message.text, index)
                              }
                              className={`inline-flex items-center gap-1.5 rounded-[7px] border px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer ${
                                speakingIndex === index
                                  ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                                  : "border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-navy"
                              }`}
                            >
                              {speakingIndex === index ? (
                                <>
                                  <VolumeX className="h-3.5 w-3.5 text-red-600 animate-pulse" />
                                  <span className="font-bold text-red-700">Stop Audio</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="h-3.5 w-3.5 text-navy" />
                                  <span>Listen Explanation</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                    </article>
                  );
                })}

                { }
                {loading && (
                  <div className="border-l-2 border-navy/15 pl-3">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-navy animate-ping" />
                      <span className="text-[10px] font-semibold text-muted">
                        {labels.analyzing || "Preparing response..."}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      <div className="h-2 w-44 rounded-full bg-slate-200 animate-pulse" />
                      <div className="h-2 w-28 rounded-full bg-slate-200 animate-pulse" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          { }
          <form
            onSubmit={handleFormSubmit}
            className="shrink-0 bg-white px-2.5 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5"
          >
            <div
              className="
                overflow-hidden
                rounded-[13px]
                border
                border-line
                bg-white
                shadow-[0_4px_16px_rgba(16,35,58,0.045)]
                transition-all
                duration-200
                focus-within:border-navy/30
                focus-within:shadow-[0_7px_22px_rgba(16,35,58,0.07)]
              "
            >
              <textarea
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e);
                  }
                }}
                rows={2}
                placeholder={labels.placeholder || "Ask your GST query (e.g. Why is Asian Paints bill unfiled?)"}
                className="
                  block
                  min-h-[54px]
                  max-h-28 sm:min-h-[58px]
                  w-full
                  resize-none
                  border-0
                  bg-transparent
                  px-3
                  py-3
                  text-[12px] sm:px-3.5
                  sm:py-3
                  leading-5
                  text-ink
                  placeholder:text-muted/55
                  focus:outline-none
                "
                aria-label="Ask GST Copilot"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/70 px-2.5 py-2 bg-slate-50/50 sm:px-3">
                <span className="text-[10px] text-muted/70 font-medium">
                  Press Enter to send
                </span>

                <button
                  type="submit"
                  disabled={loading || isStreaming || !query.trim()}
                  className="
                    flex
                    h-8
                    px-3.5
                    items-center
                    gap-1.5
                    rounded-[9px]
                    bg-navy
                    text-white
                    text-[11px]
                    font-bold
                    transition-all
                    duration-150
                    hover:bg-navy-hover
                    active:scale-[0.97]
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                    shadow-2xs
                  "
                  title="Send message"
                  aria-label="Send message"
                >
                  <span>Send</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>

            <p className="mt-1.5 px-1 text-center text-[8px] leading-3 text-muted/50">
              GST Copilot uses the current page and active taxpayer account context.
            </p>
          </form>
        </section>
      )}
    </div>
  );
};

export default ChatbotWidget;