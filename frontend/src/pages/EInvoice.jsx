import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  FileCheck2,
  FileCode2,
  FileDown,
  FileText,
  Globe2,
  Headphones,
  LockKeyhole,
  Monitor,
  Play,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Upload,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";

const heroSlides = [
  {
    eyebrow: "ONE-STOP GST SERVICE",
    title: "Your one stop hub for e-Invoicing",
    description:
      "This portal simplifies e-Invoicing by providing a complete solution for reporting, verification and access to essential resources.",
    icon: Globe2,
    points: [
      "Reporting invoices on all IRPs",
      "Access to master codes and resources",
      "Check e-Invoicing enablement status",
    ],
    primaryLabel: "How to Report e-Invoice",
    primaryTo: "#how-it-works",
  },
  {
    eyebrow: "VERIFY WITH CONFIDENCE",
    title: "Verify e-Invoice anytime, anywhere",
    description:
      "Multiple verification methods are available to help validate invoice information quickly and conveniently.",
    icon: Search,
    points: [
      "IRN verification through portal",
      "QR code scanning via mobile app",
      "JSON file upload verification",
    ],
    primaryLabel: "Start Verification",
    primaryTo: "#quick-actions",
  },
  {
    eyebrow: "SIMPLE RECORD MANAGEMENT",
    title: "Download e-Invoices easily",
    description:
      "Access your complete e-Invoice history with convenient options for downloading and exporting invoice information.",
    icon: Download,
    points: [
      "Download reported and received e-Invoices",
      "Access e-Invoice history",
      "Export in multiple formats",
    ],
    primaryLabel: "Access Downloads",
    primaryTo: "#login-access",
  },
];

const quickActions = [
  {
    title: "Verify B2B e-Invoice",
    description: "Search and verify business e-Invoices",
    icon: FileCheck2,
    to: "/verify-b2b-e-invoice",
    type: "route",
  },
  {
    title: "Check Enablement Status",
    description: "Verify your e-Invoice enablement",
    icon: CheckCircle2,
    to: "/check-enablement-status",
    type: "route",
  },
  {
    title: "Grievance",
    description: "Submit and track your concerns",
    icon: Headphones,
    to: "/grievance",
    type: "route",
  },
  {
    title: "IRP Portal",
    description: "Access Invoice Registration Portals",
    icon: Monitor,
    to: "#irp-portals",
    type: "anchor",
  },
  {
    title: "Mobile App",
    description: "Download our mobile application",
    icon: Smartphone,
    to: "#mobile-app",
    type: "anchor",
  },
];

const loginActions = [
  {
    title: "Enable Me for e-Invoice",
    description:
      "Get enabled for e-Invoicing and start reporting your e-Invoices.",
    icon: UserCheck,
    to: "/login?redirect=enable",
  },
  {
    title: "Download e-Invoice JSONs",
    description:
      "Download your e-Invoice data in JSON format for records and analysis.",
    icon: FileCode2,
    to: "/login?redirect=json-download",
  },
  {
    title: "e-Invoice Exemption Declaration",
    description:
      "Submit declarations for e-Invoice exemptions as per regulations.",
    icon: FileCheck2,
    to: "/login?redirect=exemption",
  },
];

const irps = [
  {
    name: "NIC IRP-1",
    operator: "National Informatics Centre (NIC)",
    url: "https://einvoice1.gst.gov.in",
  },
  {
    name: "NIC IRP-2",
    operator: "National Informatics Centre (NIC)",
    url: "https://einvoice2.gst.gov.in",
  },
  {
    name: "Cygnet IRP",
    operator: "Cygnet Infotech Private Limited",
    url: "https://einvoice3.gst.gov.in",
  },
  {
    name: "Clear IRP",
    operator: "Defmacro Software Private Limited",
    url: "https://einvoice4.gst.gov.in",
  },
  {
    name: "EY IRP",
    operator: "Ernst & Young LLP",
    url: "https://einvoice5.gst.gov.in",
  },
  {
    name: "IRIS IRP",
    operator: "IRIS Business Services Limited",
    url: "https://einvoice6.gst.gov.in",
  },
];

