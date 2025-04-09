import { useState, useEffect, useRef } from "react";
import {useFloating, offset, useClick, useDismiss, useRole, useInteractions} from "@floating-ui/react"
import type {ReactNode} from "react";

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
  
  export function Autocomplete<T extends { [key: string]: any }>({
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
      <div className="w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          {...getReferenceProps()}
          ref={refs.setReference}
          disabled={disabled}
          className="mt-1 w-full border px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onInputChange?.(e.target.value);
            setOpen(true);
          }}
        />
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
  
        {open && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="mt-1 w-full max-h-60 overflow-y-auto border bg-white shadow rounded z-10"
          >
            {loading ? (
              <div className="p-2 text-gray-500">Loading...</div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-2 text-gray-500">No options</div>
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
