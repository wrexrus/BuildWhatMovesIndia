import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";
import {
  speakTextInLanguage,
  stopSpeech,
} from "../utils/speechUtils";
import {
  runReconciliation,
  resolveMismatch,
  submitGstr3bReturn,
  lookupHSN,
  getVoiceExplanation,
} from "../utils/api";
import {
  AlertCircle,
  Calculator,
  Check,
  CheckCircle2,
  Download,
  Eye,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Filter,
  MessageSquare,
  Printer,
  RefreshCw,
  Search,
  Upload,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

const DEMO_PERSONAS = [
  {
    gstin: "27AAAAA1234A1Z5",
    name: "Ramesh Kumar",
    business: "Nagpur Hardware & Sanitary Store",
    location: "Nagpur, Maharashtra",
    turnover: "₹85 Lakhs",
    problem:
      "Unfiled supplier bill #AP/2026/045 (Asian Paints) for ₹4,500 ITC.",
    solution:
      "Auto-detects missing GSTR-1, defers ₹4,500 credit safely.",
    impact: "Saved ₹10,000 penalty notice & interest.",
    invoicesCount: 20,
    eligibleItc: 18200,
    mismatchesCount: 3,
    netTax: 24300,
  },
  {
    gstin: "08BBBBS5678C1Z6",
    name: "Sunita Sharma",
    business: "Jaipur Handicrafts & Textiles",
    location: "Jaipur, Rajasthan",
    turnover: "₹1.4 Crores",
    problem:
      "Tax rate mismatch on Jaquar bill #JQ/2026/089 (Portal: ₹12k vs Shop: ₹18k).",
    solution:
      "Auto-claims ₹12,000 portal limit; defers ₹6,000 for seller credit note.",
    impact: "Avoided ₹6,000 excess claim notice.",
    invoicesCount: 25,
    eligibleItc: 42000,
    mismatchesCount: 2,
    netTax: 38500,
  },
  {
    gstin: "03CCCCG9012D1Z7",
    name: "Gurpreet Singh",
    business: "Ludhiana Auto Parts Traders",
    location: "Ludhiana, Punjab",
    turnover: "₹62 Lakhs",
    problem:
      "Supplier GSTIN cancelled by department on bill #LHW/2026/144.",
    solution: "Blocks ₹2,700 ineligible tax credit completely.",
    impact: "Protected from fake invoice audit notice.",
    invoicesCount: 15,
    eligibleItc: 14500,
    mismatchesCount: 1,
    netTax: 19200,
  },
  {
    gstin: "36DDDDK3456E1Z8",
    name: "Kavita Reddy",
    business: "Hyderabad Electricals & Lighting",
    location: "Hyderabad, Telangana",
    turnover: "₹1.1 Crores",
    problem:
      "Duplicate scanned entry for Polycab bill #POLY/2026/178.",
    solution: "Removes ₹3,600 duplicate claim automatically.",
    impact: "Saved from double claiming audit penalty.",
    invoicesCount: 18,
    eligibleItc: 29400,
    mismatchesCount: 2,
    netTax: 31000,
  },
  {
    gstin: "24EEEEV7890F1Z9",
    name: "Vikram Patel",
    business: "Ahmedabad Industrial Chemicals",
    location: "Ahmedabad, Gujarat",
    turnover: "₹3.5 Crores",
    problem:
      "Late upload after 11th monthly cutoff by UltraTech Cement.",
    solution:
      "Defers ₹9,800 credit safely to next month's GSTR-2B.",
    impact: "Prevented premature tax claim rejection.",
    invoicesCount: 32,
    eligibleItc: 84000,
    mismatchesCount: 1,
    netTax: 62000,
  },
  {
    gstin: "33FFFFM1234G1Z0",
    name: "Meenakshi Sundaram",
    business: "Madurai Handloom Cotton Weavers",
    location: "Madurai, Tamil Nadu",
    turnover: "₹45 Lakhs",
    problem: "HSN classification discrepancy on yarn purchase.",
    solution:
      "Auto-reconciles HSN rate at 5% instead of 12%.",
    impact: "Correct tax calculation without penalty.",
    invoicesCount: 12,
    eligibleItc: 9800,
    mismatchesCount: 1,
    netTax: 12400,
  },
  {
    gstin: "27GGGGA5678H1Z1",
    name: "Aniket Deshmukh",
    business: "Pune Electronics & Mobile Hub",
    location: "Pune, Maharashtra",
    turnover: "₹95 Lakhs",
    problem: "Unfiled supplier bill from local wholesaler.",
    solution:
      "Notifies seller & holds ITC claim for next period.",
    impact: "Protected ₹5,200 cash flow.",
    invoicesCount: 22,
    eligibleItc: 34000,
    mismatchesCount: 2,
    netTax: 28900,
  },
  {
    gstin: "32HHHHP9012I1Z2",
    name: "Priya Nair",
    business: "Kochi Spices & Dry Fruits Wholesale",
    location: "Kochi, Kerala",
    turnover: "₹1.8 Crores",
    problem:
      "State GST code mismatch on interstate purchase.",
    solution:
      "Auto-maps CGST+SGST to IGST ledger.",
    impact: "Prevented wrong ledger head tax filing.",
    invoicesCount: 28,
    eligibleItc: 56000,
    mismatchesCount: 1,
    netTax: 44200,
  },
  {
    gstin: "23IIIIR3456J1Z3",
    name: "Rajesh Varma",
    business: "Indore Sanitary & Bath Ware",
    location: "Indore, Madhya Pradesh",
    turnover: "₹78 Lakhs",
    problem: "Unfiled GSTR-1 bill for tiles purchase.",
    solution:
      "Claims verified GSTR-2B limit with 1-click.",
    impact: "Clean filing with 0 notice risk.",
    invoicesCount: 16,
    eligibleItc: 19500,
    mismatchesCount: 1,
    netTax: 21800,
  },
  {
    gstin: "19JJJJA7890K1Z4",
    name: "Amina Begum",
    business: "Kolkata Leather Goods & Store",
    location: "Kolkata, West Bengal",
    turnover: "₹52 Lakhs",
    problem:
      "Duplicate billing entry on raw material purchase.",
    solution:
      "Removes duplicate invoice before GSTR-3B submission.",
    impact:
      "Prevented interest penalty on excess ITC.",
    invoicesCount: 14,
    eligibleItc: 13200,
    mismatchesCount: 1,
    netTax: 16500,
  },
];

const Gstr3bSimplified = () => {
  const { user } = useAuth();
  const { showToast } = useToast() || {};
  const { language } = useLanguage() || { language: "EN" };

  const [selectedPersonaGstin, setSelectedPersonaGstin] = useState(() => {
    const isLogged = Boolean(user || localStorage.getItem('gst_auth_token') || localStorage.getItem('gst_user'));
    return isLogged ? "27AAAAA1234A1Z5" : "";
  });

  const [reconciliationData, setReconciliationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [personaStateCache, setPersonaStateCache] = useState({});
  const [activePersonaMetrics, setActivePersonaMetrics] =
    useState(DEMO_PERSONAS[0]);

  const [isPreFilingSummaryOpen, setIsPreFilingSummaryOpen] =
    useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] =
    useState(false);
  const [isUploadDropzoneOpen, setIsUploadDropzoneOpen] =
    useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isParsingInvoices, setIsParsingInvoices] = useState(false);
  const [activeMismatchFilter, setActiveMismatchFilter] = useState("ALL");

  const loadReconciliationData = async (gstinToLoad, isRetry = false) => {
    setLoading(true);
    setSubmissionResult(null);

    const basePersona =
      DEMO_PERSONAS.find((p) => p.gstin === gstinToLoad) ||
      DEMO_PERSONAS[0];

    if (personaStateCache[gstinToLoad]) {
      const cached = personaStateCache[gstinToLoad];

      setReconciliationData(cached.reconciliationData);
      setActivePersonaMetrics(cached.metrics);
      setLoading(false);

      return;
    }

    setActivePersonaMetrics(basePersona);

    try {
      const data = await runReconciliation(
        language,
        gstinToLoad
      );

      const fetchedData = data?.data || data;

      setReconciliationData(fetchedData);

      setPersonaStateCache((prev) => ({
        ...prev,
        [gstinToLoad]: {
          reconciliationData: fetchedData,
          metrics: basePersona,
        },
      }));
    } catch (err) {
      if (!isRetry) {
        await new Promise((res) => setTimeout(res, 800));
        return loadReconciliationData(gstinToLoad, true);
      }
      console.warn("Using offline grounded reconciliation fallback for persona:", gstinToLoad);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    stopSpeech();
    setIsPlayingAudio(false);
    loadReconciliationData(selectedPersonaGstin);
  }, [selectedPersonaGstin, language]);

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

        if (file.name.endsWith(".json")) {
          const rawObj = JSON.parse(textContent);

          parsedInvoices = Array.isArray(rawObj)
            ? rawObj
            : [rawObj];
        } else {
          const lines = textContent
            .split("\n")
            .filter((l) => l.trim());

          if (lines.length > 1) {
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i]
                .split(",")
                .map((c) => c.trim());

              if (cols.length >= 3) {
                const taxVal = Number(
                  cols[8] || cols[4] || 5000
                );

                const safeTax = Number.isNaN(taxVal)
                  ? 5000
                  : taxVal;

                parsedInvoices.push({
                  invoiceNumber:
                    cols[0] || `UP-INV/${i}`,
                  supplierName:
                    cols[1] || "Uploaded Supplier",
                  supplierGstin:
                    cols[2] || "27AAACA9999Z1",
                  claimedTotalTax: safeTax,
                  allowedItcAmount: safeTax,
                  status: "MATCHED",
                  errorCode: null,
                });
              }
            }
          }
        }

        if (parsedInvoices.length > 0) {
          const formattedNewResults =
            parsedInvoices.map((inv, idx) => ({
              invoiceId: `UP-${Date.now()}-${idx}`,
              invoiceNumber:
                inv.invoiceNumber ||
                `INV/2026/${idx + 101}`,
              supplierName:
                inv.supplierName || "Uploaded Supplier",
              supplierGstin:
                inv.supplierGstin || "27AAACA9999Z1",
              claimedTotalTax: Number(
                inv.claimedTotalTax ||
                  inv.totalTax ||
                  5000
              ),
              allowedItcAmount:
                inv.status === "MATCHED"
                  ? Number(inv.claimedTotalTax || 5000)
                  : Number(
                      inv.gstr2bData?.totalTax || 0
                    ),
              status: inv.status || "MATCHED",
              errorCode: inv.errorCode || null,
              isUploaded: true,
            }));

          const existingResults =
            reconciliationData?.results || [];

          const combinedResults = [
            ...formattedNewResults,
            ...existingResults,
          ];

          const mismatchedCount =
            combinedResults.filter(
              (r) => r.status !== "MATCHED"
            ).length;

          const totalEligibleItc =
            combinedResults.reduce(
              (acc, curr) =>
                acc + (curr.allowedItcAmount || 0),
              0
            );

          const updatedReconciliationData = {
            results: combinedResults,
            summary: {
              totalInvoices: combinedResults.length,
              matchedCount:
                combinedResults.length - mismatchedCount,
              mismatchCount: mismatchedCount,
              eligibleItc: totalEligibleItc,
            },
          };

          const updatedMetrics = {
            ...activePersonaMetrics,
            invoicesCount: combinedResults.length,
            mismatchesCount: mismatchedCount,
            eligibleItc: totalEligibleItc,
            netTax: Math.max(
              0,
              42500 - totalEligibleItc
            ),
          };

          setReconciliationData(
            updatedReconciliationData
          );

          setActivePersonaMetrics(updatedMetrics);

          setPersonaStateCache((prev) => ({
            ...prev,
            [selectedPersonaGstin]: {
              reconciliationData:
                updatedReconciliationData,
              metrics: updatedMetrics,
            },
          }));

          if (showToast) {
            showToast(
              `Merged ${formattedNewResults.length} uploaded invoices into ${activePersonaMetrics.name}'s register.`,
              "success",
              `Invoices Added (${activePersonaMetrics.name})`
            );
          }
        }
      } catch (parseErr) {
        if (showToast) {
          showToast(
            "Could not parse file structure. Loaded sample datasets.",
            "info"
          );
        }
      } finally {
        setIsParsingInvoices(false);
        setIsUploadDropzoneOpen(false);
      }
    };

    reader.readAsText(file);
  };

  const handleDownloadCsv = () => {
    const currentInvoices =
      reconciliationData?.results || [];

    if (currentInvoices.length === 0) {
      if (showToast) {
        showToast(
          "No invoices available to export.",
          "warning"
        );
      }

      return;
    }

    let csvContent =
      "Invoice Number,Supplier Name,Supplier GSTIN,Billed Tax (INR),GSTR-2B Credit (INR),Rule Status,Error Code\n";

    currentInvoices.forEach((item) => {
      const billed =
        item.claimedTotalTax ??
        item.billedTax ??
        item.totalTax ??
        0;

      const allowed =
        item.allowedItcAmount ??
        item.allowedItc ??
        item.gstr2bTax ??
        0;

      const status =
        item.status || "MATCHED";

      const err =
        item.errorCode ||
        item.ruleCode ||
        "NONE";

      csvContent +=
        `"${item.invoiceNumber}","${item.supplierName}","${item.supplierGstin}",${billed},${allowed},"${status}","${err}"\n`;
    });

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `GST_Invoice_Register_${activePersonaMetrics.name.replace(
        /\s+/g,
        "_"
      )}_July2026.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (showToast) {
      showToast(
        `Downloaded invoice register CSV for ${activePersonaMetrics.name}.`,
        "success"
      );
    }
  };

  const handleDownloadPdf = () => {
    const currentInvoices =
      reconciliationData?.results || [];

    const printWin = window.open(
      "",
      "_blank",
      "width=900,height=1000"
    );

    if (!printWin) return;

    const tableRowsHtml = currentInvoices
      .map(
        (item) => `
          <tr style="border-bottom:1px solid #d8d9d7;font-size:12px;">
            <td style="padding:10px;font-weight:600;font-family:monospace;">
              ${item.invoiceNumber}
            </td>
            <td style="padding:10px;">
              ${item.supplierName}
              <br />
              <small style="color:#536271;">
                ${item.supplierGstin}
              </small>
            </td>
            <td style="padding:10px;font-weight:600;">
              ₹${(item.claimedTotalTax || 0).toLocaleString()}
            </td>
            <td style="padding:10px;font-weight:600;color:#4c9a5a;">
              ₹${(item.allowedItcAmount || 0).toLocaleString()}
            </td>
            <td style="padding:10px;">
              ${
                item.status === "MATCHED"
                  ? "MATCHED"
                  : item.errorCode || "MISMATCH"
              }
            </td>
          </tr>
        `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>
            GST Inward Invoice Reconciliation Register -
            ${activePersonaMetrics.name}
          </title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 30px;
              color: #10233a;
            }

            .header {
              border-bottom: 2px solid #08365f;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }

            .title {
              font-size: 20px;
              font-weight: 700;
            }

            .subtitle {
              font-size: 12px;
              color: #536271;
              margin-top: 5px;
            }

            .metrics {
              display: flex;
              gap: 12px;
              margin-bottom: 25px;
            }

            .metric {
              border: 1px solid #d8d9d7;
              padding: 12px 16px;
              flex: 1;
            }

            .metric-title {
              font-size: 10px;
              text-transform: uppercase;
              color: #536271;
              font-weight: 700;
            }

            .metric-value {
              font-size: 17px;
              font-weight: 700;
              margin-top: 5px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th {
              background: #08365f;
              color: white;
              padding: 10px;
              font-size: 10px;
              text-align: left;
              text-transform: uppercase;
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div class="title">
              GST Inward Invoice Reconciliation Statement
            </div>

            <div class="subtitle">
              Taxpayer:
              <strong>${activePersonaMetrics.name}</strong>
              (${activePersonaMetrics.business})
              &nbsp;|&nbsp;
              GSTIN:
              <strong>${activePersonaMetrics.gstin}</strong>
              &nbsp;|&nbsp;
              Return Period:
              <strong>July 2026</strong>
            </div>
          </div>

          <div class="metrics">
            <div class="metric">
              <div class="metric-title">Total Invoices</div>
              <div class="metric-value">
                ${currentInvoices.length}
              </div>
            </div>

            <div class="metric">
              <div class="metric-title">Eligible ITC</div>
              <div class="metric-value">
                ₹${(
                  activePersonaMetrics.eligibleItc || 0
                ).toLocaleString()}
              </div>
            </div>

            <div class="metric">
              <div class="metric-title">Pending Mismatches</div>
              <div class="metric-value">
                ${activePersonaMetrics.mismatchesCount}
              </div>
            </div>

            <div class="metric">
              <div class="metric-title">Net Tax Payable</div>
              <div class="metric-value">
                ₹${(
                  activePersonaMetrics.netTax || 0
                ).toLocaleString()}
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Supplier Details</th>
                <th>Billed Tax</th>
                <th>GSTR-2B Credit</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  const handleResolveAction = async (
    invoiceId,
    invoiceNumber,
    actionType
  ) => {
    setResolvingId(invoiceId);

    setTimeout(() => {
      let updatedResults = [];
      let newMismatchesCount = 0;
      let newEligibleItc = 0;

      setReconciliationData((prev) => {
        if (!prev || !prev.results) {
          return prev;
        }

        if (actionType === "DELETE_DUPLICATE") {
          updatedResults = prev.results.filter(
            (item) =>
              item.invoiceNumber !== invoiceNumber &&
              item.invoiceId !== invoiceId
          );
        } else {
          updatedResults = prev.results.map((item) => {
            if (
              item.invoiceNumber === invoiceNumber ||
              item.invoiceId === invoiceId
            ) {
              const gstr2bLimit =
                item.gstr2bData?.totalTax ||
                item.allowedItcAmount ||
                item.claimedTotalTax ||
                0;

              return {
                ...item,
                status: "MATCHED",
                errorCode: null,
                allowedItcAmount:
                  actionType === "DEFER_TO_NEXT_MONTH"
                    ? 0
                    : gstr2bLimit,
              };
            }

            return item;
          });
        }

        newMismatchesCount =
          updatedResults.filter(
            (r) => r.status !== "MATCHED"
          ).length;

        newEligibleItc = updatedResults.reduce(
          (acc, curr) =>
            acc + (curr.allowedItcAmount || 0),
          0
        );

        const updatedMetrics = {
          ...activePersonaMetrics,
          mismatchesCount: newMismatchesCount,
          eligibleItc: newEligibleItc,
          netTax: Math.max(
            0,
            42500 - newEligibleItc
          ),
        };

        const updatedReconcilData = {
          ...prev,
          results: updatedResults,
          summary: {
            ...prev?.summary,
            matchedCount:
              updatedResults.length -
              newMismatchesCount,
            mismatchCount: newMismatchesCount,
            eligibleItc: newEligibleItc,
          },
        };

        setActivePersonaMetrics(updatedMetrics);

        setPersonaStateCache((prevCache) => ({
          ...prevCache,
          [selectedPersonaGstin]: {
            reconciliationData: updatedReconcilData,
            metrics: updatedMetrics,
          },
        }));

        return updatedReconcilData;
      });

      setResolvingId(null);

      if (showToast) {
        showToast(
          `Invoice #${invoiceNumber} resolved for ${activePersonaMetrics.name}.`,
          "success",
          "Resolution Applied"
        );
      }
    }, 400);
  };

  const handleSubmitReturn = async () => {
    setSubmitting(true);

    try {
      const result = await submitGstr3bReturn({
        gstin: selectedPersonaGstin,
      });

      setSubmissionResult(result);
      setIsPreFilingSummaryOpen(false);

      if (showToast) {
        showToast(
          `GSTR-3B Return filed for ${activePersonaMetrics.name}. ARN: ${result.arn}`,
          "success",
          "Filing Complete"
        );
      }
    } catch (err) {
      if (showToast) {
        showToast(
          "Return submission failed.",
          "error"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenReceipt = () => {
    setIsReceiptModalOpen(true);
  };

  const handleVoicePlayback = async () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);

      const voiceRes = await getVoiceExplanation(
        "AP/2026/045",
        language
      );

      const textToSpeak =
        voiceRes.script ||
        voiceRes.voicePayload?.plainText ||
        "Asian Paints bill AP/2026/045 is unfiled. Claim credit safely next month.";

      const cleanText = textToSpeak
        .replace(/<[^>]*>/g, "")
        .trim();

      speakTextInLanguage(
        cleanText,
        language,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    } catch (err) {
      setIsPlayingAudio(false);
    }
  };

  const handleAskChatbot = (item) => {
    const q =
      `Explain invoice mismatch for invoice #${item.invoiceNumber} ` +
      `from supplier ${item.supplierName} ` +
      `(${item.errorCode || "mismatch"}) and tell me ` +
      `step-by-step how to resolve it safely.`;

    window.dispatchEvent(
      new CustomEvent("open-gst-copilot", {
        detail: { query: q },
      })
    );
  };

  const items = reconciliationData?.results || [];
  const mismatchedItems = items.filter(
    (item) => item.status !== "MATCHED"
  );

  const filteredMismatches =
    mismatchedItems.filter((item) => {
      if (activeMismatchFilter === "ALL") {
        return true;
      }

      if (activeMismatchFilter === "CRITICAL") {
        return (
          item.errorCode === "ERR_SUPPLIER_UNFILED" ||
          item.errorCode === "ERR_DUPLICATE_CLAIM" ||
          item.errorCode === "ERR_SUPPLIER_CANCELLED"
        );
      }

      if (activeMismatchFilter === "WARNING") {
        return (
          item.errorCode ===
          "ERR_TAX_AMOUNT_MISMATCH"
        );
      }

      if (activeMismatchFilter === "DEFERRED") {
        return (
          item.errorCode ===
          "ERR_DEFERRED_ITC_LATE_UPLOAD"
        );
      }

      return true;
    });

  const matchedCount =
    Math.max(
      0,
      items.length - mismatchedItems.length
    ) || activePersonaMetrics.invoicesCount -
      activePersonaMetrics.mismatchesCount;

  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl px-4 py-7 font-sans sm:px-6 lg:px-8">
        {/* =========================================================
            DEMO ENVIRONMENT NOTICE
        ========================================================== */}
        <div className="mb-6 flex flex-col gap-2 border border-[#e8c980] bg-[#fff9e9] px-4 py-3 text-xs text-[#6d5200] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="mr-2 font-semibold uppercase tracking-[0.08em]">
              Demo environment
            </span>

            <span>
              Taxpayer data, invoice statements and payment
              gateways are operating on simulated GSTN records.
            </span>
          </div>

          <span className="font-mono text-[10px] font-semibold text-[#876700]">
            MOCK DATA ACTIVE
          </span>
        </div>

        {/* =========================================================
            PAGE HEADER
        ========================================================== */}
        {/* Catchy Demo Spin-up Banner Note */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/90 px-4 py-2.5 text-xs text-amber-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <p>
              <strong className="font-semibold text-amber-950">💡 Demo Note:</strong> Refresh the page once if initial reconciliation loading takes a moment (happens sometimes during free cloud server spin-up).
            </p>
          </div>
        </div>

        {/* =========================================================
            HEADER & ACTIONS
        ========================================================== */}
        <header className="border-b border-line pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/65">
                Return filing
              </p>

              <h1 className="mt-2 font-serif text-[2rem] leading-tight tracking-[-0.025em] text-ink sm:text-[2.5rem]">
                GSTR-3B Filing Dashboard
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                Review inward invoice reconciliation, resolve
                exceptions and prepare the GSTR-3B return for
                submission.
              </p>
            </div>

            <div className="w-full lg:w-[360px]">
              <label
                htmlFor="persona-select"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-muted"
              >
                Taxpayer Profile / Case Study Persona
              </label>

              <div className="relative">
                <select
                  id="persona-select"
                  value={selectedPersonaGstin}
                  onChange={(e) =>
                    setSelectedPersonaGstin(
                      e.target.value
                    )
                  }
                  className="h-11 w-full appearance-none border border-line bg-white px-3 pr-9 text-sm font-medium text-ink transition-colors focus:border-navy focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>-- Select Taxpayer Profile --</option>
                  {DEMO_PERSONAS.map((persona) => (
                    <option
                      key={persona.gstin}
                      value={persona.personaId || persona.gstin}
                    >
                      {persona.name} ({persona.location.split(',')[0]}) — {persona.business}
                    </option>
                  ))}
                </select>

                <Users className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>

              <p className="mt-2 text-xs text-muted">
                Active Taxpayer GSTIN:{" "}
                <span className="font-mono font-semibold text-ink">
                  {selectedPersonaGstin ? activePersonaMetrics.gstin : "None Selected"}
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* Prompt Card if Taxpayer Profile is Not Selected */}
        {!selectedPersonaGstin ? (
          <div className="mt-8 rounded-xl border border-dashed border-navy/25 bg-white p-10 text-center shadow-xs">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy/10 text-navy">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-base font-bold text-ink">Select a Taxpayer Profile to View Dashboard</h3>
            <p className="mt-2 mx-auto max-w-md text-xs leading-5 text-muted">
              Please select a demo taxpayer profile or case study persona from the dropdown above to view reconciled invoices and file GSTR-3B.
            </p>
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => setSelectedPersonaGstin("27AAAAA1234A1Z5")}
                className="inline-flex items-center gap-2 bg-navy px-4 py-2.5 text-xs font-semibold text-white hover:bg-navy-hover transition-colors cursor-pointer"
              >
                <Users className="h-4 w-4" />
                Select Ramesh Kumar (Nagpur Hardware)
              </button>
            </div>
          </div>
        ) : (
          <>
        {/* =========================================================
            TAXPAYER SUMMARY
        ========================================================== */}
        <section className="mt-6 border border-line bg-white">
          <div className="border-b border-line px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-ink">
              Taxpayer summary
            </h2>
          </div>

          <div className="grid divide-y divide-line sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                Taxpayer
              </p>

              <p className="mt-1.5 text-sm font-semibold text-ink">
                {activePersonaMetrics.name}
              </p>

              <p className="mt-1 text-xs text-muted">
                {activePersonaMetrics.business}
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                Registration
              </p>

              <p className="mt-1.5 font-mono text-sm font-semibold text-ink">
                {activePersonaMetrics.gstin}
              </p>

              <p className="mt-1 text-xs text-muted">
                {activePersonaMetrics.location}
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                Turnover
              </p>

              <p className="mt-1.5 text-sm font-semibold text-ink">
                {activePersonaMetrics.turnover}
              </p>

              <p className="mt-1 text-xs text-muted">
                Return period: July 2026
              </p>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                Current issue
              </p>

              <p className="mt-1.5 text-sm leading-5 text-ink">
                {activePersonaMetrics.problem}
              </p>
            </div>
          </div>

          <div className="border-t border-line px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
                  Recommended handling
                </p>

                <p className="mt-1 text-sm text-ink/80">
                  {activePersonaMetrics.solution}
                </p>
              </div>

              <span className="text-xs font-medium text-green">
                {activePersonaMetrics.impact}
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================
            KEY FIGURES
        ========================================================== */}
        <section className="mt-6 grid border-y border-line bg-white sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-b border-line px-5 py-5 sm:border-r lg:border-b-0">
            <p className="text-xs font-semibold uppercase tracking-[0.07em] text-muted">
              Scanned invoices
            </p>

            <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink">
              {items.length ||
                activePersonaMetrics.invoicesCount}
            </p>

            <p className="mt-1 text-xs text-green">
              {matchedCount} matched
            </p>
          </div>

          <div className="border-b border-line px-5 py-5 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.07em] text-muted">
              Eligible ITC
            </p>

            <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink">
              ₹
              {(
                activePersonaMetrics.eligibleItc || 0
              ).toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-muted">
              GSTR-2B verified
            </p>
          </div>

          <div className="border-b border-line px-5 py-5 sm:border-r lg:border-b-0">
            <p className="text-xs font-semibold uppercase tracking-[0.07em] text-muted">
              Pending mismatches
            </p>

            <p
              className={`mt-2 font-mono text-2xl font-semibold tracking-tight ${
                mismatchedItems.length > 0
                  ? "text-[#8d5d00]"
                  : "text-green"
              }`}
            >
              {mismatchedItems.length}
            </p>

            <p className="mt-1 text-xs text-muted">
              {mismatchedItems.length > 0
                ? "Requires review"
                : "No pending exceptions"}
            </p>
          </div>

          <div className="px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.07em] text-muted">
              Net cash tax payable
            </p>

            <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-ink">
              ₹
              {(
                activePersonaMetrics.netTax || 0
              ).toLocaleString()}
            </p>

            <p className="mt-1 text-xs text-muted">
              Due: 20 August 2026
            </p>
          </div>
        </section>

        {/* =========================================================
            PRIMARY ACTION BAR
        ========================================================== */}
        <section className="mt-6 flex flex-col gap-4 border-y border-line bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleVoicePlayback}
              className={`inline-flex items-center gap-2 border px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                isPlayingAudio
                  ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border-line bg-white text-ink hover:border-navy/35 hover:bg-shell"
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="h-4 w-4 text-red-600 animate-pulse" />
                  <span>Stop Guidance</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 text-navy" />
                  <span>Voice guidance</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setIsUploadDropzoneOpen(true)
              }
              className="inline-flex items-center gap-2 border border-line bg-white px-3.5 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-navy/35 hover:bg-shell"
            >
              <Upload className="h-4 w-4 text-navy" />
              Upload invoices
            </button>

            <button
              type="button"
              onClick={() =>
                setIsPreFilingSummaryOpen(true)
              }
              className="inline-flex items-center gap-2 border border-line bg-white px-3.5 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-navy/35 hover:bg-shell"
            >
              <Eye className="h-4 w-4 text-navy" />
              Pre-filing review
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {submissionResult ? (
              <>
                <div className="border border-green/30 bg-green/5 px-3.5 py-2.5 text-xs font-semibold text-green">
                  Filed · ARN:{" "}
                  <span className="font-mono">
                    {submissionResult.arn}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenReceipt}
                  className="inline-flex items-center gap-2 bg-navy px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-hover"
                >
                  <Printer className="h-4 w-4" />
                  View receipt
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setIsPreFilingSummaryOpen(true)
                }
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-navy px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                {submitting
                  ? "Filing GSTR-3B..."
                  : "Review & Submit Return"}
              </button>
            )}
          </div>
        </section>

        {/* =========================================================
            MISMATCH REVIEW
        ========================================================== */}
        <section className="mt-8 border border-line bg-white">
          <div className="flex flex-col gap-4 border-b border-line px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">
                Reconciliation exceptions
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted">
                Review invoices that require attention before
                submitting the return.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs text-muted">
                <Filter className="mr-1 inline h-3.5 w-3.5" />
                Filter
              </span>

              {[
                { id: "ALL", label: "All" },
                { id: "CRITICAL", label: "Critical" },
                { id: "WARNING", label: "Warning" },
                { id: "DEFERRED", label: "Deferred" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() =>
                    setActiveMismatchFilter(
                      filter.id
                    )
                  }
                  className={`border px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeMismatchFilter ===
                    filter.id
                      ? "border-navy bg-navy text-white"
                      : "border-line bg-white text-muted hover:border-navy/30 hover:text-ink"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredMismatches.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center border border-green/25 bg-green/5 text-green">
                <Check className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-ink">
                No pending reconciliation exceptions
              </h3>

              <p className="mx-auto mt-1.5 max-w-lg text-sm leading-6 text-muted">
                All currently filtered invoices have been
                reconciled and can proceed to the next filing
                step.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line">
              {filteredMismatches.map((item, idx) => {
                const ruleCode =
                  item.errorCode ||
                  item.ruleCode;

                const isCritical =
                  ruleCode ===
                    "ERR_SUPPLIER_UNFILED" ||
                  ruleCode ===
                    "ERR_DUPLICATE_CLAIM" ||
                  ruleCode ===
                    "ERR_SUPPLIER_CANCELLED";

                const isWarning =
                  ruleCode ===
                  "ERR_TAX_AMOUNT_MISMATCH";

                const severity =
                  isCritical
                    ? "CRITICAL"
                    : isWarning
                    ? "WARNING"
                    : "DEFERRED";

                const billedTax =
                  item.claimedTotalTax ??
                  item.billedTax ??
                  item.totalTax ??
                  0;

                const allowedCredit =
                  item.allowedItcAmount ??
                  item.allowedItc ??
                  item.gstr2bTax ??
                  0;

                return (
                  <div
                    key={item.invoiceId || idx}
                    className="px-5 py-5 sm:px-6"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-semibold text-navy">
                            {item.invoiceNumber}
                          </span>

                          <span
                            className={`inline-flex border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${
                              isCritical
                                ? "border-red-200 bg-red-50 text-red-800"
                                : isWarning
                                ? "border-[#e6cf9c] bg-[#fff9e9] text-[#805c00]"
                                : "border-blue-200 bg-blue-50 text-blue-800"
                            }`}
                          >
                            {severity}
                          </span>

                          {item.isUploaded && (
                            <span className="border border-navy/20 bg-shell px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.05em] text-navy">
                              Uploaded
                            </span>
                          )}
                        </div>

                        <div className="mt-2">
                          <p className="text-sm font-semibold text-ink">
                            {item.supplierName}
                          </p>

                          <p className="mt-0.5 font-mono text-xs text-muted">
                            {item.supplierGstin}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2 xl:w-[360px]">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-muted">
                            Billed tax
                          </p>

                          <p className="mt-1 font-mono text-sm font-semibold text-ink">
                            ₹
                            {billedTax.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.07em] text-muted">
                            GSTR-2B credit
                          </p>

                          <p className="mt-1 font-mono text-sm font-semibold text-ink">
                            ₹
                            {allowedCredit.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            handleAskChatbot(item)
                          }
                          className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-navy/30 hover:text-navy"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Explain
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleResolveAction(
                              item.invoiceId || idx,
                              item.invoiceNumber,
                              isCritical
                                ? "DEFER_TO_NEXT_MONTH"
                                : "CLAIM_LOWER_LIMIT"
                            )
                          }
                          disabled={
                            resolvingId ===
                            (item.invoiceId || idx)
                          }
                          className="inline-flex items-center gap-1.5 bg-navy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {resolvingId ===
                          (item.invoiceId || idx)
                            ? "Applying..."
                            : "Apply resolution"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-line pt-3">
                      <p className="text-xs leading-5 text-muted">
                        Rule:
                        <span className="ml-1 font-mono font-medium text-ink">
                          {ruleCode ||
                            "MISMATCH"}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* =========================================================
            RECONCILIATION REGISTER
        ========================================================== */}
        <section className="mt-8 border border-line bg-white">
          <div className="flex flex-col gap-4 border-b border-line px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-ink">
                Inward invoice reconciliation
              </h2>

              <p className="mt-1 text-xs leading-5 text-muted">
                GSTR-1 vs GSTR-2B reconciliation register for{" "}
                <span className="font-semibold text-ink">
                  {activePersonaMetrics.name}
                </span>
                .
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-navy/30 hover:bg-shell"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-green" />
                Export CSV
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 border border-line bg-white px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-navy/30 hover:bg-shell"
              >
                <Printer className="h-3.5 w-3.5 text-navy" />
                Print / PDF
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsUploadDropzoneOpen(true)
                }
                className="inline-flex items-center gap-1.5 bg-navy px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-navy-hover"
              >
                <Upload className="h-3.5 w-3.5" />
                Add invoices
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-shell text-left">
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Invoice
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Billed tax
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    GSTR-2B credit
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-line">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center"
                    >
                      <RefreshCw className="mx-auto h-5 w-5 animate-spin text-navy" />

                      <p className="mt-3 text-sm font-medium text-ink">
                        Running reconciliation
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        Loading GSTR-2B data for{" "}
                        {activePersonaMetrics.name}.
                      </p>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-sm text-muted"
                    >
                      No invoices found for{" "}
                      {activePersonaMetrics.name}.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const hasIssue =
                      item.status !== "MATCHED";

                    const ruleCode =
                      item.errorCode ||
                      item.ruleCode;

                    const billedTax =
                      item.claimedTotalTax ??
                      item.billedTax ??
                      item.totalTax ??
                      0;

                    const allowedCredit =
                      item.allowedItcAmount ??
                      item.allowedItc ??
                      item.gstr2bTax ??
                      0;

                    return (
                      <tr
                        key={
                          item.invoiceId || idx
                        }
                        className="transition-colors hover:bg-shell/55"
                      >
                        <td className="px-4 py-4 align-top">
                          <div className="font-mono text-sm font-semibold text-navy">
                            {item.invoiceNumber}
                          </div>

                          {item.isUploaded && (
                            <span className="mt-1 inline-block border border-navy/20 bg-shell px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.05em] text-navy">
                              Uploaded
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <p className="font-medium text-ink">
                            {item.supplierName}
                          </p>

                          <p className="mt-1 font-mono text-[11px] text-muted">
                            {item.supplierGstin}
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top font-mono font-medium text-ink">
                          ₹
                          {billedTax.toLocaleString()}
                        </td>

                        <td className="px-4 py-4 align-top font-mono font-medium text-ink">
                          ₹
                          {allowedCredit.toLocaleString()}
                        </td>

                        <td className="px-4 py-4 align-top">
                          {hasIssue ? (
                            <div>
                              <span className="inline-flex border border-[#e6cf9c] bg-[#fff9e9] px-2.5 py-1 text-xs font-semibold text-[#805c00]">
                                Review required
                              </span>

                              <p className="mt-1 font-mono text-[10px] text-muted">
                                {ruleCode ||
                                  "MISMATCH"}
                              </p>
                            </div>
                          ) : (
                            <span className="inline-flex border border-green/25 bg-green/5 px-2.5 py-1 text-xs font-semibold text-green">
                              Matched
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 text-right align-top">
                          {hasIssue ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleResolveAction(
                                  item.invoiceId || idx,
                                  item.invoiceNumber,
                                  ruleCode ===
                                    "ERR_TAX_AMOUNT_MISMATCH"
                                    ? "CLAIM_LOWER_LIMIT"
                                    : "DEFER_TO_NEXT_MONTH"
                                )
                              }
                              disabled={
                                resolvingId ===
                                (item.invoiceId ||
                                  idx)
                              }
                              className="border border-navy bg-white px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-shell disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {resolvingId ===
                              (item.invoiceId ||
                                idx)
                                ? "Applying..."
                                : "Resolve"}
                            </button>
                          ) : (
                            <span className="text-xs font-medium text-green">
                              Complete
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
        </section>
        </>
        )}

        {/* =========================================================
            UPLOAD MODAL
        ========================================================== */}
        {isUploadDropzoneOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
          >
            <div className="w-full max-w-lg border border-line bg-white">
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-navy/65">
                    Invoice import
                  </p>

                  <h2
                    id="upload-title"
                    className="mt-1 text-lg font-semibold text-ink"
                  >
                    Upload invoices
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsUploadDropzoneOpen(false)
                  }
                  className="p-1 text-muted transition-colors hover:text-ink"
                  aria-label="Close upload dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-5">
                <div className="border border-dashed border-line bg-shell/60 px-6 py-10 text-center">
                  <FileText className="mx-auto h-8 w-8 text-navy" />

                  <h3 className="mt-4 text-sm font-semibold text-ink">
                    Import invoice data
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-muted">
                    Supported formats: CSV, Excel and JSON.
                    The imported records will be merged into
                    the current reconciliation register.
                  </p>

                  {selectedFileName && (
                    <p className="mt-3 text-xs font-medium text-ink">
                      Selected:{" "}
                      <span className="font-mono">
                        {selectedFileName}
                      </span>
                    </p>
                  )}

                  <input
                    type="file"
                    onChange={
                      handleSimulatedFileUpload
                    }
                    className="hidden"
                    id="raw-file-input"
                    accept=".csv,.xlsx,.xls,.json"
                  />

                  <label
                    htmlFor="raw-file-input"
                    className="mt-5 inline-flex cursor-pointer items-center gap-2 bg-navy px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-hover"
                  >
                    <Upload className="h-4 w-4" />
                    {isParsingInvoices
                      ? "Parsing..."
                      : "Choose file"}
                  </label>
                </div>
              </div>

              <div className="border-t border-line px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() =>
                    setIsUploadDropzoneOpen(false)
                  }
                  className="border border-line bg-white px-4 py-2 text-sm font-medium text-muted hover:bg-shell"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            PRE-FILING MODAL
        ========================================================== */}
        {isPreFilingSummaryOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="prefiling-title"
          >
            <div className="w-full max-w-xl border border-line bg-white">
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-navy/65">
                    Return review
                  </p>

                  <h2
                    id="prefiling-title"
                    className="mt-1 text-lg font-semibold text-ink"
                  >
                    Pre-filing tax summary
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsPreFilingSummaryOpen(false)
                  }
                  className="p-1 text-muted transition-colors hover:text-ink"
                  aria-label="Close pre-filing review"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 py-5">
                <div className="border border-line">
                  <div className="grid gap-4 border-b border-line bg-shell/60 px-5 py-4 sm:grid-cols-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Taxpayer
                      </p>

                      <p className="mt-1 text-sm font-semibold text-ink">
                        {activePersonaMetrics.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        GSTIN
                      </p>

                      <p className="mt-1 font-mono text-xs font-semibold text-ink">
                        {activePersonaMetrics.gstin}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Return period
                      </p>

                      <p className="mt-1 text-sm font-semibold text-ink">
                        July 2026
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-line">
                    <div className="flex items-center justify-between gap-5 px-5 py-4">
                      <span className="text-sm text-muted">
                        Total outward sales tax liability
                      </span>

                      <span className="font-mono text-sm font-semibold text-ink">
                        ₹42,500
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5 px-5 py-4">
                      <span className="text-sm text-muted">
                        Eligible input tax credit
                      </span>

                      <span className="font-mono text-sm font-semibold text-ink">
                        ₹
                        {(
                          activePersonaMetrics.eligibleItc ||
                          0
                        ).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5 px-5 py-4">
                      <span className="text-sm text-muted">
                        Blocked / deferred pending credit
                      </span>

                      <span className="font-mono text-sm font-semibold text-[#8d5d00]">
                        ₹6,500
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-5 bg-shell/45 px-5 py-4">
                      <span className="text-sm font-semibold text-ink">
                        Net cash tax payable
                      </span>

                      <span className="font-mono text-base font-semibold text-navy">
                        ₹
                        {(
                          activePersonaMetrics.netTax ||
                          0
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border border-[#e8c980] bg-[#fff9e9] px-4 py-3">
                  <p className="text-xs leading-5 text-[#6d5200]">
                    Review the reconciled amounts above before
                    confirming the GSTR-3B submission.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
                <button
                  type="button"
                  onClick={() =>
                    setIsPreFilingSummaryOpen(false)
                  }
                  className="border border-line bg-white px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-shell"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleSubmitReturn}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {submitting
                    ? "Filing..."
                    : "Confirm & File GSTR-3B"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            FILING SUMMARY RECEIPT MODAL
        ========================================================== */}
        {isReceiptModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="receipt-modal-title"
          >
            <div className="w-full max-w-2xl rounded-xl border border-line bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-line bg-navy px-6 py-4 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
                    <Printer className="h-4 w-4 text-amber" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70">
                      Official Return Receipt
                    </p>
                    <h2 id="receipt-modal-title" className="text-base font-bold text-white">
                      GSTR-3B Summary Receipt
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close receipt"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50/70 p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Application Reference Number (ARN)
                    </span>
                    <p className="mt-0.5 font-mono text-base font-bold text-emerald-950">
                      {submissionResult?.arn || "AA270726889900V"}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>FILED & ACKNOWLEDGED</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg border border-line bg-shell/45 p-4 text-xs">
                  <div>
                    <span className="text-muted block font-medium">Taxpayer Legal Name</span>
                    <span className="font-bold text-ink text-sm">{activePersonaMetrics.name}</span>
                  </div>
                  <div>
                    <span className="text-muted block font-medium">GSTIN</span>
                    <span className="font-mono font-bold text-navy text-sm">{activePersonaMetrics.gstin}</span>
                  </div>
                  <div>
                    <span className="text-muted block font-medium">Filing Period</span>
                    <span className="font-semibold text-ink">July 2026</span>
                  </div>
                  <div>
                    <span className="text-muted block font-medium">Filing Date & Timestamp</span>
                    <span className="font-mono font-medium text-ink">{submissionResult?.filingDate || "28 Aug 2026, 11:45 AM"}</span>
                  </div>
                </div>

                <div className="rounded-lg border border-line overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-line text-xs font-bold text-ink uppercase tracking-wider">
                    Reconciled Tax Summary Breakdown
                  </div>
                  <div className="divide-y divide-line text-xs">
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-muted">Gross Sales Tax Liability</span>
                      <span className="font-mono font-semibold text-ink">₹42,500</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-muted">Eligible Input Tax Credit (ITC Claimed)</span>
                      <span className="font-mono font-semibold text-emerald-700">₹{(activePersonaMetrics.eligibleItc || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between px-4 py-2.5">
                      <span className="text-muted">Deferred / Blocked Credit (Protected)</span>
                      <span className="font-mono font-semibold text-amber-700">₹6,500</span>
                    </div>
                    <div className="flex justify-between bg-navy/5 px-4 py-3 text-sm font-bold">
                      <span className="text-navy">Net Cash Tax Paid</span>
                      <span className="font-mono text-navy">₹{(activePersonaMetrics.netTax || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-dashed border-line pt-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded border border-line bg-white font-mono text-[9px] font-bold text-center text-navy p-1">
                      QR CODE<br/>[ARN VERIFIED]
                    </div>
                    <div className="text-[11px] leading-4 text-muted">
                      <p className="font-bold text-ink">Official Tax Department Acknowledgment</p>
                      <p>Electronically generated under Rule 61(5) of CGST Rules.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="border border-line bg-white px-4 py-2 text-xs font-semibold text-muted hover:bg-shell transition-colors cursor-pointer"
                >
                  Close
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const element = document.createElement("a");
                      const content = `=======================================================\n` +
                        `    OFFICIAL GSTR-3B RETURN FILING SUMMARY RECEIPT     \n` +
                        `=======================================================\n` +
                        `ARN Number       : ${submissionResult?.arn || "AA270726889900V"}\n` +
                        `Taxpayer Name    : ${activePersonaMetrics.name}\n` +
                        `GSTIN            : ${activePersonaMetrics.gstin}\n` +
                        `Filing Period    : July 2026\n` +
                        `Submission Date  : ${submissionResult?.filingDate || "28 Aug 2026"}\n` +
                        `-------------------------------------------------------\n` +
                        `Gross Tax Liability : ₹42,500\n` +
                        `Eligible Tax Credit : ₹${(activePersonaMetrics.eligibleItc || 0).toLocaleString()}\n` +
                        `Deferred Credit     : ₹6,500\n` +
                        `Net Cash Tax Paid   : ₹${(activePersonaMetrics.netTax || 0).toLocaleString()}\n` +
                        `-------------------------------------------------------\n` +
                        `Goods and Services Tax Portal (gst.gov.in)\n`;

                      const file = new Blob([content], { type: 'text/plain' });
                      element.href = URL.createObjectURL(file);
                      element.download = `GSTR3B_Receipt_${submissionResult?.arn || "AA270726889900V"}.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                      if (showToast) showToast("Receipt downloaded successfully!", "success");
                    }}
                    className="inline-flex items-center gap-1.5 border border-navy/30 bg-white px-3.5 py-2 text-xs font-semibold text-navy hover:bg-navy/5 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-navy" />
                    Download Receipt
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-hover transition-colors cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Print Receipt
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