import React, { useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const CreateChallan = () => {
  const [gstin, setGstin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!gstin.trim()) {
      setError("Enter the GSTIN or Other ID.");
      return;
    }

    setError("");

    console.log("Create Challan:", gstin);
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "Payments" },
            { label: "Create Challan" },
          ]}
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
          <header className="border-b border-[#eaeaea] pb-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              Payments
            </p>

            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-balance text-[#20282d] sm:text-[1.75rem]">
              Create Challan
            </h1>

            <p className="mt-4 max-w-[65ch] text-sm leading-6 text-[#6f7375]">
              Enter your GSTIN or Other ID to begin creating a payment
              challan.
            </p>
          </header>

          <section className="max-w-3xl pt-8">
            <div className="border-b border-[#eaeaea] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                Payment initiation
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-[#293238]">
                Taxpayer identification
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="pt-8"
            >
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
                    setError("");
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

                {error && (
                  <p className="mt-1.5 text-xs text-[#9f2f2d]">
                    {error}
                  </p>
                )}
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
                    active:scale-[0.98]
                  "
                >
                  Proceed
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default CreateChallan;