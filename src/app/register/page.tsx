"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Mail, Lock, User, GraduationCap, Building2, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TECHNOLOGIES } from "@/lib/constants";

type Role = "student" | "client" | null;

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
        >
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
              <Code2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">
              Campus<span className="text-[var(--primary)]">Code</span>
            </span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    step >= s
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 ${step > s ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-2xl font-bold mb-2">Create your account</h1>
              <p className="text-[var(--muted-foreground)] mb-8">Choose how you want to use CampusCode</p>

              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setRole("student")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === "student"
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--border)] hover:border-[var(--primary)]/30"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                    <GraduationCap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Student / Developer</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Build, manage, sell software & solve requirements
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setRole("client")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    role === "client"
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-[var(--border)] hover:border-[var(--primary)]/30"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                    <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Client / Organization</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Buy software & post requirements for developers
                    </p>
                  </div>
                </button>
              </div>

              <Button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="w-full"
                size="lg"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Account Details */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-2xl font-bold mb-2">Account details</h1>
              <p className="text-[var(--muted-foreground)] mb-6">
                {role === "student" ? "Tell us about yourself" : "Set up your organization account"}
              </p>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <Button variant="outline" className="w-full">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </Button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[var(--background)] px-2 text-[var(--muted-foreground)]">or</span>
                </div>
              </div>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div>
                  <Label htmlFor="name" className="mb-1.5 block">
                    {role === "student" ? "Full Name" : "Organization Name"}
                  </Label>
                  <Input id="name" placeholder={role === "student" ? "Harsh Vardhan" : "TechStart Solutions"} />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1.5 block">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="password" className="mb-1.5 block">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="w-full">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Profile Details */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-2xl font-bold mb-2">
                {role === "student" ? "Student profile" : "Organization profile"}
              </h1>
              <p className="text-[var(--muted-foreground)] mb-6">
                Complete your profile to get started
              </p>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
                {role === "student" ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="college" className="mb-1.5 block">College</Label>
                        <Input id="college" placeholder="NIT Trichy" />
                      </div>
                      <div>
                        <Label htmlFor="degree" className="mb-1.5 block">Degree</Label>
                        <Input id="degree" placeholder="B.Tech CSE" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="gradYear" className="mb-1.5 block">Graduation Year</Label>
                      <Input id="gradYear" type="number" placeholder="2026" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Skills</Label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[var(--border)] max-h-32 overflow-y-auto">
                        {TECHNOLOGIES.slice(0, 25).map((tech) => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => toggleSkill(tech)}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                              selectedSkills.includes(tech)
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="github" className="mb-1.5 block">GitHub</Label>
                        <Input id="github" placeholder="username" />
                      </div>
                      <div>
                        <Label htmlFor="linkedin" className="mb-1.5 block">LinkedIn</Label>
                        <Input id="linkedin" placeholder="username" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio" className="mb-1.5 block">Bio</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself..." rows={3} />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="website" className="mb-1.5 block">Website</Label>
                      <Input id="website" placeholder="https://yourcompany.com" />
                    </div>
                    <div>
                      <Label htmlFor="description" className="mb-1.5 block">Description</Label>
                      <Textarea id="description" placeholder="Tell us about your organization..." rows={3} />
                    </div>
                    <div>
                      <Label htmlFor="profileType" className="mb-1.5 block">Profile Type</Label>
                      <select id="profileType" className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
                        <option value="">Select type</option>
                        <option value="startup">Startup</option>
                        <option value="small_business">Small Business</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="organization">Organization</option>
                        <option value="individual">Individual</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="w-full">
                    Create Account <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
              Sign in
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
          <h2 className="text-3xl font-bold mb-3">Join 10,000+ students</h2>
          <p className="text-[var(--muted-foreground)] max-w-sm mx-auto">
            Build your developer portfolio, sell software, and earn real money while still in college.
          </p>
        </div>
      </div>
    </div>
  );
}
