import React, { useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const HomeStateGSK = () => {
  const [reference, setReference] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!reference.trim()) {
      nextErrors.reference =
        "Enter the TRN or GSTIN.";
    }

    if (!captcha.trim()) {
      nextErrors.captcha =
        "Enter the characters shown in the CAPTCHA.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    console.log({
      reference,
      captcha,
    });
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] min-w-0 overflow-x-hidden bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            {
              label: "Registration",
            },
            {
              label:
                "Home State GSK selection for Promoter/Director of specific COBs",
            },
          ]}
        />

        <div className="mx-auto w-full max-w-[1180px] min-w-0 px-4 pb-12 pt-5 sm:px-6 sm:pb-14 sm:pt-7 lg:px-8 lg:pt-8">
          <style>{`
            @keyframes pageRise {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .page-rise { animation: pageRise 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }
            @media (prefers-reduced-motion: reduce) {
              .page-rise { animation: none; }
            }
          `}</style>

          <header className="page-rise border-b border-[#eaeaea] pb-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f6c9f]">
              Registration service
            </p>

            <h1 className="max-w-4xl font-serif text-[1.75rem] leading-[1.12] sm:text-[2.1rem] tracking-[-0.02em] text-balance text-[#161b1e] sm:text-[2.4rem]">
              Home State GSK selection
            </h1>

            <p className="mt-3 max-w-[70ch] break-words text-sm leading-6 sm:mt-4 text-[#6f7375]">
              Select or validate the home state details associated
              with a promoter or director for the relevant Centre of
              Business (COB).
            </p>
          </header>

          <section className="w-full max-w-3xl min-w-0 pt-6 sm:pt-8">
            <div className="mb-6 flex flex-col items-start gap-2 border-b border-[#eaeaea] pb-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between border-b border-[#eaeaea] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Verification
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-[#293238]">
                  Application details
                </h2>
              </div>

              <p className="text-xs text-[#787774]">
                <span className="text-[#9f2f2d]">*</span>{" "}
                Required field
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="reference"
                  className="mb-2 block text-sm font-medium text-[#394247]"
                >
                  Temporary Reference Number (TRN) / GSTIN
                  <span className="ml-1 text-[#9f2f2d]">
                    *
                  </span>
                </label>

                <input
                  id="reference"
                  value={reference}
                  onChange={(event) => {
                    setReference(
                      event.target.value.toUpperCase()
                    );

                    setErrors((current) => ({
                      ...current,
                      reference: "",
                    }));
                  }}
                  placeholder="Enter TRN / GSTIN"
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

                {errors.reference && (
                  <p className="mt-1.5 text-xs text-[#9f2f2d]">
                    {errors.reference}
                  </p>
                )}
              </div>

              <div className="mt-8 border-t border-[#eaeaea] pt-8">
                <label
                  htmlFor="captcha"
                  className="mb-2 block text-sm font-medium text-[#394247]"
                >
                  Verification
                  <span className="ml-1 text-[#9f2f2d]">
                    *
                  </span>
                </label>

                <p className="mb-4 text-sm leading-6 text-[#6f7375]">
                  Enter the characters shown in the verification
                  image.
                </p>

                <div className="grid min-w-0 gap-3 sm:gap-4 sm:grid-cols-[minmax(0,1fr)_240px]">
                  <input
                    id="captcha"
                    value={captcha}
                    onChange={(event) => {
                      setCaptcha(
                        event.target.value
                      );

                      setErrors((current) => ({
                        ...current,
                        captcha: "",
                      }));
                    }}
                    placeholder="Enter verification characters"
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

                  <div
                    className="
                      flex
                      h-12
                      items-center
                      justify-center
                      border
                      border-[#d9d9d7]
                      bg-[#f1f1ef]
                      px-4
                      font-mono
                      text-lg
                      font-bold
                      tracking-[0.28em]
                      text-[#454a4d]
                    "
                    aria-label="CAPTCHA image placeholder"
                  >
                    7K3P9
                  </div>
                </div>

                {errors.captcha && (
                  <p className="mt-1.5 text-xs text-[#9f2f2d]">
                    {errors.captcha}
                  </p>
                )}

                <p className="mt-2 text-xs leading-5 text-[#787774]">
                  The production version should load and validate
                  this challenge from the backend.
                </p>
              </div>

              <div className="mt-7 flex flex-col items-stretch gap-4 border-t sm:mt-8 sm:flex-row sm:items-center sm:justify-between border-[#eaeaea] pt-6">
                <p className="max-w-md break-words text-xs leading-5 text-[#787774]">
                  Use the TRN or GSTIN associated with the relevant
                  registration.
                </p>

                <button
                  type="submit"
                  className="
                    inline-flex
                    min-w-[130px]
                    items-center
                    justify-center
                    rounded-[5px]
                    bg-[#22282d]
                    px-6
                    py-3
                    text-sm
                    font-medium
                    text-white
                    transition-colors
                    hover:bg-[#333a40]
                    active:scale-[0.98]
                  "
                >
                  Validate
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default HomeStateGSK;