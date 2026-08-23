import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import logo from "../assets/logo.png";

const dropdownItems = {
  Services: ["Registration", "Payments", "User Services", "Refunds"],
  Downloads: ["Offline Tools", "GST Statistics", "Returns Offline Tool"],
};

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Services", dropdown: true },
  { label: "GST Law", href: "#" },
  { label: "Downloads", dropdown: true },
  { label: "Search Taxpayer", search: true },
  { label: "Help and Taxpayer Facilities", href: "#" },
  { label: "e-Invoice", href: "#" },
  { label: "News and Updates", href: "#" },
];

const FONT_STEPS = [0.9, 1, 1.1, 1.2]; // rem multipliers, A- ... A+

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [fontStep, setFontStep] = useState(1); // index into FONT_STEPS
  const [highContrast, setHighContrast] = useState(false);
  const [taxpayerQuery, setTaxpayerQuery] = useState("");
  const navRef = useRef(null);

  const toggleMenu = (label) => setOpenMenu((current) => (current === label ? null : label));

  // Real font-size control: scales the document root, so it actually affects
  // every rem-based element on the page, not just this component.
  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_STEPS[fontStep] * 100}%`;
  }, [fontStep]);

  // Real high-contrast toggle: flips a class other components/CSS can key off,
  // e.g. `html.high-contrast body { background:#000; color:#fff }`.
  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  // Close any open dropdown on outside click.
  useEffect(() => {
    const handleClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape, from anywhere.
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const selectLink = (label) => {
    setActiveLink(label);
    setOpenMenu(null);
    setMobileOpen(false); // closing on selection is what makes mobile nav usable
  };

  const submitTaxpayerSearch = (event) => {
    event.preventDefault();
    if (!taxpayerQuery.trim()) return;
    // Wire this to your real search route/handler.
    console.log("Searching taxpayer:", taxpayerQuery.trim());
    setOpenMenu(null);
  };

  return (
    <header className="w-full text-white">
      <div className="bg-navy">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="flex h-9 items-center justify-between border-b border-white/10 text-[0.8rem]">
            <a
              href="#main"
              className="rounded text-white/70 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
            >
              Skip to main content
            </a>

            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-pressed={highContrast}
                aria-label="Toggle high contrast"
                onClick={() => setHighContrast((v) => !v)}
                className={`grid h-6 w-6 place-items-center rounded-full border text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 ${
                  highContrast ? "border-amber bg-amber text-navy" : "border-white/40 text-white/80 hover:border-white hover:text-white"
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
                  className="rounded text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 disabled:opacity-30 disabled:hover:text-white/80"
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
                  className="rounded text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 disabled:opacity-30 disabled:hover:text-white/80"
                >
                  A<sup>+</sup>
                </button>
              </div>
            </div>
          </div>

          <div className="flex min-h-[78px] items-center justify-between gap-6">
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
                className="rounded border border-white/40 px-4 py-2 text-[0.9rem] font-medium transition-all hover:bg-white/10 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
              >
                Register
              </button>
              <button
                type="button"
                className="rounded bg-white px-5 py-2 text-[0.9rem] font-semibold text-navy transition-all hover:bg-white/90 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
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
        <div className="relative mx-auto max-w-[1440px] px-6">
          <div className="flex flex-col lg:flex-row lg:items-stretch lg:overflow-x-auto">
            {navLinks.map((link) => {
              const isOpen = openMenu === link.label;
              const isActive = activeLink === link.label;

              if (link.search) {
                return (
                  <div key={link.label} className="relative lg:shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleMenu(link.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      className={`flex h-11 w-full items-center justify-between gap-2 whitespace-nowrap px-4 text-left text-[0.87rem] font-medium text-white/90 transition-colors duration-150 hover:bg-navy-hover hover:text-white focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber lg:w-auto lg:justify-start ${
                        isOpen ? "bg-navy-hover text-white" : ""
                      }`}
                    >
                      <Search size={14} />
                      {link.label}
                    </button>

                    {isOpen && (
                      <form
                        onSubmit={submitTaxpayerSearch}
                        className="static z-50 w-full min-w-[280px] rounded-b-md border border-line bg-white p-3 shadow-xl lg:absolute lg:left-0 lg:top-11"
                      >
                        <label htmlFor="taxpayer-search" className="mb-1.5 block text-[0.78rem] font-medium text-muted">
                          Enter GSTIN, UIN or PAN
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="taxpayer-search"
                            type="text"
                            value={taxpayerQuery}
                            onChange={(event) => setTaxpayerQuery(event.target.value)}
                            placeholder="e.g. 27AAAPL1234C1ZV"
                            className="flex-1 rounded border border-line px-3 py-2 text-[0.87rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                          />
                          <button
                            type="submit"
                            className="rounded bg-navy px-3 py-2 text-[0.85rem] font-medium text-white transition-colors hover:bg-navy-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                          >
                            Search
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                );
              }

              return (
                <div key={link.label} className="relative lg:shrink-0">
                  {link.dropdown ? (
                    <>
                      <button
                        type="button"
                        onClick={() => toggleMenu(link.label)}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        className={`flex h-11 w-full items-center justify-between gap-2 whitespace-nowrap px-4 text-left text-[0.87rem] font-medium text-white/90 transition-colors duration-150 hover:bg-navy-hover hover:text-white focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber lg:w-auto lg:justify-start ${
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
                      {isOpen && (
                        <div className="static z-50 min-w-[220px] overflow-hidden rounded-b-md border border-line bg-white py-1 text-ink shadow-xl lg:absolute lg:left-0 lg:top-11">
                          {dropdownItems[link.label].map((item) => (
                            <a
                              key={item}
                              href="#"
                              onClick={() => selectLink(link.label)}
                              className="block px-4 py-2.5 text-[0.87rem] transition-colors hover:bg-navy/5 hover:text-navy focus-visible:bg-navy/5 focus-visible:outline-none"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => selectLink(link.label)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex h-11 items-center whitespace-nowrap px-4 text-[0.87rem] font-medium transition-colors duration-150 focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-amber ${
                        isActive
                          ? "border-b-2 border-amber bg-navy-hover text-white"
                          : "text-white/90 hover:bg-navy-hover hover:text-white"
                      }`}
                    >
                      {link.label}
                    </a>
                  )}
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