import React, { useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const TrackPaymentStatus = () => {
  const [gstin, setGstin] = useState("");
  const [cpin, setCpin] = useState("");
  const [errors, setErrors] = useState({});
  const [searched, setSearched] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!gstin.trim()) {
      nextErrors.gstin = "Enter the GSTIN or Other ID.";
    }

    if (!cpin.trim()) {
      nextErrors.cpin = "Enter the CPIN.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSearched(true);
    setGstin("");
    setCpin("");
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] min-w-0 overflow-x-hidden bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "Payments" },
            { label: "Track Payment Status" },
          ]}
        />

        <div className="mx-auto w-full max-w-[1400px] min-w-0 px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-10 lg:pt-8">
          <header className="min-w-0 border-b border-[#eaeaea] pb-6 sm:pb-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              Payments
            </p>

            <h1 className="break-words text-xl font-semibold tracking-[-0.02em] text-[#20282d] sm:text-2xl md:text-[1.75rem]">
              Track Payment Status
            </h1>

            <p className="mt-3 max-w-[65ch] break-words text-sm leading-6 text-[#6f7375] sm:mt-4">
              Check the status of a payment using the taxpayer
              identifier and the CPIN generated for the challan.
            </p>
          </header>

          <section className="min-w-0 pt-6 sm:pt-8">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid min-w-0 gap-5 sm:gap-6 md:grid-cols-2 md:gap-7">
                <div>
                  <label
                    htmlFor="gstin"
                    className="mb-2 block break-words text-sm font-medium text-[#394247]"
                  >
                    GSTIN / Other ID
                    <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <input
                    id="gstin"
                    value={gstin}
                    onChange={(event) => {
                      setGstin(
                        event.target.value.toUpperCase()
                      );

                      setErrors((current) => ({
                        ...current,
                        gstin: "",
                      }));
                    }}
                    placeholder="Enter GSTIN / Other ID"
                    className="
                      h-12 min-w-0
                      w-full
                      border
                      border-[#d9d9d7]
                      bg-white
                      px-3
                      text-sm
                      font-mono
                      uppercase
                      tracking-[0.03em]
                      text-[#293238]
                      placeholder:normal-case
                      placeholder:tracking-normal
                      placeholder:text-[#a2a4a5]
                      outline-none
                      transition-colors
                      focus:border-[#1f6c9f]
                      focus:ring-2
                      focus:ring-[#e1f3fe]
                    "
                  />

                  {errors.gstin && (
                    <p className="mt-1.5 text-xs text-[#9f2f2d]">
                      {errors.gstin}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="cpin"
                    className="mb-2 block break-words text-sm font-medium text-[#394247]"
                  >
                    CPIN
                    <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <input
                    id="cpin"
                    value={cpin}
                    onChange={(event) => {
                      setCpin(event.target.value);

                      setErrors((current) => ({
                        ...current,
                        cpin: "",
                      }));
                    }}
                    placeholder="Enter CPIN"
                    className="
                      h-12 min-w-0
                      w-full
                      border
                      border-[#d9d9d7]
                      bg-white
                      px-3
                      text-sm
                      font-mono
                      text-[#293238]
                      placeholder:text-[#a2a4a5]
                      outline-none
                      transition-colors
                      focus:border-[#1f6c9f]
                      focus:ring-2
                      focus:ring-[#e1f3fe]
                    "
                  />

                  {errors.cpin && (
                    <p className="mt-1.5 text-xs text-[#9f2f2d]">
                      {errors.cpin}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col border-t border-[#eaeaea] pt-5 sm:mt-8 sm:flex-row sm:justify-end sm:pt-6">
                <button
                  type="submit"
                  className="
                    w-full rounded-[5px]
                    bg-[#22282d]
                    px-7
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition-colors sm:w-auto
                    hover:bg-[#333a40]
                  "
                >
                  Track status
                </button>
              </div>
            </form>
          </section>

          <section className="mt-8 min-w-0 border-t border-[#eaeaea] pt-6 sm:mt-10 sm:pt-8">
            <div className="grid min-w-0 gap-5 sm:gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Payment record
                </p>

                <h2 className="mt-1 break-words text-lg font-semibold text-[#293238]">
                  {searched
                    ? "Payment details available"
                    : "Payment details"}
                </h2>

                <p className="mt-2 max-w-[60ch] break-words text-sm leading-6 text-[#6f7375]">
                  {searched
                    ? "Use the available actions below to view the challan or payment receipt."
                    : "Search for a payment to enable the relevant document actions."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
                <button
                  type="button"
                  disabled={!searched}
                  className="
                    w-full rounded-[5px]
                    border
                    border-[#cfd2d3]
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-[#444b4f]
                    disabled:cursor-not-allowed
                    disabled:text-[#a7aaac] sm:w-auto
                  "
                >
                  View challan
                </button>

                <button
                  type="button"
                  disabled={!searched}
                  className="
                    w-full rounded-[5px]
                    border
                    border-[#cfd2d3]
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-[#444b4f]
                    disabled:cursor-not-allowed
                    disabled:text-[#a7aaac] sm:w-auto
                  "
                >
                  View receipt
                </button>
              </div>
            </div>
          </section>

          <section className="mt-8 min-w-0 border-t border-[#eaeaea] pt-6 sm:mt-10 sm:pt-8">
            <div className="max-w-4xl min-w-0 space-y-4 break-words text-sm leading-6 text-[#5e6467] sm:space-y-5">
              <p>
                <strong className="font-semibold text-[#293238]">
                  Bank deduction not reflected:
                </strong>{" "}
                If an amount has been deducted from your bank account
                but is not reflected in the electronic cash ledger,
                you may raise a grievance against payment.
              </p>

              <p>
                <strong className="font-semibold text-[#293238]">
                  Awaiting bank confirmation:
                </strong>{" "}
                For e-payment transactions, the bank may still be
                processing maker/checker approval or confirmation.
              </p>

              <p>
                <strong className="font-semibold text-[#293238]">
                  Awaiting bank clearance:
                </strong>{" "}
                For OTC payments, the challan may have been
                acknowledged while remittance confirmation is pending.
              </p>
            </div>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default TrackPaymentStatus;