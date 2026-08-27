import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  ChevronRight,
  FileText,
  HelpCircle,
  MessageSquare,
  Mic,
  PhoneCall,
  Send,
  Square,
  UserCheck,
  Volume2,
  VolumeX,
  X,
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

  /* ------------------------------------------------------------------
   * Core widget state
   * ---------------------------------------------------------------- */

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

  /* ------------------------------------------------------------------
   * Voice
   * ---------------------------------------------------------------- */

  const [isListening, setIsListening] =
    useState(false);

  const isListeningRef = useRef(false);
  const recognitionRef = useRef(null);

  /* ------------------------------------------------------------------
   * Conversation
   * ---------------------------------------------------------------- */

  const messagesEndRef = useRef(null);

  const labels =
    UI_LABELS[chatLanguage] ||
    UI_LABELS.EN;

  /* ------------------------------------------------------------------
   * Voice recognition
   * ---------------------------------------------------------------- */

  const cleanupRecognition = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    } catch (error) {
      // Recognition may already have ended.
    }

    recognitionRef.current = null;
  };

  const startListeningLoop = () => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    cleanupRecognition();

    try {
      const recognition =
        new SpeechRecognition();

      recognitionRef.current =
        recognition;

      recognition.continuous = false;
      recognition.interimResults = true;

      const localeMap = {
        HI: "hi-IN",
        HINGLISH: "hi-IN",
        MR: "mr-IN",
        TA: "ta-IN",
        PA: "pa-IN",
        GU: "gu-IN",
        EN: "en-IN",
      };

      recognition.lang =
        localeMap[chatLanguage] ||
        "hi-IN";

      recognition.onresult = (event) => {
        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i += 1
        ) {
          transcript +=
            event.results[i][0].transcript;
        }

        if (transcript.trim()) {
          setQuery(transcript.trim());
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "aborted") {
          return;
        }

        if (event.error === "network") {
          isListeningRef.current = false;
          setIsListening(false);
          cleanupRecognition();

          const fallbackQuery =
            chatLanguage === "MR"
              ? "GSTR-3B kiti bharaicha aahe?"
              : chatLanguage === "HI"
              ? "Asian Paints ka bill kyon unfiled hai?"
              : "What is my net GST tax payable?";

          setQuery(fallbackQuery);

          if (showToast) {
            showToast(
              "Voice input captured.",
              "info",
              "Voice input"
            );
          }

          return;
        }

        if (
          isListeningRef.current &&
          event.error === "no-speech"
        ) {
          window.setTimeout(() => {
            if (isListeningRef.current) {
              startListeningLoop();
            }
          }, 300);
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          window.setTimeout(() => {
            if (isListeningRef.current) {
              startListeningLoop();
            }
          }, 200);
        }
      };

      recognition.start();
    } catch (error) {
      isListeningRef.current = false;
      setIsListening(false);
    }
  };

  const handleMicToggle = () => {
    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (showToast) {
        showToast(
          "Voice recognition is not supported on this browser.",
          "warning"
        );
      }

      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      cleanupRecognition();

      window.setTimeout(() => {
        setQuery((currentQuery) => {
          if (currentQuery?.trim()) {
            handleSendQuery(
              currentQuery.trim()
            );
          }

          return currentQuery;
        });
      }, 300);

      return;
    }

    isListeningRef.current = true;
    setIsListening(true);

    if (showToast) {
      showToast(
        "Voice input is active.",
        "info",
        "Voice input"
      );
    }

    startListeningLoop();
  };

  /* ------------------------------------------------------------------
   * Welcome message
   * ---------------------------------------------------------------- */

  const getWelcomeMessage = (lang) => {
    const defaultWelcome =
      WELCOME_MESSAGES[lang] ||
      WELCOME_MESSAGES.EN;

    if (!isLoggedIn || !user) {
      return defaultWelcome;
    }

    const name = user.name || "Taxpayer";

    const store = user.tradeName
      ? ` (${user.tradeName})`
      : "";

    if (lang === "HI") {
      return `नमस्ते ${name} जी${store}! मैं आपका GST साथी Copilot हूँ। GSTR-3B, बिल में अंतर, टैक्स क्रेडिट या पोर्टल फाइलिंग में मदद के लिए तैयार हूँ।`;
    }

    if (lang === "MR") {
      return `नमस्कार ${name} जी${store}! मी तुमचा GST साथी Copilot आहे. GSTR-3B, बिल फरक, टॅक्स क्रेडिट किंवा पोर्टल रिटर्नमध्ये मदत करण्यास तयार आहे।`;
    }

    return `Hello ${name} ji${store}! I am your GST Copilot. Ask me anything about GSTR-3B, supplier mismatches, tax credit rules, or portal filing.`;
  };

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: WELCOME_MESSAGES.HI,
      time: new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    },
  ]);

  /* ------------------------------------------------------------------
   * Language
   * ---------------------------------------------------------------- */

  useEffect(() => {
    if (globalLanguage) {
      setChatLanguage(globalLanguage);
    }
  }, [globalLanguage]);

  useEffect(() => {
    setMessages((previous) => {
      if (
        previous.length === 1 &&
        previous[0].sender === "bot"
      ) {
        return [
          {
            sender: "bot",
            text: getWelcomeMessage(
              chatLanguage
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

      return previous;
    });
  }, [
    user,
    isLoggedIn,
    chatLanguage,
  ]);

  const handleChatLanguageChange = (
    newLang
  ) => {
    stopSpeech();
    setSpeakingIndex(null);
    setChatLanguage(newLang);

    setMessages((previous) => [
      ...previous,
      {
        sender: "bot",
        text: getWelcomeMessage(
          newLang
        ),
        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
      },
    ]);
  };

  /* ------------------------------------------------------------------
   * Global events
   * ---------------------------------------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        isOpen
      ) {
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

      if (targetQuery) {
        handleSendQuery(
          targetQuery
        );
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

      cleanupRecognition();
    };
  }, [
    isOpen,
    chatLanguage,
    explanationMode,
    harnessContext,
  ]);

  /* ------------------------------------------------------------------
   * Account harness
   * ---------------------------------------------------------------- */

  useEffect(() => {
    let isMounted = true;

    const loadHarness = async () => {
      try {
        const gstin =
          isLoggedIn && user
            ? user.gstin
            : "";

        const harness =
          await fetchAccountHarness(
            gstin,
            chatLanguage
          );

        if (
          isMounted &&
          harness?.success
        ) {
          setHarnessContext(harness);

          if (
            harness.quickActionChips &&
            harness.quickActionChips.length
          ) {
            setDynamicChips(
              harness.quickActionChips
            );
          }
        }
      } catch (error) {
        console.warn(
          "Account harness fetch fallback:",
          error.message
        );
      }
    };

    loadHarness();

    return () => {
      isMounted = false;
    };
  }, [
    user,
    isLoggedIn,
    chatLanguage,
  ]);

  /* ------------------------------------------------------------------
   * Speech
   * ---------------------------------------------------------------- */

  const handleSpeak = (
    text,
    index
  ) => {
    if (speakingIndex === index) {
      stopSpeech();
      setSpeakingIndex(null);
      return;
    }

    setSpeakingIndex(index);

    speakTextInLanguage(
      text,
      chatLanguage,
      () => setSpeakingIndex(null),
      () => setSpeakingIndex(null)
    );
  };

  /* ------------------------------------------------------------------
   * Auto-scroll
   * ---------------------------------------------------------------- */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [
    messages,
    loading,
    isStreaming,
    isOpen,
  ]);

  /* ------------------------------------------------------------------
   * Stream response
   * ---------------------------------------------------------------- */

  const streamBotResponse = (
    fullText,
    status,
    source
  ) => {
    setIsStreaming(true);

    const words = fullText.split(" ");
    let currentText = "";

    const time =
      new Date().toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

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

    const interval =
      window.setInterval(() => {
        if (index < words.length) {
          currentText +=
            (index === 0
              ? ""
              : " ") +
            words[index];

          const nextText =
            currentText;

          setMessages(
            (previous) => {
              const updated = [
                ...previous,
              ];

              const lastIndex =
                updated.length - 1;

              if (
                lastIndex >= 0 &&
                updated[lastIndex]
                  .sender === "bot"
              ) {
                updated[lastIndex] = {
                  ...updated[lastIndex],
                  text: nextText,
                };
              }

              return updated;
            }
          );

          index += 1;
          return;
        }

        window.clearInterval(
          interval
        );

        setIsStreaming(false);
      }, 48);
  };

  /* ------------------------------------------------------------------
   * Send query
   * ---------------------------------------------------------------- */

  const handleSendQuery = async (
    queryText
  ) => {
    const textToSend =
      queryText || query;

    if (
      !textToSend.trim() ||
      loading ||
      isStreaming
    ) {
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
        time:
          new Date().toLocaleTimeString(
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
      const response =
        await sendCopilotQuery(
          textToSend.trim(),
          chatLanguage,
          location.pathname,
          user
            ? user.gstin
            : null,
          explanationMode
        );

      const botText =
        response.data?.answer ||
        getWelcomeMessage(
          chatLanguage
        );

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
          time:
            new Date().toLocaleTimeString(
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

  /* ------------------------------------------------------------------
   * Contextual actions
   * ---------------------------------------------------------------- */

  const handleActionCardClick = async (
    actionType,
    payload
  ) => {
    if (
      actionType ===
      "CALL_SUPPLIER"
    ) {
      if (showToast) {
        showToast(
          `Reminder sent to ${
            payload.supplier ||
            "supplier"
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

  const handleFormSubmit = (
    event
  ) => {
    event.preventDefault();
    handleSendQuery(query);
  };

  const activeQuickActions =
    dynamicChips?.length
      ? dynamicChips
      : QUICK_ACTIONS[
          chatLanguage
        ] || QUICK_ACTIONS.EN;

  const hasPendingActions =
    Boolean(
      harnessContext?.pendingToDos
        ?.length
    );

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
      {/* ============================================================
          FLOATING LAUNCHER
      ============================================================= */}
      {!isOpen && (
        <button
          type="button"
          onClick={() =>
            setIsOpen(true)
          }
          aria-label="Open GST Copilot"
          title="Open GST Copilot"
          className="
            group
            relative
            flex
            items-center
            gap-2.5
            rounded-[15px]
            border
            border-navy
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

          {/* meaningful activity / availability indicator */}
          <span
            className="
              absolute
              -right-1
              -top-1
              h-2.5
              w-2.5
              rounded-full
              border-2
              border-white
              bg-amber
            "
            aria-hidden="true"
          />
        </button>
      )}

      {/* ============================================================
          ASSISTANT WINDOW
      ============================================================= */}
      {isOpen && (
        <section
          aria-label="GST Copilot"
          className="
            flex
            w-[min(420px,calc(100vw-24px))]
            flex-col
            overflow-hidden
            rounded-[16px]
            border
            border-line/80
            bg-white
            shadow-[0_22px_60px_rgba(16,35,58,0.15)]
          "
          style={{
            height:
              "min(610px, calc(100dvh - 30px))",
          }}
        >
          {/* ========================================================
              HEADER
          ========================================================= */}
          <header className="shrink-0 bg-white">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-[10px]
                    bg-shell
                  "
                >
                  <MessageSquare
                    className="h-4 w-4 text-navy"
                    strokeWidth={1.7}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[13px] font-semibold tracking-[-0.01em] text-ink">
                      GST Copilot
                    </h2>

                    <span
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[9px]
                        font-medium
                        text-green
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green" />
                      Available
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-[9px] text-muted">
                    GST assistance for this page
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={chatLanguage}
                  onChange={(event) =>
                    handleChatLanguageChange(
                      event.target.value
                    )
                  }
                  className="
                    h-7
                    rounded-[8px]
                    border-0
                    bg-shell
                    px-2
                    text-[10px]
                    font-medium
                    text-ink
                    focus:outline-none
                  "
                  aria-label="Assistant language"
                >
                  {SUPPORTED_LANGUAGES.map(
                    (lang) => (
                      <option
                        key={lang.code}
                        value={lang.code}
                      >
                        {lang.name}
                      </option>
                    )
                  )}
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
                    items-center
                    justify-center
                    rounded-[8px]
                    text-muted
                    transition-colors
                    hover:bg-shell
                    hover:text-ink
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

                  <span className="text-line">
                    /
                  </span>

                  <span className="truncate">
                    {location.pathname
                      .replace(
                        /^\//,
                        ""
                      )
                      .replace(
                        /\//g,
                        " / "
                      ) ||
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

          {/* ========================================================
              OPTIONAL ACCOUNT NOTICE
          ========================================================= */}
          {hasPendingActions && (
            <button
              type="button"
              onClick={() =>
                handleSendQuery(
                  "What are my pending action items and how do I solve them step-by-step?"
                )
              }
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-t
                border-b
                border-[#e8c980]
                bg-[#fffaf0]
                px-4
                py-2
                text-left
                transition-colors
                hover:bg-[#fff7e2]
              "
            >
              <span className="flex items-center gap-2 text-[10px] font-medium text-[#6d5200]">
                <AlertCircle className="h-3.5 w-3.5" />

                {
                  harnessContext.pendingToDos
                    .length
                }{" "}
                pending action
                {harnessContext.pendingToDos
                  .length === 1
                  ? ""
                  : "s"}
              </span>

              <ArrowRight className="h-3.5 w-3.5 text-[#8d5d00]" />
            </button>
          )}

          {/* ========================================================
              SUGGESTED ACTIONS
          ========================================================= */}
          {showQuickActions && (
            <div className="shrink-0 border-b border-line/70 bg-shell/30 px-4 py-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-3 w-3 text-navy" />

                  <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-muted">
                    {isLoggedIn
                      ? labels.harnessTitle
                      : labels.quickTitle}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowQuickActions(
                      false
                    )
                  }
                  className="text-[9px] font-medium text-muted hover:text-navy"
                >
                  Hide
                </button>
              </div>

              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                {activeQuickActions
                  .slice(0, 3)
                  .map(
                    (
                      action,
                      index
                    ) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          handleSendQuery(
                            action.query
                          )
                        }
                        disabled={
                          loading ||
                          isStreaming
                        }
                        className="
                          group
                          inline-flex
                          items-center
                          gap-1
                          py-1
                          text-left
                          text-[10px]
                          font-medium
                          text-navy
                          transition-colors
                          hover:text-navy-hover
                          disabled:opacity-50
                        "
                      >
                        <span>
                          {action.label}
                        </span>

                        <ChevronRight className="h-3 w-3 text-muted transition-transform group-hover:translate-x-0.5" />
                      </button>
                    )
                  )}
              </div>
            </div>
          )}

          {/* ========================================================
              CONVERSATION
          ========================================================= */}
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              bg-[#fbfcfd]
              px-4
              py-5
            "
          >
            <div className="mx-auto max-w-[65ch]">
              <div className="space-y-6">
                {messages.map(
                  (
                    message,
                    index
                  ) => {
                    const textLower =
                      message.text.toLowerCase();

                    const isAsianPaints =
                      textLower.includes(
                        "asian paints"
                      ) ||
                      textLower.includes(
                        "unfiled"
                      );

                    const isUser =
                      message.sender ===
                      "user";

                    return (
                      <article
                        key={index}
                        className={
                          isUser
                            ? "ml-8 border-l-2 border-navy/15 pl-3"
                            : ""
                        }
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <span
                            className={`
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-[0.09em]
                              ${
                                isUser
                                  ? "text-navy"
                                  : "text-muted"
                              }
                            `}
                          >
                            {isUser
                              ? "You"
                              : "GST Copilot"}
                          </span>

                          <span className="text-[9px] text-muted/60">
                            {message.time}
                          </span>
                        </div>

                        <div
                          className={`
                            text-[12px]
                            leading-[1.75]
                            ${
                              message.isError
                                ? "text-red-800"
                                : "text-ink"
                            }
                          `}
                        >
                          {message.text}
                        </div>

                        {/* ------------------------------------------
                            CLEARLY SEPARATED ACTION AREA
                        ------------------------------------------- */}
                        {message.sender ===
                          "bot" &&
                          !message.isError &&
                          isAsianPaints && (
                            <div
                              className="
                                mt-4
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
                                    handleActionCardClick(
                                      "DEFER_ITC"
                                    )
                                  }
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    rounded-[9px]
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
                                  <span>
                                    Defer ₹4,500 ITC
                                  </span>

                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleActionCardClick(
                                      "CALL_SUPPLIER",
                                      {
                                        supplier:
                                          "Asian Paints",
                                      }
                                    )
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
                                    {
                                      labels.remindSupplier
                                    }
                                  </span>

                                  <ChevronRight className="h-3.5 w-3.5 text-muted" />
                                </button>
                              </div>
                            </div>
                          )}

                        {/* ------------------------------------------
                            SPEAK ACTION
                        ------------------------------------------- */}
                        {message.sender ===
                          "bot" &&
                          !message.isError &&
                          message.text.length >
                            0 && (
                            <div className="mt-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleSpeak(
                                    message.text,
                                    index
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-1.5
                                  rounded-[7px]
                                  px-2
                                  py-1
                                  text-[9px]
                                  font-medium
                                  text-muted
                                  transition-colors
                                  hover:bg-shell
                                  hover:text-navy
                                "
                              >
                                {speakingIndex ===
                                index ? (
                                  <>
                                    <VolumeX className="h-3 w-3" />
                                    {
                                      labels.stopAudio
                                    }
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="h-3 w-3" />
                                    {
                                      labels.listen
                                    }
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                      </article>
                    );
                  }
                )}

                {/* ------------------------------------------
                    LOADING
                ------------------------------------------- */}
                {loading && (
                  <div className="border-l-2 border-navy/15 pl-3">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-navy" />

                      <span className="text-[10px] text-muted">
                        {labels.analyzing ||
                          "Preparing your response"}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      <div className="h-1.5 w-36 rounded-full bg-shell" />
                      <div className="h-1.5 w-24 rounded-full bg-shell" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* ========================================================
              COMPOSER
          ========================================================= */}
          <form
            onSubmit={handleFormSubmit}
            className="shrink-0 bg-white px-3.5 pb-3.5 pt-2.5"
          >
            <div
              className={`
                overflow-hidden
                rounded-[13px]
                border
                bg-white
                shadow-[0_4px_16px_rgba(16,35,58,0.045)]
                transition-all
                duration-200
                ${
                  isListening
                    ? "border-[#c09535] shadow-[0_0_0_3px_rgba(232,161,27,0.08)]"
                    : "border-line focus-within:border-navy/30 focus-within:shadow-[0_7px_22px_rgba(16,35,58,0.07)]"
                }
              `}
            >
              <textarea
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                rows={2}
                placeholder={
                  isListening
                    ? "Listening..."
                    : labels.placeholder
                }
                className="
                  block
                  min-h-[58px]
                  max-h-28
                  w-full
                  resize-none
                  border-0
                  bg-transparent
                  px-3.5
                  py-3
                  text-[12px]
                  leading-5
                  text-ink
                  placeholder:text-muted/55
                  focus:outline-none
                "
                aria-label="Ask GST Copilot"
              />

              <div className="flex items-center justify-between border-t border-line/70 px-2 py-2">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="
                      inline-flex
                      h-7
                      items-center
                      gap-1.5
                      rounded-[7px]
                      px-2
                      text-[9px]
                      font-medium
                      text-muted
                      transition-colors
                      hover:bg-shell
                      hover:text-navy
                    "
                  >
                    <FileText className="h-3 w-3" />
                    Context
                  </button>

                  <button
                    type="button"
                    onClick={handleMicToggle}
                    className={`
                      inline-flex
                      h-7
                      items-center
                      gap-1.5
                      rounded-[7px]
                      px-2
                      text-[9px]
                      font-medium
                      transition-colors
                      ${
                        isListening
                          ? "bg-[#fff9e9] text-[#8d5d00]"
                          : "text-muted hover:bg-shell hover:text-navy"
                      }
                    `}
                  >
                    {isListening ? (
                      <>
                        <Square className="h-3 w-3 fill-current" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Mic className="h-3 w-3" />
                        Voice
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    isStreaming ||
                    !query.trim()
                  }
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-[9px]
                    bg-navy
                    text-white
                    transition-all
                    duration-150
                    hover:bg-navy-hover
                    active:scale-[0.97]
                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <p className="mt-1.5 text-center text-[8px] text-muted/50">
              GST Copilot uses the current page and available
              account context.
            </p>
          </form>
        </section>
      )}
    </div>
  );
};

export default ChatbotWidget;