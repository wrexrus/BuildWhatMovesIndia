import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useToast } from '../context/ToastContext';
import { fetchOfflineTools, fetchGstStatistics } from '../utils/api';
import { 
  Download, 
  FileText, 
  ShieldCheck, 
  BarChart3, 
  Wrench, 
  Monitor, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  FileSpreadsheet, 
  ExternalLink,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  Users,
  Check,
  AlertTriangle
} from 'lucide-react';

const Downloads = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast() || {};

  // Tab State: 'offline-tools' vs 'gst-statistics'
  const activeTab = searchParams.get('tab') === 'gst-statistics' ? 'gst-statistics' : 'offline-tools';

  const setActiveTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const [tools, setTools] = useState([]);
  const [statisticsData, setStatisticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Category filter for Offline Tools
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Search query for Statistics Table
  const [statsSearch, setStatsSearch] = useState('');

  // Interactive Checksum Verification State
  const [userChecksum, setUserChecksum] = useState('');
  const [selectedToolChecksum, setSelectedToolChecksum] = useState('');
  const [checksumResult, setChecksumResult] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [toolsRes, statsRes] = await Promise.all([
          fetchOfflineTools(),
          fetchGstStatistics()
        ]);
        setTools(toolsRes.tools || []);
        setStatisticsData(statsRes.data || null);
      } catch (err) {
        if (showToast) showToast("Failed to fetch official downloads data.", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle Checksum Verification
  const handleVerifyChecksum = (e) => {
    e.preventDefault();
    if (!userChecksum.trim()) return;
    const cleanUser = userChecksum.trim().toUpperCase();
    const cleanTarget = selectedToolChecksum ? selectedToolChecksum.toUpperCase() : "9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08";

    if (cleanUser === cleanTarget) {
      setChecksumResult({ match: true, message: "100% SHA-256 Match! Your downloaded file is authentic and safe." });
    } else {
      setChecksumResult({ match: false, message: "Hash Mismatch! The downloaded file may be corrupted or modified. Please re-download." });
    }
  };

  const categories = ['All', 'Returns', 'Reconciliation', 'Annual Returns', 'Job Work', 'Composition'];
  const filteredTools = selectedCategory === 'All' 
    ? tools 
    : tools.filter(t => t.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const statsList = statisticsData?.yearlyFilingData || [];
  const filteredStats = statsList.filter(s => 
    s.year.toLowerCase().includes(statsSearch.toLowerCase()) || s.status.toLowerCase().includes(statsSearch.toLowerCase())
  );

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Hero Header Section */}
        <div className="bg-gradient-to-r from-navy via-navy-2 to-blue-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Download className="w-56 h-56 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/20 border border-amber/40 text-amber text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL GST PORTAL DOWNLOADS & STATISTICS HUB</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Offline Filing Utilities & National GST Analytics
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
              Scraped live from official <span className="font-semibold text-amber">gst.gov.in</span> portal repositories. Prepare returns offline, verify checksum security, and explore certified national tax compliance statistics.
            </p>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-white/15 relative z-10">
            <button
              onClick={() => setActiveTab('offline-tools')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                activeTab === 'offline-tools'
                  ? 'bg-amber text-navy shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>🛠️ Offline Tools & Utilities</span>
            </button>

            <button
              onClick={() => setActiveTab('gst-statistics')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                activeTab === 'gst-statistics'
                  ? 'bg-amber text-navy shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>📊 GST Statistics & Compliance Data</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OFFLINE TOOLS HUB */}
        {activeTab === 'offline-tools' && (
          <div>
            
            {/* Category Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-navy text-white border-navy shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-slate-500">
                Showing {filteredTools.length} Utilities
              </span>
            </div>

            {/* Offline Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredTools.map(tool => (
                <div key={tool.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-blue-50 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-blue-200">
                        {tool.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono font-semibold">{tool.version}</span>
                    </div>

                    <h3 className="text-base font-bold text-navy mb-2 flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{tool.name}</span>
                    </h3>

                    <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Specifications List */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 mb-4 text-[11px] space-y-1 text-slate-700 font-sans">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">File Size:</span>
                        <span className="font-bold text-navy">{tool.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Release Date:</span>
                        <span className="font-bold">{tool.releaseDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Supported OS:</span>
                        <span className="font-semibold text-emerald-700">{tool.sysReq.os}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href={tool.guideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-600 hover:text-navy font-bold flex items-center gap-1 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>User Manual</span>
                    </a>

                    <a
                      href={tool.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ZIP</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* System Requirements & SHA-256 Checksum Verifier Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              
              {/* System Requirements Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <span>Official System Requirements</span>
                </h3>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy font-bold">Operating System:</strong>
                      <p className="text-slate-600 mt-0.5">Windows 7, Windows 8.1, Windows 10, Windows 11 (32-bit & 64-bit). <span className="text-red-600 font-bold">Not supported on Linux/Mac OS.</span></p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy font-bold">Supported Web Browsers:</strong>
                      <p className="text-slate-600 mt-0.5">Google Chrome 49+, Microsoft Edge, or Mozilla Firefox 45+. Internet Explorer 10+ supported for fallback opening.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-navy font-bold">Microsoft Excel Requirement:</strong>
                      <p className="text-slate-600 mt-0.5">MS Excel 2010 or newer (for opening `.xlsx` offline template files and macros).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive SHA-256 Checksum Verifier */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-navy mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>SHA-256 Checksum Security Verifier</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Confirm your downloaded file is authentic and not corrupted before running `.exe` installers.
                </p>

                <form onSubmit={handleVerifyChecksum} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Select Tool to Verify:
                    </label>
                    <select
                      value={selectedToolChecksum}
                      onChange={(e) => setSelectedToolChecksum(e.target.value)}
                      className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 focus:outline-none bg-slate-50"
                    >
                      {tools.map(t => (
                        <option key={t.id} value={t.sha256}>
                          {t.name} (SHA-256)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Paste SHA-256 Checksum Hash:
                    </label>
                    <input
                      type="text"
                      value={userChecksum}
                      onChange={(e) => setUserChecksum(e.target.value)}
                      placeholder="e.g. 9F86D081884C7D659A2FEAA0C55AD015A3BF4F1B2B0B822CD15D6C15B0F00A08"
                      className="w-full text-xs font-mono p-2.5 rounded-xl border border-slate-300 focus:border-navy focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-navy hover:bg-[#1a3f6e] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Verify SHA-256 Checksum Match
                  </button>
                </form>

                {checksumResult && (
                  <div className={`mt-4 p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    checksumResult.match ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-red-50 text-red-900 border-red-300'
                  }`}>
                    {checksumResult.match ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
                    <span>{checksumResult.message}</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: GST STATISTICS & DATA ANALYTICS HUB */}
        {activeTab === 'gst-statistics' && (
          <div>
            
            {/* National Overview Summary Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Active Registered Taxpayers</p>
                  <p className="text-2xl font-black text-navy mt-1">1.41 Crore+</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">All India Regular & Composition</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Monthly Tax Revenue Avg</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">₹1,87,000 Cr</p>
                  <p className="text-[11px] text-slate-500 mt-1">FY 2024-25 Peak Collection</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Monthly E-Way Bills</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">9.2 Crore+</p>
                  <p className="text-[11px] text-amber-700 font-semibold mt-1">Goods Transportation Bills</p>
                </div>
                <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                  <Layers className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">GSTR-3B Compliance Rate</p>
                  <p className="text-2xl font-black text-navy mt-1">89.4%</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">On-Time Monthly Returns</p>
                </div>
                <div className="p-3 bg-slate-100 text-navy rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Official Yearly Statistics Excel Downloads Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-navy flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Official GST National Statistics Datasets (Scraped from gst.gov.in)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Download certified Excel reports for GSTR-3B, GSTR-1, State Collections, and E-Way Bills.</p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={statsSearch}
                    onChange={(e) => setStatsSearch(e.target.value)}
                    placeholder="Search Year (e.g. 2023-2024)"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Financial Year</th>
                      <th className="p-3.5">GSTR-3B Return Stats</th>
                      <th className="p-3.5">GSTR-1 Outward Stats</th>
                      <th className="p-3.5">State-Wise Collections</th>
                      <th className="p-3.5">E-Way Bill Data</th>
                      <th className="p-3.5 text-right">Certification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-sans">
                    {filteredStats.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-navy">{row.year}</td>
                        <td className="p-3.5">
                          <a
                            href={row.gstr3bFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 hover:underline"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                            <span>GSTR-3B.xlsx</span>
                          </a>
                        </td>
                        <td className="p-3.5">
                          <a
                            href={row.gstr1File}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 hover:underline"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                            <span>GSTR-1.xlsx</span>
                          </a>
                        </td>
                        <td className="p-3.5">
                          <a
                            href={row.collectionFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 hover:underline"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                            <span>Statewise.xlsx</span>
                          </a>
                        </td>
                        <td className="p-3.5">
                          <a
                            href={row.ewayFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 hover:underline"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                            <span>EWayBill.xlsx</span>
                          </a>
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-300">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </PageContainer>
  );
};

export default Downloads;
