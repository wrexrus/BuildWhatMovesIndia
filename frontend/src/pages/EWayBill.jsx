import React from "react";
import { ArrowUpRight, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const informationSections = [
  {
    number: "01",
    title: "Use of e-Way Bill",
    intro:
      "The e-Way Bill is used to document and verify the movement of goods under GST.",
    points: [
      "Mandatory for inter-State movement of goods where the consignment value exceeds Rs. 50,000 in a motorized conveyance.",
      "Registered GST taxpayers can register on the e-Way Bill Portal using their GSTIN.",
      "Unregistered persons and transporters can enroll using PAN and Aadhaar.",
      "The supplier, recipient, or transporter can generate an e-Way Bill.",
      "Vehicle details can be entered or updated in Part B of Form EWB-01.",
      "A QR code is provided for quick verification.",
      "Specified goods and non-motorized transportation may be exempt under the applicable CGST Rules.",
    ],
  },
  {
    number: "02",
    title: "Modes of Generation",
    intro:
      "The system provides multiple ways to generate and manage an e-Way Bill.",
    points: [
      "Web-based generation through the e-Way Bill Portal.",
      "Android application using the registered mobile number and device IMEI.",
      "SMS-based generation using the registered mobile number.",
      "Excel-based upload for bulk generation.",
      "Incorrectly generated e-Way Bills can be cancelled and a new one generated.",
      "The person who generated the e-Way Bill can cancel it within 24 hours.",
      "The recipient can reject an e-Way Bill within 72 hours of generation.",
      "Users can receive alerts through the portal and SMS.",
    ],
  },
  {
    number: "03",
    title: "Contents & Validity",
    intro:
      "The e-Way Bill contains movement details and has a defined validity period.",
    points: [
      "Part A cannot be edited or modified after generation.",
      "Part B can be updated with vehicle, RR, railway bill and related transport details.",
      "A consolidated e-Way Bill can be generated for multiple consignments carried in one vehicle.",
      "Validity is one day for every 200 km or part thereof.",
      "Validity can be extended online before expiry.",
      "The latest vehicle number carrying the consignment should be reflected.",
      "Users can maintain masters for customers, suppliers, products and HSN codes.",
    ],
  },
];

const resources = [
  {
    label: "CGST Rules",
    description: "Rule 138 and the applicable exempted-goods provisions.",
    href: "#",
  },
  {
    label: "Portal FAQs",
    description: "Frequently asked questions about the e-Way Bill System.",
    href: "#",
  },
  {
    label: "User Manual",
    description: "Detailed instructions for using the e-Way Bill System.",
    href: "#",
  },
];

const EWayBill = () => {
  return (
    <main className="min-h-screen bg-[#fbfbfa] text-[#2f3437]">
      {/* Breadcrumb */}
      <div className="border-b border-[#eaeaea] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[13px]"
          >
            <Link
              to="/"
              className="text-[#787774] transition-colors hover:text-[#111111]"
            >
              Home
            </Link>

            <ChevronRight size={13} className="text-[#b7b7b3]" />

            <span className="text-[#111111]">e-Way Bill System</span>
          </nav>
        </div>
      </div>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="max-w-4xl">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#956400]">
            GST Services
          </p>

          <h1 className="font-serif text-[42px] leading-[1.05] tracking-[-0.035em] text-[#111111] sm:text-[56px]">
            e-Way Bill System
          </h1>

          <p className="mt-6 max-w-2xl text-[16px] leading-7 text-[#787774]">
            Information and access to the electronic way bill system for the
            movement of goods under GST.
          </p>
        </div>

        {/* Primary portal action */}
        <div className="mt-12 border-y border-[#eaeaea] py-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#787774]">
                Official Portal
              </p>

              <h2 className="mt-2 text-[19px] font-semibold tracking-[-0.01em] text-[#111111]">
                Movement of Goods under GST
              </h2>

              <p className="mt-1.5 text-[14px] leading-6 text-[#787774]">
                Access the official e-Way Bill Portal to generate and manage
                electronic way bills.
              </p>
            </div>

            <a
              href="https://ewaybillgst.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[5px] bg-[#111111] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#333333] active:scale-[0.98]"
            >
              Open e-Way Bill Portal
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Information */}
      <section className="border-y border-[#eaeaea] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#787774]">
              System information
            </p>

            <h2 className="mt-3 font-serif text-[32px] leading-tight tracking-[-0.025em] text-[#111111]">
              Understanding the e-Way Bill
            </h2>

            <p className="mt-4 text-[15px] leading-7 text-[#787774]">
              Key information about when an e-Way Bill is required, how it is
              generated, and its contents and validity.
            </p>
          </div>

          <div className="divide-y divide-[#eaeaea] border-y border-[#eaeaea]">
            {informationSections.map((section) => (
              <article
                key={section.number}
                className="grid gap-8 py-10 md:grid-cols-[110px_280px_1fr] md:gap-10"
              >
                <div>
                  <span className="font-mono text-[12px] text-[#956400]">
                    {section.number}
                  </span>
                </div>

                <div>
                  <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-[#111111]">
                    {section.title}
                  </h3>

                  <p className="mt-3 text-[14px] leading-6 text-[#787774]">
                    {section.intro}
                  </p>
                </div>

                <ul className="space-y-3">
                  {section.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-[14px] leading-6 text-[#2f3437]"
                    >
                      <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-[#956400]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#787774]">
              Resources
            </p>

            <h2 className="mt-3 font-serif text-[30px] leading-tight tracking-[-0.025em] text-[#111111]">
              Reference material
            </h2>

            <p className="mt-4 max-w-sm text-[14px] leading-6 text-[#787774]">
              Official references and guidance for understanding and using the
              e-Way Bill System.
            </p>
          </div>

          <div className="border-t border-[#eaeaea]">
            {resources.map((resource) => (
              <a
                key={resource.label}
                href={resource.href}
                target={resource.href !== "#" ? "_blank" : undefined}
                rel={
                  resource.href !== "#"
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group flex items-center justify-between gap-6 border-b border-[#eaeaea] py-6"
              >
                <div>
                  <h3 className="text-[15px] font-semibold text-[#111111]">
                    {resource.label}
                  </h3>

                  <p className="mt-1 text-[13px] leading-5 text-[#787774]">
                    {resource.description}
                  </p>
                </div>

                <ExternalLink
                  size={16}
                  className="shrink-0 text-[#787774] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Track application */}
      <section className="border-t border-[#eaeaea] bg-[#f7f6f3]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#787774]">
              Application tracking
            </p>

            <h2 className="mt-2 text-[19px] font-semibold text-[#111111]">
              Track an application
            </h2>

            <p className="mt-1 text-[14px] text-[#787774]">
              Check the current status of your application.
            </p>
          </div>

          <Link
            to="/services/eway-bill/track-application-status"
            className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[#111111] bg-white px-5 py-3 text-[14px] font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white"
          >
            Track Application Status
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Helpdesk */}
      <footer className="border-t border-[#eaeaea] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#787774]">
            e-Way Bill Helpdesk
          </span>

          <span className="font-mono text-[14px] text-[#111111]">
            1800-103-4786
          </span>
        </div>
      </footer>
    </main>
  );
};

export default EWayBill;