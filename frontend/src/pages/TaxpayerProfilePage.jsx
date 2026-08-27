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
  Edit3, 
  KeyRound, 
  Check, 
  X, 
  ShieldAlert,
  Smartphone,
  ExternalLink
} from 'lucide-react';

const TaxpayerProfilePage = () => {
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast() || {};
  const navigate = useNavigate();

  // Active Taxpayer Details State (Supports Dynamic Live Updates via Edit & OTP)
  const [taxpayer, setTaxpayer] = useState({
    name: user?.name || "Ramesh Kumar",
    tradeName: user?.tradeName || "Nagpur Hardware & Sanitary Store",
    gstin: user?.gstin || "27AAAAA1234A1Z5",
    email: user?.email || "ramesh.nagpur@gst.gov.in",
    mobile: user?.mobile || "+91 98765 43210",
    state: user?.state || "Maharashtra (27)",
    annualTurnover: user?.annualTurnover || "₹82,40,000",
    registrationType: "Regular Taxpayer (Composition Exempt)",
    dateOfRegistration: "01 Jul 2017",
    jurisdiction: user?.jurisdiction || "Nagpur South Ward-4, Zone II",
    lastLogin: user?.lastLogin || "Today at 09:30 AM"
  });

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  // Edit Form Temp State
  const [editFormData, setEditFormData] = useState({ ...taxpayer });

  // OTP Verification State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

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

  const handleOpenEditModal = () => {
    setEditFormData({ ...taxpayer });
    setIsEditModalOpen(true);
  };

  const handleInitiateOtpVerification = (e) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setIsOtpModalOpen(true);
    if (showToast) showToast(`Synthetic OTP sent to registered mobile ${taxpayer.mobile}`, 'info', 'Mock OTP Dispatched');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);

    // Auto focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleAutoFillOtp = () => {
    setOtpDigits(['1', '2', '3', '4']);
    setOtpError('');
  };

  const handleVerifyOtpAndSave = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    
    if (enteredOtp.length < 4) {
      setOtpError('Please enter all 4 digits of the verification OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    setTimeout(() => {
      // Mock OTP Validation rule (accepts 1234 or any 4 digits for demo testing)
      setTaxpayer({ ...editFormData });
      setIsVerifyingOtp(false);
      setIsOtpModalOpen(false);

      if (showToast) {
        showToast('Taxpayer Profile updated & verified via OTP successfully!', 'success', 'Profile Verified');
      }
    }, 800);
  };

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
      `Mobile Number       : ${taxpayer.mobile}\n` +
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
        
        {/* Top Synthetic Environment Indicator Badge */}
        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-900 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              SYNTHETIC DEMO PROFILE
            </span>
            <span>Taxpayer profile credentials and compliance scores operate in a synthetic test sandbox.</span>
          </div>
          <span className="font-mono text-[11px] font-extrabold text-amber-800 hidden sm:inline">[MOCK DATA ACTIVE]</span>
        </div>

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
                  <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-amber" /> {taxpayer.mobile}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="bg-amber hover:bg-amber-500 text-navy font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
              >
                <Edit3 className="w-4 h-4 text-navy" />
                <span>Edit Profile Details</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadProfilePdf}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-white/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Taxpayer Registration Info</span>
              </h2>
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            </div>

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
                <span className="text-slate-400 font-medium block">Email Address</span>
                <span className="font-semibold text-slate-700">{taxpayer.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Mobile Number</span>
                <span className="font-semibold text-slate-700">{taxpayer.mobile}</span>
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

        {/* 1. EDIT PROFILE DETAILS MODAL */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-navy" />
                  <h3 className="text-lg font-bold text-navy">Edit Taxpayer Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleInitiateOtpVerification} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Legal Name (Regulated)</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 font-bold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Trade / Business Name</label>
                  <input
                    type="text"
                    value={editFormData.tradeName}
                    onChange={(e) => setEditFormData({ ...editFormData, tradeName: e.target.value })}
                    required
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      required
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Mobile Number</label>
                    <input
                      type="text"
                      value={editFormData.mobile}
                      onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                      required
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Annual Turnover Category</label>
                    <select
                      value={editFormData.annualTurnover}
                      onChange={(e) => setEditFormData({ ...editFormData, annualTurnover: e.target.value })}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium focus:border-navy focus:ring-1 focus:ring-navy bg-white"
                    >
                      <option value="₹82,40,000">₹82,40,000 (₹40L - ₹1.5 Cr)</option>
                      <option value="₹1,20,00,000">₹1.20 Cr (Medium SME)</option>
                      <option value="₹35,00,00,000">₹35.00 Cr (Large Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Jurisdiction Ward</label>
                    <input
                      type="text"
                      value={editFormData.jurisdiction}
                      onChange={(e) => setEditFormData({ ...editFormData, jurisdiction: e.target.value })}
                      required
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 font-medium focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-navy hover:bg-navy-hover text-white font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <KeyRound className="w-4 h-4 text-amber" />
                    <span>Save & Verify via OTP</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. MOCK OTP VERIFICATION MODAL */}
        {isOtpModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-center">
              <div className="h-14 w-14 bg-amber/20 border-2 border-amber/40 rounded-2xl flex items-center justify-center text-amber mx-auto mb-4">
                <KeyRound className="w-7 h-7 text-navy" />
              </div>

              <h3 className="text-lg font-extrabold text-navy">Synthetic OTP Verification</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                For security compliance, a 4-digit synthetic verification OTP has been sent to registered mobile <span className="font-bold text-slate-800">{taxpayer.mobile}</span> and email.
              </p>

              {/* Demo Helper Button */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-extrabold px-3 py-1.5 rounded-lg border border-amber-300 transition-all cursor-pointer inline-flex items-center gap-1"
                >
                  <span>⚡ Auto-Fill Hackathon Mock OTP (1234)</span>
                </button>
              </div>

              <form onSubmit={handleVerifyOtpAndSave} className="mt-6 space-y-4">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otpDigits[idx]}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-black border-2 border-slate-300 rounded-xl focus:border-navy focus:ring-2 focus:ring-navy/20 focus:outline-none bg-slate-50"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-xs text-red-600 font-bold flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> {otpError}
                  </p>
                )}

                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOtpModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="bg-navy hover:bg-navy-hover text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    {isVerifyingOtp ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Verify & Confirm Updates</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </PageContainer>
  );
};

export default TaxpayerProfilePage;
