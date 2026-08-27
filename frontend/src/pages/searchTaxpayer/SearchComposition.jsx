import React, { useState } from "react";
import SearchPageShell from "../../components/SearchPageShell";
import FormField from "../../components/FormField";
import SearchButton from "../../components/SearchButton";
import Alert from "../../components/Alert";
import { isValidGSTIN } from "../../utils/validators";
import PageContainer from "../../components/PageContainer";
import { CheckCircle2, ShieldCheck, Building2 } from "lucide-react";

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

const SearchComposition = () => {
    const [option, setOption] = useState("opt-out");
    const [searchType, setSearchType] = useState("gstin");
    const [gstin, setGstin] = useState("27AAAAA1234A1Z5");
    const [state, setState] = useState("Maharashtra");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!option) {
            setError("Please select Opt In or Opt Out.");
            return;
        }

        if (!searchType) {
            setError("Please choose GSTIN/UIN or State.");
            return;
        }

        if (searchType === "gstin" && gstin && !isValidGSTIN(gstin)) {
            setError("Please enter a valid 15-character GSTIN/UIN.");
            return;
        }

        if (searchType === "state" && !state) {
            setError("Please select a state.");
            return;
        }

        setError("");
        setLoading(true);
        setResult(null);

        await new Promise((resolve) => setTimeout(resolve, 600));

        setLoading(false);
        setResult({
            option: option === "opt-in" ? "Opted IN for Composition Scheme (CMP-02)" : "Opted OUT of Composition Scheme (Regular Taxpayer)",
            gstin: gstin.toUpperCase() || "27AAAAA1234A1Z5",
            legalName: "Ramesh Kumar",
            tradeName: "Nagpur Hardware & Sanitary Store",
            effectiveDate: "01 Apr 2026",
            financialYear: "FY 2026-27",
            status: "ACTIVE_VERIFIED"
        });
    };

    return (
        <PageContainer>
            <SearchPageShell
                title="Search Taxpayer"
                description="Find taxpayers who have opted in or opted out of the composition scheme."
                breadcrumbs={[
                    {
                        label: "Search Taxpayer",
                        href: "/search-taxpayer/gstin",
                    },
                    {
                        label: "Search Composition Taxpayer",
                    },
                ]}
            >
                <form onSubmit={handleSubmit} noValidate>
                    <div className="w-full max-w-2xl min-w-0">
                        <label
                            htmlFor="composition-option"
                            className="mb-2 block text-[0.95rem] font-semibold text-[#112f58]"
                        >
                            Opt In / Opt Out
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <select
                            id="composition-option"
                            value={option}
                            onChange={(event) => {
                                setOption(event.target.value);
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
                            <option value="opt-out">Opt Out (Regular Taxpayer)</option>
                            <option value="opt-in">Opt In (Composition Scheme)</option>
                        </select>
                    </div>

                    <div className="mt-7">
                        <p className="mb-3 text-[0.95rem] font-semibold text-[#112f58]">
                            Search using
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <label
                                className={`
                                  flex cursor-pointer items-center gap-3 rounded-md border
                                  px-4 py-3 text-sm font-medium transition-all
                                  ${searchType === "gstin"
                                          ? "border-[#315b91] bg-[#eef5fb] text-[#173f6b]"
                                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                      }
                                `}
                            >
                                <input
                                    type="radio"
                                    name="searchType"
                                    value="gstin"
                                    checked={searchType === "gstin"}
                                    onChange={() => {
                                        setSearchType("gstin");
                                        setError("");
                                    }}
                                    className="h-4 w-4 accent-[#315b91]"
                                />
                                GSTIN/UIN
                            </label>

                            <label
                                className={`
                                  flex cursor-pointer items-center gap-3 rounded-md border
                                  px-4 py-3 text-sm font-medium transition-all
                                  ${searchType === "state"
                                          ? "border-[#315b91] bg-[#eef5fb] text-[#173f6b]"
                                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                      }
                                `}
                            >
                                <input
                                    type="radio"
                                    name="searchType"
                                    value="state"
                                    checked={searchType === "state"}
                                    onChange={() => {
                                        setSearchType("state");
                                        setError("");
                                    }}
                                    className="h-4 w-4 accent-[#315b91]"
                                />
                                State
                            </label>
                        </div>
                    </div>

                    <div className="mt-7 max-w-2xl">
                        {searchType === "gstin" && (
                            <FormField
                                id="composition-gstin"
                                label="GSTIN/UIN"
                                required
                                value={gstin}
                                onChange={(event) => {
                                    setGstin(
                                        event.target.value
                                            .toUpperCase()
                                            .replace(/[^A-Z0-9]/g, "")
                                    );
                                    setError("");
                                }}
                                placeholder="Enter GSTIN/UIN"
                                maxLength={15}
                            />
                        )}

                        {searchType === "state" && (
                            <div>
                                <label
                                    htmlFor="composition-state"
                                    className="mb-2 block text-[0.95rem] font-semibold text-[#112f58]"
                                >
                                    Select State
                                    <span className="ml-1 text-red-500">*</span>
                                </label>

                                <select
                                    id="composition-state"
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
                                    {states.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-6 max-w-2xl">
                            <Alert type="error" title="Input Error" onClose={() => setError("")}>
                                {error}
                            </Alert>
                        </div>
                    )}

                    <div className="mt-6 flex w-full justify-stretch sm:mt-8 sm:justify-start">
                        <SearchButton loading={loading} />
                    </div>
                </form>

                {result && (
                    <div className="mt-6 w-full max-w-2xl min-w-0 overflow-hidden rounded-xl bg-white p-4 sm:mt-8 sm:rounded-2xl sm:p-6 shadow-sm border border-slate-200">
                        <div className="flex min-w-0 flex-col gap-3 border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="break-words text-lg font-bold text-[#071b30]">{result.tradeName}</h3>
                                <p className="break-words text-xs text-slate-500 font-mono">GSTIN: {result.gstin}</p>
                            </div>
                            <span className="inline-flex max-w-full w-fit items-center px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>{result.status}</span>
                            </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <p><strong>Composition Status:</strong> {result.option}</p>
                            <p><strong>Legal Name:</strong> {result.legalName}</p>
                            <p><strong>Effective Date:</strong> {result.effectiveDate} ({result.financialYear})</p>
                        </div>
                    </div>
                )}
            </SearchPageShell>
        </PageContainer>
    );
};

export default SearchComposition;