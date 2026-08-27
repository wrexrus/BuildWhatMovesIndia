import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";
import { useToast } from "../../context/ToastContext";
import { CheckCircle2, FileText, Upload, ShieldCheck, Download, ArrowRight, AlertCircle } from "lucide-react";

const FilingClarifications = () => {
  const navigate = useNavigate();
  const { showToast } = useToast() || {};

  const [arn, setArn] = useState("TRN2026998877");
  const [noticeRef, setNoticeRef] = useState("NOT/2026/04589");
  const [category, setCategory] = useState("ADDRESS_PROOF");
  const [responseDetails, setResponseDetails] = useState(
    "Clarification submitted regarding electricity bill address mismatch. Attached updated registered lease agreement and NOC from property owner."
  );
  const [fileName, setFileName] = useState("Property_Lease_NOC_Document.pdf");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!arn.trim()) {
      setError("Enter the Application Reference Number (ARN / TRN).");
      return;
    }
    if (!noticeRef.trim()) {
      setError("Enter the Notice Reference Number (GST REG-03).");
      return;
    }
    if (!responseDetails.trim()) {
      setError("Provide detailed clarification response text.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const clarificationArn = `CLAR/2026/${Math.floor(100000 + Math.random() * 900000)}`;
      
      const receipt = {
        clarificationArn,
        arn: arn.toUpperCase(),
        noticeRef: noticeRef.toUpperCase(),
        category,
        submissionDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: "SUBMITTED_UNDER_REVIEW",
        attachedFile: fileName
      };

      setSubmittedReceipt(receipt);
      if (showToast) {
        showToast(`Clarification Submitted! Reference: ${clarificationArn}`, 'success', 'GST REG-04 Response Saved');
      }
    }, 700);
  };

  const handleDownloadReceipt = () => {
    if (!submittedReceipt) return;
    if (showToast) showToast("Downloading Clarification Acknowledgement REG-04 PDF...", "success");
    const element = document.createElement("a");
    const file = new Blob([
      `=======================================================\n` +
      `      ACKNOWLEDGEMENT FOR FILING CLARIFICATION (REG-04) \n` +
      `=======================================================\n` +
      `Clarification ARN   : ${submittedReceipt.clarificationArn}\n` +
      `Application Ref     : ${submittedReceipt.arn}\n` +
      `Notice Reference    : ${submittedReceipt.noticeRef}\n` +
      `Filing Date         : ${submittedReceipt.submissionDate}\n` +
      `Status              : ${submittedReceipt.status}\n` +
      `Attachment          : ${submittedReceipt.attachedFile}\n` +
      `-------------------------------------------------------\n` +
      `Response Details    : ${responseDetails}\n` +
      `=======================================================\n`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GST_Clarification_${submittedReceipt.clarificationArn.replace(/\//g, '_')}.txt`;
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
            { label: "Registration" },
            { label: "Application for Filing Clarifications" },
          ]}
        />

        <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8">
          <header className="border-b border-[#eaeaea] pb-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f6c9f]">
                  GST Registration Services
                </p>

                <h1 className="font-serif text-[2.1rem] leading-[1.1] tracking-[-0.02em] text-balance text-[#161b1e] sm:text-[2.4rem]">
                  Application for Filing Clarifications (Form GST REG-04)
                </h1>

                <p className="mt-4 max-w-[62ch] text-sm leading-6 text-[#6f7375]">
                  Submit your response and supplementary documents against queries or show cause notices (GST REG-03) issued by the jurisdictional tax officer.
                </p>
              </div>

              <Link
                to="/registration/track-status"
                className="self-start border-b border-[#b9bcbd] pb-1 text-sm text-[#6b7073] transition-colors hover:border-[#1f6c9f] hover:text-[#1f6c9f] sm:self-auto"
              >
                Track application status
              </Link>
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#eaeaea]">
              <div className="border-b border-[#eaeaea] pb-4 mb-6">
                <p className="text-xs font-bold text-[#787774] uppercase tracking-wider">Notice Response Form</p>
                <h2 className="text-lg font-bold text-[#293238]">Clarification & Supporting Documents</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="arn" className="mb-2 block text-sm font-bold text-[#394247]">
                    Application Reference Number (ARN / TRN) <span className="text-[#9f2f2d]">*</span>
                  </label>
                  <input
                    id="arn"
                    value={arn}
                    onChange={(e) => setArn(e.target.value.toUpperCase())}
                    placeholder="TRN2026998877 or AA270626112233M"
                    className="h-12 w-full border border-[#d9d9d7] rounded-xl bg-white px-4 text-sm font-mono uppercase tracking-wider text-[#293238] focus:border-[#1f6c9f] outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="noticeRef" className="mb-2 block text-sm font-bold text-[#394247]">
                    Notice Reference Number (GST REG-03) <span className="text-[#9f2f2d]">*</span>
                  </label>
                  <input
                    id="noticeRef"
                    value={noticeRef}
                    onChange={(e) => setNoticeRef(e.target.value.toUpperCase())}
                    placeholder="NOT/2026/04589"
                    className="h-12 w-full border border-[#d9d9d7] rounded-xl bg-white px-4 text-sm font-mono uppercase tracking-wider text-[#293238] focus:border-[#1f6c9f] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#394247]">Query Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-12 w-full border border-[#d9d9d7] rounded-xl bg-white px-3 text-sm text-[#394247] outline-none"
                  >
                    <option value="ADDRESS_PROOF">Principal Place of Business Proof Query</option>
                    <option value="IDENTITY_PROOF">Promoter / Director Identity Mismatch</option>
                    <option value="PAN_QUERY">PAN & Name Spelling Verification Query</option>
                    <option value="ADDITIONAL_DOCS">Additional Document Requirement</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#394247]">
                    Clarification Explanation Text <span className="text-[#9f2f2d]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={responseDetails}
                    onChange={(e) => setResponseDetails(e.target.value)}
                    placeholder="Type detailed clarification response for the tax officer..."
                    className="w-full border border-[#d9d9d7] rounded-xl p-3 text-sm text-[#293238] outline-none focus:border-[#1f6c9f]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#394247]">Attach Supporting Document (PDF / Image)</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <Upload className="w-5 h-5 text-blue-600 shrink-0" />
                    <span className="text-xs font-mono text-slate-700 font-semibold truncate flex-1">{fileName}</span>
                    <button
                      type="button"
                      onClick={() => setFileName(`Clarification_Doc_${Math.floor(100+Math.random()*900)}.pdf`)}
                      className="bg-white hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 transition-colors shrink-0 cursor-pointer"
                    >
                      Change File
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-[#9f2f2d] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {error}
                  </p>
                )}

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#071b30] hover:bg-[#153457] px-6 py-3.5 text-sm font-bold text-white transition-all cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <span>Submitting REG-04...</span>
                    ) : (
                      <>
                        <span>Submit Response REG-04</span>
                        <ArrowRight className="w-4 h-4 text-amber" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* RECEIPT / RESULT ACKNOWLEDGEMENT */}
            <div className="lg:col-span-5">
              {submittedReceipt ? (
                <div className="bg-white p-6 rounded-2xl shadow-md border border-[#eaeaea] space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-bold text-[#071b30]">REG-04 Response Submitted</h3>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                      UNDER REVIEW
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium block">Clarification ARN</span>
                      <span className="font-mono font-black text-lg text-[#071b30]">{submittedReceipt.clarificationArn}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Application Ref (ARN / TRN)</span>
                      <span className="font-mono font-bold text-slate-800">{submittedReceipt.arn}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Against Notice Ref</span>
                      <span className="font-mono font-semibold text-slate-700">{submittedReceipt.noticeRef}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Date of Submission</span>
                      <span className="font-semibold text-slate-700">{submittedReceipt.submissionDate}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    className="w-full bg-[#071b30] hover:bg-[#153457] text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4 text-amber" />
                    <span>Download REG-04 Receipt</span>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700 text-sm">Form GST REG-04 Ready</h4>
                  <p className="text-xs text-slate-500 mt-1">Fill out the notice clarification form to submit supplementary explanations to tax officers.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default FilingClarifications;
