import React, { useState } from "react";
import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";
import { useToast } from "../../context/ToastContext";
import { CheckCircle2, Download, CreditCard, ShieldCheck, FileText, ArrowRight } from "lucide-react";

const CreateChallan = () => {
  const { showToast } = useToast() || {};
  const [gstin, setGstin] = useState("27AAAAA1234A1Z5");
  const [reason, setReason] = useState("MONTHLY_PAYMENT");
  const [cgst, setCgst] = useState(6075);
  const [sgst, setSgst] = useState(6075);
  const [igst, setIgst] = useState(12150);
  const [paymentMode, setPaymentMode] = useState("NET_BANKING");
  const [generatedChallan, setGeneratedChallan] = useState(null);
  const [error, setError] = useState("");

  const totalPayable = Number(cgst) + Number(sgst) + Number(igst);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!gstin.trim()) {
      setError("Enter the GSTIN or Other ID.");
      return;
    }
    setError("");

    const cpin = `CPIN2026${Math.floor(10000000 + Math.random() * 90000000)}`;
    const challanData = {
      cpin,
      gstin: gstin.toUpperCase(),
      taxpayerName: "Ramesh Kumar (Nagpur Hardware)",
      createdDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiryDate: new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      cgst,
      sgst,
      igst,
      totalPayable,
      paymentMode,
      status: "CHALLAN_GENERATED"
    };

    setGeneratedChallan(challanData);
    if (showToast) showToast(`Challan Created! CPIN: ${cpin}`, 'success', 'Payment Challan Ready');
  };

  const handleDownloadChallanPdf = () => {
    if (!generatedChallan) return;
    if (showToast) showToast("Downloading GST Payment Challan PMT-06...", "success");
    const element = document.createElement("a");
    const file = new Blob([
      `=======================================================\n` +
      `          GOODS AND SERVICES TAX PAYMENT CHALLAN (PMT-06) \n` +
      `=======================================================\n` +
      `CPIN Reference      : ${generatedChallan.cpin}\n` +
      `GSTIN               : ${generatedChallan.gstin}\n` +
      `Taxpayer Name       : ${generatedChallan.taxpayerName}\n` +
      `Challan Date        : ${generatedChallan.createdDate}\n` +
      `Valid Up To         : ${generatedChallan.expiryDate}\n` +
      `Payment Mode        : ${generatedChallan.paymentMode}\n` +
      `-------------------------------------------------------\n` +
      `TAX BREAKDOWN:\n` +
      `- CGST              : ₹${generatedChallan.cgst.toLocaleString()}\n` +
      `- SGST              : ₹${generatedChallan.sgst.toLocaleString()}\n` +
      `- IGST              : ₹${generatedChallan.igst.toLocaleString()}\n` +
      `-------------------------------------------------------\n` +
      `TOTAL CHALLAN AMT   : ₹${generatedChallan.totalPayable.toLocaleString()}\n` +
      `=======================================================\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GST_Challan_${generatedChallan.cpin}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437] font-sans">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "Payments" },
            { label: "Create Challan" },
          ]}
        />

        <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-8 sm:px-8">
          <header className="border-b border-[#eaeaea] pb-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              Payments & Electronic Cash Ledger
            </p>

            <h1 className="text-2xl font-serif tracking-[-0.02em] text-[#20282d] sm:text-[2.1rem]">
              Create Payment Challan (Form GST PMT-06)
            </h1>

            <p className="mt-4 max-w-[65ch] text-sm leading-6 text-[#6f7375]">
              Generate an official GST payment challan for Net Cash Tax Liability payment via Net Banking, NEFT/RTGS, or Over the Counter.
            </p>
          </header>

          {/* Synthetic Environment Banner */}
          <div className="mt-6 bg-amber-500/10 border border-amber-500/30 text-amber-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-900 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                SYNTHETIC DEMO PAYMENT
              </span>
              <span>All payment processing and CPIN challan numbers operate on simulated mock GSTN records.</span>
            </div>
            <span className="font-mono text-[11px] font-extrabold text-amber-800 hidden sm:inline">[MOCK DATA ACTIVE]</span>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm border border-[#eaeaea]">
              <div className="border-b border-[#eaeaea] pb-4 mb-6">
                <span className="text-xs font-bold text-[#787774] uppercase tracking-wider">Challan Setup</span>
                <h2 className="text-lg font-bold text-[#293238]">Taxpayer & Liability Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="gstin" className="mb-2 block text-sm font-bold text-[#394247]">
                    GSTIN / Unique Taxpayer ID <span className="text-[#9f2f2d]">*</span>
                  </label>

                  <input
                    id="gstin"
                    value={gstin}
                    onChange={(e) => {
                      setGstin(e.target.value.toUpperCase());
                      setError("");
                    }}
                    placeholder="27AAAAA1234A1Z5"
                    className="h-12 w-full border border-[#d9d9d7] rounded-xl bg-white px-4 text-sm font-mono uppercase tracking-wider text-[#293238] focus:border-[#1f6c9f] outline-none"
                  />
                  {error && <p className="mt-1.5 text-xs text-[#9f2f2d] font-bold">{error}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#394247]">Reason for Payment</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-12 w-full border border-[#d9d9d7] rounded-xl bg-white px-3 text-sm text-[#394247] outline-none"
                  >
                    <option value="MONTHLY_PAYMENT">Monthly Return GSTR-3B Payment</option>
                    <option value="DEMAND_PAYMENT">Payment against Demand Notice</option>
                    <option value="VOLUNTARY_PAYMENT">Voluntary Tax Deposit (DRC-03)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-[#071b30] mb-3">Tax Amounts Breakdown</h3>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">CGST (₹)</label>
                      <input
                        type="number"
                        value={cgst}
                        onChange={(e) => setCgst(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg p-2.5 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">SGST (₹)</label>
                      <input
                        type="number"
                        value={sgst}
                        onChange={(e) => setSgst(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg p-2.5 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-medium mb-1">IGST (₹)</label>
                      <input
                        type="number"
                        value={igst}
                        onChange={(e) => setIgst(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg p-2.5 font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#394247]">Select Payment Mode</label>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {[
                      { id: "NET_BANKING", name: "Net Banking" },
                      { id: "NEFT_RTGS", name: "NEFT / RTGS" },
                      { id: "OVER_COUNTER", name: "Over Counter" }
                    ].map(mode => (
                      <button
                        type="button"
                        key={mode.id}
                        onClick={() => setPaymentMode(mode.id)}
                        className={`p-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                          paymentMode === mode.id
                            ? "bg-[#071b30] text-white border-[#071b30] shadow-xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {mode.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#071b30] hover:bg-[#153457] px-6 py-3 text-sm font-bold text-white transition-all cursor-pointer shadow-sm"
                  >
                    <span>Generate Challan (₹{totalPayable.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* GENERATED MOCK CHALLAN RECEIPT */}
            <div className="lg:col-span-5">
              {generatedChallan ? (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#eaeaea] space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-bold text-[#071b30]">Official Challan PMT-06</h3>
                    </div>
                    <span className="text-[11px] bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                      GENERATED
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">CPIN Identification Number</span>
                      <span className="font-mono font-black text-lg text-[#071b30]">{generatedChallan.cpin}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Taxpayer GSTIN</span>
                      <span className="font-mono font-bold text-slate-800">{generatedChallan.gstin}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Valid Until</span>
                      <span className="font-bold text-amber-900">{generatedChallan.expiryDate}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex justify-between font-bold text-slate-800 text-sm">
                        <span>Total Payable:</span>
                        <span className="text-emerald-600 font-black">₹{generatedChallan.totalPayable.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadChallanPdf}
                    className="w-full bg-[#071b30] hover:bg-[#153457] text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4 text-amber" />
                    <span>Download PMT-06 Receipt</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700 text-sm">No Challan Generated Yet</h4>
                  <p className="text-xs text-slate-500 mt-1">Enter GSTIN and tax breakdown to generate a mock PMT-06 payment challan.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default CreateChallan;