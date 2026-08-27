import React, { useMemo, useState } from "react";
import { ArrowUpRight, MessageCircleQuestion, Phone, Search } from "lucide-react";

const newsItems = [
  { title: "Gross and Net GST revenue collections for July, 2026", date: "Aug 1, 2026", tag: "Revenue" },
  { title: "Advisory on keeping the proposed e-Way Bill enhancements on hold", date: "Jul 29, 2026", tag: "e-Way Bill" },
  { title: "Enablement of GSTR-9 and GSTR-9C filing for FY 2025-26", date: "Jun 18, 2026", tag: "Returns" },
  { title: "Revision of timeline for amendment of Aggregate Annual Turnover", date: "Jul 1, 2026", tag: "Returns" },
];

const helpTopics = [
  "Register with GST",
  "Apply for a refund",
  "File returns",
  "Use the Returns Offline Tool",
  "File an appeal",
  "File a voluntary payment intimation",
  "Correct a filed return",
  "Reset a forgotten password",
];

const categories = ["All", ...new Set(newsItems.map((item) => item.tag))];

const NewsAndHelp = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredNews =
    activeCategory === "All" ? newsItems : newsItems.filter((item) => item.tag === activeCategory);

  const filteredTopics = useMemo(
    () => helpTopics.filter((topic) => topic.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <section className="w-full overflow-x-hidden bg-paper">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-7 px-4 py-10 sm:gap-8 sm:px-6 sm:py-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-[1.65rem]">Latest updates</h2>
            <a
              href="#"
              className="group inline-flex min-h-10 items-center gap-1 text-[0.82rem] font-medium text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
            >
              View all
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div role="tablist" aria-label="Filter updates by category" className="mb-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`min-h-9 rounded-full px-3 py-1.5 text-[0.78rem] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 ${
                  activeCategory === cat
                    ? "bg-navy text-white"
                    : "border border-line bg-white text-muted hover:border-navy/25 hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-3">
            {filteredNews.length === 0 ? (
              <p className="rounded-lg border border-dashed border-line p-6 text-center text-[0.87rem] text-muted">
                No updates in this category yet.
              </p>
            ) : (
              filteredNews.map((item) => (
                <a
                  key={item.title}
                  href="#"
                  className="group min-w-0 rounded-lg border border-line bg-white p-3.5 sm:p-4 transition-colors hover:border-navy/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                >
                  <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-4">
                    <p className="min-w-0 break-words font-semibold leading-snug text-ink group-hover:text-navy">{item.title}</p>
                    <span className="max-w-full shrink-0 rounded-full bg-navy/5 px-2.5 py-1 text-[0.72rem] font-medium text-navy">
                      {item.tag}
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[0.78rem] tabular-nums text-muted">{item.date}</p>
                </a>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-ink sm:text-[1.65rem]">Popular help topics</h2>

          <label className="relative mb-4 block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search help topics"
              className="w-full min-h-11 rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-[0.87rem] text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
            />
          </label>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {filteredTopics.length === 0 ? (
              <p className="col-span-full rounded-lg border border-dashed border-line p-6 text-center text-[0.87rem] text-muted">
                No topics match "{query}".
              </p>
            ) : (
              filteredTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="flex min-w-0 min-h-12 items-start gap-2.5 rounded-lg border border-line bg-white p-3.5 text-left transition-colors hover:border-navy/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2"
                >
                  <MessageCircleQuestion size={16} className="mt-0.5 shrink-0 text-navy" />
                  <span className="break-words text-[0.84rem] leading-snug text-ink sm:text-[0.87rem]">{topic}</span>
                </button>
              ))
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-lg bg-navy-hover p-3.5 sm:p-4 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <Phone size={16} />
              <div>
                <p className="text-[0.75rem] text-white/70">Help desk</p>
                <p className="font-mono text-[0.95rem] font-bold tabular-nums">1800-103-4786</p>
              </div>
            </div>
            <a
              href="#"
              className="inline-flex min-h-10 items-center gap-1 self-start rounded bg-white/10 px-3 py-1.5 text-[0.83rem] font-medium transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-2 sm:self-auto"
            >
              Grievance redressal <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsAndHelp;