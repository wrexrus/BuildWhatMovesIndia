import React, { useState } from "react";
import SearchPageShell from "../../components/SearchPageShell";
import FormField from "../../components/FormField";
import SearchButton from "../../components/SearchButton";
import { isValidGSTIN } from "../../utils/validators";
import PageContainer from "../../components/PageContainer";

const SearchGSTIN = () => {
    const [gstin, setGstin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        // Replace with your backend request.
        await new Promise((resolve) => setTimeout(resolve, 700));

        setLoading(false);

        console.log("Search GSTIN:", gstin);
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
                        placeholder="Enter GSTIN/UIN of the Taxpayer"
                        maxLength={15}
                    />

                    <div className="mt-8">
                        <SearchButton loading={loading} />
                    </div>
                </form>
            </SearchPageShell>
        </PageContainer>
    );
};

export default SearchGSTIN;