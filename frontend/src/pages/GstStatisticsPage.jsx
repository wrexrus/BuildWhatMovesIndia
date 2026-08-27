import React, { useState } from 'react';
import PageContainer from '../components/PageContainer';
import { 
  Download, 
  FileSpreadsheet, 
  BarChart3, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Info, 
  Calendar, 
  Truck, 
  Building, 
  Landmark,
  Search,
  ExternalLink
} from 'lucide-react';

const STATS_MATRIX = [
  {
    fy: "2017-2018",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2017-2018.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2017-2018.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2017-18.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2017-2018.xlsx",
    ewayUrl: null // E-Way bill started 01/04/2018
  },
  {
    fy: "2018-2019",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2018-2019.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2018-2019.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2018-19.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2018-2019.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2018-19.xlsx"
  },
  {
    fy: "2019-2020",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2019-2020.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2019-2020.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2019-20.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2019-2020.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2019-20.xlsx"
  },
  {
    fy: "2020-2021",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2020-2021.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2020-2021.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2020-21.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2020-2021.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2020-21.xlsx"
  },
  {
    fy: "2021-2022",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2021-2022.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2021-2022.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2021-22.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2021-2022.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2021-22.xlsx"
  },
  {
    fy: "2022-2023",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2022-2023.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2022-2023.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2022-23.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2022-2023.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2022-23.xlsx"
  },
  {
    fy: "2023-2024",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2023-2024.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2023-2024.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2023-24.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2023-2024.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2023-24.xlsx"
  },
  {
    fy: "2024-2025",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2024-2025.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2024-2025.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2024-25.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2024-2025.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2024-25.xlsx"
  },
  {
    fy: "2025-2026",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2025-2026.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2025-2026.xlsx",
    grossTaxUrl: null,
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2025-26.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2025-2026.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2025-26.xlsx"
  },
  {
    fy: "2026-2027",
    regUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/REGISTRATION.xlsx",
    gstr3bUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-3B-2026-2027.xlsx",
    gstr1Url: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/GSTR-1-2026-2027.xlsx",
    grossTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Gross_Net_GST_Collection_2026-27.xlsx",
    stateTaxUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/statewise_GST_collection_2026-27.xlsx",
    igstSettlementUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Settlement-of-IGST-to-State-2026-2027.xlsx",
    ewayUrl: "https://tutorial.gst.gov.in/offlineutilities/gst_statistics/ewb-data-2026-27.xlsx"
  }
];

const GstStatisticsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = STATS_MATRIX.filter(row => 
    row.fy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-7xl px-3 py-5 font-sans sm:px-5 sm:py-7 lg:px-8 lg:py-8">
        <header className="border-b border-line pb-6 sm:pb-8">
          <div className="max-w-4xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-navy/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-navy sm:text-[11px]">
                <BarChart3 className="h-3.5 w-3.5" />
                GST statistics
              </span>
              <span className="text-[10px] text-muted sm:text-[11px]">
                FY 2017-18 to FY 2026-27
              </span>
            </div>

            <h1 className="text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink sm:text-[2.25rem] lg:text-[2.55rem]">
              GST Statistics & Compliance Reports
            </h1>

            <p className="mt-3 max-w-4xl text-sm leading-6 text-muted sm:text-[15px] sm:leading-7">
              Official government datasets covering taxpayer registrations, GSTR-3B & GSTR-1 return filings, gross & net tax collections, state-wise revenue settlements, and E-Way Bill trends from FY 2017-18 to FY 2026-27.
            </p>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border border-line bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Registration Data
                </p>
                <p className="mt-1 text-base font-semibold text-ink sm:text-lg">
                  Active Taxpayers
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  All India State-Wise Data
                </p>
              </div>
              <Users className="h-5 w-5 shrink-0 text-navy" />
            </div>
          </div>

          <div className="border border-line bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Return Filings
                </p>
                <p className="mt-1 text-base font-semibold text-ink sm:text-lg">
                  GSTR-3B & GSTR-1
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Annual Filings Summary
                </p>
              </div>
              <FileSpreadsheet className="h-5 w-5 shrink-0 text-navy" />
            </div>
          </div>

          <div className="border border-line bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Tax Collections
                </p>
                <p className="mt-1 text-base font-semibold text-ink sm:text-lg">
                  Gross & IGST
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  State & UT Settlements
                </p>
              </div>
              <Landmark className="h-5 w-5 shrink-0 text-navy" />
            </div>
          </div>

          <div className="border border-line bg-white p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Logistics & Trade
                </p>
                <p className="mt-1 text-base font-semibold text-ink sm:text-lg">
                  E-Way Bills
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Started 01/04/2018
                </p>
              </div>
              <Truck className="h-5 w-5 shrink-0 text-navy" />
            </div>
          </div>
        </section>

        <section className="mt-8 overflow-hidden border border-line bg-white">
          <div className="border-b border-line bg-[#f8fafc] px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 shrink-0 text-navy" />
                  <h2 className="text-sm font-semibold text-ink sm:text-base">
                    GST Statistics Annual Excel Datasets
                  </h2>
                </div>
                <p className="mt-1 max-w-2xl text-xs leading-5 text-muted sm:text-sm">
                  Download the available Excel dataset for each financial year.
                </p>
              </div>

              <div className="w-full lg:w-72">
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Filter Financial Year
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted/60" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g. 2025-2026"
                    className="
                      h-10
                      w-full
                      rounded-[7px]
                      border
                      border-line
                      bg-white
                      pl-9
                      pr-3
                      text-sm
                      text-ink
                      placeholder:text-muted/50
                      focus:border-navy/35
                      focus:outline-none
                      focus:ring-2
                      focus:ring-amber/25
                    "
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-line bg-white px-4 py-2.5 sm:px-5">
            <div className="flex items-start gap-2 text-[11px] leading-5 text-muted">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy" />
              <span>
                On smaller screens, swipe horizontally to view all dataset columns.
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1180px] w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/15 bg-navy text-white">
                  <th
                    className="sticky left-0 z-20 whitespace-nowrap border-r border-white/15 bg-navy px-3 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.07em] sm:px-4"
                    rowSpan={2}
                  >
                    Financial Year
                  </th>
                  <th
                    className="border-r border-white/15 px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.07em] sm:px-4"
                    rowSpan={2}
                  >
                    Registration
                  </th>
                  <th
                    className="border-r border-white/15 px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.07em] sm:px-4"
                    colSpan={2}
                  >
                    Return
                  </th>
                  <th
                    className="border-r border-white/15 px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.07em] sm:px-4"
                    colSpan={3}
                  >
                    Tax Collection
                  </th>
                  <th
                    className="px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.07em] sm:px-4"
                    rowSpan={2}
                  >
                    E-Way Bill
                  </th>
                </tr>

                <tr className="border-b border-white/15 bg-navy-2 text-white">
                  <th className="border-r border-white/15 px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.05em] sm:px-4">
                    GSTR-3B
                  </th>
                  <th className="border-r border-white/15 px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.05em] sm:px-4">
                    GSTR-1
                  </th>
                  <th className="border-r border-white/15 px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.05em] sm:px-4">
                    Gross & Net Tax Collection
                  </th>
                  <th className="border-r border-white/15 px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.05em] sm:px-4">
                    State wise Tax Collection
                  </th>
                  <th className="border-r border-white/15 px-3 py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.05em] sm:px-4">
                    Settlement of IGST to State/UTs
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-line font-sans">
                {filteredData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="group bg-white transition-colors hover:bg-[#f7f9fb]"
                  >
                    <td className="sticky left-0 z-10 whitespace-nowrap border-r border-line bg-white px-3 py-3.5 font-mono text-[11px] font-semibold text-navy group-hover:bg-[#f7f9fb] sm:px-4">
                      {row.fy}
                    </td>

                    {idx === 0 ? (
                      <td
                        className="border-r border-line bg-[#fafbfd] px-3 py-3.5 text-center sm:px-4"
                        rowSpan={10}
                      >
                        <a
                          href={row.regUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            inline-flex
                            min-w-[122px]
                            flex-col
                            items-center
                            justify-center
                            gap-1
                            rounded-[7px]
                            border
                            border-line
                            bg-white
                            px-3
                            py-2.5
                            text-navy
                            transition-colors
                            hover:border-navy/25
                            hover:bg-shell
                            focus-visible:outline-none
                          "
                          title="Download All-India Registration Excel Data"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-[10px] font-semibold leading-4 text-muted">
                            REGISTRATION.xlsx
                          </span>
                        </a>
                      </td>
                    ) : null}

                    <td className="border-r border-line px-3 py-3.5 text-center sm:px-4">
                      {row.gstr3bUrl ? (
                        <a
                          href={row.gstr3bUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 min-w-8 items-center justify-center rounded-[7px] text-navy transition-colors hover:bg-shell focus-visible:outline-none"
                          title={`Download GSTR-3B Data (${row.fy})`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-muted/35">—</span>
                      )}
                    </td>

                    <td className="border-r border-line px-3 py-3.5 text-center sm:px-4">
                      {row.gstr1Url ? (
                        <a
                          href={row.gstr1Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 min-w-8 items-center justify-center rounded-[7px] text-navy transition-colors hover:bg-shell focus-visible:outline-none"
                          title={`Download GSTR-1 Data (${row.fy})`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-muted/35">—</span>
                      )}
                    </td>

                    <td className="border-r border-line px-3 py-3.5 text-center sm:px-4">
                      {row.grossTaxUrl ? (
                        <a
                          href={row.grossTaxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 min-w-8 items-center justify-center rounded-[7px] text-navy transition-colors hover:bg-shell focus-visible:outline-none"
                          title={`Download Gross & Net Tax Collection Data (${row.fy})`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-muted/35">—</span>
                      )}
                    </td>

                    <td className="border-r border-line px-3 py-3.5 text-center sm:px-4">
                      {row.stateTaxUrl ? (
                        <a
                          href={row.stateTaxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 min-w-8 items-center justify-center rounded-[7px] text-navy transition-colors hover:bg-shell focus-visible:outline-none"
                          title={`Download State-wise Tax Collection Data (${row.fy})`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-muted/35">—</span>
                      )}
                    </td>

                    <td className="border-r border-line px-3 py-3.5 text-center sm:px-4">
                      {row.igstSettlementUrl ? (
                        <a
                          href={row.igstSettlementUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 min-w-8 items-center justify-center rounded-[7px] text-navy transition-colors hover:bg-shell focus-visible:outline-none"
                          title={`Download IGST Settlement Data (${row.fy})`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-muted/35">—</span>
                      )}
                    </td>

                    <td className="px-3 py-3.5 text-center sm:px-4">
                      {row.ewayUrl ? (
                        <a
                          href={row.ewayUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 min-w-8 items-center justify-center rounded-[7px] text-navy transition-colors hover:bg-shell focus-visible:outline-none"
                          title={`Download E-Way Bill Data (${row.fy})`}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-[11px] font-medium text-muted/55">
                          N/A
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                <tr className="border-t-2 border-line bg-[#f7f9fb]">
                  <td
                    colSpan={7}
                    className="px-3 py-3.5 text-left text-[11px] font-semibold leading-5 text-navy sm:px-4 sm:text-xs"
                  >
                    Yearwise Pre-GST regime revenue from taxes subsumed in GST
                  </td>
                  <td className="px-3 py-3.5 text-center sm:px-4">
                    <a
                      href="https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Yearwise_Pre-GST_regime_revenue.xlsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 min-w-8 items-center justify-center rounded-[7px] text-navy transition-colors hover:bg-white focus-visible:outline-none"
                      title="Download Pre-GST Revenue Report"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </td>
                </tr>

                <tr className="border-t border-line bg-[#eef2f6]">
                  <td
                    colSpan={7}
                    className="px-3 py-3.5 text-left text-[11px] font-semibold leading-5 text-navy sm:px-4 sm:text-sm"
                  >
                    Statistical Report on 9 Years of GST
                  </td>
                  <td className="px-3 py-3.5 text-center sm:px-4">
                    <a
                      href="https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Statistical_Report_on_9_Years_of_GST.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 min-w-8 items-center justify-center rounded-[7px] text-navy transition-colors hover:bg-white focus-visible:outline-none"
                      title="Download Statistical Report on 9 Years of GST"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="border-t border-line px-4 py-10 text-center sm:px-6">
              <p className="text-sm font-medium text-ink">
                No financial year found
              </p>
              <p className="mt-1 text-xs text-muted">
                Try searching for another year.
              </p>
            </div>
          )}
        </section>

        <section className="mt-8 border border-line bg-white">
          <div className="border-b border-line bg-[#f8fafc] px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-navy" />
              <h2 className="text-sm font-semibold text-ink sm:text-base">
                Important Official Notes
              </h2>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5 sm:py-5">
            <ul className="space-y-4 text-xs leading-6 text-muted sm:text-sm">
              <li>
                <strong className="font-semibold text-ink">
                  E-way Bill:
                </strong>{" "}
                System started from{" "}
                <span className="font-semibold text-ink">
                  01/04/2018
                </span>
                . Data prior to FY 2018-19 is not applicable.
              </li>

              <li>
                <strong className="font-semibold text-ink">
                  Registration Data:
                </strong>{" "}
                The State-wise data contains details of active taxpayers at the close of last month. This excludes taxpayers whose registration has been cancelled, but includes taxpayers whose registration was restored on application/appeal.
              </li>

              <li>
                <strong className="font-semibold text-ink">
                  Tax Collection Breakdown:
                </strong>

                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-muted">
                  <li>
                    Tax data is divided into three parts viz. Tax Paid on GST Portal, IGST paid on Customs Portal, and IGST settled to States/UTs.
                  </li>
                  <li>
                    July 2017 being the first month of GST implementation, there was no settlement data for that specific period.
                  </li>
                </ol>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </PageContainer>
  )
};

export default GstStatisticsPage;