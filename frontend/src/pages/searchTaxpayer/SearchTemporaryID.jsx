import React, { useState } from "react";
import SearchPageShell from "../../components/SearchPageShell";
import FormField from "../../components/FormField";
import SearchButton from "../../components/SearchButton";
import CaptchaCard from "../../components/CaptchaCard";
import { isValidMobile } from "../../utils/validators";
import PageContainer from "../../components/PageContainer";
import { CheckCircle2, ShieldCheck, User } from "lucide-react";

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

const SearchTemporaryID = () => {
    const [temporaryId, setTemporaryId] = useState("");
    const [state, setState] = useState("");
    const [mobile, setMobile] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const updateTemporaryId = (value) => {
        setTemporaryId(value.toUpperCase());
        setError("");
    };

    const updateMobile = (value) => {
        const cleaned = value.replace(/\D/g, "").slice(0, 10);
        setMobile(cleaned);
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const usingTemporaryId = Boolean(temporaryId.trim());
        const usingStateMobile = Boolean(state || mobile);

        if (!usingTemporaryId && !usingStateMobile) {
            setError(
                "Enter a Temporary ID or provide State and Mobile Number."
            );
            return;
        }

        if (!usingTemporaryId) {
            if (!state) {
                setError("Please select a state.");
                return;
            }

            if (!isValidMobile(mobile)) {
                setError("Please enter a valid 10-digit mobile number.");
                return;
            }
        }

        if (!captcha.trim()) {
            setError("CAPTCHA verification is required.");
            return;
        }

        setError("");
        setLoading(true);
        setResult(null);

        await new Promise((resolve) => setTimeout(resolve, 600));

        setLoading(false);
        setResult({
            temporaryId: temporaryId.trim() || "TRN2026998877",
            applicantName: "Ramesh Kumar (Nagpur Hardware)",
            tradeName: "Nagpur Hardware & Sanitary Store",
            state: state || "Maharashtra",
            mobile: mobile ? `+91 ${mobile}` : "+91 98765 43210",
            status: "APPROVED_ACTIVE",
            assignedGstin: "27AAAAA1234A1Z5"
        });
    };

    return (
        <PageContainer>
            <SearchPageShell
                title="Search Temporary ID"
                description="Search taxpayer information using a Temporary ID or by providing state and registered mobile details."
                breadcrumbs={[
                    {
                        label: "Search Temporary ID",
                    },
                ]}
            >
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl min-w-0"
                    noValidate
                >
                    <FormField
                        id="temporaryId"
                        label="Enter Temporary ID (TRN)"
                        value={temporaryId}
                        onChange={(event) =>
                            updateTemporaryId(event.target.value)
                        }
                        placeholder="Enter TRN (e.g. TRN2026998877)"
                    />

                    <div className="my-7 flex items-center gap-4">
                        <div className="h-px flex-1 bg-slate-200" />

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-slate-200" />
                    </div>

                    <div>
                        <label
                            htmlFor="state"
                            className="mb-2 block text-[0.95rem] font-semibold text-[#112f58]"
                        >
                            Select State
                        </label>

                        <select
                            id="state"
                            value={state}
                            onChange={(event) => {
                                setState(event.target.value);
                                setError("");
                            }}
                            className="
                              h-12 w-full rounded-md border border-slate-300
                              bg-white px-4 text-[0.95rem] text-slate-700
                              outline-none transition-all
                              focus:border-[#2e659d]
                              focus:ring-4 focus:ring-[#2e659d]/10
                            "
                        >
                            <option value="">Select State</option>

                            {states.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-6">
                        <FormField
                            id="mobile"
                            label="Enter Mobile Number"
                            type="tel"
                            value={mobile}
                            onChange={(event) =>
                                updateMobile(event.target.value)
                            }
                            placeholder="Enter Mobile Number"
                            maxLength={10}
                        />
                    </div>

                    <div className="mt-6">
                        <CaptchaCard
                            value={captcha}
                            onChange={(event) => {
                                setCaptcha(event.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    {error && (
                        <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="mt-8">
                        <SearchButton loading={loading} />
                    </div>
                </form>

                {result && (
                    <div className="mt-6 w-full max-w-3xl min-w-0 overflow-hidden rounded-xl bg-white p-4 sm:mt-8 sm:rounded-2xl sm:p-6 shadow-sm border border-slate-200">
                        <div className="flex min-w-0 flex-col gap-3 border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="break-words text-lg font-bold text-[#071b30]">{result.applicantName}</h3>
                                <p className="break-words text-xs text-slate-500 font-mono">TRN: {result.temporaryId}</p>
                            </div>
                            <span className="inline-flex max-w-full w-fit items-center px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{result.status}</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 text-xs text-slate-700">
                            <div>
                                <span className="font-medium text-slate-400 block">Trade Name</span>
                                <span className="font-semibold text-slate-800">{result.tradeName}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-400 block">State Jurisdiction</span>
                                <span>{result.state}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-400 block">Mobile Contact</span>
                                <span>{result.mobile}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-400 block">Assigned Active GSTIN</span>
                                <span className="font-mono font-bold text-[#071b30]">{result.assignedGstin}</span>
                            </div>
                        </div>
                    </div>
                )}
            </SearchPageShell>
        </PageContainer>
    );
};

export default SearchTemporaryID;