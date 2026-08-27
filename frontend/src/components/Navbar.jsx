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
  Globe,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo.png";

const megaMenus = {
  Services: {
    tabs: [
      "Registration",
      "Payments",
      "User Services",
      "Refunds",
      "e-Way Bill System",
      "Track Application Status",
    ],

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
          to: "/registration/filing-clarifications",
        },
        {
          label:
            "Home State GSK selection for Promoter/Director of specific COBs",
          to: "/registration/home-state-gsk",
        },
      ],

      Payments: [
        {
          label: "Create Challan",
          to: "/services/payments/create-challan",
        },
        {
          label: "Track Payment Status",
          to: "/services/payments/track-status",
        },
        {
          label: "Grievance against Payment (GST PMT-07)",
          to: "/services/payments/grievance",
        },
      ],

      "User Services": [
        {
          label: "Search HSN Code",
          to: "/services/user-services/search-hsn",
        },
        {
          label: "Generate User ID for Unregistered Applicant",
          to: "/services/user-services/generate-user-id",
        },
        {
          label: "Cause List",
          to: "/services/user-services/cause-list",
        },
        {
          label: "Verify RFN",
          to: "/services/user-services/verify-rfn",
        },
        {
          label: "Holiday List",
          to: "/services/user-services/holiday-list",
        },
        {
          label: "Locate GST Practitioner (GSTP)",
          to: "/services/user-services/locate-gstp",
        },
        {
          label: "Search Advance Ruling",
          to: "#",
        },
      ],

      Refunds: [
        {
          label: "Track Application Status",
          to: "/refunds/track-application-status",
        },
      ],

      "e-Way Bill System": [
        {
          label: "e-Way Bill System",
          to: "/services/eway-bill",
        },
      ],

      "Track Application Status": [
        {
          label: "Track Application Status",
          to: "/services/track-application-status",
        },
      ],
    },
  },

  Downloads: {
    tabs: ["Offline Tools", "GST Statistics"],

    content: {
      "Offline Tools": [
        { label: "Returns Offline Tool", to: "/download/returns" },
        { label: "Matching Offline Tool", to: "/download/matching" },
        { label: "Tran-1 Offline Tools", to: "/download/tran1" },
        { label: "Tran-2 Offline Tools", to: "/download/tran2" },
        { label: "GSTR3B Offline Utility", to: "/download/gstr3b" },
        { label: "ITC01 Offline Tool", to: "/download/itc01" },
        { label: "ITC03 Offline Tool", to: "/download/itc03" },
        { label: "ITC04 Offline Tool", to: "/download/itc04" },
        { label: "GST ARA 01 - Application for Advance Ruling", to: "/download/ara01" },
        { label: "GSTR-4 Offline Tool (Quarterly filing)", to: "/download/gstr4-quarterly" },
        { label: "GSTR 6 Offline Tool With Amendments", to: "/download/gstr6" },
        { label: "GSTR 11 Offline Tool", to: "/download/gstr11" },
        { label: "GSTR7 Offline Utility", to: "/download/gstr7" },
        { label: "GSTR8 Offline Tool", to: "/download/gstr8" },
        { label: "SRM-I Offline Tool", to: "/download/srm1" },
        { label: "SRM-II Offline Tool", to: "/download/srm2" },
        { label: "GSTR10 Offline Tool", to: "/download/gstr10" },
        { label: "GSTR-9 Offline Tool", to: "/download/gstr9" },
        { label: "GSTR-9A Offline Tool", to: "/download/gstr9a" },
        { label: "GSTR-9C Offline Tool", to: "/download/gstr9c" },
        { label: "GSTR-4 Offline Tool (Annual)", to: "/download/gstr4-annual" },
        { label: "GST DRC-22A - Application for Objection to Provisional Attachment Order", to: "/download/drc22a" },
        { label: "IMS Offline Tool", to: "/download/ims" },
        { label: "TDS & TCS Credit Received Offline Tool", to: "/download/tds-tcs" },
      ],

      "GST Statistics": [
        { label: "GST Statistics & National Compliance Reports", to: "/gst-statistics" },
      ],
    },
  },
};

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

const navLinks = [
  {
    label: "Home",
    labelKey: "navHome",
    href: "/",
  },
  {
    label: "GSTR-3B Simplified",
    labelKey: "navGstr3b",
    to: "/gstr3b-simplified",
  },
  {
    label: "Services",
    labelKey: "navServices",
    mega: true,
  },
  {
    label: "GST Law",
    labelKey: "navGstLaw",
    to: "/gst-law",
  },
  {
    label: "Downloads",
    labelKey: "navDownloads",
    mega: true,
  },
  {
    label: "Search Taxpayer",
    labelKey: "navSearchGstin",
    taxpayerSearch: true,
  },
  {
    label: "Help and Taxpayer Facilities",
    labelKey: "navHelpFacilities",
    to: "/help-taxpayer-facilities",
  },
  {
    label: "e-Invoice",
    labelKey: "navEinvoice",
    href: "/e-invoice",
  },
  {
    label: "News and Updates",
    labelKey: "navNews",
    href: "/news-and-updates",
  },
];

const FONT_STEPS = [0.9, 1, 1.1, 1.2];

const HOVER_OPEN_DELAY = 90;
const HOVER_CLOSE_DELAY = 200;

