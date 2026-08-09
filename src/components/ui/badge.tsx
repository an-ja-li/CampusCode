import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-[var(--primary)] text-[var(--primary-foreground)]": variant === "default",
          "bg-[var(--secondary)] text-[var(--secondary-foreground)]": variant === "secondary",
          "border border-[var(--border)] text-[var(--foreground)]": variant === "outline",
          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400": variant === "destructive",
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400": variant === "success",
          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
