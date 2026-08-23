import React from "react";
import { ArrowUp,} from "lucide-react";
// import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";


const columns = [
  {
    title: "About GST",
    links: ["GST Council Structure", "GST History"],
  },
  {
    title: "Website Policies",
    links: ["Website Policy", "Terms and Conditions", "Hyperlink Policy", "Disclaimer"],
  },
  {
    title: "Related Sites",
    links: ["Central Board of Indirect Taxes and Customs", "State Tax Websites", "National Portal"],
  },
  {
    title: "Help and Taxpayer Facilities",
    links: [
      "System Requirements",
      "GST Knowledge Portal",
      "GST Media",
      "Site Map",
      "Grievance Nodal Officers",
      "Free Accounting and Billing Services",
      "GST Suvidha Providers",
    ],
  },
];

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-navy-2 text-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3.5 text-[0.95rem] font-bold text-white">{col.title}</h3>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[0.88rem] text-white/80 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-3.5 text-[0.95rem] font-bold text-white">Contact us</h3>
          <p className="text-[0.85rem] text-white/70">Help desk number</p>
          <p className="mt-0.5 font-mono text-[1rem] font-bold tabular-nums text-white">1800-103-4786</p>

          <p className="mt-4 text-[0.85rem] text-white/70">Log or track issue</p>
          <a
            href="#"
            className="mt-0.5 inline-block text-[0.95rem] font-bold text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
          >
            Grievance redressal portal for GST
          </a>

          {/* <div className="mt-5 flex gap-4 text-white/85">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-white">
              <Youtube size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin size={18} />
            </a>
            <a href="#" aria-label="X (Twitter)" className="hover:text-white">
              <Twitter size={18} />
            </a>
          </div> */}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 py-4 text-[0.82rem] text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026-27 Goods and Services Tax Network</span>
          <span>Site last updated on 13-08-2026</span>
          <span>Designed and developed by GSTN</span>
        </div>
        <div className="border-t border-white/10 px-6 py-3 text-center text-[0.78rem] text-white/60">
          Site best viewed at 1024 x 768 resolution in Microsoft Edge, Google Chrome 49+, Firefox 45+ and Safari 6+
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 grid h-11 w-11 place-items-center rounded-full bg-navy-hover text-white shadow-lg transition-colors hover:bg-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  );
};

export default Footer;