import React, { useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const entityTypes = [
  "Proprietorship",
  "Partnership Firm",
  "Limited Liability Partnership",
  "Private Limited Company",
  "Public Limited Company",
  "Society / Club / Trust",
  "Government Department",
  "Other",
];

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const districts = [
  "Ahmedabad",
  "Bengaluru Urban",
  "Chennai",
  "Delhi",
  "Hyderabad",
  "Jaipur",
  "Kolkata",
  "Lucknow",
  "Mumbai",
  "Pune",
];

const steps = [
  {
    number: "01",
    title: "User credentials",
    description: "Business and contact details",
  },
  {
    number: "02",
    title: "OTP verification",
    description: "Verify email and mobile",
  },
];

const Registration = () => {
  const [registrationType, setRegistrationType] =
    useState("new");

  const [entityType, setEntityType] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [legalName, setLegalName] = useState("");
  const [pan, setPan] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!entityType) {
      nextErrors.entityType = "Select the type of taxpayer.";
    }

    if (!state) {
      nextErrors.state = "Select a State or Union Territory.";
    }

    if (!district) {
      nextErrors.district = "Select a district.";
    }

    if (!legalName.trim()) {
      nextErrors.legalName = "Enter the legal name of the business.";
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
      nextErrors.pan = "Enter a valid PAN.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      nextErrors.mobile =
        "Enter a valid 10-digit mobile number.";
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
      registrationType,
      entityType,
      state,
      district,
      legalName,
      pan,
      email,
      mobile,
    });
  };

  const updatePan = (value) => {
    setPan(
      value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10)
    );
  };

  const updateMobile = (value) => {
    setMobile(
      value.replace(/\D/g, "").slice(0, 10)
    );
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            {
              label: "Registration",
            },
          ]}
        />

        <div className="mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8">
          <header className="border-b border-[#eaeaea] pb-7">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
                  GST registration
                </p>

                <h1 className="text-2xl font-semibold tracking-[-0.02em] text-balance text-[#20282d] sm:text-[1.75rem]">
                  New registration
                </h1>

                <p className="mt-4 max-w-[62ch] text-sm leading-6 text-[#6f7375]">
                  Provide the required business and contact details
                  to begin GST registration. An OTP will be sent to
                  the email address and mobile number provided below.
                </p>
              </div>

              <Link
                to="/"
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
                  md:self-auto
                "
              >
                Return to home
              </Link>
            </div>
          </header>

          <section className="border-b border-[#eaeaea] py-6">
            <div className="flex max-w-xl items-start">
              {steps.map((step, index) => {
                const active = index === 0;
                const completed = index < 0;

                return (
                  <React.Fragment key={step.number}>
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          grid h-9 w-9 shrink-0 place-items-center
                          border
                          text-xs font-semibold
                          ${
                            active
                              ? "border-[#1f6c9f] bg-[#1f6c9f] text-white"
                              : completed
                                ? "border-[#346538] bg-[#edf3ec] text-[#346538]"
                                : "border-[#d8d8d6] bg-white text-[#787774]"
                          }
                        `}
                      >
                        {step.number}
                      </div>

                      <div className="min-w-[150px]">
                        <p
                          className={`text-sm font-semibold ${
                            active
                              ? "text-[#20282d]"
                              : "text-[#787774]"
                          }`}
                        >
                          {step.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#8a8c8d]">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {index !== steps.length - 1 && (
                      <div className="mx-4 mt-4 h-px flex-1 bg-[#dededc]" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="pt-8"
          >
            <div className="mb-7 flex items-end justify-between gap-4 border-b border-[#eaeaea] pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Account setup
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-[-0.01em] text-[#293238]">
                  User credentials
                </h2>
              </div>

              <p className="text-xs text-[#787774]">
                <span className="text-[#9f2f2d]">*</span>{" "}
                Required fields
              </p>
            </div>

            <section className="border-b border-[#eaeaea] pb-7">
              <p className="mb-4 text-sm font-semibold text-[#293238]">
                Registration method
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`
                    flex cursor-pointer items-start gap-3
                    border p-4
                    transition-colors
                    ${
                      registrationType === "new"
                        ? "border-[#1f6c9f] bg-[#f4f9fc]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="registrationType"
                    value="new"
                    checked={registrationType === "new"}
                    onChange={() =>
                      setRegistrationType("new")
                    }
                    className="mt-1 accent-[#1f6c9f]"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-[#293238]">
                      New registration
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#787774]">
                      Start a fresh GST registration application.
                    </span>
                  </span>
                </label>

                <label
                  className={`
                    flex cursor-pointer items-start gap-3
                    border p-4
                    transition-colors
                    ${
                      registrationType === "trn"
                        ? "border-[#1f6c9f] bg-[#f4f9fc]"
                        : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="registrationType"
                    value="trn"
                    checked={registrationType === "trn"}
                    onChange={() =>
                      setRegistrationType("trn")
                    }
                    className="mt-1 accent-[#1f6c9f]"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-[#293238]">
                      Temporary Reference Number
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-[#787774]">
                      Continue an existing registration started
                      earlier.
                    </span>
                  </span>
                </label>
              </div>
            </section>

            <section className="border-b border-[#eaeaea] py-6">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Business details
                </p>

                <h3 className="mt-1 text-lg font-semibold text-[#293238]">
                  Tell us about the applicant
                </h3>
              </div>

              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="entityType"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    I am a
                    <span className="ml-1 text-[#9f2f2d]">
                      *
                    </span>
                  </label>

                  <select
                    id="entityType"
                    value={entityType}
                    onChange={(event) => {
                      setEntityType(event.target.value);

                      setErrors((current) => ({
                        ...current,
                        entityType: "",
                      }));
                    }}
                    className="
                      h-12
                      w-full
                      border
                      border-[#d9d9d7]
                      bg-white
                      px-3
                      text-sm
                      text-[#394247]
                      outline-none
                      transition-colors
                      focus:border-[#1f6c9f]
                      focus:ring-2
                      focus:ring-[#e1f3fe]
                    "
                  >
                    <option value="">Select</option>

                    {entityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {errors.entityType && (
                    <p className="mt-1.5 text-xs text-[#9f2f2d]">
                      {errors.entityType}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    State / Union Territory
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
                      h-12
                      w-full
                      border
                      border-[#d9d9d7]
                      bg-white
                      px-3
                      text-sm
                      text-[#394247]
                      outline-none
                      transition-colors
                      focus:border-[#1f6c9f]
                      focus:ring-2
                      focus:ring-[#e1f3fe]
                    "
                  >
                    <option value="">Select</option>

                    {states.map((item) => (
                      <option key={item} value={item}>
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

                <div>
                  <label
                    htmlFor="district"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    District
                    <span className="ml-1 text-[#9f2f2d]">
                      *
                    </span>
                  </label>

                  <select
                    id="district"
                    value={district}
                    onChange={(event) => {
                      setDistrict(event.target.value);

                      setErrors((current) => ({
                        ...current,
                        district: "",
                      }));
                    }}
                    className="
                      h-12
                      w-full
                      border
                      border-[#d9d9d7]
                      bg-white
                      px-3
                      text-sm
                      text-[#394247]
                      outline-none
                      transition-colors
                      focus:border-[#1f6c9f]
                      focus:ring-2
                      focus:ring-[#e1f3fe]
                    "
                  >
                    <option value="">Select</option>

                    {districts.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  {errors.district && (
                    <p className="mt-1.5 text-xs text-[#9f2f2d]">
                      {errors.district}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="legalName"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    Legal name of the business
                    <span className="ml-1 text-xs font-normal text-[#787774]">
                      As mentioned in PAN
                    </span>

                    <span className="ml-1 text-[#9f2f2d]">
                      *
                    </span>
                  </label>

                  <input
                    id="legalName"
                    value={legalName}
                    onChange={(event) => {
                      setLegalName(event.target.value);

                      setErrors((current) => ({
                        ...current,
                        legalName: "",
                      }));
                    }}
                    placeholder="Enter legal name of business"
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

                  {errors.legalName && (
                    <p className="mt-1.5 text-xs text-[#9f2f2d]">
                      {errors.legalName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="pan"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    Permanent Account Number (PAN)
                    <span className="ml-1 text-[#9f2f2d]">
                      *
                    </span>
                  </label>

                  <input
                    id="pan"
                    value={pan}
                    onChange={(event) => {
                      updatePan(event.target.value);

                      setErrors((current) => ({
                        ...current,
                        pan: "",
                      }));
                    }}
                    maxLength={10}
                    placeholder="Enter PAN"
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
                      tracking-[0.04em]
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

                  {errors.pan && (
                    <p className="mt-1.5 text-xs text-[#9f2f2d]">
                      {errors.pan}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="border-b border-[#eaeaea] py-6">
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Contact details
                </p>

                <h3 className="mt-1 text-lg font-semibold text-[#293238]">
                  Where should we send verification codes?
                </h3>
              </div>

              <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
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

                  <p className="mt-2 text-xs leading-5 text-[#787774]">
                    A separate OTP will be sent to this email
                    address.
                  </p>

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
                      inputMode="numeric"
                      value={mobile}
                      onChange={(event) => {
                        updateMobile(
                          event.target.value
                        );

                        setErrors((current) => ({
                          ...current,
                          mobile: "",
                        }));
                      }}
                      maxLength={10}
                      placeholder="Enter mobile number"
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
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#787774]">
                    A separate OTP will be sent to this mobile
                    number.
                  </p>

                  {errors.mobile && (
                    <p className="mt-1.5 text-xs text-[#9f2f2d]">
                      {errors.mobile}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-[#787774]">
                By proceeding, you confirm that the information
                provided is accurate and that you are authorised to
                submit this registration.
              </p>

              <button
                type="submit"
                className="
                  inline-flex
                  min-w-[170px]
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
                Proceed
              </button>
            </div>
          </form>
        </div>
      </main>
    </PageContainer>
  );
};

export default Registration;