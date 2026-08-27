import React from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../components/Breadcrumbs.jsx";
import PageContainer from "../components/PageContainer.jsx";

const taxpayerServices = [
  {
    title: "Free accounting and billing services",
    description:
      "Empanelled accounting and billing software solutions.",
  },
  {
    title: "GST Suvidha Providers",
    description:
      "Information about GST Suvidha Providers and available services.",
  },
  {
    title: "Site Map",
    description:
      "A structured view of the GST Portal and its services.",
  },
];

const helpItems = [
  {
    title: "GST Knowledge Portal",
    description:
      "Videos, FAQs and manuals related to GST.",
  },
  {
    title: "Grievance Redressal Portal",
    description:
      "Facility for lodging complaints and grievances.",
    meta: "Self service",
  },
  {
    title: "Common Errors & Suggested Solutions",
    description:
      "Reference material for common GST Portal errors.",
  },
  {
    title: "System Requirements",
    description:
      "Requirements for accessing the GST Portal.",
  },
  {
    title: "GST Media",
    description:
      "Webinars, interviews and videos related to GST.",
  },
  {
    title: "Grievance Nodal Officers",
    description:
      "Contact information for grievance nodal officers.",
  },
];

const HelpItem = ({
  index,
  title,
  description,
  meta,
}) => {
  return (
    <a
      href="#"
      className="
        group
        grid
        grid-cols-[32px_1fr_20px]
        gap-4
        border-b
        border-[#eaeaea]
        py-6
        transition-colors
        hover:bg-[#fbfbfa]
      "
    >
      <span className="font-mono text-xs text-[#9a9b99]">
        {String(index).padStart(2, "0")}
      </span>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-semibold text-[#293238] transition-colors group-hover:text-[#1f6c9f]">
            {title}
          </h3>

          {meta && (
            <span className="border border-[#e1e1df] bg-[#fbfbfa] px-2 py-1 text-[0.65rem] font-medium uppercase tracking-[0.05em] text-[#787774]">
              {meta}
            </span>
          )}
        </div>

        <p className="mt-2 max-w-[60ch] text-sm leading-6 text-[#6f7375]">
          {description}
        </p>
      </div>

      <span
        aria-hidden="true"
        className="pt-0.5 text-lg text-[#a0a2a3] transition-transform group-hover:translate-x-1 group-hover:text-[#1f6c9f]"
      >
        →
      </span>
    </a>
  );
};

const HelpTaxPayerFacilities = () => {
  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            {
              label: "Help and Taxpayer Facilities",
            },
          ]}
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
          <style>{`
            @keyframes pageRise {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .page-rise { animation: pageRise 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }
            @media (prefers-reduced-motion: reduce) {
              .page-rise { animation: none; }
            }
          `}</style>

          {/* Intro */}
          <header className="page-rise max-w-4xl border-b border-[#eaeaea] pb-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f6c9f]">
              Support & facilities
            </p>

            <h1 className="font-serif text-[2.6rem] leading-[1.05] tracking-[-0.03em] text-[#161b1e] sm:text-[3.2rem]">
              Help and taxpayer facilities
            </h1>

            <p className="mt-5 max-w-[62ch] text-base leading-7 text-[#6f7375]">
              Find guidance, support services, grievance facilities
              and other resources available through the GST Portal.
            </p>
          </header>

          {/* Taxpayer services */}
          <section className="border-b border-[#eaeaea] py-10">
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#787774]">
                  Facilities
                </p>

                <h2 className="mt-2 text-lg font-semibold text-[#293238]">
                  Taxpayer services
                </h2>
              </div>

              <div className="grid border-t border-[#eaeaea] md:grid-cols-3 md:divide-x md:divide-[#eaeaea] md:border-t-0">
                {taxpayerServices.map((service, index) => (
                  <a
                    key={service.title}
                    href="#"
                    className={`
                      group
                      py-6
                      transition-all
                      duration-200
                      hover:bg-[#fbfbfa]
                      hover:-translate-y-0.5
                      md:px-6
                      ${
                        index === 0
                          ? "md:pl-0"
                          : ""
                      }
                      ${
                        index ===
                        taxpayerServices.length - 1
                          ? "md:pr-0"
                          : ""
                      }
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs text-[#9a9b99]">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span
                        aria-hidden="true"
                        className="text-lg text-[#a0a2a3] transition-transform group-hover:translate-x-1 group-hover:text-[#1f6c9f]"
                      >
                        →
                      </span>
                    </div>

                    <h3 className="mt-8 text-base font-semibold leading-6 text-[#293238] transition-colors group-hover:text-[#1f6c9f]">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#6f7375]">
                      {service.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Help */}
          <section className="py-10">
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#787774]">
                  Support
                </p>

                <h2 className="mt-2 text-lg font-semibold text-[#293238]">
                  Help & support
                </h2>

                <p className="mt-3 max-w-xs text-sm leading-6 text-[#6f7375]">
                  Guidance, troubleshooting information and official
                  support resources.
                </p>
              </div>

              <div className="border-t border-[#eaeaea]">
                {helpItems.map((item, index) => (
                  <HelpItem
                    key={item.title}
                    index={index + 1}
                    {...item}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Return */}
          <section className="border-t border-[#eaeaea] pt-8">
            <Link
              to="/"
              className="
                inline-flex
                items-center
                gap-2
                border-b
                border-[#2f3437]
                pb-1
                text-sm
                font-medium
                text-[#2f3437]
                transition-colors
                hover:border-[#1f6c9f]
                hover:text-[#1f6c9f]
              "
            >
              Return to home
              <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default HelpTaxPayerFacilities;