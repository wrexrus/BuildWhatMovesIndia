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

    console.log({
      gstin,
      cpin,
    });
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "Payments" },
            { label: "Track Payment Status" },
          ]}
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="border-b border-[#eaeaea] pb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              Payments
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#20282d] sm:text-4xl">
              Track Payment Status
            </h1>

            <p className="mt-4 max-w-[65ch] text-sm leading-6 text-[#6f7375]">
              Check the status of a payment using the taxpayer
              identifier and the CPIN generated for the challan.
            </p>
          </header>

          {/* =====================================================
              SEARCH
          ===================================================== */}

          <section className="pt-10">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-7 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="gstin"
                    className="mb-2 block text-sm font-medium text-[#394247]"
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
                      h-12
                      w-full
                      border
                      border-[#d9d9d7]
                      bg-white
                      px-3
                      text-sm
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
                    className="mb-2 block text-sm font-medium text-[#394247]"
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
                      h-12
                      w-full
                      border
                      border-[#d9d9d7]
                      bg-white
                      px-3
                      text-sm
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

              <div className="mt-8 flex justify-end border-t border-[#eaeaea] pt-6">
                <button
                  type="submit"
                  className="
                    rounded-[5px]
                    bg-[#22282d]
                    px-7
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition-colors
                    hover:bg-[#333a40]
                  "
                >
                  Track status
                </button>
              </div>
            </form>
          </section>

          {/* =====================================================
              RESULT ACTIONS
          ===================================================== */}

          <section className="mt-10 border-t border-[#eaeaea] pt-8">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Payment record
                </p>

                <h2 className="mt-1 text-lg font-semibold text-[#293238]">
                  {searched
                    ? "Payment details available"
                    : "Payment details"}
                </h2>

                <p className="mt-2 max-w-[60ch] text-sm leading-6 text-[#6f7375]">
                  {searched
                    ? "Use the available actions below to view the challan or payment receipt."
                    : "Search for a payment to enable the relevant document actions."}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!searched}
                  className="
                    rounded-[5px]
                    border
                    border-[#cfd2d3]
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-[#444b4f]
                    disabled:cursor-not-allowed
                    disabled:text-[#a7aaac]
                  "
                >
                  View challan
                </button>

                <button
                  type="button"
                  disabled={!searched}
                  className="
                    rounded-[5px]
                    border
                    border-[#cfd2d3]
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-medium
                    text-[#444b4f]
                    disabled:cursor-not-allowed
                    disabled:text-[#a7aaac]
                  "
                >
                  View receipt
                </button>
              </div>
            </div>
          </section>

          {/* =====================================================
              PAYMENT NOTES
          ===================================================== */}

          <section className="mt-10 border-t border-[#eaeaea] pt-8">
            <div className="max-w-4xl space-y-5 text-sm leading-6 text-[#5e6467]">
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
