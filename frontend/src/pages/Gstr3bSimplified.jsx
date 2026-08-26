import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  runReconciliation, 
  resolveMismatch, 
  submitGstr3bReturn, 
  lookupHSN, 
  getVoiceExplanation 
} from '../utils/api';
import { 
  FileCheck2, 
  AlertCircle, 
  ShieldCheck, 
  Calculator, 
  Volume2, 
  Printer, 
  Search, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles,
  MessageSquare,
  Building2,
  MapPin,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

const DEMO_PERSONAS = [
  {
    gstin: "27AAAAA1234A1Z5",
    name: "Ramesh Kumar",
    business: "Nagpur Hardware & Sanitary Store",
    location: "Nagpur, Maharashtra",
    turnover: "₹85 Lakhs",
    problem: "Unfiled supplier bill #AP/2026/045 (Asian Paints) for ₹4,500 ITC.",
    solution: "Auto-detects missing GSTR-1, defers ₹4,500 credit safely.",
    impact: "Saved ₹10,000 penalty notice & interest.",
    invoicesCount: 20,
    eligibleItc: 18200,
    mismatchesCount: 3,
    netTax: 24300
  },
  {
    gstin: "08BBBBS5678C1Z6",
    name: "Sunita Sharma",
    business: "Jaipur Handicrafts & Textiles",
    location: "Jaipur, Rajasthan",
    turnover: "₹45 Lakhs",
    problem: "Tax mismatch: Bill shows ₹18,000 tax, but GSTR-2B shows ₹12,000.",
    solution: "Rule 102 caps claim at portal limit (₹12,000) for safe filing.",
    impact: "Saved ₹6,000 over-claim penalty notice.",
    invoicesCount: 15,
    eligibleItc: 12000,
    mismatchesCount: 1,
    netTax: 16500
  },
  {
    gstin: "03CCCCG9012D1Z7",
    name: "Gurpreet Singh",
    business: "Ludhiana Auto Parts Traders",
    location: "Ludhiana, Punjab",
    turnover: "₹1.2 Crore",
    problem: "Supplier uploaded UltraTech bill late on August 18th.",
    solution: "Rule 105 flags late upload and defers ₹9,800 ITC automatically.",
    impact: "Zero portal rejection.",
    invoicesCount: 18,
    eligibleItc: 34000,
    mismatchesCount: 1,
    netTax: 42100
  },
  {
    gstin: "36DDDDK3456E1Z8",
    name: "Kavita Reddy",
    business: "Hyderabad Electricals & Lighting",
    location: "Hyderabad, Telangana",
    turnover: "₹60 Lakhs",
    problem: "Accidental duplicate entry of Polycab invoice #POLY/2026/178.",
    solution: "Rule 103 detects duplicate GSTIN + invoice and rejects duplicate.",
    impact: "Avoided double ITC claim rejection.",
    invoicesCount: 22,
    eligibleItc: 28500,
    mismatchesCount: 1,
    netTax: 31200
  },
  {
    gstin: "24EEEEV7890F1Z9",
    name: "Vikram Patel",
    business: "Ahmedabad Industrial Chemicals",
    location: "Ahmedabad, Gujarat",
    turnover: "₹1.8 Crore",
    problem: "Purchased from supplier whose GSTIN was cancelled suo-moto.",
    solution: "Rule 104 verifies supplier GSTIN status, blocking ₹2,700 credit.",
    impact: "Protected from Section 16(2)(aa) audit.",
    invoicesCount: 25,
    eligibleItc: 48000,
    mismatchesCount: 1,
    netTax: 58900
  },
  {
    gstin: "33FFFFF1234G1Z0",
    name: "Meenakshi Sundaram",
    business: "Madurai Handloom Cotton Weavers",
    location: "Madurai, Tamil Nadu",
    turnover: "₹35 Lakhs",
    problem: "Cryptic English error codes created confusion. Speaks Tamil.",
    solution: "Native Tamil UI + 1-Tap Tamil Audio Narration explaining fix out loud.",
    impact: "100% comprehension without CA fees.",
    invoicesCount: 12,
    eligibleItc: 14200,
    mismatchesCount: 1,
    netTax: 18400
  },
  {
    gstin: "27GGGGG5678H1Z1",
    name: "Aniket Deshmukh",
    business: "Pune Electronics & Mobile Hub",
    location: "Pune, Maharashtra",
    turnover: "₹50 Lakhs",
    problem: "Unsure about correct HSN code and GST tax rate for emulsions.",
    solution: "Built-in HSN Lookup Service provides HSN 3208 and 18% rate.",
    impact: "Saved ₹5,000 over-taxation per order.",
    invoicesCount: 16,
    eligibleItc: 21000,
    mismatchesCount: 1,
    netTax: 27800
  },
  {
    gstin: "32HHHHH9012I1Z2",
    name: "Priya Nair",
    business: "Kochi Spices & Dry Fruits Wholesale",
    location: "Kochi, Kerala",
    turnover: "₹75 Lakhs",
    problem: "Confused about net cash tax liability vs eligible input tax credit.",
    solution: "Real-time Net Tax Payable Engine + Printable HTML Receipt Generator.",
    impact: "On-time filing, saved ₹50/day late fee.",
    invoicesCount: 19,
    eligibleItc: 26400,
    mismatchesCount: 1,
    netTax: 32900
  },
  {
    gstin: "23IIIII3456J1Z3",
    name: "Rajesh Varma",
    business: "Indore Sanitary & Bath Ware",
    location: "Indore, Madhya Pradesh",
    turnover: "₹90 Lakhs",
    problem: "Struggled to import raw Tally/Excel sales invoices.",
    solution: "Custom Raw Invoice Array Parser converts CSV rows automatically.",
    impact: "Filing time reduced from 4 hours to 30s.",
    invoicesCount: 24,
    eligibleItc: 31000,
    mismatchesCount: 1,
    netTax: 39500
  },
  {
    gstin: "19JJJJJ7890K1Z4",
    name: "Amina Begum",
    business: "Kolkata Leather Goods & Store",
    location: "Kolkata, West Bengal",
    turnover: "₹30 Lakhs",
    problem: "CA legal jargon ('Section 17(5)', 'Rule 36(4)') caused anxiety.",
    solution: "Shopkeeper Mode ('Dukan Mode') converts law into simple stories.",
    impact: "Complete peace of mind & self-filing.",
    invoicesCount: 10,
    eligibleItc: 11500,
    mismatchesCount: 1,
    netTax: 15200
  }
];

const Gstr3bSimplified = () => {
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useToast() || {};
  const { language } = useLanguage();

  const [selectedPersonaGstin, setSelectedPersonaGstin] = useState(
    isLoggedIn && user ? user.gstin : "27AAAAA1234A1Z5"
  );
  const [reconciliationData, setReconciliationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // HSN Lookup Widget State
  const [hsnQuery, setHsnQuery] = useState('');
  const [hsnResults, setHsnResults] = useState([]);
  const [hsnLoading, setHsnLoading] = useState(false);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Load live reconciliation data from backend
  const loadReconciliationData = async (gstinToLoad) => {
    setLoading(true);
    setSubmissionResult(null);
    try {
      const data = await runReconciliation(language, gstinToLoad);
      setReconciliationData(data?.data || data);
    } catch (err) {
      if (showToast) showToast("Failed to fetch reconciliation data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReconciliationData(selectedPersonaGstin);
  }, [selectedPersonaGstin, language]);

  // Handle 1-Click Mismatch Resolution
  const handleResolveAction = async (invoiceId, invoiceNumber, actionType) => {
    setResolvingId(invoiceId);
    try {
      const result = await resolveMismatch(invoiceId, invoiceNumber, actionType);
      if (showToast) {
        showToast(result.message || "Mismatch resolved successfully!", "success");
      }
      await loadReconciliationData(selectedPersonaGstin);
    } catch (err) {
      if (showToast) showToast(err.message || "Resolution failed.", "error");
    } finally {
      setResolvingId(null);
    }
  };

  // Handle 1-Click GSTR-3B Return Submission
  const handleSubmitReturn = async () => {
    setSubmitting(true);
    try {
      const result = await submitGstr3bReturn({ gstin: selectedPersonaGstin });
      setSubmissionResult(result);
      if (showToast) {
        showToast(`GSTR-3B Return Filed! ARN: ${result.arn}`, "success", "Filing Complete");
      }
    } catch (err) {
      if (showToast) showToast("Return submission failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Printable HTML Summary Receipt in Window
  const handleOpenReceipt = () => {
    const arn = submissionResult?.arn || "AA270726889900V";
    const receiptUrl = `/api/gstr3b/receipt/${arn}/html`;
    window.open(receiptUrl, '_blank', 'width=800,height=900,scrollbars=yes');
  };

  // Handle HSN Search
  const handleHsnSearch = async (e) => {
    e.preventDefault();
    if (!hsnQuery.trim()) return;
    setHsnLoading(true);
    try {
      const data = await lookupHSN(hsnQuery.trim());
      setHsnResults(data.data || []);
    } catch (err) {
      if (showToast) showToast("HSN lookup failed.", "error");
    } finally {
      setHsnLoading(false);
    }
  };

  // Speak SSML Voice Explainer out loud
  const handleVoicePlayback = async () => {
    if (isPlayingAudio) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);
      const voiceRes = await getVoiceExplanation('AP/2026/045', language);
      const textToSpeak = voiceRes.script || voiceRes.voicePayload?.plainText || "Asian Paints bill AP/2026/045 is unfiled. Claim credit safely next month.";
      
      const cleanText = textToSpeak.replace(/<[^>]*>/g, '').trim();

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        const localeMap = { HI: 'hi-IN', MR: 'mr-IN', TA: 'ta-IN', PA: 'pa-IN', EN: 'en-IN' };
        utterance.lang = localeMap[language] || 'hi-IN';
        utterance.rate = 0.92;

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);

        window.speechSynthesis.speak(utterance);
      } else {
        if (showToast) showToast("Web Speech API not supported on this browser.", "info");
        setIsPlayingAudio(false);
      }
    } catch (err) {
      setIsPlayingAudio(false);
    }
  };

  // Trigger Chatbot explaining specific mismatch
  const handleAskChatbot = (item) => {
    const q = `Explain invoice mismatch for invoice #${item.invoiceNumber} from supplier ${item.supplierName} (${item.errorCode || 'mismatch'}) and tell me step-by-step how to resolve it safely.`;
    window.dispatchEvent(new CustomEvent('open-gst-copilot', { detail: { query: q } }));
  };

  const activePersona = DEMO_PERSONAS.find(p => p.gstin === selectedPersonaGstin) || DEMO_PERSONAS[0];
  const items = reconciliationData?.results || [];

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Top Banner: Interactive Hackathon Demo Persona Switcher */}
        <div className="mb-8 bg-gradient-to-r from-navy via-navy-2 to-blue-900 text-white p-6 rounded-2xl shadow-lg border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Users className="w-48 h-48 text-white" />
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/20 border border-amber/40 text-amber text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>10 TAXPAYER DEMO PERSONAS & CASE STUDIES</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">GSTR-3B Simplified Filing Dashboard</h1>
              <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                Automatic GSTR-2B reconciliation, 1-click mismatch resolution, and penalty-free return submission.
              </p>
            </div>

            {/* Persona Switcher Dropdown */}
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 w-full lg:w-auto shrink-0">
              <label htmlFor="persona-select" className="block text-[11px] font-bold text-amber uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                Select Live Taxpayer Persona:
              </label>
              <select
                id="persona-select"
                value={selectedPersonaGstin}
                onChange={(e) => setSelectedPersonaGstin(e.target.value)}
                className="bg-navy text-white text-xs font-bold py-2.5 px-3 rounded-lg border border-amber/40 focus:outline-none cursor-pointer w-full"
              >
                {DEMO_PERSONAS.map(p => (
                  <option key={p.gstin} value={p.gstin}>
                    {p.name} — {p.business} ({p.location})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-white/70 mt-1.5 font-mono">
                Active GSTIN: <span className="text-amber font-semibold">{activePersona.gstin}</span>
              </p>
            </div>
          </div>

          {/* Active Persona Case Details Card */}
          <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 text-xs">
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-amber font-bold mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{activePersona.name} • {activePersona.business}</span>
              </div>
              <p className="text-white/80 text-[11px] flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/60" /> {activePersona.location}</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-white/60" /> Turnover: {activePersona.turnover}</span>
              </p>
            </div>

            <div className="bg-amber-500/20 backdrop-blur-sm p-3.5 rounded-xl border border-amber-400/30">
              <div className="flex items-center gap-1.5 text-amber font-bold mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber" />
                <span>Portal Problem & Barrier</span>
              </div>
              <p className="text-amber-100 text-[11px]">{activePersona.problem}</p>
            </div>

            <div className="bg-emerald-500/20 backdrop-blur-sm p-3.5 rounded-xl border border-emerald-400/30">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Our Solution & Impact</span>
              </div>
              <p className="text-emerald-100 text-[11px]">
                {activePersona.solution} <span className="font-bold underline text-white">({activePersona.impact})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live Tax Payable Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Scanned Invoices</p>
              <p className="text-2xl font-black text-navy mt-1">{activePersona.invoicesCount}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {activePersona.invoicesCount - activePersona.mismatchesCount} Matched Invoices
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FileCheck2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Eligible ITC Credit</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">₹{activePersona.eligibleItc.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 mt-1">GSTR-2B Verified</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Pending Mismatches</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{activePersona.mismatchesCount}</p>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">Requires 1-Click Fix</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Net Cash Tax Payable</p>
              <p className="text-2xl font-black text-navy mt-1">₹{activePersona.netTax.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 mt-1">Due: 20th August 2026</p>
            </div>
            <div className="p-3 bg-slate-100 text-navy rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Action Controls & Voice Audio Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleVoicePlayback}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs ${
                isPlayingAudio ? 'bg-amber text-navy animate-pulse' : 'bg-navy hover:bg-[#1a3f6e] text-white'
              }`}
            >
              <Volume2 className="w-4 h-4 text-amber" />
              <span>{isPlayingAudio ? 'Playing Voice Guidance...' : '1-Tap Voice Audio Explanation'}</span>
            </button>

            <button
              onClick={() => loadReconciliationData(selectedPersonaGstin)}
              disabled={loading}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Re-run live reconciliation"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Return Filing Trigger Button */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            {submissionResult ? (
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Filed (ARN: {submissionResult.arn})</span>
                </span>

                <button
                  onClick={handleOpenReceipt}
                  className="bg-navy hover:bg-[#1a3f6e] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-amber" />
                  <span>View Printable Receipt</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleSubmitReturn}
                disabled={submitting}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Filing GSTR-3B...' : 'Submit GSTR-3B Return Now'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Invoice Reconciliation Table & 1-Click Mismatch Resolutions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-base font-bold text-navy flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span>GSTR-1 vs GSTR-2B Inward Invoice Reconciliation ({activePersona.name})</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Tax Period: July 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Supplier Name & GSTIN</th>
                  <th className="p-3.5">Billed Tax</th>
                  <th className="p-3.5">GSTR-2B Credit</th>
                  <th className="p-3.5">Rule Check Status</th>
                  <th className="p-3.5 text-right">1-Click Resolution Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-navy" />
                      Running live GSTR-2B reconciliation engine for {activePersona.name}...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">No invoices found for {activePersona.name}.</td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const hasIssue = item.status !== 'MATCHED';
                    const ruleCode = item.errorCode || item.ruleCode;
                    const isUnfiled = ruleCode === 'ERR_SUPPLIER_UNFILED';
                    const isMismatch = ruleCode === 'ERR_TAX_AMOUNT_MISMATCH';
                    const isDuplicate = ruleCode === 'ERR_DUPLICATE_CLAIM';
                    const isCancelled = ruleCode === 'ERR_SUPPLIER_CANCELLED';
                    const isLate = ruleCode === 'ERR_DEFERRED_ITC_LATE_UPLOAD';

                    const billedTax = item.claimedTotalTax ?? item.billedTax ?? item.totalTax ?? 0;
                    const allowedCredit = item.allowedItcAmount ?? item.allowedItc ?? item.gstr2bTax ?? 0;

                    return (
                      <tr key={idx} className={`hover:bg-slate-50 transition-colors ${hasIssue ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : ''}`}>
                        <td className="p-3.5 font-bold font-mono text-navy">{item.invoiceNumber}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{item.supplierName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{item.supplierGstin}</div>
                          
                          {/* "🤖 Ask Chatbot" Button */}
                          {hasIssue && (
                            <button
                              type="button"
                              onClick={() => handleAskChatbot(item)}
                              className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1.5 mt-1.5 transition-all cursor-pointer shadow-2xs"
                              title="Click to open Copilot Chatbot explanation for this bill"
                            >
                              <MessageSquare className="w-3 h-3 text-blue-600" />
                              <span>🤖 Ask Chatbot to Explain</span>
                            </button>
                          )}
                        </td>
                        <td className="p-3.5 font-bold tabular-nums">₹{billedTax.toLocaleString()}</td>
                        <td className="p-3.5 font-bold tabular-nums text-emerald-600">₹{allowedCredit.toLocaleString()}</td>
                        <td className="p-3.5">
                          {hasIssue ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{ruleCode || 'MISMATCH'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>MATCHED</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          {isUnfiled && (
                            <button
                              onClick={() => handleResolveAction(item.invoiceId || item.id, item.invoiceNumber, 'DEFER_TO_NEXT_MONTH')}
                              disabled={resolvingId === (item.invoiceId || item.id)}
                              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>{resolvingId === (item.invoiceId || item.id) ? 'Resolving...' : 'Defer ITC to Next Month'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {isMismatch && (
                            <button
                              onClick={() => handleResolveAction(item.invoiceId || item.id, item.invoiceNumber, 'CLAIM_LOWER_LIMIT')}
                              disabled={resolvingId === (item.invoiceId || item.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>{resolvingId === (item.invoiceId || item.id) ? 'Resolving...' : 'Claim GSTR-2B Limit'}</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {isDuplicate && (
                            <button
                              onClick={() => handleResolveAction(item.invoiceId || item.id, item.invoiceNumber, 'DELETE_DUPLICATE')}
                              disabled={resolvingId === (item.invoiceId || item.id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>{resolvingId === (item.invoiceId || item.id) ? 'Resolving...' : 'Remove Duplicate Entry'}</span>
                            </button>
                          )}

                          {isCancelled && (
                            <span className="bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-red-300">
                              🚫 Credit Blocked (Cancelled GSTIN)
                            </span>
                          )}

                          {isLate && (
                            <button
                              onClick={() => handleResolveAction(item.invoiceId || item.id, item.invoiceNumber, 'DEFER_TO_NEXT_MONTH')}
                              disabled={resolvingId === (item.invoiceId || item.id)}
                              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Defer Credit to Next Month</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

                          {!hasIssue && (
                            <span className="text-xs text-slate-400 font-semibold">No action needed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive HSN Code & Tax Rate Lookup Widget */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-navy mb-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>HSN Code & GST Tax Rate Finder Service</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">Search official GST rates for hardware, paints, and retail goods before creating invoices.</p>

          <form onSubmit={handleHsnSearch} className="flex gap-3 max-w-xl mb-4">
            <input
              type="text"
              value={hsnQuery}
              onChange={(e) => setHsnQuery(e.target.value)}
              placeholder="e.g. Paints, Taps, Cement, or HSN Code 3208"
              className="flex-1 text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:border-navy focus:outline-none"
            />
            <button
              type="submit"
              disabled={hsnLoading}
              className="bg-navy hover:bg-[#1a3f6e] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs shrink-0"
            >
              {hsnLoading ? 'Searching...' : 'Search HSN'}
            </button>
          </form>

          {hsnResults.length > 0 && (
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-600 border-b">
                  <tr>
                    <th className="p-2.5">HSN Code</th>
                    <th className="p-2.5">Description</th>
                    <th className="p-2.5">Official GST Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y font-mono">
                  {hsnResults.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-navy">{h.hsnCode}</td>
                      <td className="p-2.5 font-sans">{h.description}</td>
                      <td className="p-2.5 font-bold text-emerald-700">{h.gstRate}% GST</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </PageContainer>
  );
};

export default Gstr3bSimplified;
