import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const newsItems = [
  {
    id: 1,
    month: "August 2026",
    title:
      "Gross and Net GST revenue collections for the month of July, 2026",
    description:
      "Please click on the link below to view the gross and net GST revenue collections for the month of July, 2026. Thanks, Team GSTN",
    date: "Aug 1st, 2026",
    category: "OTHERS",
  },

  {
    id: 2,
    month: "July 2026",
    title: "Advisory on Keeping on Hold the Proposed e-Way Bill Enhancements",
    description:
      "GSTN had earlier issued advisories dated 9th June 2026 and 17th June 2026 regarding certain proposed enhancements to the e-Way Bill system, with the scheduled date of implementation as 1st August 2026. Detailed FAQs relating to these enhancements were also issued on 2nd July 2026. It is hereby informed that the implementation of the above-mentioned enhancements has been kept on hold until further notice.",
    date: "Jul 29th, 2026",
    category: "E-WAY BILL",
  },

  {
    id: 3,
    month: "July 2026",
    title:
      "Advisory on Revision of Timeline for Amendment of Aggregate Annual Turnover (AATO), 2026",
    description:
      "It is informed that the Aggregate Annual Turnover (AATO) functionality is currently being upgraded to enable automatic updation of AATO as subsequent returns are filed post amendment window. As this enhanced functionality is being deployed from 1st July 2026, the window for amendment of AATO by taxpayers for FY 2025-26 has been revised on the GST Portal.",
    date: "Jul 1st, 2026",
    category: "RETURNS",
  },

  {
    id: 4,
    month: "July 2026",
    title:
      "Gross and Net GST revenue collections for the month of June, 2026",
    description:
      "Please click on the link below to view the gross and net GST revenue collections for the month of June, 2026. Thanks, Team GSTN",
    date: "Jul 1st, 2026",
    category: "OTHERS",
  },

  {
    id: 5,
    month: "June 2026",
    title:
      "Advisory on e-Invoice API and e-Way Bill by IRN API changes for Invoice Registration Portals",
    description:
      "GSTN has issued an advisory regarding changes to e-Invoice and e-Way Bill API functionality. Taxpayers and system integrators are advised to review the applicable changes and update their integrations accordingly.",
    date: "Jun 25th, 2026",
    category: "E-INVOICE",
  },

  {
    id: 6,
    month: "June 2026",
    title:
      "Advisory on RSP-Based Valuation of Notified Tobacco Goods under GST",
    description:
      "An advisory has been issued regarding RSP-based valuation of notified tobacco goods under GST. Taxpayers are advised to review the applicable provisions and follow the prescribed methodology.",
    date: "Jun 25th, 2026",
    category: "GST",
  },

  {
    id: 7,
    month: "June 2026",
    title:
      "Advisory regarding system changes and taxpayer services on the GST Portal",
    description:
      "GSTN has released updates relating to taxpayer-facing functionality and system improvements on the GST Portal.",
    date: "Jun 18th, 2026",
    category: "OTHERS",
  },

  {
    id: 8,
    month: "April 2026",
    title: "Introduction of IMS Offline Tool",
    description:
      "The Invoice Management System (IMS) was introduced on the GST portal from the October 2024 tax period, enabling taxpayers to take actions on invoices uploaded by their suppliers through GSTR-1, GSTR-1A, or IFF. An IMS Offline Tool has now been introduced to facilitate taxpayer convenience and ease of compliance.",
    date: "Apr 21st, 2026",
    category: "RETURNS",
  },

  {
    id: 9,
    month: "April 2026",
    title:
      "Advisory on Re-Computation of Interest under Table 5.1 of GSTR-3B",
    description:
      "Please click on the link below to access the detailed advisory for taxpayers wherein the system-calculated interest for the February 2026 period was incorrectly calculated and auto-populated in the March 2026 GSTR-3B.",
    date: "Apr 16th, 2026",
    category: "RETURNS",
  },

  {
    id: 10,
    month: "April 2026",
    title: "Pre-deposit Percentage in the GST Portal",
    description:
      "While filing an appeal in Form APL-01 on the GST portal, the pre-deposit percentage is auto-populated as 10% in accordance with Section 107(6) of the CGST Act, 2017. Changes have been introduced to address cases where the pre-deposit had already been made through other means.",
    date: "Apr 10th, 2026",
    category: "APPEAL",
  },

  {
    id: 11,
    month: "March 2026",
    title: "Advisory regarding taxpayer services on the GST Portal",
    description:
      "GSTN has issued an advisory regarding recent functionality and taxpayer-service updates available through the GST Portal.",
    date: "Mar 26th, 2026",
    category: "OTHERS",
  },

  {
    id: 12,
    month: "March 2026",
    title:
      "Advisory on changes to return filing functionality",
    description:
      "Information regarding changes and improvements introduced to return filing functionality on the GST Portal.",
    date: "Mar 18th, 2026",
    category: "RETURNS",
  },
];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/
const getMonthKey = (month) => month;

