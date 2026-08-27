import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { OFFLINE_TOOLS_MAP } from '../data/offlineToolsData';
import { Download, ChevronRight, Info, AlertTriangle, ShieldCheck, Monitor, Globe, Table } from 'lucide-react';

const OfflineToolPage = () => {
  const { toolId } = useParams();
  const [showChecksumInfo, setShowChecksumInfo] = useState(false);

  const tool = OFFLINE_TOOLS_MAP[toolId] || OFFLINE_TOOLS_MAP["returns"];

  return (
    <PageContainer>
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

      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-500 mb-8"
        >
          <Link to="/" className="font-medium text-navy transition-colors hover:text-navy-hover">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-500">Downloads</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-ink">{tool.title}</span>
        </nav>

        <header className="page-rise border-b border-line pb-6 mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-navy/70">
            Offline utility
          </p>
          <h1 className="font-serif text-[2rem] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[2.3rem]">
            {tool.title}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Version {tool.version}
          </p>
        </header>

        <section className="page-rise mb-8" style={{ animationDelay: '80ms' }}>
          <p className="text-[15px] leading-7 text-ink/85">
            {tool.description}
          </p>

          <a
            href={tool.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex items-center gap-2.5 rounded-[6px] bg-navy px-5 py-3 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-navy-hover hover:shadow-md active:translate-y-0"
          >
            <Download className="w-4 h-4 transition-transform duration-150 group-hover:translate-y-0.5" />
            Download {tool.title}
          </a>
        </section>

        <section
          className="page-rise mt-8 border border-line bg-shell/60 p-6 rounded-[6px]"
          style={{ animationDelay: '140ms' }}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Table className="w-4 h-4 text-navy" />
            The downloaded zip file contains
          </h3>
          <ul className="mt-4 space-y-2.5">
            {tool.packageContents.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm leading-6 text-ink/80">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-navy/50" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section
          className="page-rise mt-6 border border-amber/40 bg-amber/[0.06] p-6 rounded-[6px]"
          style={{ animationDelay: '200ms' }}
        >
          <h3 className="flex items-center gap-2 text-sm font-semibold text-[#7a5200]">
            <AlertTriangle className="w-4 h-4 text-[#a06e00]" />
            Before you install
          </h3>

          <ul className="mt-4 space-y-2.5 text-sm leading-6 text-[#6b4a00]">
            <li className="flex items-start gap-2.5">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#a06e00]/60" />
              <span>
                Ensure the downloaded file is not corrupted before you extract and run it.{' '}
                <button
                  type="button"
                  onClick={() => setShowChecksumInfo((value) => !value)}
                  className="font-semibold text-navy underline decoration-navy/30 underline-offset-2 transition-colors hover:text-navy-hover"
                >
                  {showChecksumInfo ? 'Hide checksum details' : 'How do I verify the checksum?'}
                </button>
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#a06e00]/60" />
              Go through the Readme document before you begin installation.
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#a06e00]/60" />
              Double-click the installer file to install the offline tool.
            </li>
          </ul>

          <div
            className={`grid transition-all duration-300 ease-out ${
              showChecksumInfo ? 'mt-4 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-[6px] border border-amber/30 bg-white p-4">
                <h4 className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verifying the ZIP file is not corrupt
                </h4>
                <p className="mt-2 text-[13px] leading-6 text-ink/70">
                  Match the SHA-256 checksum generated on your computer against the official
                  checksum published on the GST Portal. An exact match confirms the downloaded
                  package is authentic and safe to install.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="page-rise mt-10 border-t border-line pt-8" style={{ animationDelay: '260ms' }}>
          <h2 className="font-serif text-xl tracking-[-0.01em] text-ink">
            System requirements
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-ink/60">
            Confirm the following before using the tool.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[6px] border border-line bg-white p-5 transition-shadow hover:shadow-sm">
              <Monitor className="w-4 h-4 text-navy" />
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-[0.06em] text-ink/50">
                Operating system
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink/80">{tool.sysReq.os}</p>
            </div>

            <div className="rounded-[6px] border border-line bg-white p-5 transition-shadow hover:shadow-sm">
              <Globe className="w-4 h-4 text-navy" />
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-[0.06em] text-ink/50">
                Supported browsers
              </h3>
              <ul className="mt-2 space-y-1">
                {tool.sysReq.browsers.map((b, i) => (
                  <li key={i} className="text-sm leading-6 text-ink/80">{b}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[6px] border border-line bg-white p-5 transition-shadow hover:shadow-sm">
              <Table className="w-4 h-4 text-navy" />
              <h3 className="mt-3 text-xs font-semibold uppercase tracking-[0.06em] text-ink/50">
                Microsoft Excel
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink/80">{tool.sysReq.excel}</p>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-ink/50">
            <Info className="mt-0.5 w-3.5 h-3.5 shrink-0" />
            For any lower Excel version, the tool will open in your default browser instead.
          </p>
        </section>
      </div>
    </PageContainer>
  );
};

export default OfflineToolPage;