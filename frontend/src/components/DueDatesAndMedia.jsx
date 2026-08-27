import React, { useMemo, useState } from "react";
import { Download, Play, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "../context/ToastContext";

const TODAY = new Date("2026-08-24");

const dueDates = [
  { form: "GSTR-1", period: "Jul, 2026", due: "2026-08-11", cadence: "Monthly" },
  { form: "IFF (Optional)", period: "Jul, 2026", due: "2026-08-13", cadence: "Monthly" },
  { form: "GSTR-3B", period: "Jul, 2026", due: "2026-08-20", cadence: "Monthly" },
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
  overdue: "bg-red-100 text-red-800 font-bold border border-red-200",
  soon: "bg-amber-100 text-amber-900 font-bold border border-amber-300",
  upcoming: "bg-navy/5 text-muted font-medium border border-slate-200",
};

const DueDatesAndMedia = () => {
  const [activeTab, setActiveTab] = useState("Monthly");
  const { showToast } = useToast() || {};

  const rows = useMemo(
    () =>
      dueDates
        .filter((row) => row.cadence === activeTab)
        .map((row) => ({ ...row, ...urgency(row.due) })),
    [activeTab]
  );

  const handleDownloadPdf = () => {
    if (showToast) {
      showToast("Downloading Official GST Return Due Dates Schedule...", "success");
    }

    const element = document.createElement("a");
    const content = `=======================================================\n` +
      `       OFFICIAL GST RETURN DUE DATES CALENDAR 2026      \n` +
      `=======================================================\n` +
      `Filing Cadence Category : ${activeTab.toUpperCase()}\n` +
      `Report Generated Date   : ${new Date().toLocaleDateString('en-IN')}\n` +
      `-------------------------------------------------------\n` +
      `Form Name          Period        Due Date     Filing Status\n` +
      `-------------------------------------------------------\n` +
      dueDates.map(d => `${d.form.padEnd(18)} ${d.period.padEnd(12)} ${new Date(d.due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).padEnd(12)} ${d.cadence}`).join('\n') +
      `\n-------------------------------------------------------\n` +
      `Note: Late filing incurs daily late fees under Section 47.\n` +
      `Goods and Services Tax Portal (gst.gov.in)\n`;

    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `GST_Return_Due_Dates_Calendar_${activeTab}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="w-full overflow-x-hidden bg-paper pb-10 font-sans sm:pb-14">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-7 px-4 py-1 sm:gap-8 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5">
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-[1.65rem]">Upcoming due dates</h2>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-1 text-[0.82rem] font-bold text-navy transition-colors hover:text-navy cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 sm:min-h-0 sm:text-[0.87rem]"
              title="Download PDF filing schedule"
            >
              <Download size={14} className="text-navy" /> PDF
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-white shadow-xs">
            <div role="tablist" aria-label="Filing cadence" className="flex gap-1 overflow-x-auto border-b border-line bg-slate-50 p-2">
              {["Monthly", "Quarterly", "Other"].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`min-w-[92px] flex-1 rounded-lg px-3 py-2.5 text-xs font-bold transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 ${
                    activeTab === tab ? "bg-navy text-white shadow-xs" : "text-slate-600 hover:bg-slate-200/60 hover:text-navy"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="w-full overflow-x-auto overscroll-x-contain">
              <table className="w-full min-w-[590px] border-collapse">
              <caption className="sr-only">
                GST filing due dates for the {activeTab.toLowerCase()} cadence
              </caption>
              <thead>
                <tr className="text-left text-xs text-slate-500 font-bold border-b border-line bg-slate-50/50">
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Form
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Period
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Due date
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row) => (
                  <tr key={row.form + row.period} className="text-[0.87rem] hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-navy">{row.form}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{row.period}</td>
                    <td className="px-5 py-3.5 font-mono tabular-nums text-slate-900 font-semibold">
                      {new Date(row.due).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-3 py-1 text-xs ${toneStyles[row.tone]}`}>
                        {row.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5">
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-[1.65rem]">GST media</h2>
            <a
              href="#"
              className="inline-flex min-h-10 items-center text-[0.82rem] font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
            >
              View all
            </a>
          </div>

          <div className="grid gap-2.5">
            {mediaItems.map((item) => (
              <a
                key={item.title}
                href="#"
                className="group flex min-w-0 items-center gap-3 rounded-lg border border-line bg-white p-3 transition-colors hover:border-navy/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy text-white transition-colors group-hover:bg-navy-hover">
                  <Play size={14} className="fill-white" />
                </span>
                <div className="min-w-0">
                  <p className="break-words text-[0.84rem] font-medium leading-snug text-ink sm:text-[0.87rem]">{item.title}</p>
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