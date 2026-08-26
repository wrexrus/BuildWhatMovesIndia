import React, { useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const grievanceTypes = [
  "Payment deducted but not reflected",
  "Challan related issue",
  "Bank confirmation issue",
  "Bank clearance issue",
  "Other payment issue",
];

const states = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
];

const PaymentGrievance = () => {
  const [activeTab, setActiveTab] = useState("submit");

  const [grievanceRelatedTo, setGrievanceRelatedTo] =
    useState("");

  const [previousGrievance, setPreviousGrievance] =
    useState("");

  const [state, setState] = useState("");

  const [gstin, setGstin] = useState("");

  const [businessName, setBusinessName] =
    useState("");

  const [complainant, setComplainant] =
    useState("");

  const [email, setEmail] = useState("");

  const [mobile, setMobile] = useState("");

  const [pan, setPan] = useState("");

  const [description, setDescription] =
    useState("");

  const [supportingDocument, setSupportingDocument] =
    useState(null);

  const [cpin, setCpin] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!grievanceRelatedTo) {
      nextErrors.grievanceRelatedTo =
        "Select what the grievance is related to.";
    }

    if (!state) {
      nextErrors.state = "Select a State.";
    }

    if (!gstin.trim()) {
      nextErrors.gstin = "Enter the GSTIN / Other ID.";
    }

    if (!businessName.trim()) {
      nextErrors.businessName =
        "Enter the name and address of the business.";
    }

    if (!complainant.trim()) {
      nextErrors.complainant =
        "Enter the name of the complainant.";
    }

    if (!email.trim()) {
      nextErrors.email = "Enter the email address.";
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      nextErrors.mobile =
        "Enter a valid 10-digit mobile number.";
    }

    if (!description.trim()) {
      nextErrors.description =
        "Enter the grievance description.";
    }

    if (!cpin.trim()) {
      nextErrors.cpin = "Enter the CPIN.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (mode) => {
    if (!validate()) {
      return;
    }

    console.log({
      submissionMode: mode,
      grievanceRelatedTo,
      previousGrievance,
      state,
      gstin,
      businessName,
      complainant,
      email,
      mobile,
      pan,
      description,
      supportingDocument,
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
            {
              label:
                "Grievance against Payment (GST PMT-07)",
            },
          ]}
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <header className="border-b border-[#eaeaea] pb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              Payments / Grievance
            </p>

            <h1 className="max-w-4xl text-3xl font-semibold tracking-[-0.03em] text-[#20282d] sm:text-4xl">
              Grievance against Payment
            </h1>

            <p className="mt-3 text-sm font-medium text-[#5d6366]">
              GST PMT-07
            </p>

            <p className="mt-4 max-w-[70ch] text-sm leading-6 text-[#6f7375]">
              Submit a grievance related to a GST payment or check
              the status of an existing payment grievance.
            </p>
          </header>

          {/* =====================================================
              TABS
          ===================================================== */}

          <div className="border-b border-[#eaeaea] pt-7">
            <div className="flex gap-8">
              <button
                type="button"
                onClick={() => setActiveTab("submit")}
                className={`
                  relative
                  pb-4
                  text-sm
                  font-medium
                  ${
                    activeTab === "submit"
                      ? "text-[#1f6c9f]"
                      : "text-[#74787a] hover:text-[#293238]"
                  }
                `}
              >
                Submit grievance

                {activeTab === "submit" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#1f6c9f]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("status")}
                className={`
                  relative
                  pb-4
                  text-sm
                  font-medium
                  ${
                    activeTab === "status"
                      ? "text-[#1f6c9f]"
                      : "text-[#74787a] hover:text-[#293238]"
                  }
                `}
              >
                Enquire status

                {activeTab === "status" && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#1f6c9f]" />
                )}
              </button>
            </div>
          </div>

          {activeTab === "status" ? (
            <section className="max-w-3xl pt-10">
              <div className="border-b border-[#eaeaea] pb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Grievance lookup
                </p>

                <h2 className="mt-1 text-xl font-semibold text-[#293238]">
                  Check grievance status
                </h2>
              </div>

              <div className="pt-7">
                <label
                  htmlFor="previous-grievance"
                  className="mb-2 block text-sm font-medium text-[#394247]"
                >
                  Grievance Number
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="previous-grievance"
                    value={previousGrievance}
                    onChange={(event) =>
                      setPreviousGrievance(
                        event.target.value
                      )
                    }
                    placeholder="Enter Grievance Number"
                    className="
                      h-12 flex-1
                      border border-[#d9d9d7]
                      bg-white px-3
                      text-sm
                      outline-none
                      focus:border-[#1f6c9f]
                    "
                  />

                  <button
                    type="button"
                    className="
                      h-12
                      rounded-[5px]
                      bg-[#22282d]
                      px-7
                      text-sm
                      font-medium
                      text-white
                      hover:bg-[#333a40]
                    "
                  >
                    Enquire
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit("EVC");
              }}
              noValidate
              className="pt-10"
            >
              {/* =================================================
                  GRIEVANCE DETAILS
              ================================================= */}

              <section>
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                    01 — Grievance details
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[#293238]">
                    Payment issue
                  </h2>
                </div>

                <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#394247]">
                      Grievance type
                    </label>

                    <p className="text-sm font-semibold text-[#293238]">
                      Grievance Against Payment (GST PMT-07)
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="previous"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Previous grievance number
                    </label>

                    <input
                      id="previous"
                      value={previousGrievance}
                      onChange={(event) =>
                        setPreviousGrievance(
                          event.target.value
                        )
                      }
                      placeholder="Enter previous grievance number"
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="grievanceRelatedTo"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Grievance related to
                      <span className="ml-1 text-[#9f2f2d]">
                        *
                      </span>
                    </label>

                    <select
                      id="grievanceRelatedTo"
                      value={grievanceRelatedTo}
                      onChange={(event) => {
                        setGrievanceRelatedTo(
                          event.target.value
                        );

                        setErrors((current) => ({
                          ...current,
                          grievanceRelatedTo: "",
                        }));
                      }}
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    >
                      <option value="">Select</option>

                      {grievanceTypes.map((item) => (
                        <option key={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    {errors.grievanceRelatedTo && (
                      <p className="mt-1.5 text-xs text-[#9f2f2d]">
                        {errors.grievanceRelatedTo}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      State
                      <span className="ml-1 text-[#9f2f2d]">
                        *
                      </span>
                    </label>

                    <select
                      id="state"
                      value={state}
                      onChange={(event) => {
                        setState(event.target.value);

                        setErrors((current) => ({
                          ...current,
                          state: "",
                        }));
                      }}
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    >
                      <option value="">Select</option>

                      {states.map((item) => (
                        <option key={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    {errors.state && (
                      <p className="mt-1.5 text-xs text-[#9f2f2d]">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* =================================================
                  TAXPAYER DETAILS
              ================================================= */}

              <section className="mt-12 border-t border-[#eaeaea] pt-10">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                    02 — Taxpayer details
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[#293238]">
                    Person reporting the grievance
                  </h2>
                </div>

                <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="gstin"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      GSTIN / Other ID
                      <span className="ml-1 text-[#9f2f2d]">
                        *
                      </span>
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
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        uppercase
                        placeholder:normal-case
                        outline-none
                        focus:border-[#1f6c9f]
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
                      htmlFor="complainant"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Name of complainant
                      <span className="ml-1 text-[#9f2f2d]">
                        *
                      </span>
                    </label>

                    <input
                      id="complainant"
                      value={complainant}
                      onChange={(event) => {
                        setComplainant(
                          event.target.value
                        );

                        setErrors((current) => ({
                          ...current,
                          complainant: "",
                        }));
                      }}
                      placeholder="Enter name of complainant"
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />

                    {errors.complainant && (
                      <p className="mt-1.5 text-xs text-[#9f2f2d]">
                        {errors.complainant}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor="businessName"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Name and address of business
                      <span className="ml-1 text-[#9f2f2d]">
                        *
                      </span>
                    </label>

                    <input
                      id="businessName"
                      value={businessName}
                      onChange={(event) => {
                        setBusinessName(
                          event.target.value
                        );

                        setErrors((current) => ({
                          ...current,
                          businessName: "",
                        }));
                      }}
                      placeholder="Enter name and address of business"
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />

                    {errors.businessName && (
                      <p className="mt-1.5 text-xs text-[#9f2f2d]">
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Email address
                      <span className="ml-1 text-[#9f2f2d]">
                        *
                      </span>
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);

                        setErrors((current) => ({
                          ...current,
                          email: "",
                        }));
                      }}
                      placeholder="Enter email address"
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs text-[#9f2f2d]">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Mobile number
                      <span className="ml-1 text-[#9f2f2d]">
                        *
                      </span>
                    </label>

                    <div className="flex">
                      <span className="flex h-12 items-center border border-r-0 border-[#d9d9d7] bg-[#f7f6f3] px-3 text-sm text-[#5f6467]">
                        +91
                      </span>

                      <input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        onChange={(event) => {
                          setMobile(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10)
                          );

                          setErrors((current) => ({
                            ...current,
                            mobile: "",
                          }));
                        }}
                        placeholder="Enter mobile number"
                        className="
                          h-12 w-full
                          border border-[#d9d9d7]
                          bg-white px-3
                          text-sm
                          outline-none
                          focus:border-[#1f6c9f]
                        "
                      />
                    </div>

                    {errors.mobile && (
                      <p className="mt-1.5 text-xs text-[#9f2f2d]">
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="pan"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Permanent Account Number (PAN)
                    </label>

                    <input
                      id="pan"
                      value={pan}
                      onChange={(event) =>
                        setPan(
                          event.target.value
                            .toUpperCase()
                            .replace(
                              /[^A-Z0-9]/g,
                              ""
                            )
                            .slice(0, 10)
                        )
                      }
                      placeholder="Enter PAN"
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm uppercase
                        placeholder:normal-case
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Description of grievance
                      <span className="ml-1 text-[#9f2f2d]">
                        *
                      </span>
                    </label>

                    <textarea
                      id="description"
                      rows={4}
                      maxLength={4000}
                      value={description}
                      onChange={(event) => {
                        setDescription(
                          event.target.value
                        );

                        setErrors((current) => ({
                          ...current,
                          description: "",
                        }));
                      }}
                      placeholder="Enter grievance description"
                      className="
                        w-full
                        resize-y
                        border border-[#d9d9d7]
                        bg-white px-3 py-3
                        text-sm
                        leading-6
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />

                    <p className="mt-1 text-right text-xs text-[#8a8d8f]">
                      {description.length}/4000
                    </p>

                    {errors.description && (
                      <p className="mt-1.5 text-xs text-[#9f2f2d]">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* =================================================
                  DOCUMENT
              ================================================= */}

              <section className="mt-12 border-t border-[#eaeaea] pt-10">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                    03 — Supporting document
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[#293238]">
                    Add supporting documentation
                  </h2>
                </div>

                <input
                  type="file"
                  accept=".pdf,.jpeg,.jpg"
                  onChange={(event) =>
                    setSupportingDocument(
                      event.target.files?.[0] || null
                    )
                  }
                  className="
                    block
                    w-full
                    max-w-xl
                    border
                    border-[#d9d9d7]
                    bg-white
                    px-3
                    py-3
                    text-sm
                    text-[#50565a]
                  "
                />

                <div className="mt-3 space-y-1 text-xs leading-5 text-[#787774]">
                  <p>PDF or JPEG files are allowed.</p>
                  <p>Maximum file size: 500 KB.</p>
                </div>
              </section>

              {/* =================================================
                  DISCREPANCY
              ================================================= */}

              <section className="mt-12 border-t border-[#eaeaea] pt-10">
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                    04 — Discrepancy in payments
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-[#293238]">
                    Payment reference
                  </h2>
                </div>

                <div className="max-w-xl">
                  <label
                    htmlFor="cpin"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    CPIN
                    <span className="ml-1 text-[#9f2f2d]">
                      *
                    </span>
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
                      h-12 w-full
                      border border-[#d9d9d7]
                      bg-white px-3
                      text-sm
                      outline-none
                      focus:border-[#1f6c9f]
                    "
                  />

                  {errors.cpin && (
                    <p className="mt-1.5 text-xs text-[#9f2f2d]">
                      {errors.cpin}
                    </p>
                  )}

                  <p className="mt-2 text-xs leading-5 text-[#787774]">
                    Enter the grievance-related information,
                    State and taxpayer identifier before entering
                    the CPIN.
                  </p>
                </div>
              </section>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <section className="mt-12 border-t border-[#eaeaea] pt-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="
                      rounded-[5px]
                      border
                      border-[#cfd2d3]
                      bg-white
                      px-6
                      py-3
                      text-sm
                      font-medium
                      text-[#394247]
                      hover:bg-[#f7f6f3]
                    "
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validate()) {
                        handleSubmit("DSC");
                      }
                    }}
                    className="
                      rounded-[5px]
                      bg-[#22282d]
                      px-6
                      py-3
                      text-sm
                      font-medium
                      text-white
                      hover:bg-[#333a40]
                    "
                  >
                    Submit with DSC
                  </button>

                  <button
                    type="submit"
                    className="
                      rounded-[5px]
                      bg-[#22282d]
                      px-6
                      py-3
                      text-sm
                      font-medium
                      text-white
                      hover:bg-[#333a40]
                    "
                  >
                    Submit with EVC
                  </button>
                </div>
              </section>
            </form>
          )}
        </div>
      </main>
    </PageContainer>
  );
};

export default PaymentGrievance;