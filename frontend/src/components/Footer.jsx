import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const columns = [
  {
    title: "About GST",
    links: [
      { name: "GST Council Structure", path: "/gst-law" },
      { name: "GST History & Acts", path: "/gst-law" },
    ],
  },
  {
    title: "Website Policies",
    links: [
      { name: "Website Policy", external: "https://www.gst.gov.in/websitepolicies" },
      { name: "Terms and Conditions", external: "https://www.gst.gov.in/termsandconditions" },
      { name: "Hyperlink Policy", external: "https://www.gst.gov.in/hyperlinkpolicy" },
      { name: "Disclaimer", external: "https://www.gst.gov.in/disclaimer" },
    ],
  },
  {
    title: "Related Sites",
    links: [
      { name: "Central Board of Indirect Taxes (CBIC)", external: "https://www.cbic.gov.in/" },
      { name: "State Tax GSK Centers", path: "/registration/home-state-gsk" },
      { name: "National Portal of India", external: "https://www.india.gov.in/" },
    ],
  },
  {
    title: "Help and Taxpayer Facilities",
    links: [
      { name: "System Requirements", path: "/help-taxpayer-facilities" },
      { name: "GST Knowledge Portal", path: "/gst-statistics" },
      { name: "GST Media & Tutorials", external: "https://tutorial.gst.gov.in/" },
      { name: "Returns Offline Tools", path: "/downloads" },
      { name: "Grievance Nodal Officers", path: "/services/payments/grievance" },
      { name: "Free Billing Services", path: "/help-taxpayer-facilities" },
    ],
  },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative w-full overflow-x-hidden bg-navy-2 text-white">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-4 py-9 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-12 lg:grid-cols-5">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3.5 text-[0.93rem] font-bold text-white sm:text-[0.95rem]">
              {col.title}
            </h3>

            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.name}>
                  {link.path ? (
                    <Link
                      to={link.path}
                      className="inline-block py-0.5 text-[0.86rem] leading-relaxed text-white/80 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.external || "https://www.gst.gov.in"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-0.5 text-[0.86rem] leading-relaxed text-white/80 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-3.5 text-[0.93rem] font-bold text-white sm:text-[0.95rem]">
            Contact us
          </h3>

          <p className="text-[0.85rem] text-white/70">Help desk number</p>

          <p className="mt-0.5 font-mono text-[1rem] font-bold tabular-nums text-white">
            1800-103-4786
          </p>

          <p className="mt-4 text-[0.85rem] text-white/70">
            Log or track issue
          </p>

          <Link
            to="/services/payments/grievance"
            className="mt-0.5 inline-block break-words text-[0.92rem] font-bold leading-relaxed text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
          >
            Grievance redressal portal for GST
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-4 sm:px-6">
          <div className="rounded-md border border-amber/25 bg-amber/10 px-4 py-3 text-[0.78rem] leading-relaxed text-white/90 sm:px-5 sm:py-3.5 sm:text-[0.82rem]">
            <p className="font-semibold text-amber">
              Demo / Hackathon Prototype
            </p>

            <p className="mt-1 text-white/75">
              This website is a demonstration prototype created for a hackathon.
              It is not an official GST Portal and is not affiliated with,
              endorsed by, or operated by the Goods and Services Tax Network
              (GSTN), Government of India, or any government department.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-4 py-4 text-[0.78rem] leading-relaxed text-white/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-[0.82rem]">
            <span>© 2026-27 Goods and Services Tax Network</span>
            <span>Site last updated on 13-08-2026</span>
            <span>Designed and developed by Independent Developers</span>
          </div>

          <div className="border-t border-white/10 px-4 py-3 text-center text-[0.72rem] leading-relaxed text-white/60 sm:px-6 sm:text-[0.78rem]">
            Site best viewed at 1024 x 768 resolution in Microsoft Edge, Google Chrome 49+, Firefox 45+ and Safari 6+
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-40 grid h-11 w-11 place-items-center rounded-full bg-navy-hover text-white shadow-lg transition-colors hover:bg-navy active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;