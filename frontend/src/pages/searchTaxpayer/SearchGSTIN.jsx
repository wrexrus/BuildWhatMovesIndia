import React, { useState } from "react";
import SearchPageShell from "../../components/SearchPageShell";
import FormField from "../../components/FormField";
import SearchButton from "../../components/SearchButton";
import { isValidGSTIN } from "../../utils/validators";
import PageContainer from "../../components/PageContainer";
import { searchTaxpayerByGSTIN, trackReturnsByGSTIN } from "../../utils/api";

const SearchGSTIN = () => {
    const [gstin, setGstin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [filingHistory, setFilingHistory] = useState([]);

    const handleChange = (event) => {
        const value = event.target.value
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "");

        setGstin(value);

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!gstin) {
            setError("GSTIN/UIN is required.");
            return;
        }

        if (!isValidGSTIN(gstin)) {
            setError("Please enter a valid 15-character GSTIN/UIN.");
            return;
        }

        setError("");
        setLoading(true);
        setResult(null);
        setFilingHistory([]);

        try {
            const data = await searchTaxpayerByGSTIN(gstin);
            setResult(data);

            const returnsData = await trackReturnsByGSTIN(gstin);
            if (returnsData && returnsData.filingHistory) {
                setFilingHistory(returnsData.filingHistory);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch taxpayer details from backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer>
            <SearchPageShell
                title="Search Taxpayer"
                description="Find taxpayer registration and compliance information using a valid GSTIN or UIN."
                breadcrumbs={[
                    {
                        label: "Search Taxpayer",
                        href: "/search-taxpayer/gstin",
                    },
                    {
                        label: "Search by GSTIN/UIN",
                    },
                ]}
            >
                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl"
                    noValidate
                >
                    <FormField
                        id="gstin"
                        label="GSTIN/UIN of the Taxpayer"
                        required
                        value={gstin}
                        onChange={handleChange}
                        error={error}
                        placeholder="Enter GSTIN/UIN of the Taxpayer (e.g. 27AAAAA1234A1Z5)"
                        maxLength={15}
                    />

                    <div className="mt-8">
                        <SearchButton loading={loading} />
                    </div>
                </form>

                {/* Connected Backend Results Card */}
                {result && (
                    <div className="mt-8 max-w-3xl bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4 border-b pb-3 border-gray-100">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{result.tradeName || result.legalName}</h3>
                                <p className="text-sm text-gray-500 font-mono">GSTIN: {result.gstin}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                result.gstinStatus === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                                {result.gstinStatus}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
                            <div>
                                <span className="font-semibold text-gray-500 block text-xs">Legal Name</span>
                                <span>{result.legalName}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block text-xs">Taxpayer Type</span>
                                <span>{result.taxpayerType || 'Regular'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block text-xs">State Jurisdiction</span>
                                <span>{result.stateJurisdiction || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-500 block text-xs">Constitution of Business</span>
                                <span>{result.constitutionOfBusiness || 'Proprietorship'}</span>
                            </div>
                        </div>

                        {/* Return Filing History Table */}
                        {filingHistory && filingHistory.length > 0 && (
                            <div className="mt-6 border-t border-gray-100 pt-4">
                                <h4 className="text-sm font-bold text-gray-700 mb-3">Recent Return Filing History</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs text-left text-gray-600">
                                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                                            <tr>
                                                <th className="px-3 py-2">Return Period</th>
                                                <th className="px-3 py-2">Form</th>
                                                <th className="px-3 py-2">Filing Date</th>
                                                <th className="px-3 py-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filingHistory.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-3 py-2 font-mono">{item.period}</td>
                                                    <td className="px-3 py-2 font-semibold text-blue-600">{item.form}</td>
                                                    <td className="px-3 py-2">{item.filingDate || 'Pending'}</td>
                                                    <td className="px-3 py-2 font-semibold">{item.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </SearchPageShell>
        </PageContainer>
    );
};

export default SearchGSTIN;