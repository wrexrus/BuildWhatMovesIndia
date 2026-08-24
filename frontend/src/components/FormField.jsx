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
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.95rem] font-semibold text-[#112f58]"
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
          h-12 w-full rounded-md border bg-white px-4
          text-[0.95rem] text-slate-800
          outline-none transition-all
          placeholder:text-slate-400
          disabled:cursor-not-allowed
          disabled:bg-slate-100

          ${
            error
              ? "border-red-400 ring-2 ring-red-100"
              : "border-slate-300 focus:border-[#2e659d] focus:ring-4 focus:ring-[#2e659d]/10"
          }
        `}
      />

      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;