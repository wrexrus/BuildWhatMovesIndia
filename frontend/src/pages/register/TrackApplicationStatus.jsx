import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";
import { useToast } from "../../context/ToastContext";
import { CheckCircle2, Clock, FileText, Download, ShieldCheck, Building2, User, Search, MapPin } from "lucide-react";

const TrackApplicationStatus = () => {
  const [searchParams] = useSearchParams();
  const initialArn = searchParams.get('arn') || '';
  const { showToast } = useToast() || {};

  const [searchType, setSearchType] = useState("arn");
  const [referenceNumber, setReferenceNumber] = useState(initialArn || "TRN2026998877");
  const [activeResult, setActiveResult] = useState(null);
  const [errors, setErrors] = useState({});

  const isARN = searchType === "arn";

  useEffect(() => {
    const storedMock = localStorage.getItem('gst_registered_mock_taxpayer');
    if (initialArn || storedMock) {
      handlePerformLookup(initialArn || "TRN2026998877");
    }
  }, [initialArn]);

  const handlePerformLookup = (refNo) => {
    const term = (refNo || referenceNumber).trim().toUpperCase();
    const storedMockStr = localStorage.getItem('gst_registered_mock_taxpayer');
    let storedMock = null;
    try {
      if (storedMockStr) storedMock = JSON.parse(storedMockStr);
    } catch (e) {}
    const mockData = {
      referenceNumber: term || "TRN2026998877",
      formType: term.startsWith("TRN") ? "GST REG-01 (New Registration Application)" : "GSTR-3B Return Statement",
      applicantName: storedMock?.name || "Ramesh Kumar",
      tradeName: storedMock?.tradeName || "Nagpur Hardware & Sanitary Store",
      gstin: storedMock?.gstin || "27AAAAA1234A1Z5",
      jurisdiction: "Nagpur South Ward-4, Zone II",
      state: storedMock?.state || "Maharashtra (27)",
      submissionDate: "18 Aug 2026",
      currentStatus: "APPROVED & GSTIN ISSUED",
      timeline: [
        { title: "Application Submitted", date: "18 Aug 2026", status: "COMPLETED", detail: "Form GST REG-01 filed successfully with TRN." },
        { title: "e-KYC & Mobile Verification", date: "19 Aug 2026", status: "COMPLETED", detail: "Aadhaar e-KYC and mock OTP verified." },
        { title: "Jurisdictional Officer Verification", date: "20 Aug 2026", status: "COMPLETED", detail: "Nagpur Ward-4 Tax Inspector approved verification." },
        { title: "GSTIN Certificate Generated", date: "21 Aug 2026", status: "COMPLETED", detail: "Active 15-digit GSTIN assigned to business." }
      ]
    };

    setActiveResult(mockData);
    if (showToast) showToast(`Application status retrieved for ${term || 'TRN'}`, 'success', 'Status Found');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!referenceNumber.trim()) {
      setErrors({ referenceNumber: "Enter the reference number." });
      return;
    }
    setErrors({});
    handlePerformLookup(referenceNumber);
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    setReferenceNumber(type === "arn" ? "TRN2026998877" : "SRN2026443322");
    setErrors({});
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] min-w-0 overflow-x-hidden bg-[#f7f6f3] text-[#2f3437] font-sans">
        <Breadcrumbs
          items={[
            {
              label: "Services",
            },
            {
              label: "Track Application Status",
            },
          ]}
        />

        <div className="mx-auto w-full max-w-[1180px] min-w-0 px-4 pb-12 pt-5 sm:px-6 sm:pb-14 sm:pt-7 lg:px-8">
          <header className="min-w-0 border-b border-[#eaeaea] pb-6 sm:pb-7">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f6c9f]">
                  Registration & Service Tracking
                </p>

                <h1 className="break-words font-serif text-[1.8rem] leading-[1.1] tracking-[-0.02em] text-[#161b1e] sm:text-[2.1rem] md:text-[2.4rem]">
                  Track application status
                </h1>

                <p className="mt-3 max-w-[62ch] break-words text-sm leading-6 text-[#6f7375] sm:mt-4">
                  Check the live progress of your GST registration, amendment, or return application using your ARN or TRN reference number.
                </p>
              </div>

              <Link
                to="/registration"
                className="self-start border-b border-[#b9bcbd] pb-1 text-sm text-[#6b7073] transition-colors hover:border-[#1f6c9f] hover:text-[#1f6c9f] sm:self-auto"
              >
                New registration
              </Link>
            </div>
          </header>

          <section className="w-full max-w-3xl min-w-0 pt-6 sm:pt-8">
            <form onSubmit={handleSubmit} noValidate className="min-w-0 rounded-xl border border-[#eaeaea] bg-white p-4 shadow-sm mb-6 sm:rounded-2xl sm:p-6 sm:mb-8">
              <fieldset>
                <legend className="mb-4 text-sm font-bold text-[#293238]">
                  Select Application Reference Type
                </legend>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer items-start gap-3 border p-4 rounded-xl transition-all duration-150 ${
                      isARN
                        ? "border-[#1f6c9f] bg-[#f4f9fc] shadow-sm"
                        : "border-[#eaeaea] bg-white hover:border-[#c7d8e3]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="searchType"
                      checked={searchType === "arn"}
                      onChange={() => handleTypeChange("arn")}
                      className="mt-1 accent-[#1f6c9f]"
                    />

                    <span>
                      <span className="block text-sm font-bold text-[#293238]">
                        ARN / TRN
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#787774]">
                        Application or Temporary Reference Number
                      </span>
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-3 border p-4 rounded-xl transition-all duration-150 ${
                      !isARN
                        ? "border-[#1f6c9f] bg-[#f4f9fc] shadow-sm"
                        : "border-[#eaeaea] bg-white hover:border-[#c7d8e3]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="searchType"
                      checked={searchType === "srn"}
                      onChange={() => handleTypeChange("srn")}
                      className="mt-1 accent-[#1f6c9f]"
                    />

                    <span>
                      <span className="block text-sm font-bold text-[#293238]">
                        SRN / FRN
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-[#787774]">
                        Service Request or Filing Reference Number
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              <div className="mt-6">
                <label htmlFor="referenceNumber" className="mb-2 block text-sm font-bold text-[#394247]">
                  {isARN ? "ARN / TRN Reference Number" : "SRN / FRN Number"}
                  <span className="ml-1 text-[#9f2f2d]">*</span>
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="referenceNumber"
                    value={referenceNumber}
                    onChange={(event) => {
                      setReferenceNumber(event.target.value.toUpperCase());
                      setErrors({});
                    }}
                    placeholder={isARN ? "e.g. TRN2026998877 or AA270626112233M" : "e.g. SRN2026443322"}
                    className="min-w-0 flex-1 h-12 border border-[#d9d9d7] rounded-xl bg-white px-4 text-sm font-mono uppercase tracking-wider text-[#293238] outline-none focus:border-[#1f6c9f]"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#071b30] hover:bg-[#153457] px-5 py-3 sm:w-auto sm:px-6 text-sm font-bold text-white transition-colors shadow-sm cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>

                {errors.referenceNumber && (
                  <p className="mt-1.5 text-xs text-[#9f2f2d] font-bold">{errors.referenceNumber}</p>
                )}
              </div>
            </form>
{activeResult && (
              <div className="min-w-0 bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-md border border-[#eaeaea] space-y-6">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Application Summary</span>
                    <h3 className="break-words text-base font-bold text-[#071b30] mt-0.5 sm:text-lg">{activeResult.formType}</h3>
                    <p className="text-xs font-mono text-slate-600 mt-1">Ref: {activeResult.referenceNumber}</p>
                  </div>
                  <span className="inline-flex max-w-full items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px] px-2.5 py-1.5 rounded-full sm:text-xs sm:px-3.5 self-start sm:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{activeResult.currentStatus}</span>
                  </span>
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-3 text-xs bg-slate-50 p-3 rounded-xl sm:grid-cols-2 sm:gap-4 sm:p-4 border border-slate-200">
                  <div>
                    <span className="text-slate-400 font-medium block">Applicant Name</span>
                    <span className="font-bold text-slate-800 text-sm">{activeResult.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Business / Trade Name</span>
                    <span className="font-semibold text-slate-700">{activeResult.tradeName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Assigned GSTIN</span>
                    <span className="font-mono font-bold text-[#071b30]">{activeResult.gstin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Jurisdiction Office</span>
                    <span className="font-medium text-slate-700">{activeResult.jurisdiction}</span>
                  </div>
                </div>
<div>
                  <h4 className="text-sm font-bold text-[#071b30] mb-4">Application Processing Lifecycle</h4>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
                    {activeResult.timeline.map((step, idx) => (
                      <div key={idx} className="relative flex min-w-0 items-start gap-3 pl-8 sm:gap-4">
                        <div className="absolute left-0 top-0.5 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm z-10">
                          ✓
                        </div>
                        <div className="min-w-0 flex-1 bg-white p-3 rounded-xl sm:p-3.5 border border-slate-200 shadow-2xs">
                          <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span className="font-bold text-slate-800 text-xs">{step.title}</span>
                            <span className="text-[10px] font-mono text-slate-400">{step.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 font-medium">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default TrackApplicationStatus;