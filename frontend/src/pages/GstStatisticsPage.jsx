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
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-navy via-navy-2 to-blue-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <BarChart3 className="w-56 h-56 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/20 border border-amber/40 text-amber text-xs font-bold mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>OFFICIAL GST PORTAL NATIONAL DATASET</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              GST Statistics & Compliance Reports
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
              Official government datasets covering taxpayer registrations, GSTR-3B & GSTR-1 return filings, gross & net tax collections, state-wise revenue settlements, and E-Way Bill trends from FY 2017-18 to FY 2026-27.
            </p>
          </div>
        </div>

        {/* Quick Highlights Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Registration Data</p>
              <p className="text-xl font-black text-navy mt-1">Active Taxpayers</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">All India State-Wise Data</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Return Filings</p>
              <p className="text-xl font-black text-emerald-600 mt-1">GSTR-3B & GSTR-1</p>
              <p className="text-[11px] text-slate-500 mt-1">Annual Filings Summary</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Tax Collections</p>
              <p className="text-xl font-black text-amber-600 mt-1">Gross & IGST</p>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">State & UT Settlements</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <Landmark className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Logistics & Trade</p>
              <p className="text-xl font-black text-navy mt-1">E-Way Bills</p>
              <p className="text-[11px] text-slate-500 mt-1">Started 01/04/2018</p>
            </div>
            <div className="p-3 bg-slate-100 text-navy rounded-xl">
              <Truck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Clean & Readable GST Statistics Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <span>GST Statistics Annual Excel Datasets (2017-18 to 2026-27)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Click any download icon to fetch the official Excel spreadsheet from gst.gov.in.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter Financial Year..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-[#3F6F9F] text-white font-bold uppercase text-[11px] border-b border-blue-900">
                <tr>
                  <th className="p-3.5 border-r border-white/20" rowSpan={2}>Financial Year</th>
                  <th className="p-3.5 text-center border-r border-white/20" rowSpan={2}>Registration</th>
                  <th className="p-3.5 text-center border-r border-white/20" colSpan={2}>Return</th>
                  <th className="p-3.5 text-center border-r border-white/20" colSpan={3}>Tax Collection</th>
                  <th className="p-3.5 text-center" rowSpan={2}>E-Way Bill</th>
                </tr>
                <tr className="bg-[#2D537B] text-white">
                  <th className="p-2.5 text-center border-r border-white/20">GSTR-3B</th>
                  <th className="p-2.5 text-center border-r border-white/20">GSTR-1</th>
                  <th className="p-2.5 text-center border-r border-white/20">Gross & Net Tax Collection</th>
                  <th className="p-2.5 text-center border-r border-white/20">State wise Tax Collection</th>
                  <th className="p-2.5 text-center border-r border-white/20">Settlement of IGST to State/UTs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                    <td className="p-3.5 font-bold font-mono text-navy border-r border-slate-200">{row.fy}</td>

                    {/* Registration (Merged single download for all years) */}
                    {idx === 0 ? (
                      <td className="p-3.5 text-center border-r border-slate-200 bg-slate-100/30" rowSpan={10}>
                        <a
                          href={row.regUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-col items-center justify-center p-2 rounded-xl text-blue-700 hover:text-blue-900 hover:bg-blue-50 transition-all group cursor-pointer"
                          title="Download All-India Registration Excel Data"
                        >
                          <Download className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold mt-1 text-slate-600">REGISTRATION.xlsx</span>
                        </a>
                      </td>
                    ) : null}

                    {/* GSTR-3B */}
                    <td className="p-3.5 text-center border-r border-slate-200">
                      {row.gstr3bUrl ? (
                        <a
                          href={row.gstr3bUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer"
                          title={`Download GSTR-3B Data (${row.fy})`}
                        >
                          <Download className="w-5 h-5 text-emerald-600" />
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* GSTR-1 */}
                    <td className="p-3.5 text-center border-r border-slate-200">
                      {row.gstr1Url ? (
                        <a
                          href={row.gstr1Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-lg text-blue-700 hover:bg-blue-50 transition-all cursor-pointer"
                          title={`Download GSTR-1 Data (${row.fy})`}
                        >
                          <Download className="w-5 h-5 text-blue-600" />
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Gross and Net Tax Collection */}
                    <td className="p-3.5 text-center border-r border-slate-200">
                      {row.grossTaxUrl ? (
                        <a
                          href={row.grossTaxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-lg text-amber-700 hover:bg-amber-50 transition-all cursor-pointer"
                          title={`Download Gross & Net Tax Collection Data (${row.fy})`}
                        >
                          <Download className="w-5 h-5 text-amber-600" />
                        </a>
                      ) : (
                        <span className="text-slate-300 font-mono text-[11px]">-</span>
                      )}
                    </td>

                    {/* State wise Tax Collection */}
                    <td className="p-3.5 text-center border-r border-slate-200">
                      {row.stateTaxUrl ? (
                        <a
                          href={row.stateTaxUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-all cursor-pointer"
                          title={`Download State-wise Tax Collection Data (${row.fy})`}
                        >
                          <Download className="w-5 h-5 text-indigo-600" />
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Settlement of IGST to State/UTs */}
                    <td className="p-3.5 text-center border-r border-slate-200">
                      {row.igstSettlementUrl ? (
                        <a
                          href={row.igstSettlementUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-lg text-purple-700 hover:bg-purple-50 transition-all cursor-pointer"
                          title={`Download IGST Settlement Data (${row.fy})`}
                        >
                          <Download className="w-5 h-5 text-purple-600" />
                        </a>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* E-Way Bill */}
                    <td className="p-3.5 text-center">
                      {row.ewayUrl ? (
                        <a
                          href={row.ewayUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                          title={`Download E-Way Bill Data (${row.fy})`}
                        >
                          <Download className="w-5 h-5 text-slate-700" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-semibold">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Special Summary Footer Rows */}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                  <td colSpan={7} className="p-4 text-right text-navy font-sans">
                    Yearwise Pre-GST regime revenue from taxes subsumed in GST
                  </td>
                  <td className="p-4 text-center">
                    <a
                      href="https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Yearwise_Pre-GST_regime_revenue.xlsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 rounded-lg text-blue-700 hover:bg-blue-100 transition-all cursor-pointer"
                      title="Download Pre-GST Revenue Report"
                    >
                      <Download className="w-5 h-5 text-navy" />
                    </a>
                  </td>
                </tr>

                <tr className="bg-slate-200/80 font-extrabold border-t border-slate-300">
                  <td colSpan={7} className="p-4 text-right text-navy font-sans text-sm">
                    Statistical Report on 9 Years of GST
                  </td>
                  <td className="p-4 text-center">
                    <a
                      href="https://tutorial.gst.gov.in/offlineutilities/gst_statistics/Statistical_Report_on_9_Years_of_GST.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 rounded-lg text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
                      title="Download Statistical Report on 9 Years of GST"
                    >
                      <Download className="w-5 h-5 text-emerald-700" />
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Notes Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10">
          <h3 className="text-base font-bold text-navy mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span>Important Official Notes:</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-700 font-sans list-disc list-inside">
            <li>
              <strong className="text-navy">E-way Bill:</strong> System started from <span className="font-semibold text-slate-900">01/04/2018</span>. Data prior to FY 2018-19 is not applicable.
            </li>
            <li>
              <strong className="text-navy">Registration Data:</strong> The State-wise data contains details of active taxpayers at the close of last month. This excludes taxpayers whose registration has been cancelled, but includes taxpayers whose registration was restored on application/appeal.
            </li>
            <li>
              <strong className="text-navy">Tax Collection Breakdown:</strong>
              <ol className="list-decimal list-inside ml-5 mt-1 space-y-1 text-slate-600">
                <li>Tax data is divided into three parts viz. Tax Paid on GST Portal, IGST paid on Customs Portal, and IGST settled to States/UTs.</li>
                <li>July 2017 being the first month of GST implementation, there was no settlement data for that specific period.</li>
              </ol>
            </li>
          </ul>
        </div>

      </div>
    </PageContainer>
  );
};

export default GstStatisticsPage;
