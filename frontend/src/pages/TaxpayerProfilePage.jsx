import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Building2, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Download, 
  Printer, 
  Clock, 
  TrendingUp, 
  Mail, 
  MapPin, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

const TaxpayerProfilePage = () => {
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast() || {};
  const navigate = useNavigate();

  // Active Taxpayer Details (Grounded on logged in user or default Ramesh profile)
  const taxpayer = {
    name: user?.name || "Ramesh Kumar",
    tradeName: user?.tradeName || "Nagpur Hardware & Sanitary Store",
    gstin: user?.gstin || "27AAAAA1234A1Z5",
    email: user?.email || "ramesh.nagpur@gst.gov.in",
    state: user?.state || "Maharashtra (27)",
    annualTurnover: user?.annualTurnover || "₹82,40,000",
    registrationType: "Regular Taxpayer (Composition Exempt)",
    dateOfRegistration: "01 Jul 2017",
    jurisdiction: "Nagpur South Ward-4, Zone II",
    lastLogin: user?.lastLogin || "Today at 09:30 AM"
  };

  // Mock Tax Liability & Safety Health Summary
  const summary = {
    safetyScore: 85,
    eligibleItc: 18200,
    blockedItc: 6500,
    totalSalesTax: 42500,
    netTaxPayable: 24300,
    matchedCount: 14,
    mismatchCount: 6
  };

  // Taxpayer Return Filing History
  const filingHistory = [
    { form: "GSTR-3B", period: "Jun 2026", arn: "AA270626112233M", date: "18 Jul 2026", status: "FILED", taxPaid: "₹21,400" },
    { form: "GSTR-1", period: "Jun 2026", arn: "AA270626998877K", date: "10 Jul 2026", status: "FILED", taxPaid: "N/A" },
    { form: "GSTR-3B", period: "May 2026", arn: "AA270526776655L", date: "19 Jun 2026", status: "FILED", taxPaid: "₹19,800" },
    { form: "GSTR-1", period: "May 2026", arn: "AA270526443322P", date: "11 Jun 2026", status: "FILED", taxPaid: "N/A" },
    { form: "CMP-08", period: "Q1 FY26", arn: "AA270426554433X", date: "18 Apr 2026", status: "EXEMPT", taxPaid: "₹0" }
  ];

  // Action Items Pending Attention
  const pendingActions = [
    {
      id: 1,
      supplier: "Asian Paints",
      invoice: "AP/2026/045",
      tax: "₹4,500",
      reason: "GSTR-1 Not Filed by Supplier",
      actionLabel: "Defer ITC to Next Month",
      severity: "CRITICAL"
    },
    {
      id: 2,
      supplier: "Jaipur Handicrafts",
      invoice: "JQ/2026/089",
      tax: "₹6,000",
      reason: "Tax Rate Mismatch (Portal: ₹12k vs Bill: ₹18k)",
      actionLabel: "Claim ₹12k Portal Amount",
      severity: "WARNING"
    },
    {
      id: 3,
      supplier: "Polycab India",
      invoice: "POLY/2026/178",
      tax: "₹3,600",
      reason: "Duplicate Scanned Entry",
      actionLabel: "Remove Duplicate Entry",
      severity: "CRITICAL"
    }
  ];

  const handlePrintSummary = () => {
    window.print();
  };

  const handleDownloadProfilePdf = () => {
    if (showToast) showToast("Downloading Taxpayer Profile & Compliance Report PDF...", "success");
    const element = document.createElement("a");
    const file = new Blob([
      `=======================================================\n` +
      `       OFFICIAL TAXPAYER PROFILE & COMPLIANCE SUMMARY   \n` +
      `=======================================================\n` +
      `Taxpayer Legal Name : ${taxpayer.name}\n` +
      `Trade / Business    : ${taxpayer.tradeName}\n` +
      `GSTIN               : ${taxpayer.gstin}\n` +
      `Email               : ${taxpayer.email}\n` +
      `State               : ${taxpayer.state}\n` +
      `Annual Turnover     : ${taxpayer.annualTurnover}\n` +
      `Registration Type   : ${taxpayer.registrationType}\n` +
      `Jurisdiction        : ${taxpayer.jurisdiction}\n` +
      `-------------------------------------------------------\n` +
      `GSTR-3B RECONCILIATION SUMMARY (JULY 2026):\n` +
      `- Safety Filing Score  : ${summary.safetyScore}% (SAFE)\n` +
      `- Matched Invoices     : ${summary.matchedCount}\n` +
      `- Mismatched Invoices  : ${summary.mismatchCount}\n` +
      `- Total Sales Tax      : ₹${summary.totalSalesTax.toLocaleString()}\n` +
      `- Eligible ITC         : ₹${summary.eligibleItc.toLocaleString()}\n` +
      `- Net Tax Payable      : ₹${summary.netTaxPayable.toLocaleString()}\n` +
      `-------------------------------------------------------\n` +
      `Report Generated On    : ${new Date().toLocaleString('en-IN')}\n` +
      `Goods and Services Tax Network (GSTN)\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GST_Taxpayer_Profile_${taxpayer.gstin}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#071b30] via-navy to-[#0a2f58] text-white p-6 sm:p-8 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden mb-8">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Building2 className="w-64 h-64 text-white" />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-amber/20 border-2 border-amber/40 rounded-2xl flex items-center justify-center text-amber shadow-inner shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{taxpayer.name}</h1>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Citizen
                  </span>
                </div>
                <p className="text-sm text-white/80 font-medium mt-0.5">{taxpayer.tradeName}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-white/70">
                  <span className="bg-white/10 px-2 py-0.5 rounded border border-white/15">GSTIN: {taxpayer.gstin}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber" /> {taxpayer.state}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-amber" /> {taxpayer.email}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleDownloadProfilePdf}
                className="bg-amber hover:bg-amber-500 text-navy font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
              >
                <Download className="w-4 h-4 text-navy" />
                <span>Download Report</span>
              </button>
              <button
                type="button"
                onClick={handlePrintSummary}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-white/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Health Metric Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200/90 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filing Health Score</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-navy">{summary.safetyScore}%</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Safe to File</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">14 of 20 invoices 100% matched with GSTR-2B</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eligible ITC (Claimable)</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mt-3 text-3xl font-black text-emerald-600">₹{summary.eligibleItc.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Auto-reflected in GSTR-2B statement</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Cash Tax Payable</span>
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div className="mt-3 text-3xl font-black text-navy">₹{summary.netTaxPayable.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Total Sales Tax: ₹{summary.totalSalesTax.toLocaleString()}</p>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-200/90">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blocked Pending Credit</span>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-3 text-3xl font-black text-amber-700">₹{summary.blockedItc.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">Saved from automated GST portal notices</p>
          </div>
        </div>

        {/* Main Content Grid: Taxpayer Details & Pending Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column: Taxpayer Registration & Business Details */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/90 space-y-4">
            <h2 className="text-base font-bold text-navy border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Taxpayer Registration Info</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Legal Name</span>
                <span className="font-bold text-slate-800 text-sm">{taxpayer.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Trade Name</span>
                <span className="font-semibold text-slate-700">{taxpayer.tradeName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">GSTIN / Unique ID</span>
                <span className="font-mono font-bold text-navy bg-slate-100 px-2 py-0.5 rounded">{taxpayer.gstin}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Registration Type</span>
                <span className="font-medium text-slate-700">{taxpayer.registrationType}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Annual Turnover Category</span>
                <span className="font-bold text-emerald-700">{taxpayer.annualTurnover}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">State & Code</span>
                <span className="font-medium text-slate-700">{taxpayer.state}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Jurisdictional Office</span>
                <span className="font-medium text-slate-700">{taxpayer.jurisdiction}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/gstr3b-simplified"
                className="w-full bg-navy hover:bg-[#1a3f6e] text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Launch GSTR-3B Dashboard</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column (2 Spans): Pending Action Items & Filing Roadmap */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-slate-200/90 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Pending Action Items Requiring Attention ({pendingActions.length})</span>
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full">
                July 2026 Filing Period
              </span>
            </div>

            <div className="space-y-3">
              {pendingActions.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy text-sm">{item.supplier}</span>
                      <span className="font-mono text-xs text-slate-500">#{item.invoice}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{item.reason}</p>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded inline-block mt-1">
                      Tax Credit Impact: {item.tax}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (showToast) showToast(`Action initiated for ${item.supplier}: ${item.actionLabel}`, 'info');
                      navigate('/gstr3b-simplified');
                    }}
                    className="bg-navy hover:bg-navy-hover text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-navy/30 transition-all cursor-pointer shrink-0 shadow-2xs"
                  >
                    {item.actionLabel}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Taxpayer Return Filing History Table */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/90">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>GST Return Filing History & Statements</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Verified ARNs and filing timestamps recorded on GST Portal</p>
            </div>
            <Link
              to="/registration/track-status"
              className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 hover:underline"
            >
              <span>Track Application Status</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                  <th className="p-3">Form Type</th>
                  <th className="p-3">Return Period</th>
                  <th className="p-3">ARN Reference Number</th>
                  <th className="p-3">Date of Filing</th>
                  <th className="p-3">Tax Amount Paid</th>
                  <th className="p-3">Filing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filingHistory.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-bold text-navy">{row.form}</td>
                    <td className="p-3 text-slate-700">{row.period}</td>
                    <td className="p-3 font-mono text-slate-800 font-semibold">{row.arn}</td>
                    <td className="p-3 text-slate-600">{row.date}</td>
                    <td className="p-3 font-bold text-slate-800">{row.taxPaid}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{row.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};

export default TaxpayerProfilePage;
