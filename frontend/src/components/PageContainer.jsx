import React from "react";

const PageContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`min-w-0 animate-page-enter
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default PageContainer;