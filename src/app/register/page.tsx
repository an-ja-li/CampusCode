"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, Mail, Lock, User, GraduationCap, Building2, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { TECHNOLOGIES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

type Role = "student" | "client" | null;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["React", "Next.js", "TypeScript"]);
  const [error, setError] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [gradYear, setGradYear] = useState("2026");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [bio, setBio] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setError("");
    const result = await register({
      name,
      email,
      password,
      role: role || "student",
      college: college || "Engineering College",
      degree: degree || "B.Tech Computer Science",
      graduationYear: parseInt(gradYear) || 2026,
      skills: selectedSkills.length > 0 ? selectedSkills : ["React", "TypeScript", "Next.js"],
      bio: bio || "",
    });

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
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
                  type="button"
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
                      Build, manage, sell software & solve client requirements
                    </p>
                  </div>
                </button>

                <button
                  type="button"
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
                type="button"
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

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                <div>
                  <Label htmlFor="name" className="mb-1.5 block">
                    {role === "student" ? "Full Name" : "Organization Name"}
                  </Label>
                  <Input
                    id="name"
                    required
                    placeholder={role === "student" ? "e.g. Alex Chen" : "TechStart Solutions"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1.5 block">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="mb-1.5 block">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className="pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
                {role === "student" ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="college" className="mb-1.5 block">College / University</Label>
                        <Input
                          id="college"
                          required
                          placeholder="e.g. Stanford University"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="degree" className="mb-1.5 block">Degree / Major</Label>
                        <Input
                          id="degree"
                          required
                          placeholder="e.g. B.S. Computer Science"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="gradYear" className="mb-1.5 block">Graduation Year</Label>
                      <Input
                        id="gradYear"
                        type="number"
                        placeholder="2026"
                        value={gradYear}
                        onChange={(e) => setGradYear(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Your Skills</Label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[var(--border)] max-h-32 overflow-y-auto">
                        {TECHNOLOGIES.slice(0, 20).map((tech) => (
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
                    <div>
                      <Label htmlFor="bio" className="mb-1.5 block">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell clients and developers about yourself..."
                        rows={2}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="college" className="mb-1.5 block">Organization Name</Label>
                      <Input
                        id="college"
                        placeholder="e.g. Acme Innovations"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="mb-1.5 block">Description</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell developers about your projects..."
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-full">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
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
          <h2 className="text-3xl font-bold mb-3">Join student developers</h2>
          <p className="text-[var(--muted-foreground)] max-w-sm mx-auto">
            Build your developer portfolio, sell software, and earn real money while still in college.
          </p>
        </div>
      </div>
    </div>
  );
}
