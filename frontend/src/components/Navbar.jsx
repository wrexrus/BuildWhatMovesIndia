import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Menu, Search, X } from "lucide-react";
import logo from "../assets/logo.png";

const megaMenus = {
  Services: {
    tabs: ["Registration", "Payments", "User Services", "Refunds"],
    content: {
      Registration: [
        "New Registration",
        "Track Application Status",
        "Application for Filing Clarifications",
        "Home State GSK selection for Promoter/Director of specific COBs",
      ],
      Payments: ["Create Challan", "Track Payment Status", "Grievance against Payment (GST PMT-07)"],
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
      "GST Statistics": ["Monthly Collection Reports", "State-wise Revenue Reports"],
    },
  },
};

const taxpayerSearchTypes = [
  { key: "gstin", label: "Search by GSTIN/UIN", placeholder: "e.g. 27AAAPL1234C1ZV" },
  { key: "pan", label: "Search by PAN", placeholder: "e.g. AAAPL1234C" },
  { key: "temp", label: "Search Temporary ID", placeholder: "Enter temporary ID" },
  { key: "composition", label: "Search Composition Taxpayer", placeholder: "e.g. 27AAAPL1234C1ZV" },
];

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", mega: true },
  { label: "GST Law", href: "#" },
  { label: "Downloads", mega: true },
  { label: "Search Taxpayer", taxpayerSearch: true },
  { label: "Help and Taxpayer Facilities", href: "#" },
  { label: "e-Invoice", href: "#" },
  { label: "News and Updates", href: "#" },
];

const FONT_STEPS = [0.9, 1, 1.1, 1.2];
const HOVER_OPEN_DELAY = 90; 
const HOVER_CLOSE_DELAY = 200;

