import React, { useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const VerifyRFN = () => {
  const [rfn, setRfn] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!rfn.trim()) {
      setError("Enter the Reference Number.");
      return;
    }

    setError("");

    console.log("Verify RFN:", rfn);
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] min-w-0 overflow-x-hidden bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "User Services" },
            { label: "Verify RFN" },
          ]}
        />

        <div className="mx-auto w-full max-w-[1400px] min-w-0 px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8 lg:pt-8">
          <header className="min-w-0 border-b border-[#eaeaea] pb-6 sm:pb-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              User service
            </p>

            <h1 className="break-words text-xl font-semibold tracking-[-0.02em] text-[#20282d] sm:text-2xl md:text-[1.75rem]">
              Verify RFN
            </h1>

            <p className="mt-3 max-w-[70ch] break-words text-sm leading-6 text-[#6f7375] sm:mt-4">
              Verify the Reference Number (RFN) of a document issued
              by a State GST officer.
            </p>
          </header>

          <section className="w-full max-w-3xl min-w-0 pt-6 sm:pt-8">
            <div className="border-b border-[#eaeaea] pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                Document verification
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-[#293238]">
                Enter the reference number
              </h2>
            </div>

            <div className="mt-8">
              <p className="max-w-[75ch] text-sm leading-6 text-[#5f6568]">
                The Reference Number uniquely identifies a document
                issued by a tax officer to a taxpayer. Use this service
                to verify the document reference.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-8"
            >
              <label
                htmlFor="rfn"
                className="mb-2 block text-sm font-medium text-[#394247]"
              >
                Reference Number of the Document (RFN)
                <span className="ml-1 text-[#9f2f2d]">*</span>
              </label>

              <input
                id="rfn"
                value={rfn}
                onChange={(event) => {
                  setRfn(event.target.value);
                  setError("");
                }}
                placeholder="Enter Reference Number"
                className="
                  h-12
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

              {error && (
                <p className="mt-1.5 text-xs text-[#9f2f2d]">
                  {error}
                </p>
              )}

              <div className="mt-6 flex flex-col border-t border-[#eaeaea] pt-5 sm:mt-8 sm:flex-row sm:justify-end sm:pt-6">
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
                  Submit
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default VerifyRFN;