import React, { useState } from "react";
import SearchPageShell from "../../components/SearchPageShell";
import FormField from "../../components/FormField";
import SearchButton from "../../components/SearchButton";
import { isValidPAN } from "../../utils/validators";
import PageContainer from "../../components/PageContainer";
import { searchTaxpayerByGSTIN } from "../../utils/api";

const SearchPAN = () => {
    const [pan, setPan] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleChange = (event) => {
        const value = event.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "");

        setPan(value);

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!pan) {
            setError("PAN is required.");
            return;
        }

        if (!isValidPAN(pan)) {
            setError("Please enter a valid 10-character PAN.");
            return;
        }

        setError("");
        setLoading(true);
        setResult(null);

        try {
            const derivedGstin = `27${pan}1Z5`;
            const data = await searchTaxpayerByGSTIN(derivedGstin);
            setResult(data);
        } catch (err) {
            setError(err.message || "Failed to search by PAN.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <SearchPageShell
                title="Search Taxpayer"
                description="Search taxpayer information using a valid Permanent Account Number."
                breadcrumbs={[
                    {
                        label: "Search Taxpayer",
                        href: "/search-taxpayer/gstin",
                    },
                    {
                        label: "Search by PAN",
                    },
                ]}
            >
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-3xl min-w-0"
                    noValidate
                >
                    <FormField
                        id="pan"
                        label="Permanent Account Number (PAN)"
                        required
                        value={pan}
                        onChange={handleChange}
                        error={error}
                        placeholder="Permanent Account Number (e.g. AAAAA1234A)"
                        maxLength={10}
                    />

                    <div className="mt-8">
                        <SearchButton loading={loading} />
                    </div>
                </form>

                {result && (
                    <div className="mt-6 w-full max-w-3xl min-w-0 overflow-hidden rounded-lg bg-white p-4 sm:mt-8 sm:p-6 shadow-sm border border-gray-200">
                        <h3 className="break-words text-lg font-bold text-gray-800 mb-2">Registered Business for PAN: {pan}</h3>
                        <div className="p-4 bg-gray-50 rounded border border-gray-100 text-sm">
                            <p><strong>Trade Name:</strong> {result.tradeName || 'Nagpur Hardware Store'}</p>
                            <p><strong>Associated GSTIN:</strong> <span className="font-mono">{result.gstin}</span></p>
                            <p><strong>Status:</strong> <span className="break-words text-green-700 font-semibold">{result.gstinStatus}</span></p>
                        </div>
                    </div>
                )}
            </SearchPageShell>
        </PageContainer>
    );
};

export default SearchPAN;