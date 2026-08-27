import React, { useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const SearchHSNCode = () => {
  const [searchBy, setSearchBy] = useState("hsn");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const isHSN = searchBy === "hsn";

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!query.trim()) {
      setError(
        isHSN
          ? "Enter an HSN chapter or code."
          : "Enter a goods or service description."
      );
      return;
    }

    setError("");

    console.log({
      searchBy,
      query,
    });
  };

  const handleModeChange = (mode) => {
    setSearchBy(mode);
    setQuery("");
    setError("");
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] min-w-0 overflow-x-hidden bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "User Services" },
            { label: "Search HSN Code" },
          ]}
        />

        <div className="mx-auto w-full max-w-[1400px] min-w-0 px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8 lg:pt-8">
          <header className="w-full max-w-4xl min-w-0 border-b border-[#eaeaea] pb-6 sm:pb-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              User service
            </p>

            <h1 className="break-words text-xl font-semibold tracking-[-0.02em] text-[#20282d] sm:text-2xl md:text-[1.75rem]">
              Search HSN Code
            </h1>

            <p className="mt-3 max-w-[65ch] break-words text-sm leading-6 text-[#6f7375] sm:mt-4">
              Find an HSN classification using a chapter/code or a
              description of the goods or service.
            </p>
          </header>

          <section className="w-full max-w-4xl min-w-0 pt-6 sm:pt-8">
            <form onSubmit={handleSubmit} noValidate>
              <fieldset>
                <legend className="text-sm font-semibold text-[#293238]">
                  Search by
                  <span className="ml-1 text-[#9f2f2d]">*</span>
                </legend>

                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
                  <label
                    className={`
                      flex w-full cursor-pointer items-center gap-3 border px-4 py-3 sm:w-auto
                      text-sm
                      transition-colors
                      ${
                        isHSN
                          ? "border-[#1f6c9f] bg-[#f4f9fc] text-[#263c49]"
                          : "border-[#eaeaea] bg-white text-[#4f5558]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="searchBy"
                      checked={isHSN}
                      onChange={() =>
                        handleModeChange("hsn")
                      }
                      className="accent-[#1f6c9f]"
                    />

                    HSN
                  </label>

                  <label
                    className={`
                      flex w-full cursor-pointer items-center gap-3 border px-4 py-3 sm:w-auto
                      text-sm
                      transition-colors
                      ${
                        !isHSN
                          ? "border-[#1f6c9f] bg-[#f4f9fc] text-[#263c49]"
                          : "border-[#eaeaea] bg-white text-[#4f5558]"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="searchBy"
                      checked={!isHSN}
                      onChange={() =>
                        handleModeChange("description")
                      }
                      className="accent-[#1f6c9f]"
                    />

                    Description
                  </label>
                </div>
              </fieldset>

              <div className="mt-8">
                <label
                  htmlFor="hsn-query"
                  className="mb-2 block text-sm font-medium text-[#394247]"
                >
                  {isHSN
                    ? "Search HSN Chapter by Code"
                    : "Search by Description"}
                  <span className="ml-1 text-[#9f2f2d]">
                    *
                  </span>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="hsn-query"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setError("");
                    }}
                    placeholder={
                      isHSN
                        ? "Search HSN chapter by digits"
                        : "Enter goods or service description"
                    }
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

                  <button
                    type="submit"
                    className="
                      h-12 w-full rounded-[5px] sm:w-auto
                      bg-[#22282d]
                      px-7
                      text-sm
                      font-medium
                      text-white
                      transition-colors
                      hover:bg-[#333a40]
                      active:scale-[0.98]
                    "
                  >
                    Search
                  </button>
                </div>

                {error && (
                  <p className="mt-1.5 text-xs text-[#9f2f2d]">
                    {error}
                  </p>
                )}
              </div>
            </form>

            <div className="mt-8 border-t border-[#eaeaea] pt-6 sm:mt-10 sm:pt-7">
              <a
                href="#"
                className="
                  text-sm
                  font-medium
                  text-[#1f6c9f]
                  underline
                  decoration-[#b9d4e4]
                  underline-offset-4
                  hover:text-[#18587f]
                "
              >
                Download HSN Directory in Excel format
              </a>

              <div className="mt-7 border-l-2 border-[#f0cfcf] pl-4">
                <p className="text-sm leading-6 text-[#50565a]">
                  <strong className="text-[#9f2f2d]">
                    Note:
                  </strong>{" "}
                  If a valid HSN is unavailable through this service,
                  raise a ticket through the GST self-service portal.
                </p>

                <a
                  href="https://selfservice.gstsystem.in/"
                  className="mt-1 inline-block text-sm text-[#1f6c9f] underline underline-offset-4"
                >
                  GST Self-Service Portal
                </a>
              </div>

              <details className="mt-8 border-t border-[#eaeaea] pt-5">
                <summary className="cursor-pointer text-sm font-semibold text-[#394247]">
                  Search HSN disclaimer
                </summary>

                <div className="mt-5 space-y-4 text-sm leading-6 text-[#6f7375]">
                  <p>
                    The Search HSN facility uses matching logic linked
                    with e-invoice related data to provide relevant
                    HSN or description suggestions.
                  </p>

                  <p>
                    Technical and trade descriptions shown by the
                    facility are intended to assist taxpayers and
                    should not be treated as legal advice.
                  </p>

                  <p>
                    Users should verify the applicability and legal
                    treatment of a classification before using it for
                    compliance purposes.
                  </p>
                </div>
              </details>
            </div>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default SearchHSNCode;