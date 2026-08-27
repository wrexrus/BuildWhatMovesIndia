import React from "react";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-slate-200 bg-shell"
    >
      <div className="mx-auto flex max-w-[1440px] items-center px-5 py-3 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm">
          <li>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 font-medium text-navy transition-colors hover:text-navy-hover"
            >
              <Home size={15} strokeWidth={2} />
              Home
            </a>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <li className="text-slate-400">
                  <ChevronRight size={15} />
                </li>

                <li>
                  {isLast ? (
                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>
                  ) : (
                    <a
                      href={item.href || "#"}
                      className="font-medium text-navy transition-colors hover:text-navy-hover"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;