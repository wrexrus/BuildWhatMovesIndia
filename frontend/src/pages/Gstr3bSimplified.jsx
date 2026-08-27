import React, { useState, useEffect } from 'react';
import PageContainer from '../components/PageContainer';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { speakTextInLanguage, stopSpeech } from '../utils/speechUtils';
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
  ShieldAlert,
  Upload,
  FileText,
  X,
  Check,
  Eye,
  Filter,
  PlusCircle,
  Download,
  FileSpreadsheet
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
    turnover: "₹1.4 Crores",
    problem: "Tax rate mismatch on Jaquar bill #JQ/2026/089 (Portal: ₹12k vs Shop: ₹18k).",
    solution: "Auto-claims ₹12,000 portal limit; defers ₹6,000 for seller credit note.",
    impact: "Avoided ₹6,000 excess claim notice.",
    invoicesCount: 25,
    eligibleItc: 42000,
    mismatchesCount: 2,
    netTax: 38500
  },
  {
    gstin: "03CCCCG9012D1Z7",
    name: "Gurpreet Singh",
    business: "Ludhiana Auto Parts Traders",
    location: "Ludhiana, Punjab",
    turnover: "₹62 Lakhs",
    problem: "Supplier GSTIN cancelled by department on bill #LHW/2026/144.",
    solution: "Blocks ₹2,700 ineligible tax credit completely.",
    impact: "Protected from fake invoice audit notice.",
    invoicesCount: 15,
    eligibleItc: 14500,
    mismatchesCount: 1,
    netTax: 19200
  },
  {
    gstin: "36DDDDK3456E1Z8",
    name: "Kavita Reddy",
    business: "Hyderabad Electricals & Lighting",
    location: "Hyderabad, Telangana",
    turnover: "₹1.1 Crores",
    problem: "Duplicate scanned entry for Polycab bill #POLY/2026/178.",
    solution: "Removes ₹3,600 duplicate claim automatically.",
    impact: "Saved from double claiming audit penalty.",
    invoicesCount: 18,
    eligibleItc: 29400,
    mismatchesCount: 2,
    netTax: 31000
  },
  {
    gstin: "24EEEEV7890F1Z9",
    name: "Vikram Patel",
    business: "Ahmedabad Industrial Chemicals",
    location: "Ahmedabad, Gujarat",
    turnover: "₹3.5 Crores",
    problem: "Late upload after 11th monthly cutoff by UltraTech Cement.",
    solution: "Defers ₹9,800 credit safely to next month's GSTR-2B.",
    impact: "Prevented premature tax claim rejection.",
    invoicesCount: 32,
    eligibleItc: 84000,
    mismatchesCount: 1,
    netTax: 62000
  },
  {
    gstin: "33FFFFM1234G1Z0",
    name: "Meenakshi Sundaram",
    business: "Madurai Handloom Cotton Weavers",
    location: "Madurai, Tamil Nadu",
    turnover: "₹45 Lakhs",
    problem: "HSN classification discrepancy on yarn purchase.",
    solution: "Auto-reconciles HSN rate at 5% instead of 12%.",
    impact: "Correct tax calculation without penalty.",
    invoicesCount: 12,
    eligibleItc: 9800,
    mismatchesCount: 1,
    netTax: 12400
  },
  {
    gstin: "27GGGGA5678H1Z1",
    name: "Aniket Deshmukh",
    business: "Pune Electronics & Mobile Hub",
    location: "Pune, Maharashtra",
    turnover: "₹95 Lakhs",
    problem: "Unfiled supplier bill from local wholesaler.",
    solution: "Notifies seller & holds ITC claim for next period.",
    impact: "Protected ₹5,200 cash flow.",
    invoicesCount: 22,
    eligibleItc: 34000,
    mismatchesCount: 2,
    netTax: 28900
  },
  {
    gstin: "32HHHHP9012I1Z2",
    name: "Priya Nair",
    business: "Kochi Spices & Dry Fruits Wholesale",
    location: "Kochi, Kerala",
    turnover: "₹1.8 Crores",
    problem: "State GST code mismatch on interstate purchase.",
    solution: "Auto-maps CGST+SGST to IGST ledger.",
    impact: "Prevented wrong ledger head tax filing.",
    invoicesCount: 28,
    eligibleItc: 56000,
    mismatchesCount: 1,
    netTax: 44200
  },
  {
    gstin: "23IIIIR3456J1Z3",
    name: "Rajesh Varma",
    business: "Indore Sanitary & Bath Ware",
    location: "Indore, Madhya Pradesh",
    turnover: "₹78 Lakhs",
    problem: "Unfiled GSTR-1 bill for tiles purchase.",
    solution: "Claims verified GSTR-2B limit with 1-click.",
    impact: "Clean filing with 0 notice risk.",
    invoicesCount: 16,
    eligibleItc: 19500,
    mismatchesCount: 1,
    netTax: 21800
  },
  {
    gstin: "19JJJJA7890K1Z4",
    name: "Amina Begum",
    business: "Kolkata Leather Goods & Store",
    location: "Kolkata, West Bengal",
    turnover: "₹52 Lakhs",
    problem: "Duplicate billing entry on raw material purchase.",
    solution: "Removes duplicate invoice before GSTR-3B submission.",
    impact: "Prevented interest penalty on excess ITC.",
    invoicesCount: 14,
    eligibleItc: 13200,
    mismatchesCount: 1,
    netTax: 16500
  }
];

