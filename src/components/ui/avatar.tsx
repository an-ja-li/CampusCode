import * as React from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function Avatar({ className, src, alt, name, size = "md", ...props }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const colors = [
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  ];

  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (src) {
    return (
      <div
        className={cn("relative rounded-full overflow-hidden shrink-0", sizeClasses[size], className)}
        {...props}
      >
        <img src={src} alt={alt || name || ""} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0 flex items-center justify-center font-semibold",
        sizeClasses[size],
        colors[colorIndex],
        className
      )}
      {...props}
    >
      {name ? getInitials(name) : "?"}
    </div>
  );
}

export { Avatar };