function MegaPanel({ menu, onSelect }) {
  const [previewTab, setPreviewTab] = useState(null);

  const links = previewTab
    ? menu.content[previewTab] || []
    : [];

  return (
    <div
      className="
    static z-50
    flex flex-col w-full
    origin-top
    animate-[megaPanelIn_160ms_ease-out]
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
    lg:flex-row
  "
    >

      <div
        className="
          w-full
          shrink-0
          border-r border-line
          bg-slate-50
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
        hover:bg-navy/5
        hover:text-navy-hover
        focus-visible:bg-navy/5
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
        hover:bg-navy/5
        hover:text-navy-hover
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

  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const openTimeoutRef = useRef(null);

  const isTouchDevice = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none)").matches;

  const isTaxpayerRoute =
    location.pathname.startsWith("/search-taxpayer/");

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

  const handleClick = (label) => {
    clearTimers();

    setOpenMenu((current) =>
      current === label ? null : label
    );
  };

  useEffect(() => {
    document.documentElement.style.fontSize =
      `${FONT_STEPS[fontStep] * 100}%`;
  }, [fontStep]);

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

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const selectLink = (label) => {
    setActiveLink(label);
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className="w-full text-white">
      <style>{`
        @keyframes megaPanelIn {
          from { opacity: 0; transform: translateY(-4px) scaleY(0.98); }
          to { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[megaPanelIn_160ms_ease-out\\] { animation: none; }
        }
      `}</style>


      <div className="bg-navy">
        <div className="mx-auto max-w-360 px-4 sm:px-6">

          <div className="flex h-9 items-center justify-between gap-3 border-b border-white/10 text-[0.75rem] sm:text-[0.8rem]">
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

            <div className="hidden items-center gap-3 sm:flex">
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
                    cursor-pointer
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
                    cursor-pointer
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


          <div className="flex min-h-19.5 items-center justify-between gap-3 py-3 sm:gap-6 sm:py-0">
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
              <Link to="/">
                <img
                  src={logo}
                  alt="GST Portal Logo"
                  className="h-12 w-12 shrink-0 object-contain sm:h-20 sm:w-20"
                />
              </Link>

              <div>
                <h1 className="font-serif text-[1.15rem] leading-[1.1] tracking-[-0.02em] text-white sm:text-[1.65rem]">
                  Goods and Services Tax
                </h1>

                <p className="mt-1 hidden text-[0.68rem] font-medium uppercase tracking-[0.08em] text-white/55 sm:block sm:text-[0.78rem]">
                  Government of India, States and Union Territories
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
              {!isLoggedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="hidden rounded border border-white/40 px-4 py-2 text-[0.9rem] font-medium transition-all hover:bg-white/10 active:scale-[0.98] cursor-pointer sm:block"
                  >
                    {t('navRegister')}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="hidden rounded bg-white px-5 py-2 text-[0.9rem] font-semibold text-navy transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer sm:block"
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
                      <div className="text-[10px] text-slate-400 mb-2.5">
                        Last Logged In: {user?.lastLogin || 'Today'}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate('/profile');
                        }}
                        className="w-full flex items-center justify-center gap-1.5 rounded bg-navy hover:bg-navy-hover text-white font-bold py-2 border border-navy mb-2 transition-colors cursor-pointer shadow-xs"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber" />
                        <span>My Taxpayer Dashboard</span>
                      </button>

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


      <nav
        ref={navRef}
        className={`
          bg-navy-2
          ${mobileOpen ? "block" : "hidden"}
          lg:block
        `}
      >
        <div className="relative mx-auto max-w-360 px-0 sm:px-6">
          <div className="flex max-h-[calc(100vh-8rem)] flex-col overflow-y-auto overscroll-contain lg:max-h-none lg:flex-row lg:items-stretch lg:overflow-visible">
            {!isLoggedIn && (
              <div className="flex gap-2 border-b border-white/10 p-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="min-h-10 flex-1 rounded border border-white/35 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  {t('navRegister')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="min-h-10 flex-1 rounded bg-white px-3 py-2 text-sm font-semibold text-navy transition-colors hover:bg-white/90"
                >
                  {t('navLogin')}
                </button>
              </div>
            )}

            {navLinks.map((link) => {
              const isOpen = openMenu === link.label;

              const isSearchTaxpayer =
                link.taxpayerSearch;

              const isActive =
                currentActiveNav === link.label;

              if (isSearchTaxpayer) {
                return (
                  <div
                    key={link.label}
                    className="relative lg:shrink-0"
                    onMouseEnter={() => !isTouchDevice() && handleMouseEnter(link.label)}
                    onMouseLeave={() => !isTouchDevice() && handleMouseLeave()}
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
                        whitespace-normal
                        px-4
                        text-left
                        lg:whitespace-nowrap
                        text-[0.87rem]
                        font-medium
                        transition-colors
                        duration-150

                        ${isActive || isOpen
                          ? "bg-navy-hover text-white"
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

                        {t(link.labelKey)}
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

                    {isOpen && (
                      <div
                        className="
                          static z-50
                          w-full
                          min-w-full
                          origin-top
                          animate-[megaPanelIn_160ms_ease-out]
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

                                  hover:bg-navy/5
                                  hover:text-navy-hover

                                  focus-visible:bg-navy/5
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
                                    group-hover:text-navy-hover
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

              if (link.mega) {
                const menu = megaMenus[link.label];

                return (
                  <div
                    key={link.label}
                    className="relative lg:shrink-0"
                    onMouseEnter={() => !isTouchDevice() && handleMouseEnter(link.label)}
                    onMouseLeave={() => !isTouchDevice() && handleMouseLeave()}
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
                        whitespace-normal
                        px-4
                        text-left
                        lg:whitespace-nowrap
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
                      {t(link.labelKey)}

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
    whitespace-normal
    px-4
    text-[0.87rem]
    lg:whitespace-nowrap
    font-medium
    transition-colors
    duration-150

    ${isActive
                        ? "border-b-2 border-amber bg-navy-hover text-white"
                        : "text-white/90 hover:bg-navy-hover hover:text-white"
                      }

    focus-visible:outline-2
    focus-visible:outline-amber
  `}
                  >
                    {t(link.labelKey)}
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