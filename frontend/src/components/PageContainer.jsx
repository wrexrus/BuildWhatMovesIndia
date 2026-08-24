import React from "react";

const PageContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`
        animate-page-enter
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default PageContainer;