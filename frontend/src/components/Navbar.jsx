import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  X,
  User,
  LogOut,
  ShieldCheck,
  Globe
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo.png";

/* =========================================================
   MEGA MENU DATA
========================================================= */

const megaMenus = {
  Services: {
    tabs: ["Registration", "Payments", "User Services", "Refunds"],

    content: {
      Registration: [
        {
          label: "New Registration",
          to: "/registration",
        },
        {
          label: "Track Application Status",
          to: "/registration/track-status",
        },
        {
          label: "Application for Filing Clarifications",
          to: "#",
        },
        {
          label:
            "Home State GSK selection for Promoter/Director of specific COBs",
          to: "/registration/home-state-gsk",
        },
      ],

      Payments: [
        "Create Challan",
        "Track Payment Status",
        "Grievance against Payment (GST PMT-07)",
      ],

      "User Services": [
        "Search HSN Code",
        "Generate User ID for Unregistered Applicant",
        "Cause List",
        "Verify RFN",
        "Holiday List",
        "Locate GST Practitioner (GSTP)",
        "Search Advance Ruling",
      ],

      Refunds: ["Track Application Status"],
    },
  },

  Downloads: {
    tabs: ["Offline Tools", "GST Statistics"],

    content: {
      "Offline Tools": [
        "Returns Offline Tool",
        "Matching Offline Tool",
        "Tran-1 Offline Tools",
        "Tran-2 Offline Tools",
        "GSTR3B Offline Utility",
        "ITC01 Offline Tool",
        "ITC03 Offline Tool",
        "ITC04 Offline Tool",
        "GST ARA 01 - Application for Advance Ruling",
        "GSTR-4 Offline Tool (Quarterly filing)",
        "GSTR 6 Offline Tool With Amendments",
        "GSTR 11 Offline Tool",
        "GSTR7 Offline Utility",
        "GSTR8 Offline Tool",
        "SRM-I Offline Tool",
        "SRM-II Offline Tool",
        "GSTR10 Offline Tool",
        "GSTR-9 Offline Tool",
        "GSTR-9A Offline Tool",
        "GSTR-9C Offline Tool",
        "GSTR-4 Offline Tool (Annual)",
        "GST DRC-22A - Application for Objection to Provisional Attachment Order",
        "IMS Offline Tool",
        "TDS & TCS Credit Received Offline Tool",
      ],

      "GST Statistics": [
        "Monthly Collection Reports",
        "State-wise Revenue Reports",
      ],
    },
  },
};

/* =========================================================
   SEARCH TAXPAYER ROUTES
========================================================= */

const taxpayerSearchLinks = [
  {
    label: "Search by GSTIN/UIN",
    path: "/search-taxpayer/gstin",
  },
  {
    label: "Search by PAN",
    path: "/search-taxpayer/pan",
  },
  {
    label: "Search Temporary ID",
    path: "/search-taxpayer/temporary-id",
  },
  {
    label: "Search Composition Taxpayer",
    path: "/search-taxpayer/composition",
  },
];

/* =========================================================
   MAIN NAVIGATION
========================================================= */

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    mega: true,
  },
  {
    label: "GST Law",
    to: "/gst-law",
  },
  {
    label: "Downloads",
    mega: true,
  },
  {
    label: "Search Taxpayer",
    taxpayerSearch: true,
  },
  {
    label: "Help and Taxpayer Facilities",
    to: "/help-taxpayer-facilities",
  },
  {
    label: "e-Invoice",
    href: "#",
  },
  {
    label: "News and Updates",
    href: "#",
  },
];

/* =========================================================
   CONFIG
========================================================= */

const FONT_STEPS = [0.9, 1, 1.1, 1.2];

const HOVER_OPEN_DELAY = 90;
const HOVER_CLOSE_DELAY = 200;

/* =========================================================
   MEGA PANEL
========================================================= */

