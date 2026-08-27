import React from "react";

const FormField = ({
  id,
  label,
  required = false,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  maxLength,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`min-w-0 ${className}`}>
      <label
        htmlFor={id}
        className="mb-2 block break-words text-[0.9rem] font-semibold text-navy sm:text-[0.95rem]"
      >
        {label}
        {required && (
          <span
            className="ml-1 text-red-500"
            aria-label="required"
          >
            *
          </span>
        )}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        className={`
          h-12 w-full min-w-0 rounded-md border bg-white px-3
          text-[0.9rem] text-slate-800 sm:px-4 sm:text-[0.95rem]
          outline-none transition-all
          placeholder:text-slate-400
          disabled:cursor-not-allowed
          disabled:bg-slate-100
          ${
            error
              ? "border-red-400 ring-2 ring-red-100"
              : "border-slate-300 focus:border-navy focus:ring-4 focus:ring-navy/10"
          }
        `}
      />

      {error && (
        <p className="mt-1.5 break-words text-xs font-medium leading-5 text-red-600 sm:text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