function MegaPanel({ menu, onSelect }) {
  const [previewTab, setPreviewTab] = useState(null);
  const links = previewTab ? menu.content[previewTab] || [] : [];

  return (
    <div className="static z-50 flex w-full overflow-hidden rounded-b-lg border border-line bg-white text-ink shadow-xl lg:absolute lg:left-0 lg:top-11 lg:w-[min(680px,90vw)]">
      <div className="w-full shrink-0 border-r border-line bg-[#f7f6f2] py-1.5 lg:w-55">
        {menu.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onMouseEnter={() => setPreviewTab(tab)}
            onFocus={() => setPreviewTab(tab)}
            onClick={() => setPreviewTab(tab)}
            className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-[0.87rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-amber focus-visible:-outline-offset-2 ${
              previewTab === tab ? "bg-white text-navy" : "text-ink/80 hover:bg-white/70 hover:text-navy"
            }`}
          >
            {tab}
            <ChevronRight
              size={14}
              className={`shrink-0 transition-opacity ${previewTab === tab ? "opacity-100 text-amber" : "opacity-0"}`}
            />
          </button>
        ))}
      </div>

      <div className="hidden max-h-[55vh] flex-1 overflow-y-auto p-4 lg:block">
        {previewTab ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
            {links.map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => onSelect(item)}
                className="rounded-md px-2.5 py-2 text-[0.87rem] text-navy transition-colors hover:bg-navy/6 focus-visible:bg-navy/6 focus-visible:outline-none"
              >
                {item}
              </a>
            ))}
          </div>
        ) : (
          <div className="grid h-full min-h-35 place-items-center">
            <div className="h-1.5 w-1.5 rounded-full bg-line" />
          </div>
        )}
      </div>

      {previewTab && (
        <div className="w-full border-t border-line p-4 lg:hidden">
          <div className="grid gap-0.5">
            {links.map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => onSelect(item)}
                className="rounded-md px-2.5 py-2 text-[0.87rem] text-navy transition-colors hover:bg-navy/6"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [fontStep, setFontStep] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [taxpayerType, setTaxpayerType] = useState(null);
  const [taxpayerQuery, setTaxpayerQuery] = useState("");
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const openTimeoutRef = useRef(null);

  const clearTimers = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
  };

  const handleMouseEnter = (label) => {
    clearTimers();
    openTimeoutRef.current = setTimeout(() => {
      setOpenMenu(label);
      setTaxpayerType(null);
    }, HOVER_OPEN_DELAY);
  };

  const handleMouseLeave = () => {
    clearTimers();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
      setTaxpayerType(null);
    }, HOVER_CLOSE_DELAY);
  };

  const handleClick = (label) => {
    clearTimers();
    setOpenMenu((current) => {
      if (current !== label) setTaxpayerType(null);
      return current === label ? null : label;
    });
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_STEPS[fontStep] * 100}%`;
  }, [fontStep]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
        setTaxpayerType(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setTaxpayerType(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => clearTimers, []);

  const selectLink = (label) => {
    setActiveLink(label);
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const submitTaxpayerSearch = (event) => {
    event.preventDefault();
    if (!taxpayerQuery.trim()) return;
    console.log(`Searching (${taxpayerType}):`, taxpayerQuery.trim());
    setOpenMenu(null);
    setTaxpayerType(null);
    setTaxpayerQuery("");
  };

  return (
    <header className="w-full text-white">
      <div className="bg-navy">
        <div className="mx-auto max-w-360 px-6">
          <div className="flex h-9 items-center justify-between border-b border-white/10 text-[0.8rem]">
            <a
              href="#main"
              className="rounded text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-amber focus-visible:outline-offset-2"
            >
              Skip to main content
            </a>

            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-pressed={highContrast}
                aria-label="Toggle high contrast"
                onClick={() => setHighContrast((v) => !v)}
                className={`grid h-6 w-6 place-items-center rounded-full border text-xs transition-colors focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 ${
                  highContrast
                    ? "border-amber bg-amber text-navy"
                    : "border-white/40 text-white/80 hover:border-white hover:text-white"
                }`}
              >
                ◐
              </button>

              <div className="flex items-center gap-1" role="group" aria-label="Text size">
                <button
                  type="button"
                  aria-label="Decrease text size"
                  disabled={fontStep === 0}
                  onClick={() => setFontStep((s) => Math.max(0, s - 1))}
                  className="rounded text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 disabled:opacity-30 disabled:hover:text-white/80"
                >
                  A<sup>-</sup>
                </button>
                <span className="px-1 text-white/30" aria-hidden="true">
                  |
                </span>
                <button
                  type="button"
                  aria-label="Increase text size"
                  disabled={fontStep === FONT_STEPS.length - 1}
                  onClick={() => setFontStep((s) => Math.min(FONT_STEPS.length - 1, s + 1))}
                  className="rounded text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 disabled:opacity-30 disabled:hover:text-white/80"
                >
                  A<sup>+</sup>
                </button>
              </div>
            </div>
          </div>

          <div className="flex min-h-19.5 items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={logo} alt="GST Portal Logo" className="h-20 w-20 shrink-0 object-contain" />
              <div>
                <h1 className="text-[1.4rem] font-semibold leading-tight tracking-tight">Goods and Services Tax</h1>
                <p className="mt-0.5 text-[0.85rem] text-white/60">
                  Government of India, States and Union Territories
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="rounded border border-white/40 px-4 py-2 text-[0.9rem] font-medium transition-all hover:bg-white/10 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
              >
                Register
              </button>
              <button
                type="button"
                className="rounded bg-white px-5 py-2 text-[0.9rem] font-semibold text-navy transition-all hover:bg-white/90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
              >
                Login
              </button>
              <button
                type="button"
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="ml-1 grid h-9 w-9 place-items-center rounded border border-white/40 lg:hidden"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav ref={navRef} className={`bg-navy-2 ${mobileOpen ? "block" : "hidden"} lg:block`}>
        <div className="relative mx-auto max-w-360 px-6">
          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {navLinks.map((link) => {
              const isOpen = openMenu === link.label;
              const isActive = activeLink === link.label;
              const isInteractiveDropdown = link.mega || link.taxpayerSearch;

              if (link.taxpayerSearch) {
                return (
                  <div
                    key={link.label}
                    className="relative lg:shrink-0"
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => handleClick(link.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`flex h-11 w-full items-center justify-between gap-2 whitespace-nowrap px-4 text-left text-[0.87rem] font-medium text-white/90 transition-colors duration-150 hover:bg-navy-hover hover:text-white focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber lg:w-auto lg:justify-start ${
                        isOpen ? "bg-navy-hover text-white" : ""
                      }`}
                    >
                      <Search size={14} />
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="static z-50 min-w-70 overflow-hidden rounded-b-lg border border-line bg-white text-ink shadow-xl lg:absolute lg:left-0 lg:top-11">
                        {!taxpayerType ? (
                          <div className="py-1.5">
                            {taxpayerSearchTypes.map((type) => (
                              <button
                                key={type.key}
                                type="button"
                                onClick={() => setTaxpayerType(type.key)}
                                className="block w-full px-4 py-2.5 text-left text-[0.87rem] text-navy transition-colors hover:bg-navy/6 focus-visible:bg-navy/6 focus-visible:outline-none"
                              >
                                {type.label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <form onSubmit={submitTaxpayerSearch} className="p-3">
                            <button
                              type="button"
                              onClick={() => setTaxpayerType(null)}
                              className="mb-2 text-[0.78rem] font-medium text-muted hover:text-navy"
                            >
                              ← Choose a different search type
                            </button>
                            <label htmlFor="taxpayer-search" className="mb-1.5 block text-[0.78rem] font-medium text-muted">
                              {taxpayerSearchTypes.find((t) => t.key === taxpayerType)?.label}
                            </label>
                            <div className="flex gap-2">
                              <input
                                id="taxpayer-search"
                                type="text"
                                autoFocus
                                value={taxpayerQuery}
                                onChange={(event) => setTaxpayerQuery(event.target.value)}
                                placeholder={taxpayerSearchTypes.find((t) => t.key === taxpayerType)?.placeholder}
                                className="flex-1 rounded border border-line px-3 py-2 text-[0.87rem] text-ink focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                              />
                              <button
                                type="submit"
                                className="rounded bg-navy px-3 py-2 text-[0.85rem] font-medium text-white transition-colors hover:bg-navy-hover focus-visible:outline focus-visible:outline-amber focus-visible:outline-offset-2"
                              >
                                Search
                              </button>
                            </div>
                          </form>
                        )}
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
                    onMouseEnter={() => handleMouseEnter(link.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => handleClick(link.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`flex h-11 w-full items-center justify-between gap-2 whitespace-nowrap px-4 text-left text-[0.87rem] font-medium text-white/90 transition-colors duration-150 hover:bg-navy-hover hover:text-white focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-amber lg:w-auto lg:justify-start ${
                        isOpen ? "bg-navy-hover text-white" : ""
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && <MegaPanel menu={menu} onSelect={() => selectLink(link.label)} />}
                  </div>
                );
              }

              return (
                <div key={link.label} className="relative lg:shrink-0">
                  <a
                    href={link.href}
                    onClick={() => selectLink(link.label)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex h-11 items-center whitespace-nowrap px-4 text-[0.87rem] font-medium transition-colors duration-150 focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber ${
                      isActive
                        ? "border-b-2 border-amber bg-navy-hover text-white"
                        : "text-white/90 hover:bg-navy-hover hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
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