"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
  id,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => opt.value === value);
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => opt.value === value);
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} id={id}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] transition-all",
          "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent",
          "hover:border-[var(--primary)]/50",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-[var(--ring)] border-transparent"
        )}
      >
        <span className={cn("flex items-center gap-2 truncate", !selectedOption && "text-[var(--muted-foreground)]")}>
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-[var(--muted-foreground)] shrink-0 transition-transform duration-200",
            isOpen && "rotate-180 text-[var(--primary)]"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[var(--border)] bg-[var(--card)] p-1 text-[var(--foreground)] shadow-xl animate-in fade-in-80 zoom-in-95">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "relative flex cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm outline-none transition-colors",
                  isSelected
                    ? "bg-[var(--primary)] text-white font-medium"
                    : "hover:bg-[var(--muted)] text-[var(--foreground)]"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <div>
                    <p className="truncate">{opt.label}</p>
                    {opt.description && (
                      <p className={cn("text-xs", isSelected ? "text-white/80" : "text-[var(--muted-foreground)]")}>
                        {opt.description}
                      </p>
                    )}
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-white" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
