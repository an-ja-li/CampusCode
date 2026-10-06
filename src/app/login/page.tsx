"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGitHub, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGitHubSigningIn, setIsGitHubSigningIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    const result = await login(email, password);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid email or password");
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setIsGitHubSigningIn(true);
      setError("");
      await loginWithGitHub("/dashboard");
    } catch {
      setError("GitHub sign-in failed. Please try again.");
      setIsGitHubSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">
              Campus<span className="text-[var(--primary)]">Code</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-[var(--muted-foreground)] mb-6">
            Sign in to access your dashboard, projects, and synced GitHub repositories.
          </p>

          {/* GitHub OAuth Button */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-11 mb-5 gap-3 border-[var(--border)] hover:bg-[var(--accent)] font-medium text-sm transition-all"
            onClick={handleGitHubSignIn}
            disabled={isLoading || isGitHubSigningIn}
          >
            {isGitHubSigningIn ? (
              <Loader2 className="h-4 w-4 animate-spin text-[var(--muted-foreground)]" />
            ) : (
              <GitHubIcon className="h-5 w-5 text-[var(--foreground)]" />
            )}
            <span>{isGitHubSigningIn ? "Connecting to GitHub..." : "Continue with GitHub"}</span>
          </Button>

          {/* Divider */}
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <span className="relative bg-[var(--background)] px-3 text-xs uppercase text-[var(--muted-foreground)] font-medium">
              or continue with email
            </span>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="mb-1.5 block">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-[var(--primary)] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading || isGitHubSigningIn}>
              {isLoading ? "Signing in..." : "Sign in to Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[var(--primary)] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--muted)]/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-purple-500/5 to-cyan-500/5" />
        <div className="relative text-center p-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--primary)] text-white mx-auto mb-8">
            <Code2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Build. Manage. Sell. Earn.</h2>
          <p className="text-[var(--muted-foreground)] max-w-sm mx-auto">
            Connect your GitHub repositories, synchronize Kanban boards in real time, and build your developer portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}
