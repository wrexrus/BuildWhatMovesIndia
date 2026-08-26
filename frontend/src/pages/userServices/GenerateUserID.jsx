import React, { useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const WarningModal = ({
  open,
  onContinue,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[1000]
        flex
        items-center
        justify-center
        bg-[#111111]/45
        px-5
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="warning-title"
    >
      <div
        className="
          w-full
          max-w-[620px]
          border
          border-[#dededc]
          bg-white
          p-7
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          sm:p-9
        "
      >
        <div className="border-b border-[#eaeaea] pb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#9f2f2d]">
            Important information
          </p>

          <h2
            id="warning-title"
            className="text-2xl font-semibold tracking-[-0.02em] text-[#20282d]"
          >
            Before you continue
          </h2>
        </div>

        <div className="py-6 text-sm leading-6 text-[#4f5558]">
          <p>
            This functionality is only for applicants who are not
            registered or not liable to be registered under the GST
            Act.
          </p>

          <p className="mt-4">
            This Temporary ID / Enrolment ID is intended to facilitate
            specific functions for unregistered persons at the GST
            Portal, such as filing an application for refund or
            advance ruling, or supplying through e-commerce operators.
          </p>

          <p className="mt-5 font-medium text-[#293238]">
            Do you wish to continue?
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#eaeaea] pt-5">
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-[5px]
              border
              border-[#d9d9d7]
              bg-white
              px-6 py-2.5
              text-sm font-medium
              text-[#394247]
              hover:bg-[#f7f6f3]
            "
          >
            No
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="
              rounded-[5px]
              bg-[#22282d]
              px-6 py-2.5
              text-sm font-medium
              text-white
              hover:bg-[#333a40]
            "
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const GenerateUserID = () => {
  const [purpose, setPurpose] = useState("");
  const [ecommerce, setEcommerce] = useState(false);
  const [warningOpen, setWarningOpen] = useState(true);

  const canProceed =
    Boolean(purpose) || ecommerce;

  const handleProceed = () => {
    if (!canProceed) return;

    console.log({
      purpose,
      ecommerce,
    });
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "User Services" },
            {
              label:
                "Generate User ID for Unregistered Applicant",
            },
          ]}
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          <header className="border-b border-[#eaeaea] pb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              User service
            </p>

            <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.03em] text-[#20282d] sm:text-4xl">
              Generate User ID for unregistered applicant
            </h1>

            <p className="mt-4 max-w-[70ch] text-sm leading-6 text-[#6f7375]">
              Select the purpose for which you need a temporary
              User ID or enrolment facility.
            </p>
          </header>

          <section className="max-w-4xl pt-10">
            {/* Purpose */}
            <div className="border-b border-[#eaeaea] pb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                Step 01
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#293238]">
                Purpose of application
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6f7375]">
                Select one of the available purposes.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <label
                  className={`
                    flex cursor-pointer items-start gap-3
                    border px-5 py-5
                    transition-colors
                    ${
                      purpose === "refund"
                        ? "border-[#1f6c9f] bg-[#f4f9fc]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="purpose"
                    checked={purpose === "refund"}
                    onChange={() =>
                      setPurpose("refund")
                    }
                    className="mt-1 accent-[#1f6c9f]"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-[#293238]">
                      Claim refund
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#787774]">
                      Apply as an unregistered applicant for a
                      refund.
                    </span>
                  </span>
                </label>

                <label
                  className={`
                    flex cursor-pointer items-start gap-3
                    border px-5 py-5
                    transition-colors
                    ${
                      purpose === "ruling"
                        ? "border-[#1f6c9f] bg-[#f4f9fc]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="purpose"
                    checked={purpose === "ruling"}
                    onChange={() =>
                      setPurpose("ruling")
                    }
                    className="mt-1 accent-[#1f6c9f]"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-[#293238]">
                      Apply for Advance Ruling
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#787774]">
                      Apply for an advance ruling as an
                      unregistered applicant.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* E-commerce */}
            <div className="border-b border-[#eaeaea] py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                Additional registration
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#293238]">
                E-commerce supplier enrolment
              </h2>

              <label
                className={`
                  mt-5
                  flex cursor-pointer items-start gap-3
                  border px-5 py-5
                  transition-colors
                  ${
                    ecommerce
                      ? "border-[#1f6c9f] bg-[#f4f9fc]"
                      : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                  }
                `}
              >
                <input
                  type="checkbox"
                  checked={ecommerce}
                  onChange={(event) =>
                    setEcommerce(
                      event.target.checked
                    )
                  }
                  className="mt-1 accent-[#1f6c9f]"
                />

                <span>
                  <span className="block text-sm font-semibold text-[#293238]">
                    Apply as a supplier to e-commerce operators
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[#787774]">
                    Select this option when the enrolment is required
                    for supplies through an e-commerce operator.
                  </span>
                </span>
              </label>
            </div>

            {/* Action */}
            <div className="flex justify-end pt-7">
              <button
                type="button"
                disabled={!canProceed}
                onClick={handleProceed}
                className="
                  rounded-[5px]
                  bg-[#22282d]
                  px-7 py-3
                  text-sm font-medium
                  text-white
                  transition-colors
                  hover:bg-[#333a40]
                  disabled:cursor-not-allowed
                  disabled:bg-[#d4d7d8]
                  disabled:text-[#7c8082]
                "
              >
                Proceed
              </button>
            </div>
          </section>
        </div>

        <WarningModal
          open={warningOpen}
          onCancel={() => setWarningOpen(false)}
          onContinue={() => setWarningOpen(false)}
        />
      </main>
    </PageContainer>
  );
};

export default GenerateUserID;