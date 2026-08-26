import React, { useMemo, useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs.jsx";
import PageContainer from "../../components/PageContainer.jsx";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const sampleHolidays = [
  {
    date: "2026-01-26",
    month: "January",
    day: "Monday",
    description: "Republic Day",
    region: "Central",
  },
  {
    date: "2026-03-04",
    month: "March",
    day: "Wednesday",
    description: "Holi",
    region: "Central",
  },
  {
    date: "2026-08-15",
    month: "August",
    day: "Saturday",
    description: "Independence Day",
    region: "Central",
  },
  {
    date: "2026-10-02",
    month: "October",
    day: "Friday",
    description: "Gandhi Jayanti",
    region: "Central",
  },
];

const states = [
  "Central",
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Tamil Nadu",
  "Uttar Pradesh",
];

const HolidayList = () => {
  const [year, setYear] = useState("2026");
  const [state, setState] = useState("");
  const [view, setView] = useState("list");
  const [expandedMonth, setExpandedMonth] = useState(null);

  const holidays = useMemo(() => {
    if (!state) return sampleHolidays;

    return sampleHolidays.filter(
      (holiday) => holiday.region === state
    );
  }, [state]);

  const grouped = months.map((month) => ({
    month,
    items: holidays.filter(
      (holiday) => holiday.month === month
    ),
  }));

  return (
    <PageContainer>
      <main className="min-h-[calc(100vh-150px)] bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "User Services" },
            { label: "Holiday List" },
          ]}
        />

        <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 sm:px-8 lg:px-10">
          <header className="border-b border-[#eaeaea] pb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              User service
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#20282d] sm:text-4xl">
              Holiday list
            </h1>

            <p className="mt-4 max-w-[65ch] text-sm leading-6 text-[#6f7375]">
              View GST-related holidays by year and State or Union
              Territory.
            </p>
          </header>

          {/* Filters */}
          <section className="border-b border-[#eaeaea] py-8">
            <div className="grid gap-5 sm:grid-cols-[180px_260px_auto] sm:items-end">
              <div>
                <label
                  htmlFor="holiday-year"
                  className="mb-2 block text-sm font-medium text-[#394247]"
                >
                  Year
                </label>

                <select
                  id="holiday-year"
                  value={year}
                  onChange={(event) =>
                    setYear(event.target.value)
                  }
                  className="
                    h-11
                    w-full
                    border
                    border-[#d9d9d7]
                    bg-white
                    px-3
                    text-sm
                    outline-none
                    focus:border-[#1f6c9f]
                  "
                >
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="holiday-state"
                  className="mb-2 block text-sm font-medium text-[#394247]"
                >
                  State / Centre
                </label>

                <select
                  id="holiday-state"
                  value={state}
                  onChange={(event) =>
                    setState(event.target.value)
                  }
                  className="
                    h-11
                    w-full
                    border
                    border-[#d9d9d7]
                    bg-white
                    px-3
                    text-sm
                    outline-none
                    focus:border-[#1f6c9f]
                  "
                >
                  <option value="">All locations</option>

                  {states.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="
                  h-11
                  rounded-[5px]
                  bg-[#22282d]
                  px-7
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-[#333a40]
                "
              >
                Apply filters
              </button>
            </div>
          </section>

          {/* View controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eaeaea] py-5">
            <p className="text-sm text-[#6f7375]">
              {holidays.length} holiday
              {holidays.length !== 1 ? "s" : ""} available
              {state ? ` for ${state}` : ""}.
            </p>

            <div className="flex border border-[#d9d9d7]">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`
                  px-4
                  py-2
                  text-sm
                  ${
                    view === "list"
                      ? "bg-[#22282d] text-white"
                      : "bg-white text-[#555b5e]"
                  }
                `}
              >
                List
              </button>

              <button
                type="button"
                onClick={() => setView("calendar")}
                className={`
                  border-l border-[#d9d9d7]
                  px-4
                  py-2
                  text-sm
                  ${
                    view === "calendar"
                      ? "bg-[#22282d] text-white"
                      : "bg-white text-[#555b5e]"
                  }
                `}
              >
                Calendar
              </button>
            </div>
          </div>

          {/* List */}
          {view === "list" && (
            <section className="pt-6">
              <div className="grid grid-cols-[150px_1fr_180px] border-y border-[#dcdcdc] bg-[#f1f0ed] px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#616567] sm:grid-cols-[180px_1fr_200px]">
                <span>Date</span>
                <span>Description</span>
                <span>State / Centre</span>
              </div>

              <div>
                {grouped.map((group) => (
                  <div key={group.month} className="border-b border-[#eaeaea]">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedMonth(
                          expandedMonth === group.month
                            ? null
                            : group.month
                        )
                      }
                      className="
                        grid
                        w-full
                        grid-cols-[150px_1fr]
                        items-center
                        px-4
                        py-4
                        text-left
                        transition-colors
                        hover:bg-[#fbfbfa]
                        sm:grid-cols-[180px_1fr]
                      "
                    >
                      <span className="text-sm font-semibold text-[#293238]">
                        {group.month}
                      </span>

                      <span className="text-xs text-[#8a8d8f]">
                        {group.items.length}{" "}
                        {group.items.length === 1
                          ? "holiday"
                          : "holidays"}
                        <span className="ml-3">
                          {expandedMonth === group.month
                            ? "−"
                            : "+"}
                        </span>
                      </span>
                    </button>

                    {expandedMonth === group.month &&
                      group.items.map((holiday) => (
                        <div
                          key={holiday.date}
                          className="
                            grid
                            grid-cols-[150px_1fr]
                            gap-4
                            border-t
                            border-[#eaeaea]
                            bg-white
                            px-4
                            py-4
                            sm:grid-cols-[180px_1fr_200px]
                          "
                        >
                          <div className="text-sm text-[#394247]">
                            {holiday.date}
                            <span className="ml-2 text-xs text-[#8a8d8f]">
                              {holiday.day}
                            </span>
                          </div>

                          <div className="text-sm text-[#454b4f]">
                            {holiday.description}
                          </div>

                          <div className="text-sm text-[#6f7375]">
                            {holiday.region}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Calendar */}
          {view === "calendar" && (
            <section className="pt-8">
              <div className="grid gap-px border border-[#eaeaea] bg-[#eaeaea] sm:grid-cols-2 lg:grid-cols-3">
                {holidays.map((holiday) => (
                  <article
                    key={holiday.date}
                    className="bg-white p-5"
                  >
                    <p className="font-mono text-xs text-[#8a8d8f]">
                      {holiday.date}
                    </p>

                    <h3 className="mt-4 text-base font-semibold text-[#293238]">
                      {holiday.description}
                    </h3>

                    <p className="mt-2 text-sm text-[#6f7375]">
                      {holiday.day} · {holiday.region}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </PageContainer>
  );
};

export default HolidayList;