"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={cn("", className)} data-active-tab={value}>
      {typeof children === "function"
        ? (children as (props: { value: string; onValueChange: (v: string) => void }) => ReactNode)({ value, onValueChange })
        : children}
    </div>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-xl bg-[var(--muted)] p-1", className)}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, active, onClick, children, className }: TabsTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer",
        active
          ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
        className
      )}
      data-tab-value={value}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  active?: boolean;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, active, children, className }: TabsContentProps) {
  if (!active) return null;
  return (
    <div className={cn("mt-4", className)} data-tab-value={value}>
      {children}
    </div>
  );
}
