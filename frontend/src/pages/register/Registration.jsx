import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";
import { useToast } from "../../context/ToastContext";
import { KeyRound, Check, X, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

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
  const navigate = useNavigate();
  const { showToast } = useToast() || {};

  const [registrationType, setRegistrationType] = useState("new");

  const [entityType, setEntityType] = useState("Proprietorship");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Mumbai");
  const [legalName, setLegalName] = useState("");
  const [pan, setPan] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [errors, setErrors] = useState({});

  // Mock OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');

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
      nextErrors.pan = "Enter a valid 10-character PAN (e.g. ABCDE1234F).";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      nextErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    // Open Mock OTP Modal
    setOtpDigits(['', '', '', '']);
    setOtpError('');
    setIsOtpModalOpen(true);
    if (showToast) showToast(`Synthetic OTP dispatched to mobile +91 ${mobile} and email ${email}`, 'info', 'Mock OTP Sent');
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otpDigits];
    updated[index] = value.slice(-1);
    setOtpDigits(updated);

    if (value && index < 3) {
      const nextInput = document.getElementById(`reg-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleAutoFillOtp = () => {
    setOtpDigits(['1', '2', '3', '4']);
    setOtpError('');
  };

  const handleConfirmRegistration = (e) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 4) {
      setOtpError('Please enter all 4 digits of the mock verification OTP.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    setTimeout(() => {
      setIsVerifying(false);
      setIsOtpModalOpen(false);

      const generatedTrn = `TRN2026${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedGstin = `27${pan}1Z5`;

      const newTaxpayerData = {
        name: legalName,
        tradeName: `${legalName} Enterprises`,
        gstin: generatedGstin,
        trn: generatedTrn,
        email,
        mobile: `+91 ${mobile}`,
        state: `${state} (${district})`,
        registrationType: entityType,
        dateOfRegistration: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: "APPROVED_ACTIVE"
      };

      // Save to localStorage as active mock data
      localStorage.setItem('gst_registered_mock_taxpayer', JSON.stringify(newTaxpayerData));

      if (showToast) {
        showToast(`Registration Complete! Temporary Reference Number (TRN): ${generatedTrn}`, 'success', 'New GST Taxpayer Registered');
      }

      // Redirect to Track Application Status page with TRN
      navigate(`/registration/track-status?arn=${generatedTrn}`);
    }, 800);
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
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437] font-sans">
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
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#1f6c9f]">
                  GST registration
                </p>

                <h1 className="font-serif text-[2.1rem] leading-[1.1] tracking-[-0.02em] text-balance text-[#161b1e] sm:text-[2.4rem]">
                  New registration
                </h1>

                <p className="mt-4 max-w-[62ch] text-sm leading-6 text-[#6f7375]">
                  Provide the required business and contact details
                  to begin GST registration. A synthetic OTP verification will be required
                  to finalize registration and generate your TRN.
                </p>
              </div>

              <Link
                to="/"
                className="self-start border-b border-[#b9bcbd] pb-1 text-sm text-[#6b7073] transition-colors hover:border-[#1f6c9f] hover:text-[#1f6c9f] md:self-auto"
              >
                Return to home
              </Link>
            </div>
          </header>

          <section className="border-b border-[#eaeaea] py-6">
            <div className="flex max-w-xl items-start">
              {steps.map((step, index) => {
                const active = index === 0;
                return (
                  <React.Fragment key={step.number}>
                    <div className="flex items-start gap-3">
                      <div
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                          active
                            ? "border-[#1f6c9f] bg-[#1f6c9f] text-white shadow-sm"
                            : "border-[#d8d8d6] bg-white text-[#787774]"
                        }`}
                      >
                        {step.number}
                      </div>

                      <div className="min-w-[150px]">
                        <p className={`text-sm font-semibold ${active ? "text-[#161b1e]" : "text-[#787774]"}`}>
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

          <form onSubmit={handleSubmit} noValidate className="pt-8">
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
                <span className="text-[#9f2f2d]">*</span> Required fields
              </p>
            </div>

            <section className="border-b border-[#eaeaea] pb-7">
              <p className="mb-4 text-sm font-semibold text-[#293238]">
                Registration method
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-start gap-3 border p-4 transition-all duration-150 ${
                    registrationType === "new"
                      ? "border-[#1f6c9f] bg-[#f4f9fc] shadow-sm"
                      : "border-[#eaeaea] bg-white hover:border-[#c7d8e3] hover:bg-[#fbfbfa]"
                  }`}
                >
                  <input
                    type="radio"
                    name="registrationType"
                    value="new"
                    checked={registrationType === "new"}
                    onChange={() => setRegistrationType("new")}
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
                  className={`flex cursor-pointer items-start gap-3 border p-4 transition-all duration-150 ${
                    registrationType === "trn"
                      ? "border-[#1f6c9f] bg-[#f4f9fc] shadow-sm"
                      : "border-[#eaeaea] bg-white hover:border-[#c7d8e3] hover:bg-[#fbfbfa]"
                  }`}
                >
                  <input
                    type="radio"
                    name="registrationType"
                    value="trn"
                    checked={registrationType === "trn"}
                    onChange={() => setRegistrationType("trn")}
                    className="mt-1 accent-[#1f6c9f]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#293238]">
                      Temporary Reference Number
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[#787774]">
                      Continue an existing registration started earlier.
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
                  <label htmlFor="entityType" className="mb-2 block text-sm font-medium text-[#394247]">
                    I am a <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <select
                    id="entityType"
                    value={entityType}
                    onChange={(event) => {
                      setEntityType(event.target.value);
                      setErrors((current) => ({ ...current, entityType: "" }));
                    }}
                    className="h-12 w-full border border-[#d9d9d7] bg-white px-3 text-sm text-[#394247] outline-none transition-colors focus:border-[#1f6c9f]"
                  >
                    {entityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="state" className="mb-2 block text-sm font-medium text-[#394247]">
                    State / Union Territory <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <select
                    id="state"
                    value={state}
                    onChange={(event) => {
                      setState(event.target.value);
                      setErrors((current) => ({ ...current, state: "" }));
                    }}
                    className="h-12 w-full border border-[#d9d9d7] bg-white px-3 text-sm text-[#394247] outline-none transition-colors focus:border-[#1f6c9f]"
                  >
                    {states.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="district" className="mb-2 block text-sm font-medium text-[#394247]">
                    District <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <select
                    id="district"
                    value={district}
                    onChange={(event) => {
                      setDistrict(event.target.value);
                      setErrors((current) => ({ ...current, district: "" }));
                    }}
                    className="h-12 w-full border border-[#d9d9d7] bg-white px-3 text-sm text-[#394247] outline-none transition-colors focus:border-[#1f6c9f]"
                  >
                    {districts.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="legalName" className="mb-2 block text-sm font-medium text-[#394247]">
                    Legal name of business <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <input
                    id="legalName"
                    value={legalName}
                    onChange={(event) => {
                      setLegalName(event.target.value);
                      setErrors((current) => ({ ...current, legalName: "" }));
                    }}
                    placeholder="e.g. Ramesh Hardware Store"
                    className="h-12 w-full border border-[#d9d9d7] bg-white px-3 text-sm text-[#293238] outline-none focus:border-[#1f6c9f]"
                  />
                  {errors.legalName && <p className="mt-1.5 text-xs text-[#9f2f2d]">{errors.legalName}</p>}
                </div>

                <div>
                  <label htmlFor="pan" className="mb-2 block text-sm font-medium text-[#394247]">
                    Permanent Account Number (PAN) <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <input
                    id="pan"
                    value={pan}
                    onChange={(event) => {
                      updatePan(event.target.value);
                      setErrors((current) => ({ ...current, pan: "" }));
                    }}
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    className="h-12 w-full border border-[#d9d9d7] bg-white px-3 text-sm font-mono uppercase text-[#293238] outline-none focus:border-[#1f6c9f]"
                  />
                  {errors.pan && <p className="mt-1.5 text-xs text-[#9f2f2d]">{errors.pan}</p>}
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
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#394247]">
                    Email address <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErrors((current) => ({ ...current, email: "" }));
                    }}
                    placeholder="applicant@domain.com"
                    className="h-12 w-full border border-[#d9d9d7] bg-white px-3 text-sm text-[#293238] outline-none focus:border-[#1f6c9f]"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-[#9f2f2d]">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="mobile" className="mb-2 block text-sm font-medium text-[#394247]">
                    Mobile number <span className="ml-1 text-[#9f2f2d]">*</span>
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
                        updateMobile(event.target.value);
                        setErrors((current) => ({ ...current, mobile: "" }));
                      }}
                      maxLength={10}
                      placeholder="9876543210"
                      // value={9404949988}
                    className="h-12 w-full border border-[#d9d9d7] bg-white px-3 text-sm font-mono text-[#293238] outline-none focus:border-[#1f6c9f]"
                    />
                  </div>
                  {errors.mobile && <p className="mt-1.5 text-xs text-[#9f2f2d]">{errors.mobile}</p>}
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-5 text-[#787774]">
                By proceeding, you confirm that the information provided is accurate and that you are authorised to submit this registration.
              </p>

              <button
                type="submit"
                className="inline-flex min-w-[170px] items-center justify-center rounded-[5px] bg-[#071b30] hover:bg-[#153457] px-6 py-3.5 text-sm font-bold text-white transition-all cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <span>Proceed to Mock OTP</span>
              </button>
            </div>
          </form>

          {/* MOCK OTP VERIFICATION MODAL */}
          {isOtpModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-center">
                <div className="h-14 w-14 bg-amber/20 border-2 border-amber/40 rounded-2xl flex items-center justify-center text-amber mx-auto mb-4">
                  <KeyRound className="w-7 h-7 text-[#071b30]" />
                </div>

                <h3 className="text-lg font-extrabold text-[#071b30]">New Registration OTP Verification</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Synthetic OTP dispatched to registered mobile <span className="font-bold text-slate-800">+91 {mobile}</span> and email <span className="font-bold text-slate-800">{email}</span>.
                </p>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-extrabold px-3 py-1.5 rounded-lg border border-amber-300 transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>⚡ Auto-Fill Hackathon Mock OTP (1234)</span>
                  </button>
                </div>

                <form onSubmit={handleConfirmRegistration} className="mt-6 space-y-4">
                  <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        id={`reg-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={otpDigits[idx]}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-12 h-12 text-center text-xl font-black border-2 border-slate-300 rounded-xl focus:border-[#071b30] focus:outline-none bg-slate-50"
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-xs text-red-600 font-bold flex items-center justify-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> {otpError}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsOtpModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="bg-[#071b30] hover:bg-[#153457] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
                    >
                      {isVerifying ? (
                        <span>Registering...</span>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Verify & Generate TRN</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </PageContainer>
  );
};

export default Registration;