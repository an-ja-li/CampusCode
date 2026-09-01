"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Lightbulb, User, FolderKanban, ArrowRight, Command } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  type: "product" | "solution" | "student" | "project";
  title: string;
  subtitle: string;
  url: string;
}

const typeIcons = {
  product: Package,
  solution: Lightbulb,
  student: User,
  project: FolderKanban,
};

const typeColors = {
  product: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
  solution: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30",
  student: "text-purple-500 bg-purple-100 dark:bg-purple-900/30",
  project: "text-amber-500 bg-amber-100 dark:bg-amber-900/30",
};

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setResults((data.results || []).slice(0, 8));
          }
        }
      } catch (err) {
        console.error("[SearchBar] Error:", err);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      onClose();
      window.location.href = results[selectedIndex].url;
    }
  }, [results, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="flex justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="relative z-10 w-full max-w-xl"
            >
              <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 border-b border-[var(--border)]">
                  <Search className="h-5 w-5 text-[var(--muted-foreground)] shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products, requests, developers, projects..."
                    className="flex-1 h-14 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
                  />
                  <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-md bg-[var(--muted)] text-[10px] text-[var(--muted-foreground)] font-mono">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                {results.length > 0 && (
                  <div className="max-h-80 overflow-y-auto p-2">
                    {results.map((result, idx) => {
                      const Icon = typeIcons[result.type];
                      return (
                        <Link
                          key={`${result.type}-${result.id}`}
                          href={result.url}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                            idx === selectedIndex ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "hover:bg-[var(--muted)]"
                          }`}
                        >
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${typeColors[result.type]}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{result.title}</p>
                            <p className="text-xs text-[var(--muted-foreground)] truncate">{result.subtitle}</p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Empty state */}
                {query.length >= 2 && results.length === 0 && (
                  <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                )}

                {/* Hint */}
                {!query && (
                  <div className="p-4 text-xs text-[var(--muted-foreground)] text-center">
                    Type to search across products, solution requests, developers, and projects
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
