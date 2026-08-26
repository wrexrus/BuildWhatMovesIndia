import React, { useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const states = [
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Uttar Pradesh",
];

const districts = [
  "Ahmedabad",
  "Bengaluru Urban",
  "Chennai",
  "Delhi",
  "Hyderabad",
  "Jaipur",
  "Mumbai",
  "Pune",
];

const LocateGSTP = () => {
  const [mode, setMode] = useState("id");

  const [gstpId, setGstpId] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pincode, setPincode] = useState("");

  const handleModeChange = (nextMode) => {
    setMode(nextMode);

    setGstpId("");
    setName("");
    setState("");
    setDistrict("");
    setPincode("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log({
      mode,
      gstpId,
      name,
      state,
      district,
      pincode,
    });
  };

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "User Services" },
            { label: "Locate GST Practitioner (GSTP)" },
          ]}
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          <header className="border-b border-[#eaeaea] pb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              User service
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#20282d] sm:text-4xl">
              Locate GST Practitioner
            </h1>

            <p className="mt-4 max-w-[65ch] text-sm leading-6 text-[#6f7375]">
              Find a GST Practitioner using an enrolment or GSTP ID,
              or search by name and location.
            </p>
          </header>

          <section className="pt-10">
            <div className="grid gap-3 border-b border-[#eaeaea] pb-6 md:grid-cols-2">
              <button
                type="button"
                onClick={() => handleModeChange("id")}
                className={`
                  flex items-start gap-3
                  border px-4 py-4
                  text-left
                  transition-colors
                  ${
                    mode === "id"
                      ? "border-[#1f6c9f] bg-[#f4f9fc]"
                      : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                  }
                `}
              >
                <span
                  className={`
                    mt-1 h-3 w-3 border
                    ${
                      mode === "id"
                        ? "border-[#1f6c9f] bg-[#1f6c9f]"
                        : "border-[#9b9d9e]"
                    }
                  `}
                />

                <span>
                  <span className="block text-sm font-semibold text-[#293238]">
                    Enrolment Number / GSTP ID
                  </span>

                  <span className="mt-1 block text-xs text-[#787774]">
                    Search using the practitioner's identifier.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange("area")}
                className={`
                  flex items-start gap-3
                  border px-4 py-4
                  text-left
                  transition-colors
                  ${
                    mode === "area"
                      ? "border-[#1f6c9f] bg-[#f4f9fc]"
                      : "border-[#eaeaea] bg-white hover:bg-[#fbfbfa]"
                  }
                `}
              >
                <span
                  className={`
                    mt-1 h-3 w-3 border
                    ${
                      mode === "area"
                        ? "border-[#1f6c9f] bg-[#1f6c9f]"
                        : "border-[#9b9d9e]"
                    }
                  `}
                />

                <span>
                  <span className="block text-sm font-semibold text-[#293238]">
                    Name / Area
                  </span>

                  <span className="mt-1 block text-xs text-[#787774]">
                    Search using practitioner and location details.
                  </span>
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="pt-8">
              {mode === "id" ? (
                <div className="max-w-2xl">
                  <label
                    htmlFor="gstpId"
                    className="mb-2 block text-sm font-medium text-[#394247]"
                  >
                    Enrolment Number / GSTP ID
                    <span className="ml-1 text-[#9f2f2d]">*</span>
                  </label>

                  <div className="flex gap-3">
                    <input
                      id="gstpId"
                      value={gstpId}
                      onChange={(event) =>
                        setGstpId(event.target.value)
                      }
                      placeholder="Enter Enrolment Number / GSTP ID"
                      className="
                        h-12 flex-1
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        placeholder:text-[#a2a4a5]
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />

                    <button
                      type="submit"
                      className="
                        h-12 rounded-[5px]
                        bg-[#22282d]
                        px-7
                        text-sm font-medium
                        text-white
                        hover:bg-[#333a40]
                      "
                    >
                      Search
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-x-6 gap-y-7 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label
                      htmlFor="gstp-name"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Name
                    </label>

                    <input
                      id="gstp-name"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter name of GSTP"
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        placeholder:text-[#a2a4a5]
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="gstp-state"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      State
                      <span className="ml-1 text-[#9f2f2d]">*</span>
                    </label>

                    <select
                      id="gstp-state"
                      value={state}
                      onChange={(event) =>
                        setState(event.target.value)
                      }
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
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
                      htmlFor="gstp-district"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      District
                    </label>

                    <select
                      id="gstp-district"
                      value={district}
                      onChange={(event) =>
                        setDistrict(event.target.value)
                      }
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    >
                      <option value="">Select</option>

                      {districts.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="gstp-pincode"
                      className="mb-2 block text-sm font-medium text-[#394247]"
                    >
                      Pincode
                    </label>

                    <input
                      id="gstp-pincode"
                      value={pincode}
                      onChange={(event) =>
                        setPincode(
                          event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      placeholder="Enter Pincode"
                      className="
                        h-12 w-full
                        border border-[#d9d9d7]
                        bg-white px-3
                        text-sm
                        placeholder:text-[#a2a4a5]
                        outline-none
                        focus:border-[#1f6c9f]
                      "
                    />
                  </div>

                  <div className="lg:col-span-4 flex justify-end border-t border-[#eaeaea] pt-6">
                    <button
                      type="submit"
                      className="
                        rounded-[5px]
                        bg-[#22282d]
                        px-7 py-3
                        text-sm font-medium
                        text-white
                        hover:bg-[#333a40]
                      "
                    >
                      Search
                    </button>
                  </div>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default LocateGSTP;