import React, { useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const TrackApplicationStatus = () => {
  const [searchType, setSearchType] = useState("arn");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [errors, setErrors] = useState({});

  const isARN = searchType === "arn";

  const validate = () => {
    const nextErrors = {};

    if (!referenceNumber.trim()) {
      nextErrors.referenceNumber = isARN
        ? "Enter the ARN."
        : "Enter the SRN/FRN.";
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
      searchType,
      referenceNumber,
    });
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
    setReferenceNumber("");
    setErrors({});
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            {
              label: "Registration",
            },
            {
              label: "Track Application Status",
            },
          ]}
        />

        <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8">
          <header className="border-b border-[#eaeaea] pb-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
                  Registration
                </p>

                <h1 className="text-2xl font-semibold tracking-[-0.02em] text-balance text-[#20282d] sm:text-[1.75rem]">
                  Track application status
                </h1>

                <p className="mt-4 max-w-[62ch] text-sm leading-6 text-[#6f7375]">
                  Check the current status of your GST registration
                  application using the reference number generated
                  during the application process.
                </p>
              </div>

              <Link
                to="/registration"
                className="
                  self-start
                  border-b
                  border-[#b9bcbd]
                  pb-1
                  text-sm
                  text-[#6b7073]
                  transition-colors
                  hover:border-[#1f6c9f]
                  hover:text-[#1f6c9f]
                  sm:self-auto
                "
              >
                New registration
              </Link>
            </div>
          </header>

          <section className="max-w-3xl pt-8">
            <div className="mb-8 flex items-end justify-between border-b border-[#eaeaea] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Application lookup
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-[#293238]">
                  Select a reference type
                </h2>
              </div>

              <p className="text-xs text-[#787774]">
                <span className="text-[#9f2f2d]">*</span>{" "}
                Required field
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend className="mb-4 text-sm font-medium text-[#394247]">
                  Application reference
                </legend>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label
                    className={`
                      flex cursor-pointer items-start gap-3
                      border p-4
                      transition-colors

                      ${
                        isARN
                          ? "border-[#1f6c9f] bg-[#f4f9fc]"
                          : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="searchType"
                      checked={searchType === "arn"}
                      onChange={() =>
                        handleTypeChange("arn")
                      }
                      className="mt-1 accent-[#1f6c9f]"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-[#293238]">
                        ARN
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#787774]">
                        Application Reference Number
                      </span>
                    </span>
                  </label>

                  <label
                    className={`
                      flex cursor-pointer items-start gap-3
                      border p-4
                      transition-colors

                      ${
                        !isARN
                          ? "border-[#1f6c9f] bg-[#f4f9fc]"
                          : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="searchType"
                      checked={searchType === "srn"}
                      onChange={() =>
                        handleTypeChange("srn")
                      }
                      className="mt-1 accent-[#1f6c9f]"
                    />

                    <span>
                      <span className="block text-sm font-semibold text-[#293238]">
                        SRN / FRN
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-[#787774]">
                        Service Request Number / Filing Reference
                        Number
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              <div className="mt-8">
                <label
                  htmlFor="referenceNumber"
                  className="mb-2 block text-sm font-medium text-[#394247]"
                >
                  {isARN ? "ARN" : "SRN / FRN"}
                  <span className="ml-1 text-[#9f2f2d]">*</span>
                </label>

                <input
                  id="referenceNumber"
                  value={referenceNumber}
                  onChange={(event) => {
                    setReferenceNumber(
                      event.target.value.toUpperCase()
                    );

                    setErrors((current) => ({
                      ...current,
                      referenceNumber: "",
                    }));
                  }}
                  placeholder={
                    isARN
                      ? "Enter ARN"
                      : "Enter SRN / FRN"
                  }
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

                {errors.referenceNumber && (
                  <p className="mt-1.5 text-xs text-[#9f2f2d]">
                    {errors.referenceNumber}
                  </p>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-[#eaeaea] pt-6">
                <p className="max-w-md text-xs leading-5 text-[#787774]">
                  Enter the reference exactly as provided in your
                  registration or service acknowledgement.
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
                  Search
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default TrackApplicationStatus;