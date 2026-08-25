import React, { useState } from "react";
import SearchPageShell from "../../components/SearchPageShell";
import FormField from "../../components/FormField";
import SearchButton from "../../components/SearchButton";
import Alert from "../../components/Alert";
import { isValidGSTIN } from "../../utils/validators";
import PageContainer from "../../components/PageContainer";

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
    const [option, setOption] = useState("");
    const [searchType, setSearchType] = useState("");
    const [gstin, setGstin] = useState("");
    const [state, setState] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (searchType === "gstin" && !isValidGSTIN(gstin)) {
            setError("Please enter a valid 15-character GSTIN/UIN.");
            return;
        }

        if (searchType === "state" && !state) {
            setError("Please select a state.");
            return;
        }

        setError("");
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 700));

        setLoading(false);

        console.log({
            option,
            searchType,
            gstin,
            state,
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
                    {/* Composition status */}
                    <div className="max-w-2xl">
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
                            <option value="">Select</option>
                            <option value="opt-in">Opt In</option>
                            <option value="opt-out">Opt Out</option>
                        </select>
                    </div>

                    {/* Search method */}
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

                    {/* Conditional field */}
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
                                    <option value="">Select State</option>

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

                    <div className="mt-8 flex justify-start">
                        <SearchButton loading={loading} />
                    </div>
                </form>
            </SearchPageShell>
        </PageContainer>
    );
};

export default SearchComposition;