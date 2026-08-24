import React from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../components/Breadcrumbs.jsx";
import PageContainer from "../components/PageContainer.jsx";

const centralResources = [
  {
    title: "CBIC",
    description:
      "Central GST Acts, rules, notifications and related legal resources.",
  },
];

const stateGroups = [
  {
    title: "North & North-East",
    states: [
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chandigarh",
      "Delhi",
      "Haryana",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Jharkhand",
      "Ladakh",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
    ],
  },
  {
    title: "West & Central",
    states: [
      "Chhattisgarh",
      "Dadra and Nagar Haveli",
      "Daman and Diu",
      "Goa",
      "Gujarat",
      "Madhya Pradesh",
      "Maharashtra",
    ],
  },
  {
    title: "South & East",
    states: [
      "Andaman and Nicobar Islands",
      "Andhra Pradesh",
      "Karnataka",
      "Kerala",
      "Lakshadweep",
      "Odisha",
      "Puducherry",
      "Tamil Nadu",
      "Telangana",
      "West Bengal",
    ],
  },
];

const GSTLaw = () => {
  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs items={[{ label: "GST Law" }]} />

        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          {/* Page introduction */}
          <header className="max-w-4xl border-b border-[#eaeaea] pb-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              Legal resources
            </p>

            <h1 className="text-4xl font-semibold tracking-[-0.035em] text-[#20282d] sm:text-[3rem]">
              GST Law
            </h1>

            <p className="mt-5 max-w-[62ch] text-base leading-7 text-[#6f7375]">
              Access Central, State and Union Territory GST legislation,
              rules, notifications and related legal information.
            </p>
          </header>

          {/* Central */}
          <section className="border-b border-[#eaeaea] py-12">
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Central
                </p>

                <h2 className="mt-2 text-lg font-semibold text-[#293238]">
                  Central GST
                </h2>
              </div>

              <div>
                {centralResources.map((resource) => (
                  <a
                    key={resource.title}
                    href="#"
                    className="group flex items-start justify-between gap-8 border-t border-[#eaeaea] py-5 transition-colors hover:bg-[#fbfbfa]"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-[#1f6c9f]">
                        {resource.title}
                      </h3>

                      <p className="mt-1.5 max-w-[60ch] text-sm leading-6 text-[#6f7375]">
                        {resource.description}
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="pt-0.5 text-lg text-[#9a9c9d] transition-transform group-hover:translate-x-1 group-hover:text-[#1f6c9f]"
                    >
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* States */}
          <section className="border-b border-[#eaeaea] py-12">
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  State & UT
                </p>

                <h2 className="mt-2 text-lg font-semibold text-[#293238]">
                  State GST resources
                </h2>

                <p className="mt-3 max-w-xs text-sm leading-6 text-[#6f7375]">
                  Select the relevant State or Union Territory.
                </p>
              </div>

              <div className="divide-y divide-[#eaeaea]">
                {stateGroups.map((group) => (
                  <section
                    key={group.title}
                    className="py-7 first:pt-0"
                  >
                    <div className="mb-4 flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-[#454b4f]">
                        {group.title}
                      </h3>

                      <span className="text-xs text-[#999b9c]">
                        {group.states.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                      {group.states.map((state) => (
                        <a
                          key={state}
                          href="#"
                          className="
                            group
                            flex items-center justify-between
                            border-b border-transparent
                            py-2.5
                            text-sm
                            text-[#1f6c9f]
                            transition-colors
                            hover:border-[#eaeaea]
                            hover:text-[#18587f]
                          "
                        >
                          <span>{state}</span>

                          <span
                            aria-hidden="true"
                            className="text-[#a3a5a6] transition-transform group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </a>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </section>

          {/* Reference links */}
          <section className="pt-12">
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#787774]">
                  Reference
                </p>

                <h2 className="mt-2 text-lg font-semibold text-[#293238]">
                  GST framework
                </h2>
              </div>

              <div className="grid border-t border-[#eaeaea] sm:grid-cols-2">
                {[
                  "Central Goods and Services Tax Act, 2017",
                  "State Goods and Services Tax Acts, 2017",
                  "Union Territory Goods and Services Tax Act, 2017",
                  "Integrated Goods and Services Tax Act, 2017",
                  "GST Compensation to States legislation",
                  "Rules, notifications, amendments and circulars",
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="
                      group
                      flex items-center justify-between
                      border-b border-[#eaeaea]
                      py-5
                      pr-6
                      text-sm
                      text-[#40474b]
                      transition-colors
                      hover:bg-[#fbfbfa]
                      hover:text-[#1f6c9f]
                    "
                  >
                    <span>{item}</span>

                    <span
                      aria-hidden="true"
                      className="ml-5 shrink-0 text-[#a3a5a6] transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </PageContainer>
  );
};

export default GSTLaw;