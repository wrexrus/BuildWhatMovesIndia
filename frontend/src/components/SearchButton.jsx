import React from "react";
import { Search, Loader2 } from "lucide-react";

const SearchButton = ({
  loading = false,
  disabled = false,
  children = "Search",
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="inline-flex h-11 w-full min-w-0 items-center justify-center gap-2 rounded-md bg-navy px-5
        text-sm font-bold uppercase tracking-wide text-white
        shadow-sm
        transition-all

        hover:bg-navy-hover
        hover:shadow-md

        active:translate-y-[1px]

        disabled:cursor-not-allowed
        disabled:opacity-50 sm:w-auto sm:px-7
      "
    >
      {loading ? (
        <>
          <Loader2 size={17} className="shrink-0 animate-spin" />
          <span className="truncate">Searching...</span>
        </>
      ) : (
        <>
          <Search size={17} className="shrink-0" />
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};

export default SearchButton;