function MegaPanel({ menu, onSelect }) {
  const [previewTab, setPreviewTab] = useState(null);

  const links = previewTab
    ? menu.content[previewTab] || []
    : [];

  return (
    <div
      className="
        static z-50
        flex w-full
        overflow-hidden
        rounded-b-lg
        border border-line
        bg-white
        text-ink
        shadow-xl

        lg:absolute
        lg:left-0
        lg:top-11
        lg:w-[min(760px,90vw)]
      "
    >
      {/* =====================================================
          LEFT CATEGORY PANEL
      ===================================================== */}

      <div
        className="
          w-full
          shrink-0
          border-r border-line
          bg-[#f7f8fa]
          py-1.5

          lg:w-55
        "
      >
        {menu.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onMouseEnter={() => setPreviewTab(tab)}
            onFocus={() => setPreviewTab(tab)}
            onClick={() => setPreviewTab(tab)}
            className={`
              flex w-full
              items-center justify-between
              gap-2
              px-4 py-2.5
              text-left
              text-[0.87rem]
              font-medium
              transition-colors

              focus-visible:outline-2
              focus-visible:outline-amber
              focus-visible:-outline-offset-2

              ${previewTab === tab
                ? "bg-white text-navy shadow-sm"
                : "text-ink/80 hover:bg-white/80 hover:text-navy"
              }
            `}
          >
            <span>{tab}</span>

            <ChevronRight
              size={14}
              className={`
                shrink-0
                transition-all
                ${previewTab === tab
                  ? "translate-x-0 opacity-100 text-amber"
                  : "-translate-x-1 opacity-0"
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* =====================================================
          RIGHT CONTENT PANEL — DESKTOP
      ===================================================== */}

      <div className="hidden max-h-[55vh] flex-1 overflow-y-auto p-4 lg:block">
        {previewTab ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {links.map((item) => {
              const label =
                typeof item === "string"
                  ? item
                  : item.label;

              const to =
                typeof item === "string"
                  ? "#"
                  : item.to || "#";

              return (
                <Link
                  key={label}
                  to={to}
                  onClick={() => onSelect(label)}
                  className="
        group
        flex
        items-start
        gap-2
        rounded-md
        px-2.5
        py-2
        text-[0.87rem]
        leading-5
        text-navy
        transition-colors
        hover:bg-[#eef5fb]
        hover:text-[#174d82]
        focus-visible:bg-[#eef5fb]
        focus-visible:outline-none
      "
                >
                  <span
                    className="
          mt-[0.48rem]
          h-1.5
          w-1.5
          shrink-0
          rounded-full
          bg-transparent
          transition-colors
          group-hover:bg-amber
        "
                  />

                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="grid min-h-35 h-full place-items-center">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          </div>
        )}
      </div>

      {/* =====================================================
          MOBILE CONTENT
      ===================================================== */}

      {previewTab && (
        <div
          className="
            w-full
            border-t border-line
            p-4

            lg:hidden
          "
        >
          <div className="grid gap-1">
            {links.map((item) => {
              const label =
                typeof item === "string"
                  ? item
                  : item.label;

              const to =
                typeof item === "string"
                  ? "#"
                  : item.to || "#";

              return (
                <Link
                  key={label}
                  to={to}
                  onClick={() => onSelect(label)}
                  className="
        rounded-md
        px-2.5
        py-2
        text-[0.87rem]
        text-navy
        transition-colors
        hover:bg-[#eef5fb]
        hover:text-[#174d82]
      "
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();

  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [fontStep, setFontStep] = useState(1);
  const [highContrast, setHighContrast] = useState(false);

  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const openTimeoutRef = useRef(null);

  /* =========================================================
     SEARCH TAXPAYER ACTIVE STATE
  ========================================================= */

  const isTaxpayerRoute =
    location.pathname.startsWith("/search-taxpayer/");

  /* =========================================================
     CURRENT ACTIVE MAIN NAV ITEM
  ========================================================= */

  const getActiveNav = () => {
    if (isTaxpayerRoute) {
      return "Search Taxpayer";
    }

    if (location.pathname === "/") {
      return "Home";
    }

    return activeLink;
  };

  const currentActiveNav = getActiveNav();

  /* =========================================================
     TIMERS
  ========================================================= */

  const clearTimers = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
    }
  };

  const handleMouseEnter = (label) => {
    clearTimers();

    openTimeoutRef.current = setTimeout(() => {
      setOpenMenu(label);
    }, HOVER_OPEN_DELAY);
  };

  const handleMouseLeave = () => {
    clearTimers();

    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, HOVER_CLOSE_DELAY);
  };

  /* =========================================================
     DROPDOWN CLICK
  ========================================================= */

  const handleClick = (label) => {
    clearTimers();

    setOpenMenu((current) =>
      current === label ? null : label
    );
  };

  /* =========================================================
     ACCESSIBILITY
  ========================================================= */

  useEffect(() => {
    document.documentElement.style.fontSize =
      `${FONT_STEPS[fontStep] * 100}%`;
  }, [fontStep]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "high-contrast",
      highContrast
    );
  }, [highContrast]);

  /* =========================================================
     OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================================
     ESCAPE
  ========================================================= */

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  /* =========================================================
     CLEANUP
  ========================================================= */

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  /* =========================================================
     LINK SELECT
  ========================================================= */

  const selectLink = (label) => {
    setActiveLink(label);
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className="w-full text-white">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-navy">
        <div className="mx-auto max-w-360 px-6">
          {/* =================================================
              ACCESSIBILITY ROW
          ================================================= */}

          <div className="flex h-9 items-center justify-between border-b border-white/10 text-[0.8rem]">
            <a
              href="#main"
              className="
                rounded
                text-white/70
                transition-colors
                hover:text-white

                focus-visible:outline
                focus-visible:outline-amber
                focus-visible:outline-offset-2
              "
            >
              Skip to main content
            </a>

            <div className="flex items-center gap-3">
              {/* Global Website Language Selector */}
              <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/25 rounded px-2 py-0.5 text-xs text-white transition-colors">
                <Globe className="w-3.5 h-3.5 text-amber shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
                  aria-label="Select Website Language"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-navy text-white font-medium">
                      {lang.nativeName} ({lang.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* High Contrast */}
              <button
                type="button"
                aria-pressed={highContrast}
                aria-label="Toggle high contrast"
                onClick={() =>
                  setHighContrast((value) => !value)
                }
                className={`
                  grid h-6 w-6
                  place-items-center
                  rounded-full
                  border
                  text-xs
                  transition-colors

                  focus-visible:outline-2
                  focus-visible:outline-amber
                  focus-visible:outline-offset-2

                  ${highContrast
                    ? "border-amber bg-amber text-navy"
                    : "border-white/40 text-white/80 hover:border-white hover:text-white"
                  }
                `}
              >
                ◐
              </button>

              {/* Font Size */}
              <div
                className="flex items-center gap-1"
                role="group"
                aria-label="Text size"
              >
                <button
                  type="button"
                  aria-label="Decrease text size"
                  disabled={fontStep === 0}
                  onClick={() =>
                    setFontStep((step) =>
                      Math.max(0, step - 1)
                    )
                  }
                  className="
                    rounded
                    text-white/80
                    transition-colors
                    hover:text-white

                    focus-visible:outline-2
                    focus-visible:outline-amber
                    focus-visible:outline-offset-2

                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  A<sup>-</sup>
                </button>

                <span
                  className="px-1 text-white/30"
                  aria-hidden="true"
                >
                  |
                </span>

                <button
                  type="button"
                  aria-label="Increase text size"
                  disabled={
                    fontStep === FONT_STEPS.length - 1
                  }
                  onClick={() =>
                    setFontStep((step) =>
                      Math.min(
                        FONT_STEPS.length - 1,
                        step + 1
                      )
                    )
                  }
                  className="
                    rounded
                    text-white/80
                    transition-colors
                    hover:text-white

                    focus-visible:outline-2
                    focus-visible:outline-amber
                    focus-visible:outline-offset-2

                    disabled:cursor-not-allowed
                    disabled:opacity-30
                  "
                >
                  A<sup>+</sup>
                </button>
              </div>
            </div>
          </div>

          {/* =================================================
              BRANDING ROW
          ================================================= */}

          <div className="flex min-h-19.5 items-center justify-between gap-6">
            {/* Logo + Branding */}
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="GST Portal Logo"
                className="
                  h-20
                  w-20
                  shrink-0
                  object-contain
                "
              />

              <div>
                <h1 className="text-[1.4rem] font-semibold leading-tight tracking-tight">
                  Goods and Services Tax
                </h1>

                <p className="mt-0.5 text-[0.85rem] text-white/60">
                  Government of India, States and Union Territories
                </p>
              </div>
            </div>

            {/* Actions / Logged In Taxpayer Profile */}
            <div className="flex items-center gap-2.5">
              {!isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="
                      rounded border border-white/40 px-4 py-2 text-[0.9rem] font-medium transition-all
                      hover:bg-white/10 active:scale-[0.98] cursor-pointer
                    "
                  >
                    {t('navRegister')}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="
                      rounded bg-white px-5 py-2 text-[0.9rem] font-semibold text-navy transition-all
                      hover:bg-white/90 active:scale-[0.98] cursor-pointer
                    "
                  >
                    {t('navLogin')}
                  </button>
                </>
              ) : (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 rounded bg-white/10 hover:bg-white/20 border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer shadow-xs"
                  >
                    <User className="w-4 h-4 text-amber" />
                    <span>{user?.name || 'Ramesh Kumar'}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-10 w-64 bg-white text-ink rounded-lg shadow-xl border border-line p-3.5 z-50 text-xs">
                      <div className="border-b border-line pb-2.5 mb-2.5">
                        <p className="font-bold text-navy text-sm leading-snug">{user?.name}</p>
                        <p className="text-[11px] text-ink/80 font-medium">{user?.tradeName || 'Nagpur Hardware Store'}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-1">GSTIN: {user?.gstin}</p>
                      </div>
                      <div className="text-[10px] text-slate-400 mb-3">
                        Last Logged In: {user?.lastLogin || 'Today'}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center justify-center gap-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 border border-red-200 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('navLogout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu */}
              <button
                type="button"
                aria-label={
                  mobileOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={mobileOpen}
                onClick={() =>
                  setMobileOpen((value) => !value)
                }
                className="
                  ml-1
                  grid h-9 w-9
                  place-items-center
                  rounded
                  border border-white/40

                  lg:hidden
                "
              >
                {mobileOpen ? (
                  <X size={18} />
                ) : (
                  <Menu size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        ref={navRef}
        className={`
          bg-navy-2
          ${mobileOpen ? "block" : "hidden"}
          lg:block
        `}
      >
        <div className="relative mx-auto max-w-360 px-6">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {navLinks.map((link) => {
              const isOpen = openMenu === link.label;

              const isSearchTaxpayer =
                link.taxpayerSearch;

              const isActive =
                currentActiveNav === link.label;

              /* =================================================
                 SEARCH TAXPAYER
              ================================================= */

              if (isSearchTaxpayer) {
                return (
                  <div
                    key={link.label}
                    className="relative lg:shrink-0"
                    onMouseEnter={() =>
                      handleMouseEnter(link.label)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleClick(link.label)
                      }
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`
                        flex h-11 w-full
                        items-center
                        justify-between
                        gap-2
                        whitespace-nowrap
                        px-4
                        text-left
                        text-[0.87rem]
                        font-medium
                        transition-colors
                        duration-150

                        ${isActive || isOpen
                          ? "bg-[#3F6F9F] text-white"
                          : "text-white/90 hover:bg-navy-hover hover:text-white"
                        }

                        focus-visible:outline-2
                        focus-visible:outline-amber
                        lg:w-auto
                        lg:justify-start
                      `}
                    >
                      <span className="flex items-center gap-2">
                        <Search size={14} />

                        {link.label}
                      </span>

                      <ChevronDown
                        size={14}
                        className={`
                          transition-transform
                          duration-200
                          ${isOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    {/* Search Taxpayer Dropdown */}
                    {isOpen && (
                      <div
                        className="
                          static z-50
                          min-w-full
                          overflow-hidden
                          rounded-b-lg
                          border border-line
                          bg-white
                          text-ink
                          shadow-xl

                          lg:absolute
                          lg:left-0
                          lg:top-11
                          lg:min-w-[290px]
                        "
                      >
                        <div className="py-1.5">
                          {taxpayerSearchLinks.map(
                            (item) => (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() =>
                                  selectLink(
                                    "Search Taxpayer"
                                  )
                                }
                                className="
                                  group
                                  flex
                                  items-center
                                  justify-between
                                  gap-4
                                  px-4 py-3
                                  text-[0.87rem]
                                  font-medium
                                  text-navy
                                  transition-colors

                                  hover:bg-[#eef5fb]
                                  hover:text-[#174d82]

                                  focus-visible:bg-[#eef5fb]
                                  focus-visible:outline-none
                                "
                              >
                                <span>
                                  {item.label}
                                </span>

                                <ChevronRight
                                  size={15}
                                  className="
                                    shrink-0
                                    text-slate-400
                                    transition-transform
                                    duration-150

                                    group-hover:translate-x-0.5
                                    group-hover:text-[#315b91]
                                  "
                                />
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              /* =================================================
                 MEGA MENU
              ================================================= */

              if (link.mega) {
                const menu = megaMenus[link.label];

                return (
                  <div
                    key={link.label}
                    className="relative lg:shrink-0"
                    onMouseEnter={() =>
                      handleMouseEnter(link.label)
                    }
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleClick(link.label)
                      }
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`
                        flex h-11 w-full
                        items-center
                        justify-between
                        gap-2
                        whitespace-nowrap
                        px-4
                        text-left
                        text-[0.87rem]
                        font-medium
                        transition-colors
                        duration-150

                        ${isOpen
                          ? "bg-navy-hover text-white"
                          : "text-white/90 hover:bg-navy-hover hover:text-white"
                        }

                        focus-visible:outline-2
                        focus-visible:outline-amber

                        lg:w-auto
                        lg:justify-start
                      `}
                    >
                      {link.label}

                      <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className={`
                          transition-transform
                          duration-200
                          ${isOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    {isOpen && (
                      <MegaPanel
                        menu={menu}
                        onSelect={() =>
                          selectLink(link.label)
                        }
                      />
                    )}
                  </div>
                );
              }

              /* =================================================
                 NORMAL NAV LINK
              ================================================= */

              return (
                <div
                  key={link.label}
                  className="relative lg:shrink-0"
                >
                  <Link
                    to={link.to || link.href || "#"}
                    onClick={() => selectLink(link.label)}
                    aria-current={isActive ? "page" : undefined}
                    className={`
    flex h-11
    items-center
    whitespace-nowrap
    px-4
    text-[0.87rem]
    font-medium
    transition-colors
    duration-150

    ${isActive
                        ? "border-b-2 border-amber bg-[#3F6F9F] text-white"
                        : "text-white/90 hover:bg-navy-hover hover:text-white"
                      }

    focus-visible:outline-2
    focus-visible:outline-amber
  `}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;