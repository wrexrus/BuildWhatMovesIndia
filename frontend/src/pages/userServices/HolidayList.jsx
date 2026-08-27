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
      <main className="min-h-[calc(100vh-150px)] min-w-0 overflow-x-hidden bg-[#f7f6f3] text-[#2f3437]">
        <Breadcrumbs
          items={[
            { label: "Services" },
            { label: "User Services" },
            { label: "Holiday List" },
          ]}
        />

        <div className="mx-auto w-full max-w-[1400px] min-w-0 px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8 lg:pt-8">
          <header className="min-w-0 border-b border-[#eaeaea] pb-6 sm:pb-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#1f6c9f]">
              User service
            </p>

            <h1 className="break-words text-xl font-semibold tracking-[-0.02em] text-[#20282d] sm:text-2xl md:text-[1.75rem]">
              Holiday list
            </h1>

            <p className="mt-3 max-w-[65ch] break-words text-sm leading-6 text-[#6f7375] sm:mt-4">
              View GST-related holidays by year and State or Union
              Territory.
            </p>
          </header>

          <section className="border-b border-[#eaeaea] py-6">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,180px)_minmax(0,260px)_auto] sm:items-end">
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
                  h-11 w-full rounded-[5px] sm:w-auto
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

          <div className="flex flex-col items-stretch gap-4 border-b py-5 sm:flex-row sm:items-center sm:justify-between border-[#eaeaea] py-5">
            <p className="text-sm text-[#6f7375]">
              {holidays.length} holiday
              {holidays.length !== 1 ? "s" : ""} available
              {state ? ` for ${state}` : ""}.
            </p>

            <div className="flex self-start border border-[#d9d9d7] sm:self-auto">
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

          {view === "list" && (
            <section className="pt-6">
              <div className="grid grid-cols-[minmax(105px,120px)_minmax(160px,1fr)_minmax(110px,140px)] overflow-x-auto border-y border-[#dcdcdc] bg-[#f1f0ed] px-4 py-3 text-xs font-semibold uppercase tracking-[0.05em] text-[#616567] sm:grid-cols-[180px_1fr_200px]">
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
                        grid w-full min-w-[340px] grid-cols-[minmax(120px,150px)_minmax(180px,1fr)]
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
                            grid min-w-[340px] grid-cols-[minmax(120px,150px)_minmax(180px,1fr)] gap-4
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

          {view === "calendar" && (
            <section className="pt-8">
              <div className="grid gap-px border border-[#eaeaea] bg-[#eaeaea] sm:grid-cols-2 lg:grid-cols-3">
                {holidays.map((holiday) => (
                  <article
                    key={holiday.date}
                    className="min-w-0 bg-white p-4 sm:p-5"
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