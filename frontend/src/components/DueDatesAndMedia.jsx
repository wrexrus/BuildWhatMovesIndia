import React, { useMemo, useState } from "react";
import { Download, Play } from "lucide-react";

// Reference "today" for this prototype — GST portal shows Aug 2026 dates.
const TODAY = new Date("2026-08-24");

const dueDates = [
  { form: "GSTR-3B", period: "Jul, 2026", due: "2026-08-20", cadence: "Monthly" },
  { form: "GSTR-1", period: "Jul, 2026", due: "2026-08-11", cadence: "Monthly" },
  { form: "IFF (Optional)", period: "Jul, 2026", due: "2026-08-13", cadence: "Monthly" },
  { form: "GSTR-3B", period: "Jul-Sep, 2026", due: "2026-10-22", cadence: "Quarterly" },
  { form: "GSTR-1", period: "Jul-Sep, 2026", due: "2026-10-13", cadence: "Quarterly" },
  { form: "CMP-08", period: "Jul-Sep, 2026", due: "2026-10-18", cadence: "Quarterly" },
  { form: "GSTR-5", period: "Jul, 2026", due: "2026-08-13", cadence: "Other" },
  { form: "GSTR-6", period: "Jul, 2026", due: "2026-08-13", cadence: "Other" },
  { form: "GSTR-7", period: "Jul, 2026", due: "2026-08-10", cadence: "Other" },
  { form: "GSTR-8", period: "Jul, 2026", due: "2026-08-10", cadence: "Other" },
];

const mediaItems = [
  { title: "Map-based geocoding in registration", date: "Mar 1, 2024" },
  { title: "Validate a digital signature on a downloaded document", date: "Feb 27, 2024" },
  { title: "Utilise Cash/ITC for payment of demand", date: "Feb 16, 2024" },
];

function urgency(dueDateStr) {
  const due = new Date(dueDateStr);
  const daysLeft = Math.ceil((due - TODAY) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { label: "Overdue", tone: "overdue", daysLeft };
  if (daysLeft <= 7) return { label: `${daysLeft}d left`, tone: "soon", daysLeft };
  return { label: `${daysLeft}d left`, tone: "upcoming", daysLeft };
}

const toneStyles = {
  overdue: "bg-red-50 text-red-700",
  soon: "bg-amber/15 text-[#8a5a00]",
  upcoming: "bg-navy/5 text-muted",
};

const DueDatesAndMedia = () => {
  const [activeTab, setActiveTab] = useState("Monthly");

  const rows = useMemo(
    () =>
      dueDates
        .filter((row) => row.cadence === activeTab)
        .map((row) => ({ ...row, ...urgency(row.due) }))
        .sort((a, b) => a.daysLeft - b.daysLeft),
    [activeTab]
  );

  return (
    <section className="bg-paper pb-14">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Upcoming due dates — a real table, sorted by urgency */}
        <div>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-[1.4rem] font-bold tracking-tight text-ink">Upcoming due dates</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[0.87rem] font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
            >
              <Download size={14} /> PDF
            </button>
          </div>

          <div className="rounded-lg border border-line bg-white">
            <div role="tablist" aria-label="Filing cadence" className="flex gap-1 border-b border-line p-1.5">
              {["Monthly", "Quarterly", "Other"].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-md px-3 py-2 text-[0.85rem] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 ${
                    activeTab === tab ? "bg-navy text-white" : "text-muted hover:bg-navy/5 hover:text-ink"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <table className="w-full border-collapse">
              <caption className="sr-only">
                GST filing due dates for the {activeTab.toLowerCase()} cadence
              </caption>
              <thead>
                <tr className="text-left text-[0.78rem] text-muted">
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Form
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Period
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Due date
                  </th>
                  <th scope="col" className="px-4 py-2.5 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr key={row.form + row.period} className="text-[0.87rem]">
                    <td className="px-4 py-3 font-semibold text-ink">{row.form}</td>
                    <td className="px-4 py-3 text-muted">{row.period}</td>
                    <td className="px-4 py-3 font-mono tabular-nums text-ink">
                      {new Date(row.due).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[0.75rem] font-medium ${toneStyles[row.tone]}`}>
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* GST media */}
        <div>
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-[1.4rem] font-bold tracking-tight text-ink">GST media</h2>
            <a
              href="#"
              className="text-[0.87rem] font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
            >
              View all
            </a>
          </div>

          <div className="grid gap-2.5">
            {mediaItems.map((item) => (
              <a
                key={item.title}
                href="#"
                className="group flex items-center gap-3 rounded-lg border border-line bg-white p-3 transition-colors hover:border-navy/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-white transition-colors group-hover:bg-navy-hover">
                  <Play size={14} className="fill-white" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.87rem] font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 font-mono text-[0.75rem] text-muted">{item.date}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DueDatesAndMedia;