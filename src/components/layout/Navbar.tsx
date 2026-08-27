"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Search,
  Bell,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  LayoutDashboard,
  Store,
  Lightbulb,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SearchBar } from "@/components/shared/SearchBar";
import { NotificationCenter } from "@/components/shared/NotificationCenter";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/lib/user-store";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications } = useUserData();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayName = user?.name || "Student Developer";

  const navLinks = [
    { href: "/marketplace", label: "Marketplace", icon: Store },
    { href: "/solutions", label: "Solutions", icon: Lightbulb },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/projects") ||
    pathname?.startsWith("/contracts") ||
    pathname?.startsWith("/messages") ||
    pathname?.startsWith("/earnings") ||
    pathname?.startsWith("/settings") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/proposals") ||
    pathname?.startsWith("/sell") ||
    pathname?.startsWith("/portfolio") ||
    pathname?.startsWith("/reviews") ||
    pathname?.startsWith("/tasks");

  if (isDashboard) return null;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">
                Campus<span className="text-[var(--primary)]">Code</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="text-[var(--muted-foreground)]"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-[var(--muted-foreground)]"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {isAuthenticated && user ? (
                <>
                  {/* Notifications */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setNotifOpen(!notifOpen);
                        setUserMenuOpen(false);
                      }}
                      className="text-[var(--muted-foreground)] relative"
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                    <NotificationCenter isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setUserMenuOpen(!userMenuOpen);
                        setNotifOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-[var(--muted)] transition-colors cursor-pointer"
                    >
                      <Avatar name={displayName} size="sm" />
                      <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)] hidden sm:block" />
                    </button>
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg z-50"
                        >
                          <div className="p-3 border-b border-[var(--border)]">
                            <p className="font-semibold text-sm">{displayName}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {user.studentProfile?.college || "Student Developer"}
                            </p>
                          </div>
                          <div className="p-1">
                            {[
                              { label: "Dashboard", href: "/dashboard" },
                              { label: "My Projects", href: "/projects" },
                              { label: "Earnings", href: "/earnings" },
                              { label: "Settings", href: "/settings" },
                            ].map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setUserMenuOpen(false)}
                                className="block px-3 py-2 text-sm rounded-lg hover:bg-[var(--muted)] transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                          <div className="p-1 border-t border-[var(--border)]">
                            <button
                              onClick={() => {
                                setUserMenuOpen(false);
                                logout();
                              }}
                              className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            >
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      <LogIn className="h-4 w-4 mr-1.5" /> Sign in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-1.5" /> Sign up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden text-[var(--muted-foreground)]"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[var(--border)] overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[var(--muted)]"
                  >
                    <link.icon className="h-4 w-4 text-[var(--muted-foreground)]" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Search Dialog */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