const Gstr3bSimplified = () => {
  const { user } = useAuth();
  const { showToast } = useToast() || {};
  const { language } = useLanguage() || { language: 'EN' };

  // State Management
  const [selectedPersonaGstin, setSelectedPersonaGstin] = useState("27AAAAA1234A1Z5");
  const [reconciliationData, setReconciliationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Per-Persona Persistent State Dictionary (Preserves uploads & 1-click fixes per persona!)
  const [personaStateCache, setPersonaStateCache] = useState({});

  // Dynamic Persona Metrics State for Instant Live UI Updates
  const [activePersonaMetrics, setActivePersonaMetrics] = useState(DEMO_PERSONAS[0]);

  // Standalone Feature States
  const [isPreFilingSummaryOpen, setIsPreFilingSummaryOpen] = useState(false);
  const [isUploadDropzoneOpen, setIsUploadDropzoneOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isParsingInvoices, setIsParsingInvoices] = useState(false);
  const [activeMismatchFilter, setActiveMismatchFilter] = useState("ALL");

  // Load live reconciliation data from backend with per-persona caching
  const loadReconciliationData = async (gstinToLoad) => {
    setLoading(true);
    setSubmissionResult(null);

    const basePersona = DEMO_PERSONAS.find(p => p.gstin === gstinToLoad) || DEMO_PERSONAS[0];

    // Check if we have custom uploaded / resolved state cached for this persona
    if (personaStateCache[gstinToLoad]) {
      const cached = personaStateCache[gstinToLoad];
      setReconciliationData(cached.reconciliationData);
      setActivePersonaMetrics(cached.metrics);
      setLoading(false);
      return;
    }

    setActivePersonaMetrics(basePersona);

    try {
      const data = await runReconciliation(language, gstinToLoad);
      const fetchedData = data?.data || data;
      setReconciliationData(fetchedData);

      // Cache initial state for this persona
      setPersonaStateCache(prev => ({
        ...prev,
        [gstinToLoad]: {
          reconciliationData: fetchedData,
          metrics: basePersona
        }
      }));
    } catch (err) {
      if (showToast) showToast("Failed to fetch reconciliation data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReconciliationData(selectedPersonaGstin);
  }, [selectedPersonaGstin, language]);

  // LIVE File Parser: MERGES newly uploaded invoices with existing persona invoices!
  const handleSimulatedFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsParsingInvoices(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const textContent = event.target.result;
        let parsedInvoices = [];

        if (file.name.endsWith('.json')) {
          const rawObj = JSON.parse(textContent);
          parsedInvoices = Array.isArray(rawObj) ? rawObj : [rawObj];
        } else {
          // Parse CSV cleanly with NaN protection
          const lines = textContent.split('\n').filter(l => l.trim());
          if (lines.length > 1) {
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map(c => c.trim());
              if (cols.length >= 3) {
                const taxVal = Number(cols[8] || cols[4] || 5000);
                const safeTax = isNaN(taxVal) ? 5000 : taxVal;

                parsedInvoices.push({
                  invoiceNumber: cols[0] || `UP-INV/${i}`,
                  supplierName: cols[1] || 'Uploaded Supplier',
                  supplierGstin: cols[2] || '27AAACA9999Z1',
                  claimedTotalTax: safeTax,
                  allowedItcAmount: safeTax,
                  status: 'MATCHED',
                  errorCode: null
                });
              }
            }
          }
        }

        if (parsedInvoices.length > 0) {
          const formattedNewResults = parsedInvoices.map((inv, idx) => ({
            invoiceId: `UP-${Date.now()}-${idx}`,
            invoiceNumber: inv.invoiceNumber || `INV/2026/${idx + 101}`,
            supplierName: inv.supplierName || 'Uploaded Supplier',
            supplierGstin: inv.supplierGstin || '27AAACA9999Z1',
            claimedTotalTax: Number(inv.claimedTotalTax || inv.totalTax || 5000),
            allowedItcAmount: inv.status === 'MATCHED' ? Number(inv.claimedTotalTax || 5000) : Number(inv.gstr2bData?.totalTax || 0),
            status: inv.status || 'MATCHED',
            errorCode: inv.errorCode || null,
            isUploaded: true // Mark as newly uploaded invoice!
          }));

          // MERGE newly uploaded invoices into current persona's invoice list!
          const existingResults = reconciliationData?.results || [];
          const combinedResults = [...formattedNewResults, ...existingResults];

          const mismatchedCount = combinedResults.filter(r => r.status !== 'MATCHED').length;
          const totalEligibleItc = combinedResults.reduce((acc, curr) => acc + (curr.allowedItcAmount || 0), 0);

          const updatedReconciliationData = {
            results: combinedResults,
            summary: {
              totalInvoices: combinedResults.length,
              matchedCount: combinedResults.length - mismatchedCount,
              mismatchCount: mismatchedCount,
              eligibleItc: totalEligibleItc
            }
          };

          const updatedMetrics = {
            ...activePersonaMetrics,
            invoicesCount: combinedResults.length,
            mismatchesCount: mismatchedCount,
            eligibleItc: totalEligibleItc,
            netTax: Math.max(0, 42500 - totalEligibleItc)
          };

          setReconciliationData(updatedReconciliationData);
          setActivePersonaMetrics(updatedMetrics);

          // Update Per-Persona Cache
          setPersonaStateCache(prev => ({
            ...prev,
            [selectedPersonaGstin]: {
              reconciliationData: updatedReconciliationData,
              metrics: updatedMetrics
            }
          }));

          if (showToast) {
            showToast(`Merged ${formattedNewResults.length} uploaded invoices into ${activePersonaMetrics.name}'s register!`, "success", `Invoices Added (${activePersonaMetrics.name})`);
          }
        }
      } catch (parseErr) {
        if (showToast) showToast("Could not parse file structure. Loaded sample datasets.", "info");
      } finally {
        setIsParsingInvoices(false);
        setIsUploadDropzoneOpen(false);
      }
    };

    reader.readAsText(file);
  };

  // Download Invoice List as CSV / Excel
  const handleDownloadCsv = () => {
    const currentInvoices = reconciliationData?.results || [];
    if (currentInvoices.length === 0) {
      if (showToast) showToast("No invoices available to export.", "warning");
      return;
    }

    let csvContent = "Invoice Number,Supplier Name,Supplier GSTIN,Billed Tax (INR),GSTR-2B Credit (INR),Rule Status,Error Code\n";
    currentInvoices.forEach(item => {
      const billed = item.claimedTotalTax ?? item.billedTax ?? item.totalTax ?? 0;
      const allowed = item.allowedItcAmount ?? item.allowedItc ?? item.gstr2bTax ?? 0;
      const status = item.status || 'MATCHED';
      const err = item.errorCode || item.ruleCode || 'NONE';
      csvContent += `"${item.invoiceNumber}","${item.supplierName}","${item.supplierGstin}",${billed},${allowed},"${status}","${err}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GST_Invoice_Register_${activePersonaMetrics.name.replace(/\s+/g, '_')}_July2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) showToast(`Downloaded invoice register CSV for ${activePersonaMetrics.name}!`, "success");
  };

  // Download Invoice List as Printable PDF Statement
  const handleDownloadPdf = () => {
    const currentInvoices = reconciliationData?.results || [];
    const printWin = window.open('', '_blank', 'width=900,height=1000');
    
    const tableRowsHtml = currentInvoices.map((item) => `
      <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
        <td style="padding: 10px; font-weight: bold; font-family: monospace;">${item.invoiceNumber}</td>
        <td style="padding: 10px;">${item.supplierName}<br><small style="color: #64748b;">${item.supplierGstin}</small></td>
        <td style="padding: 10px; font-weight: bold;">₹${(item.claimedTotalTax || 0).toLocaleString()}</td>
        <td style="padding: 10px; font-weight: bold; color: #059669;">₹${(item.allowedItcAmount || 0).toLocaleString()}</td>
        <td style="padding: 10px;">
          <span style="padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: bold; background-color: ${item.status === 'MATCHED' ? '#d1fae5' : '#fef3c7'}; color: ${item.status === 'MATCHED' ? '#065f46' : '#92400e'};">
            ${item.status === 'MATCHED' ? 'MATCHED' : (item.errorCode || 'MISMATCH')}
          </span>
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GST Inward Invoice Reconciliation Register - ${activePersonaMetrics.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #0f172a; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 5px; }
          .metrics { display: flex; gap: 15px; margin-bottom: 25px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 18px; border-radius: 8px; flex: 1; }
          .card-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
          .card-val { font-size: 18px; font-weight: bold; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #0f172a; color: white; padding: 10px; font-size: 11px; text-align: left; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">GST Inward Invoice Reconciliation Statement</div>
          <div class="subtitle">Taxpayer: <strong>${activePersonaMetrics.name}</strong> (${activePersonaMetrics.business}) | GSTIN: <strong>${activePersonaMetrics.gstin}</strong> | Return Period: <strong>July 2026</strong></div>
        </div>

        <div class="metrics">
          <div class="card"><div class="card-title">Total Invoices</div><div class="card-val">${currentInvoices.length}</div></div>
          <div class="card"><div class="card-title">Eligible ITC Credit</div><div class="card-val" style="color: #059669;">₹${(activePersonaMetrics.eligibleItc || 0).toLocaleString()}</div></div>
          <div class="card"><div class="card-title">Pending Mismatches</div><div class="card-val" style="color: #d97706;">${activePersonaMetrics.mismatchesCount}</div></div>
          <div class="card"><div class="card-title">Net Cash Tax Payable</div><div class="card-val" style="color: #0f172a;">₹${(activePersonaMetrics.netTax || 0).toLocaleString()}</div></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Supplier Details</th>
              <th>Billed Tax</th>
              <th>GSTR-2B Credit</th>
              <th>Reconciliation Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  // INSTANT LIVE 1-CLICK MISMATCH RESOLUTION (Persisted Per-Persona)
  const handleResolveAction = async (invoiceId, invoiceNumber, actionType) => {
    setResolvingId(invoiceId);

    setTimeout(() => {
      let updatedResults = [];
      let newMismatchesCount = 0;
      let newEligibleItc = 0;

      setReconciliationData(prev => {
        if (!prev || !prev.results) return prev;

        if (actionType === 'DELETE_DUPLICATE') {
          updatedResults = prev.results.filter(item => item.invoiceNumber !== invoiceNumber && item.invoiceId !== invoiceId);
        } else {
          updatedResults = prev.results.map(item => {
            if (item.invoiceNumber === invoiceNumber || item.invoiceId === invoiceId) {
              const gstr2bLimit = item.gstr2bData?.totalTax || item.allowedItcAmount || item.claimedTotalTax || 0;
              return {
                ...item,
                status: 'MATCHED',
                errorCode: null,
                allowedItcAmount: actionType === 'DEFER_TO_NEXT_MONTH' ? 0 : gstr2bLimit
              };
            }
            return item;
          });
        }

        newMismatchesCount = updatedResults.filter(r => r.status !== 'MATCHED').length;
        newEligibleItc = updatedResults.reduce((acc, curr) => acc + (curr.allowedItcAmount || 0), 0);

        const updatedMetrics = {
          ...activePersonaMetrics,
          mismatchesCount: newMismatchesCount,
          eligibleItc: newEligibleItc,
          netTax: Math.max(0, 42500 - newEligibleItc)
        };

        const updatedReconcilData = {
          ...prev,
          results: updatedResults,
          summary: {
            ...prev?.summary,
            matchedCount: updatedResults.length - newMismatchesCount,
            mismatchCount: newMismatchesCount,
            eligibleItc: newEligibleItc
          }
        };

        setActivePersonaMetrics(updatedMetrics);

        // Update Per-Persona Cache
        setPersonaStateCache(prevCache => ({
          ...prevCache,
          [selectedPersonaGstin]: {
            reconciliationData: updatedReconcilData,
            metrics: updatedMetrics
          }
        }));

        return updatedReconcilData;
      });

      setResolvingId(null);
      if (showToast) {
        showToast(`Invoice #${invoiceNumber} resolved for ${activePersonaMetrics.name}!`, "success", "1-Click Fix Applied");
      }
    }, 400);
  };

  // Handle Final GSTR-3B Submission
  const handleSubmitReturn = async () => {
    setSubmitting(true);
    try {
      const result = await submitGstr3bReturn({ gstin: selectedPersonaGstin });
      setSubmissionResult(result);
      setIsPreFilingSummaryOpen(false);
      if (showToast) {
        showToast(`GSTR-3B Return Filed for ${activePersonaMetrics.name}! ARN: ${result.arn}`, "success", "Filing Complete");
      }
    } catch (err) {
      if (showToast) showToast("Return submission failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Printable HTML Summary Receipt
  const handleOpenReceipt = () => {
    const arn = submissionResult?.arn || "AA270726889900V";
    const receiptUrl = `/api/gstr3b/receipt/${arn}/html`;
    window.open(receiptUrl, '_blank', 'width=800,height=900,scrollbars=yes');
  };

  // Speak SSML Voice Explainer out loud
  const handleVoicePlayback = async () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);
      const voiceRes = await getVoiceExplanation('AP/2026/045', language);
      const textToSpeak = voiceRes.script || voiceRes.voicePayload?.plainText || "Asian Paints bill AP/2026/045 is unfiled. Claim credit safely next month.";
      
      const cleanText = textToSpeak.replace(/<[^>]*>/g, '').trim();

      speakTextInLanguage(cleanText, language, () => {
        setIsPlayingAudio(false);
      }, () => {
        setIsPlayingAudio(false);
      });
    } catch (err) {
      setIsPlayingAudio(false);
    }
  };

  // Trigger Chatbot explaining specific mismatch
  const handleAskChatbot = (item) => {
    const q = `Explain invoice mismatch for invoice #${item.invoiceNumber} from supplier ${item.supplierName} (${item.errorCode || 'mismatch'}) and tell me step-by-step how to resolve it safely.`;
    window.dispatchEvent(new CustomEvent('open-gst-copilot', { detail: { query: q } }));
  };

  const items = reconciliationData?.results || [];
  const mismatchedItems = items.filter(item => item.status !== 'MATCHED');

  const filteredMismatches = mismatchedItems.filter(item => {
    if (activeMismatchFilter === 'ALL') return true;
    if (activeMismatchFilter === 'CRITICAL') return item.errorCode === 'ERR_SUPPLIER_UNFILED' || item.errorCode === 'ERR_DUPLICATE_CLAIM' || item.errorCode === 'ERR_SUPPLIER_CANCELLED';
    if (activeMismatchFilter === 'WARNING') return item.errorCode === 'ERR_TAX_AMOUNT_MISMATCH';
    if (activeMismatchFilter === 'DEFERRED') return item.errorCode === 'ERR_DEFERRED_ITC_LATE_UPLOAD';
    return true;
  });

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Top Synthetic Environment Indicator Badge */}
        <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-900 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              SYNTHETIC TEST ENVIRONMENT
            </span>
            <span>All taxpayer data, invoice statements, and payment gateways operate on simulated mock GSTN records.</span>
          </div>
          <span className="font-mono text-[11px] font-extrabold text-amber-800 hidden sm:inline">[MOCK DATA ACTIVE]</span>
        </div>

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
                Select Live Taxpayer Persona (10 Available):
              </label>
              <select
                id="persona-select"
                value={selectedPersonaGstin}
                onChange={(e) => setSelectedPersonaGstin(e.target.value)}
                className="bg-navy border border-white/30 text-white font-bold text-xs rounded-lg px-3 py-2 w-full lg:w-80 focus:outline-none focus:ring-2 focus:ring-amber"
              >
                {DEMO_PERSONAS.map(p => (
                  <option key={p.gstin} value={p.gstin}>
                    {p.name} — {p.business} ({p.location})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-white/70 mt-1.5 font-mono">
                Active GSTIN: <span className="text-amber font-semibold">{activePersonaMetrics.gstin}</span>
              </p>
            </div>
          </div>

          {/* Active Persona Case Details Card */}
          <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 text-xs">
            <div className="bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5 text-amber font-bold mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{activePersonaMetrics.name} • {activePersonaMetrics.business}</span>
              </div>
              <p className="text-white/80 text-[11px] flex items-center gap-2">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/60" /> {activePersonaMetrics.location}</span>
                <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-white/60" /> Turnover: {activePersonaMetrics.turnover}</span>
              </p>
            </div>

            <div className="bg-amber-500/20 backdrop-blur-sm p-3.5 rounded-xl border border-amber-400/30">
              <div className="flex items-center gap-1.5 text-amber font-bold mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber" />
                <span>Portal Problem & Barrier</span>
              </div>
              <p className="text-amber-100 text-[11px]">{activePersonaMetrics.problem}</p>
            </div>

            <div className="bg-emerald-500/20 backdrop-blur-sm p-3.5 rounded-xl border border-emerald-400/30">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Our Solution & Impact</span>
              </div>
              <p className="text-emerald-100 text-[11px]">
                {activePersonaMetrics.solution} <span className="font-bold underline text-white">({activePersonaMetrics.impact})</span>
              </p>
            </div>
          </div>
        </div>

        {/* Live Tax Payable Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Scanned Invoices</p>
              <p className="text-2xl font-black text-navy mt-1">{items.length || activePersonaMetrics.invoicesCount}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                {items.length - mismatchedItems.length} Matched Invoices
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FileCheck2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Eligible ITC Credit</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">₹{(activePersonaMetrics.eligibleItc || 0).toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 mt-1">GSTR-2B Verified</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Pending Mismatches</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{mismatchedItems.length}</p>
              <p className="text-[11px] text-amber-700 font-semibold mt-1">{mismatchedItems.length === 0 ? 'All Mismatches Resolved!' : 'Requires 1-Click Fix'}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Net Cash Tax Payable</p>
              <p className="text-2xl font-black text-navy mt-1">₹{(activePersonaMetrics.netTax || 0).toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 mt-1">Due: 20th August 2026</p>
            </div>
            <div className="p-3 bg-slate-100 text-navy rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Action Controls, Audio Bar & Standalone Modals */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
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
              onClick={() => setIsUploadDropzoneOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-4 h-4 text-white" />
              <span>📤 Upload Raw Invoices for {activePersonaMetrics.name}</span>
            </button>

            <button
              onClick={() => setIsPreFilingSummaryOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-amber-600" />
              <span>📊 Pre-Filing Summary</span>
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
                onClick={() => setIsPreFilingSummaryOpen(true)}
                disabled={submitting}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{submitting ? 'Filing GSTR-3B...' : 'Review & Submit Return'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. STANDALONE COLOR-CODED MISMATCH & ERROR CARDS SECTION */}
        <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-navy">Standalone Mismatch & Error Cards — {activePersonaMetrics.name} ({mismatchedItems.length})</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Color-coded severity badges with 1-click plain-language tax fixes</p>
            </div>

            {/* Severity Filters */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: 'ALL', label: 'All Mismatches' },
                { id: 'CRITICAL', label: '🔴 Critical' },
                { id: 'WARNING', label: '🟠 Warning' },
                { id: 'DEFERRED', label: '🔵 Deferred' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveMismatchFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                    activeMismatchFilter === f.id
                      ? 'bg-navy text-white border-navy'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredMismatches.length === 0 ? (
            <div className="p-8 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-emerald-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-base">All Invoice Mismatches Resolved for {activePersonaMetrics.name}! 🎉</h4>
              <p className="text-xs text-emerald-700 mt-1">100% of purchase invoices are now matched against GSTR-2B. Safe to file GSTR-3B return!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMismatches.map((item, idx) => {
                const ruleCode = item.errorCode || item.ruleCode;
                const isCritical = ruleCode === 'ERR_SUPPLIER_UNFILED' || ruleCode === 'ERR_DUPLICATE_CLAIM' || ruleCode === 'ERR_SUPPLIER_CANCELLED';
                const isWarning = ruleCode === 'ERR_TAX_AMOUNT_MISMATCH';

                const badgeStyle = isCritical
                  ? 'bg-red-100 text-red-900 border-red-300'
                  : isWarning
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-blue-100 text-blue-900 border-blue-300';

                const cardBorder = isCritical
                  ? 'border-red-200 bg-red-50/30'
                  : isWarning
                    ? 'border-amber-200 bg-amber-50/30'
                    : 'border-blue-200 bg-blue-50/30';

                return (
                  <div key={idx} className={`p-4 rounded-xl border ${cardBorder} shadow-2xs space-y-3 flex flex-col justify-between relative`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-navy font-mono text-sm">#{item.invoiceNumber}</span>
                          {item.isUploaded && (
                            <span className="bg-blue-100 text-blue-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-blue-300 uppercase">
                              NEWLY UPLOADED
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                          {isCritical ? '🔴 CRITICAL' : isWarning ? '🟠 WARNING' : '🔵 DEFERRED'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-800 text-xs mt-2">{item.supplierName}</h4>
                      <p className="text-[11px] font-mono text-slate-500">{item.supplierGstin}</p>

                      <div className="mt-2.5 text-xs bg-white/80 p-2.5 rounded-lg border border-slate-200/80 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Billed Tax:</span>
                          <span className="font-bold text-slate-800">₹{(item.claimedTotalTax || item.billedTax || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">GSTR-2B Limit:</span>
                          <span className="font-bold text-emerald-700">₹{(item.allowedItcAmount || item.gstr2bTax || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleAskChatbot(item)}
                        className="text-[11px] bg-white hover:bg-slate-100 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                        <span>Explain</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResolveAction(item.invoiceId || idx, item.invoiceNumber, isCritical ? 'DEFER_TO_NEXT_MONTH' : 'CLAIM_LOWER_LIMIT')}
                        disabled={resolvingId === (item.invoiceId || idx)}
                        className="bg-navy hover:bg-navy-hover text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs shrink-0"
                      >
                        {resolvingId === (item.invoiceId || idx) ? 'Fixing...' : '⚡ 1-Click Fix'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. STANDALONE SCANNED INVOICE LIST & RECONCILIATION TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-navy flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-600" />
                <span>GSTR-1 vs GSTR-2B Inward Invoice List ({activePersonaMetrics.name})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Showing merged scanned purchase invoices & GSTR-2B reconciliation status</p>
            </div>
            
            {/* Export & Add Invoice Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="text-xs bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Download invoice list as CSV / Excel spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>📥 CSV / Excel</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="text-xs bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Print or save invoice reconciliation statement as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-navy" />
                <span>🖨️ PDF Statement</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUploadDropzoneOpen(true)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-white" />
                <span>Add / Upload Invoices</span>
              </button>
            </div>
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
                      Running live GSTR-2B reconciliation engine for {activePersonaMetrics.name}...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">No invoices found for {activePersonaMetrics.name}.</td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const hasIssue = item.status !== 'MATCHED';
                    const ruleCode = item.errorCode || item.ruleCode;

                    const billedTax = item.claimedTotalTax ?? item.billedTax ?? item.totalTax ?? 0;
                    const allowedCredit = item.allowedItcAmount ?? item.allowedItc ?? item.gstr2bTax ?? 0;

                    return (
                      <tr key={idx} className={`hover:bg-slate-50 transition-colors ${hasIssue ? 'bg-amber-50/40 border-l-4 border-l-amber-500' : ''}`}>
                        <td className="p-3.5 font-bold font-mono text-navy flex items-center gap-2">
                          <span>{item.invoiceNumber}</span>
                          {item.isUploaded && (
                            <span className="bg-blue-100 text-blue-800 font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-blue-300 uppercase">
                              NEW
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-800">{item.supplierName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{item.supplierGstin}</div>
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
                          {hasIssue ? (
                            <button
                              onClick={() => handleResolveAction(item.invoiceId || idx, item.invoiceNumber, ruleCode === 'ERR_TAX_AMOUNT_MISMATCH' ? 'CLAIM_LOWER_LIMIT' : 'DEFER_TO_NEXT_MONTH')}
                              disabled={resolvingId === (item.invoiceId || idx)}
                              className="bg-navy hover:bg-navy-hover disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                            >
                              {resolvingId === (item.invoiceId || idx) ? 'Fixing...' : '⚡ 1-Click Fix'}
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-700 font-bold flex items-center justify-end gap-1">
                              <Check className="w-3.5 h-3.5" /> 100% Matched
                            </span>
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

        {/* 3. STANDALONE UPLOAD DROPZONE MODAL */}
        {isUploadDropzoneOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-navy">Upload Raw Invoices ({activePersonaMetrics.name})</h3>
                </div>
                <button type="button" onClick={() => setIsUploadDropzoneOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center space-y-3">
                <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">Drag & Drop Invoice Files (CSV, Excel, JSON)</h4>
                <p className="text-xs text-slate-500">Upload sample_invoices_clean.csv or sample_invoices_mismatch.json to merge into {activePersonaMetrics.name}'s register.</p>
                <input type="file" onChange={handleSimulatedFileUpload} className="hidden" id="raw-file-input" />
                <label htmlFor="raw-file-input" className="inline-block bg-navy hover:bg-navy-hover text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-sm">
                  {isParsingInvoices ? 'Parsing & Reconciling...' : 'Browse Files'}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* 4. PRE-FILING TAX RECONCILIATION SUMMARY MODAL */}
        {isPreFilingSummaryOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-navy">Pre-Filing Tax Reconciliation Summary</h3>
                </div>
                <button type="button" onClick={() => setIsPreFilingSummaryOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Taxpayer Name:</span>
                    <span className="font-bold text-slate-800">{activePersonaMetrics.name} ({activePersonaMetrics.business})</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>GSTIN:</span>
                    <span className="font-mono font-bold text-navy">{activePersonaMetrics.gstin}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>Filing Return Period:</span>
                    <span className="font-semibold text-slate-800">July 2026</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Total Outward Sales Tax Liability:</span>
                    <span className="font-bold text-slate-800">₹42,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Total Eligible Input Tax Credit (ITC):</span>
                    <span className="font-bold text-emerald-600">₹{(activePersonaMetrics.eligibleItc || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Blocked / Deferred Pending Credit:</span>
                    <span className="font-bold text-amber-700">₹6,500</span>
                  </div>
                  <div className="flex justify-between text-sm font-black pt-3 border-t border-slate-200">
                    <span className="text-navy">Net Cash Tax Payable:</span>
                    <span className="text-navy">₹{(activePersonaMetrics.netTax || 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsPreFilingSummaryOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-bold">
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReturn}
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submitting ? 'Filing GSTR-3B...' : 'Confirm & File GSTR-3B Return'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageContainer>
  );
};

export default Gstr3bSimplified;