const steps = [
  {
    number: "1",
    title: "Register Your Business",
    description:
      "Ensure your business is registered for GST and enabled for e-Invoicing based on turnover criteria.",
    icon: FileText,
  },
  {
    number: "2",
    title: "Choose an IRP",
    description:
      "Select any authorized Invoice Registration Portal for generating your Invoice Reference Number.",
    icon: Server,
  },
  {
    number: "3",
    title: "Report e-Invoices",
    description:
      "Upload your e-Invoice data through the selected IRP to generate the IRN.",
    icon: Upload,
  },
  {
    number: "4",
    title: "Download & Share",
    description:
      "Download the digitally signed e-Invoice and share it with your buyers for GST compliance.",
    icon: FileDown,
  },
];

const newsItems = [
  {
    title:
      "Advisory on RSP-Based Valuation of Notified Tobacco Goods under GST",
    date: "25/06/2026",
  },
  {
    title:
      "Advisory on e-Invoice API and e-Way Bill by IRN API changes for...",
    date: "25/06/2026",
  },
  {
    title: "Advisory: Webinars on e-Invoice in 2025",
    date: "30/12/2025",
  },
  {
    title: "Advisory: Webinars on e-Invoice Download Functionality",
    date: "18/12/2025",
  },
];

const tutorials = [
  {
    title: "GSTN e-Invoicing Master Video",
    category: "e-Invoice Basics",
  },
  {
    title:
      "Want to Know all about the e-Invoice JSON Download functionality?",
    category: "JSON Download",
  },
  {
    title:
      "Know how to Auto populate HSN Data from e-Invoice into GSTR-1",
    category: "GSTR-1 Integration",
  },
  {
    title:
      "Understanding the New Invoice Management System (IMS) by GSTN",
    category: "Invoice Management",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Compliant",
    description:
      "Authorized infrastructure and standardized validation for GST reporting.",
  },
  {
    icon: FileCheck2,
    title: "Real-time Processing",
    description:
      "Generate Invoice Reference Numbers with immediate validation.",
  },
  {
    icon: Users,
    title: "Multi-user Access",
    description:
      "Support multiple users and role-based business workflows.",
  },
  {
    icon: Globe2,
    title: "API Integration",
    description:
      "Connect ERP and business systems through standardized APIs.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  className = "",
}) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy/60">
          {eyebrow}
        </p>
      )}

      <h2 className="font-serif text-3xl leading-tight tracking-[-0.02em] text-ink sm:text-[2.25rem]">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-[15px] leading-7 text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function IconTile({ children, className = "" }) {
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-[8px] bg-shell text-navy ${className}`}
    >
      {children}
    </div>
  );
}

function EInvoice() {
  const [activeHero, setActiveHero] = useState(0);

  const currentHero = heroSlides[activeHero];
  const HeroIcon = currentHero.icon;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const changeHero = (direction) => {
    setActiveHero((current) => {
      if (direction === "next") {
        return (current + 1) % heroSlides.length;
      }

      return (current - 1 + heroSlides.length) % heroSlides.length;
    });
  };

  return (
    <PageContainer>
      <main className="bg-white font-sans text-ink">
        {/* =========================================================
            HERO
        ========================================================== */}
        <section
          className="relative overflow-hidden border-b border-line bg-shell"
          aria-label="e-Invoice introduction"
        >
          <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
          <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-white/50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
            <div className="mx-auto max-w-5xl">
              <div key={activeHero} className="animate-page-enter text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-navy shadow-sm ring-1 ring-line">
                  <HeroIcon className="h-8 w-8" strokeWidth={1.7} />
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-navy/65">
                  {currentHero.eyebrow}
                </p>

                <h1 className="mx-auto mt-3 max-w-4xl font-serif text-[2.4rem] leading-[1.06] tracking-[-0.03em] text-ink sm:text-[3.25rem] lg:text-[3.75rem]">
                  {currentHero.title}
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-muted sm:text-base">
                  {currentHero.description}
                </p>

                <div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
                  {currentHero.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-2.5 rounded-[6px] border border-white bg-white/80 px-4 py-3 text-left text-sm leading-5 text-muted"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={currentHero.primaryTo}
                  className="group mt-8 inline-flex items-center gap-2 rounded-[6px] bg-navy px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-navy-hover hover:shadow-md"
                >
                  {currentHero.primaryLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="mt-9 flex items-center justify-center gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveHero(index)}
                    aria-label={`Show slide ${index + 1}`}
                    aria-current={index === activeHero}
                    className={`h-2 rounded-full transition-all ${
                      index === activeHero
                        ? "w-7 bg-navy"
                        : "w-2 bg-[#aebed0] hover:bg-[#7f98b5]"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  to="/enable-e-invoicing"
                  className="inline-flex items-center gap-2 rounded-[6px] border border-navy bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-shell"
                >
                  Get Enabled for e-Invoicing
                </Link>

                <a
                  href="#mobile-app"
                  className="inline-flex items-center gap-2 rounded-[6px] border border-navy bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-shell"
                >
                  <Smartphone className="h-4 w-4" />
                  Download GSTN App
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => changeHero("previous")}
              className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy shadow-sm transition hover:bg-shell lg:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => changeHero("next")}
              className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white text-navy shadow-sm transition hover:bg-shell lg:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* =========================================================
            QUICK ACTIONS
        ========================================================== */}
        <section id="quick-actions" className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Essential services"
              title="Quick Actions"
              description="Access essential e-Invoicing services and tools with just a few clicks."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;

                const content = (
                  <>
                    <IconTile>
                      <ActionIcon className="h-7 w-7" strokeWidth={1.7} />
                    </IconTile>

                    <h3 className="mt-5 min-h-[48px] text-[17px] font-semibold leading-6 text-ink">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted">
                      {action.description}
                    </p>

                    <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-navy">
                      Open service
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </>
                );

                const className =
                  "group rounded-[6px] border border-line bg-white p-6 shadow-none transition-all duration-150 hover:-translate-y-0.5 hover:border-navy/25 hover:shadow-sm";

                return action.type === "route" ? (
                  <Link key={action.title} to={action.to} className={className}>
                    {content}
                  </Link>
                ) : (
                  <a key={action.title} href={action.to} className={className}>
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            LOGIN
        ========================================================== */}
        <section
          id="login-access"
          className="border-y border-line bg-shell px-5 py-16 sm:px-8 lg:px-10 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Personalized access"
              title="Login to Access"
              description="Access personalized e-Invoicing services that require authentication."
            />

            <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
              {loginActions.map((action) => {
                const ActionIcon = action.icon;

                return (
                  <div
                    key={action.title}
                    className="rounded-[6px] border border-line bg-white p-7 shadow-none transition-shadow hover:shadow-sm"
                  >
                    <IconTile className="mx-auto">
                      <ActionIcon
                        className="h-7 w-7"
                        strokeWidth={1.7}
                      />
                    </IconTile>

                    <h3 className="mt-5 text-center text-[18px] font-semibold leading-6 text-ink">
                      {action.title}
                    </h3>

                    <p className="mt-3 text-center text-sm leading-6 text-muted">
                      {action.description}
                    </p>

                    <Link
                      to={action.to}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-hover"
                    >
                      <LockKeyhole className="h-4 w-4" />
                      Login
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            IRP PORTALS
        ========================================================== */}
        <section
          id="irp-portals"
          className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Authorized infrastructure"
              title="Invoice Registration Portals"
              description="Access any GSTN-authorized IRP for e-Invoice reporting and management."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {irps.map((irp) => (
                <div
                  key={irp.name}
                  className="rounded-[6px] border border-line bg-white p-6 shadow-none transition-all duration-150 hover:-translate-y-0.5 hover:border-navy/25 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <IconTile>
                      <Server className="h-7 w-7" strokeWidth={1.7} />
                    </IconTile>

                    <span className="rounded-full border border-green/20 bg-green/10 px-3 py-1 text-xs font-medium text-green">
                      Active
                    </span>
                  </div>

                  <h3 className="mt-5 text-[20px] font-semibold text-ink">
                    {irp.name}
                  </h3>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.07em] text-muted/70">
                        Operator
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-ink/80">
                        {irp.operator}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted">
                      <Globe2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">{irp.url}</span>
                    </div>
                  </div>

                  <a
                    href={irp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-hover"
                  >
                    Visit Portal
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            HOW TO REPORT
        ========================================================== */}
        <section
          id="how-it-works"
          className="border-y border-line bg-shell px-5 py-16 sm:px-8 lg:px-10 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Getting started"
              title="How to Report e-Invoices"
              description="Follow these simple steps to start reporting your e-Invoices through the authorized portals."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-4">
              {steps.map((step) => {
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="relative rounded-[6px] border border-line bg-white p-7 text-center"
                  >
                    <IconTile className="mx-auto">
                      <StepIcon className="h-7 w-7" strokeWidth={1.7} />
                    </IconTile>

                    <div className="mx-auto mt-5 flex h-8 w-8 items-center justify-center rounded-full bg-navy font-mono text-xs font-semibold text-white">
                      {step.number}
                    </div>

                    <h3 className="mt-5 text-[18px] font-semibold leading-6 text-ink">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-muted">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 rounded-[6px] border border-line bg-white px-6 py-9 text-center sm:px-10">
              <h3 className="font-serif text-2xl tracking-[-0.01em] text-ink">
                Need Help Getting Started?
              </h3>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
                Our comprehensive guides and tutorials can help you navigate
                the e-Invoicing process seamlessly.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  to="/user-guide"
                  className="inline-flex items-center gap-2 rounded-[6px] border border-navy bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-shell"
                >
                  Download User Guide
                  <Download className="h-4 w-4" />
                </Link>

                <a
                  href="#tutorials"
                  className="inline-flex items-center gap-2 rounded-[6px] border border-navy bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-shell"
                >
                  Watch Tutorial Videos
                  <Play className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            OVERVIEW
        ========================================================== */}
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="The e-Invoicing framework"
              title="e-Invoicing Overview"
              description="The e-Invoicing framework under GST enables accurate reporting, reduces the risk of tax discrepancies and simplifies regulatory obligations for enterprises."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
              <div className="rounded-[6px] border border-line bg-shell p-8 sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-navy/65">
                  Understanding IRPs
                </p>

                <h3 className="mt-3 max-w-xl font-serif text-[28px] leading-tight tracking-[-0.02em] text-ink">
                  Standardized infrastructure for digital invoice compliance.
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
                  Invoice Registration Portals are GSTN-authorized platforms
                  that validate and authenticate B2B e-Invoices. When an
                  invoice is successfully reported, it receives an Invoice
                  Reference Number along with digital authentication and a QR
                  code.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-[6px] border border-line bg-white p-4 text-center">
                    <Server className="mx-auto h-5 w-5 text-navy" />
                    <p className="mt-2 text-sm font-semibold text-ink">
                      6 Authorized IRPs
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Choose from authorized portals.
                    </p>
                  </div>

                  <div className="rounded-[6px] border border-line bg-white p-4 text-center">
                    <ShieldCheck className="mx-auto h-5 w-5 text-navy" />
                    <p className="mt-2 text-sm font-semibold text-ink">
                      Secure Processing
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Standardized and secure processing.
                    </p>
                  </div>

                  <div className="rounded-[6px] border border-line bg-white p-4 text-center">
                    <Clock3 className="mx-auto h-5 w-5 text-navy" />
                    <p className="mt-2 text-sm font-semibold text-ink">
                      24/7 Availability
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      Report invoices whenever needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => {
                  const FeatureIcon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-[6px] border border-line bg-white p-6 transition-shadow hover:shadow-sm"
                    >
                      <IconTile>
                        <FeatureIcon
                          className="h-6 w-6"
                          strokeWidth={1.7}
                        />
                      </IconTile>

                      <h3 className="mt-4 text-[16px] font-semibold text-ink">
                        {feature.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-muted">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            STATISTICS
        ========================================================== */}
        <section className="border-y border-line bg-shell px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="Portal activity"
              title="e-Invoice Portal Statistics"
              description="A quick view of reported Invoice Reference Number activity across the portal ecosystem."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="rounded-[6px] border border-line bg-white p-8 text-center">
                <IconTile className="mx-auto">
                  <FileCheck2 className="h-7 w-7" strokeWidth={1.7} />
                </IconTile>

                <p className="mt-5 font-serif text-[2.5rem] tracking-[-0.025em] text-ink">
                  140.69 Cr
                </p>

                <p className="mt-2 text-sm text-muted">
                  Total number of IRNs Generated in FY 2026–27
                </p>

                <p className="mt-3 text-sm font-semibold text-green">
                  +37.35%
                  <span className="ml-1 font-normal text-muted">
                    FY 2026–27
                  </span>
                </p>
              </div>

              <div className="rounded-[6px] border border-line bg-white p-8 text-center">
                <IconTile className="mx-auto">
                  <BarChart3 className="h-7 w-7" strokeWidth={1.7} />
                </IconTile>

                <p className="mt-5 font-serif text-[2.5rem] tracking-[-0.025em] text-ink">
                  1.05 Cr
                </p>

                <p className="mt-2 text-sm text-muted">
                  Total number of IRNs Generated on 26/08/2026
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[6px] border border-line bg-white p-7 sm:p-8">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-navy" />
                <h3 className="text-[18px] font-semibold text-ink">
                  System Performance
                </h3>
              </div>

              <div className="mt-8 grid gap-7 sm:grid-cols-3">
                <div className="text-center">
                  <Zap className="mx-auto h-5 w-5 text-navy" />
                  <p className="mt-3 text-2xl font-semibold text-navy">
                    99.9%
                  </p>
                  <p className="mt-1 text-xs text-muted">System Uptime</p>
                </div>

                <div className="text-center">
                  <Clock3 className="mx-auto h-5 w-5 text-navy" />
                  <p className="mt-3 text-2xl font-semibold text-navy">
                    30 ms
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Average e-Invoice Lookup Response Time
                  </p>
                </div>

                <div className="text-center">
                  <Headphones className="mx-auto h-5 w-5 text-navy" />
                  <p className="mt-3 text-2xl font-semibold text-navy">
                    24/7
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Support Availability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            NEWS
        ========================================================== */}
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Stay informed"
              title="News and Updates"
              description="Latest advisories and updates from the e-Invoice portal."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {newsItems.map((item) => (
                <article
                  key={item.title}
                  className="flex flex-col rounded-[6px] border border-line bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <h3 className="min-h-[82px] text-[16px] font-semibold leading-6 text-ink">
                    {item.title}
                  </h3>

                  <div className="mt-5 flex items-center gap-2 text-xs text-muted">
                    <CalendarDays className="h-4 w-4" />
                    {item.date}
                  </div>

                  <a
                    href="#news"
                    className="mt-6 inline-flex items-center justify-between rounded-[6px] border border-line px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:border-navy/30 hover:bg-shell"
                  >
                    Read More
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                to="/updates"
                className="inline-flex items-center gap-2 rounded-[6px] bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-hover"
              >
                View All Updates
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            TUTORIALS
        ========================================================== */}
        <section
          id="tutorials"
          className="border-y border-line bg-shell px-5 py-16 sm:px-8 lg:px-10 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="Learn the workflow"
              title="e-Invoice Tutorial Videos"
              description="Watch comprehensive video tutorials to understand and use the e-Invoicing system."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {tutorials.map((video, index) => (
                <article
                  key={video.title}
                  className="overflow-hidden rounded-[6px] border border-line bg-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="relative aspect-video overflow-hidden bg-navy-2">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(91,144,212,0.18),transparent_34%),linear-gradient(135deg,#052b51,#08365f)]" />

                    <div className="absolute left-5 right-5 top-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/55">
                        GSTN e-Invoicing
                      </p>

                      <p className="mt-3 max-w-[80%] text-[16px] font-semibold leading-6 text-white">
                        {video.category}
                      </p>
                    </div>

                    <span className="absolute left-5 bottom-5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white">
                      {index + 1}/9
                    </span>

                    <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-navy shadow-md">
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="min-h-[72px] text-[15px] font-medium leading-6 text-ink">
                      {video.title}
                    </h3>

                    <a
                      href="#video"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy"
                    >
                      Watch video
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-9 flex justify-center">
              <a
                href="#youtube"
                className="inline-flex items-center gap-2 rounded-[6px] bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-hover"
              >
                View All Videos on GSTN YouTube
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            MOBILE APP / FINAL CTA
        ========================================================== */}
        <section
          id="mobile-app"
          className="px-5 py-14 sm:px-8 lg:px-10"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 rounded-[6px] border border-line bg-shell px-6 py-9 text-center sm:px-10 lg:flex-row lg:text-left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/65">
                Get started
              </p>

              <h2 className="mt-2 font-serif text-[28px] tracking-[-0.02em] text-ink">
                Ready to use e-Invoicing?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Access the tools, authorized portals and resources required
                for your e-Invoicing journey.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap justify-center gap-3 lg:justify-end">
              <Link
                to="/enable-e-invoicing"
                className="inline-flex items-center gap-2 rounded-[6px] bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-hover"
              >
                Get Enabled
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/verify-b2b-e-invoice"
                className="inline-flex items-center gap-2 rounded-[6px] border border-navy bg-white px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-shell"
              >
                Verify Invoice
                <Search className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageContainer>
  );
}

export default EInvoice;