function SectionHeading() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy/60">
        GST Portal
      </p>

      <h1 className="mt-2 font-serif text-[2.25rem] leading-tight tracking-[-0.025em] text-ink sm:text-[2.75rem]">
        News and Updates
      </h1>

      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
        Stay informed with the latest advisories, announcements and
        functionality updates from the GST Portal.
      </p>
    </div>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-shell px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
      {category}
    </span>
  );
}

function NewsCard({ item }) {
  return (
    <article className="group rounded-[6px] border border-line bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-navy/25 hover:shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <h3 className="text-[18px] font-semibold leading-7 tracking-[-0.01em] text-ink transition-colors group-hover:text-navy sm:text-[19px]">
            {item.title}
          </h3>
        </div>

        <div className="hidden shrink-0 sm:flex">
          <CategoryBadge category={item.category} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-medium text-muted">
        <CalendarDays className="h-4 w-4 shrink-0" />
        <span>{item.date}</span>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        {item.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
        <div className="sm:hidden">
          <CategoryBadge category={item.category} />
        </div>

        <a
          href="#"
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors hover:text-navy-hover"
        >
          Read More
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="rounded-[6px] border border-dashed border-line bg-shell px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[6px] bg-white text-navy shadow-sm">
        <Search className="h-5 w-5" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-ink">
        No updates found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        Try changing your search term or filter selection to find relevant
        updates.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 rounded-[6px] border border-navy bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-shell"
      >
        Clear filters
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function NewsAndUpdates() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;

  const categories = useMemo(() => {
    return [...new Set(newsItems.map((item) => item.category))].sort();
  }, []);

  const months = useMemo(() => {
    return [...new Set(newsItems.map((item) => item.month))];
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return newsItems.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      const matchesType =
        !selectedType || item.category === selectedType;

      const matchesMonth =
        !selectedMonth || item.month === selectedMonth;

      return matchesSearch && matchesType && matchesMonth;
    });
  }, [search, selectedType, selectedMonth]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const groupedItems = useMemo(() => {
    const groups = [];

    pageItems.forEach((item) => {
      const existing = groups.find(
        (group) => group.month === getMonthKey(item.month)
      );

      if (existing) {
        existing.items.push(item);
      } else {
        groups.push({
          month: item.month,
          items: [item],
        });
      }
    });

    return groups;
  }, [pageItems]);

  const clearFilters = () => {
    setSearch("");
    setSelectedType("");
    setSelectedMonth("");
    setPage(1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
    setPage(1);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setPage(1);
  };

  return (
    <PageContainer>
      <main className="min-h-screen bg-shell font-sans text-ink">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-10">
          {/* =========================================================
              BREADCRUMB
          ========================================================== */}
          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-2 text-xs text-muted"
          >
            <Link
              to="/"
              className="font-medium text-navy transition-colors hover:text-navy-hover"
            >
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5 text-muted/45" />

            <span className="font-medium text-ink">
              News and Updates
            </span>
          </nav>

          {/* =========================================================
              PAGE HEADER
          ========================================================== */}
          <header className="rounded-[6px] border border-line bg-white px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading />

              <Link
                to="/news/archive"
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-[6px] border border-navy bg-white px-4 py-2.5 text-sm font-semibold text-navy transition-colors hover:bg-shell lg:self-end"
              >
                View Archives
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </header>

          {/* =========================================================
              SEARCH / FILTER BAR
          ========================================================== */}
          <section
            aria-label="News filters"
            className="mt-5 rounded-[6px] border border-line bg-white p-4 sm:p-5"
          >
            <div className="flex items-center gap-2 border-b border-line pb-4">
              <SlidersHorizontal className="h-4 w-4 text-navy" />

              <h2 className="text-sm font-semibold text-ink">
                Find an update
              </h2>

              {(search || selectedType || selectedMonth) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-navy-hover"
                >
                  Clear all
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
              {/* Search */}
              <div>
                <label
                  htmlFor="news-search"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.06em] text-muted"
                >
                  Search
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                  <input
                    id="news-search"
                    type="search"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search news and updates"
                    className="h-11 w-full rounded-[6px] border border-line bg-white pl-10 pr-10 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-navy focus:outline-none"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="news-type"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.06em] text-muted"
                >
                  Filter by type
                </label>

                <div className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                  <select
                    id="news-type"
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="h-11 w-full appearance-none rounded-[6px] border border-line bg-white pl-10 pr-10 text-sm text-ink transition-colors focus:border-navy focus:outline-none"
                  >
                    <option value="">All types</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
              </div>

              {/* Month */}
              <div>
                <label
                  htmlFor="news-month"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.06em] text-muted"
                >
                  Filter by month
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />

                  <select
                    id="news-month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="h-11 w-full appearance-none rounded-[6px] border border-line bg-white pl-10 pr-10 text-sm text-ink transition-colors focus:border-navy focus:outline-none"
                  >
                    <option value="">All months</option>

                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================
              RESULTS SUMMARY
          ========================================================== */}
          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">
                {filteredItems.length === 0
                  ? "No updates"
                  : `${filteredItems.length} ${
                      filteredItems.length === 1 ? "update" : "updates"
                    } found`}
              </p>

              <p className="mt-1 text-xs text-muted">
                Latest portal announcements and advisories
              </p>
            </div>

            {(search || selectedType || selectedMonth) && (
              <div className="flex flex-wrap gap-2">
                {selectedType && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-muted">
                    {selectedType}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedType("");
                        setPage(1);
                      }}
                      aria-label="Remove type filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedMonth && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-muted">
                    {selectedMonth}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMonth("");
                        setPage(1);
                      }}
                      aria-label="Remove month filter"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* =========================================================
              NEWS LIST
          ========================================================== */}
          <section className="mt-6" aria-label="News and updates list">
            {groupedItems.length === 0 ? (
              <EmptyState onReset={clearFilters} />
            ) : (
              <div className="space-y-10">
                {groupedItems.map((group) => (
                  <section key={group.month}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white">
                        <CalendarDays className="h-4 w-4" />
                      </div>

                      <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink">
                        {group.month}
                      </h2>

                      <div className="h-px flex-1 bg-line" />
                    </div>

                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <NewsCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>

          {/* =========================================================
              PAGINATION
          ========================================================== */}
          {filteredItems.length > 0 && (
            <section className="mt-10 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Showing{" "}
                <span className="font-semibold text-ink">
                  {(currentPage - 1) * PAGE_SIZE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-ink">
                  {Math.min(currentPage * PAGE_SIZE, filteredItems.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-ink">
                  {filteredItems.length}
                </span>
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-[6px] border border-line bg-white px-3 text-sm font-medium text-muted transition-colors hover:border-navy/30 hover:text-navy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`h-9 min-w-9 rounded-[6px] px-2 text-sm font-semibold transition-colors ${
                          pageNumber === currentPage
                            ? "bg-navy text-white"
                            : "border border-line bg-white text-muted hover:border-navy/30 hover:text-navy"
                        }`}
                        aria-current={
                          pageNumber === currentPage ? "page" : undefined
                        }
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1)
                    )
                  }
                  className="inline-flex h-9 items-center gap-1 rounded-[6px] border border-line bg-white px-3 text-sm font-medium text-muted transition-colors hover:border-navy/30 hover:text-navy disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}

          {/* =========================================================
              BOTTOM RESOURCE CTA
          ========================================================== */}
          <section className="mt-12 rounded-[6px] border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] bg-shell text-navy">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-ink">
                    Looking for older announcements?
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted">
                    Browse the complete archive of GST Portal news and updates.
                  </p>
                </div>
              </div>

              <Link
                to="/news/archive"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[6px] border border-navy px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-shell"
              >
                Browse Archive
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </PageContainer>
  );
}

export default NewsAndUpdates;