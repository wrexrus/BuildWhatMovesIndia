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
      className="
        inline-flex h-11 items-center justify-center gap-2
        rounded-md bg-[#315b91]
        px-7
        text-sm font-bold uppercase tracking-wide text-white
        shadow-sm
        transition-all

        hover:bg-[#284e80]
        hover:shadow-md

        active:translate-y-[1px]

        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      {loading ? (
        <>
          <Loader2 size={17} className="animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search size={17} />
          {children}
        </>
      )}
    </button>
  );
};

export default SearchButton;