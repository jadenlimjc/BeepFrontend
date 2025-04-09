import { useState, useEffect, useRef } from "react";
import { useFloating, offset, useClick, useDismiss, useRole, useInteractions } from "@floating-ui/react"
import type { ReactNode } from "react";

interface AutocompleteProps<T> {
  label: string;
  placeholder?: string;
  description?: string;
  options: T[];
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  value: T | T[];
  onChange: (val: T | T[]) => void;
  onInputChange?: (input: string) => void;
  filterOptions?: (input: string, options: T[]) => T[];
  renderOption?: (opt: T) => ReactNode;
}

export function Autocomplete<T extends Record<string, any> | string>({
  label,
  placeholder = "Search...",
  description,
  options,
  disabled,
  loading,
  multiple = false,
  value,
  onChange,
  onInputChange,
  filterOptions,
  renderOption
}: AutocompleteProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(4)],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const filteredOptions = filterOptions
    ? filterOptions(inputValue, options)
    : options.filter((opt) =>
      typeof opt === "string"
        ? opt.toLowerCase().includes(inputValue.toLowerCase())
        : Object.values(opt).join(" ").toLowerCase().includes(inputValue.toLowerCase())
    );

  return (

    
    <div className="relative mt-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2.5a7.5 7.5 0 010 14.15z"
          />
        </svg>
      </div>

      {/* Input field */}
      <input
        {...getReferenceProps()}
        ref={refs.setReference}
        disabled={disabled}
        className="mt-1 w-full border px-8 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onInputChange?.(e.target.value);
          setOpen(true);
        }}
      />

      
      {/* Spinner on Load */}
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
        </div>
      )}
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}

      {open && inputValue.trim() !== "" &&(
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="mt-1 w-full max-h-60 overflow-y-auto border bg-white shadow rounded z-10"
        >
          {loading ? (
            <div className="p-2 text-gray-500">Loading...</div>
          ) : filteredOptions.length === 0 && inputValue.trim() !== "" ? (
            <div className="p-2 text-gray-500">No results were found</div>
          ) : (
            filteredOptions.map((opt, i) => (
              <div
                key={i}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  onChange(opt);
                  if (!multiple) setOpen(false);
                }}
              >
                {renderOption ? renderOption(opt) : typeof opt === "string" ? opt : opt.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
