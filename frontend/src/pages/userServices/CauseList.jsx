import React, { useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const authorities = [
  "Authority for Advance Ruling",
  "Appellate Authority for Advance Ruling",
  "High Court",
];

const states = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Uttar Pradesh",
];

const jurisdictions = [
  "Central",
  "State",
];

const CauseList = () => {
  const [authority, setAuthority] = useState("");
  const [state, setState] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log({
      authority,
      state,
      jurisdiction,
      date,
    });
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "User Services" },
            { label: "Cause List" },
          ]}
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          <header className="border-b border-[#eaeaea] pb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              User service
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#20282d] sm:text-4xl">
              Cause list
            </h1>

            <p className="mt-4 max-w-[65ch] text-sm leading-6 text-[#6f7375]">
              Find scheduled hearings and matters using authority,
              State, jurisdiction and date.
            </p>
          </header>

          <section className="pt-10">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-x-8 gap-y-7 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="authority"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    Type of authority
                    <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <select
                    id="authority"
                    value={authority}
                    onChange={(event) =>
                      setAuthority(event.target.value)
                    }
                    className="
                      h-12 w-full border border-[#d9d9d7]
                      bg-white px-3 text-sm
                      outline-none
                      focus:border-[#1f6c9f]
                    "
                  >
                    <option value="">Select</option>

                    {authorities.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    State
                    <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <select
                    id="state"
                    value={state}
                    onChange={(event) =>
                      setState(event.target.value)
                    }
                    className="
                      h-12 w-full border border-[#d9d9d7]
                      bg-white px-3 text-sm
                      outline-none
                      focus:border-[#1f6c9f]
                    "
                  >
                    <option value="">Select</option>

                    {states.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="jurisdiction"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    Jurisdiction
                  </label>

                  <select
                    id="jurisdiction"
                    value={jurisdiction}
                    onChange={(event) =>
                      setJurisdiction(event.target.value)
                    }
                    className="
                      h-12 w-full border border-[#d9d9d7]
                      bg-white px-3 text-sm
                      outline-none
                      focus:border-[#1f6c9f]
                    "
                  >
                    <option value="">Select</option>

                    {jurisdictions.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cause-date"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    Date
                  </label>

                  <input
                    id="cause-date"
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(event.target.value)
                    }
                    className="
                      h-12 w-full border border-[#d9d9d7]
                      bg-white px-3 text-sm
                      outline-none
                      focus:border-[#1f6c9f]
                    "
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end border-t border-[#eaeaea] pt-6">
                <button
                  type="submit"
                  className="
                    rounded-[5px]
                    bg-[#22282d]
                    px-7 py-3
                    text-sm font-medium
                    text-white
                    transition-colors
                    hover:bg-[#333a40]
                  "
                >
                  Search
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default CauseList;