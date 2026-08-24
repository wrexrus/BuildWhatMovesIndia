import React from "react";
import { Search, Info } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs.jsx";

const SearchPageShell = ({
  title,
  description,
  breadcrumbs,
  children,
  mandatory = true,
  maxWidth = "max-w-[1440px]",
}) => {
  return (
    
    <main className="min-h-[calc(100vh-150px)] bg-[#eef2f6]">
      <Breadcrumbs items={breadcrumbs} />

      <div className={`mx-auto ${maxWidth} px-4 py-5 sm:px-6 lg:px-8`}>
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,42,74,0.06)]">
          {/* Section accent */}
          <div className="h-1 bg-gradient-to-r from-[#315b91] via-[#18b8b6] to-[#315b91]" />

          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl">
                <div className="mb-2 flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-[#e7f2fb] text-[#285989]">
                    <Search size={18} />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#315b91]">
                    Taxpayer Services
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-[#082d62] sm:text-[1.65rem]">
                  {title}
                </h1>

                {description && (
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                )}
              </div>

              {mandatory && (
                <div className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
                  <span className="text-lg font-bold leading-none text-red-500">
                    *
                  </span>
                  indicates mandatory fields
                </div>
              )}
            </div>
          </div>

          {/* Form content */}
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default SearchPageShell;