import React, { useState } from "react";
import SearchPageShell from "../../components/SearchPageShell";
import FormField from "../../components/FormField";
import SearchButton from "../../components/SearchButton";
import { isValidPAN } from "../../utils/validators";
import PageContainer from "../../components/PageContainer";

const SearchPAN = () => {
    const [pan, setPan] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

        await new Promise((resolve) => setTimeout(resolve, 700));

        setLoading(false);

        console.log("Search PAN:", pan);
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
                    className="max-w-3xl"
                    noValidate
                >
                    <FormField
                        id="pan"
                        label="Permanent Account Number (PAN)"
                        required
                        value={pan}
                        onChange={handleChange}
                        error={error}
                        placeholder="Permanent Account Number (PAN)"
                        maxLength={10}
                    />

                    <div className="mt-8">
                        <SearchButton loading={loading} />
                    </div>
                </form>
            </SearchPageShell>
        </PageContainer>
    );
};

export default SearchPAN;