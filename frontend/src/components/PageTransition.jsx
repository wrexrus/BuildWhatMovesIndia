import React from "react";
import { useNavigation } from "react-router-dom";

const PageTransition = () => {
  const navigation = useNavigation();

  const isNavigating = navigation.state === "loading";

  if (!isNavigating) {
    return null;
  }

  return (
    <div
      className="
        pointer-events-none
        fixed
        inset-x-0
        top-0
        z-[9999]
        h-[3px]
        overflow-hidden
      "
      aria-hidden="true"
    >
      <div
        className="
          h-full
          w-[35%]
          rounded-r-full
          bg-gradient-to-r
          from-[#315B91]
          via-[#18B8B6]
          to-[#F2B84B]
          shadow-[0_0_8px_rgba(24,184,182,0.35)]
          animate-page-progress
        "
      />
    </div>
  );
};

export default PageTransition;