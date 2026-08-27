"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, Users, CheckCircle2, Send, Calendar, DollarSign,
  AlertCircle, FileText, Briefcase, Loader2, Sparkles, Plus, Trash2,
  ShieldCheck, Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Textarea, Label } from "@/components/ui/input";
import { solutionRequests as fallbackRequests } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime, formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { SolutionRequest } from "@/types";

interface MilestoneInput {
  id: string;
  title: string;
  amount: number;
  durationDays: number;
}

export default function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated, user } = useAuth();

  const [request, setRequest] = useState<SolutionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmittingMode, setIsSubmittingMode] = useState(false);

  // Proposal Form State
  const [price, setPrice] = useState<number>(0);
  const [days, setDays] = useState<number>(14);
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [milestones, setMilestones] = useState<MilestoneInput[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRequirement() {
      try {
        const res = await fetch(`/api/solutions/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data) {
            setRequest(data);
            const initialPrice = data.budgetMin || 20000;
            setPrice(initialPrice);
            setSelectedTechs(data.preferredTechnologies || []);
            setMilestones([
              { id: "m1", title: "Architecture, UI Wireframes & DB Schema", amount: Math.round(initialPrice * 0.4), durationDays: 5 },
              { id: "m2", title: "Core Functionality & API Integrations", amount: Math.round(initialPrice * 0.4), durationDays: 6 },
              { id: "m3", title: "Testing, QA & Deployment", amount: Math.round(initialPrice * 0.2), durationDays: 3 },
            ]);
            return;
          }
        }
      } catch (err) {
        console.error("[SolutionDetail] Error fetching requirement:", err);
      }

      // Fallback
      const fallback = fallbackRequests.find((sr) => sr.id === id);
      if (!cancelled && fallback) {
        setRequest(fallback);
        const initialPrice = fallback.budgetMin || 20000;
        setPrice(initialPrice);
        setSelectedTechs(fallback.preferredTechnologies || []);
        setMilestones([
          { id: "m1", title: "Architecture & Schema Setup", amount: Math.round(initialPrice * 0.4), durationDays: 5 },
          { id: "m2", title: "Feature Development", amount: Math.round(initialPrice * 0.4), durationDays: 6 },
          { id: "m3", title: "Testing & Deployment", amount: Math.round(initialPrice * 0.2), durationDays: 3 },
        ]);
      }
    }

    loadRequirement().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handlePriceChange = (val: number) => {
    setPrice(val);
    if (milestones.length === 3) {
      setMilestones([
        { ...milestones[0], amount: Math.round(val * 0.4) },
        { ...milestones[1], amount: Math.round(val * 0.4) },
        { ...milestones[2], amount: Math.round(val * 0.2) },
      ]);
    }
  };

  const handleAddMilestone = () => {
    const newId = `m_${Date.now()}`;
    setMilestones([...milestones, { id: newId, title: "Additional Deliverable", amount: 5000, durationDays: 3 }]);
  };

  const handleRemoveMilestone = (mId: string) => {
    setMilestones(milestones.filter((m) => m.id !== mId));
  };

  const handleMilestoneChange = (mId: string, field: "title" | "amount" | "durationDays", val: string | number) => {
    setMilestones(
      milestones.map((m) => (m.id === mId ? { ...m, [field]: val } : m))
    );
  };

  const toggleTech = (tech: string) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter((t) => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const totalMilestonesAmount = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);
  const platformFee = Math.round(price * 0.1);
  const takeHome = Math.max(0, price - platformFee);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setSubmitError("Please sign in to submit proposals.");
      return;
    }
    if (!coverLetter.trim()) {
      setSubmitError("Please write a brief cover letter describing your approach.");
      return;
    }
    if (price <= 0) {
      setSubmitError("Please enter a valid proposal price.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          solutionRequestId: id,
          content: coverLetter,
          price,
          estimatedDelivery: days,
          technologies: selectedTechs,
          milestones: milestones.map((m) => ({
            title: m.title,
            amount: Number(m.amount) || 0,
            durationDays: Number(m.durationDays) || 5,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit proposal");
      }

      setSubmitSuccess(true);
    } catch (err: unknown) {
      console.error("[Submit Proposal Error]:", err);
      setSubmitError(err instanceof Error ? err.message : "Failed to submit proposal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-2">Requirement Not Found</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          This solution request does not exist or has been removed.
        </p>
        <Link href="/solutions">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Solutions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {/* ============================================================ */}
        {/* MODE 1: REQUIREMENT OVERVIEW VIEW                            */}
        {/* ============================================================ */}
        {!isSubmittingMode ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top Breadcrumb */}
            <Link
              href="/solutions"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Solutions
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant={typeof request.status === "string" && request.status.toLowerCase() === "open" ? "success" : "warning"}>
                      {typeof request.status === "string" && request.status.toLowerCase() === "open" ? "Open" : "In Progress"}
                    </Badge>
                    <Badge variant="outline">{request.difficulty}</Badge>
                    <Badge variant="outline">{request.solutionType?.replace("_", " / ").toUpperCase()}</Badge>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-3">{request.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Posted {formatRelativeTime(request.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {request.proposalCount} proposals
                    </span>
                    {request.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Deadline: {formatDate(request.deadline)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Statement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Problem Statement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-[var(--muted-foreground)] whitespace-pre-line">
                      {request.problemStatement || request.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Required Features */}
                {request.requiredFeatures && request.requiredFeatures.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">Required Features & Scope</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {request.requiredFeatures.map((feature) => (
                          <div key={feature} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-[var(--foreground)]">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Preferred Technologies */}
                {request.preferredTechnologies && request.preferredTechnologies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">Preferred Tech Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {request.preferredTechnologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="px-3 py-1.5 text-sm font-normal">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Expected Deliverables */}
                {request.expectedDeliverables && request.expectedDeliverables.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">Expected Deliverables</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {request.expectedDeliverables.map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                            <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                            <span className="text-[var(--foreground)]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar Action Column */}
              <div className="space-y-4 lg:sticky lg:top-6 self-start">
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                        Client Budget
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-[var(--primary)]">
                        {request.budgetMin && request.budgetMax
                          ? `${formatCurrency(request.budgetMin)} – ${formatCurrency(request.budgetMax)}`
                          : "Open to Proposals"}
                      </p>
                      {request.isFixedPrice && (
                        <Badge variant="secondary" className="mt-1.5">
                          Fixed Price Project
                        </Badge>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] space-y-2 text-sm">
                      {request.deadline && (
                        <div className="flex justify-between">
                          <span className="text-[var(--muted-foreground)]">Target Deadline</span>
                          <span className="font-medium">{formatDate(request.deadline)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Proposals</span>
                        <span className="font-medium">{request.proposalCount} submitted</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--muted-foreground)]">Experience Level</span>
                        <span className="font-medium capitalize">{request.difficulty}</span>
                      </div>
                    </div>

                    {/* Smooth Transition Trigger */}
                    <Button
                      className="w-full gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                      size="lg"
                      onClick={() => setIsSubmittingMode(true)}
                    >
                      <Send className="h-4 w-4" />
                      Submit Proposal
                    </Button>
                  </CardContent>
                </Card>

                {/* Client Profile Card */}
                {request.client && (
                  <Card>
                    <CardContent className="p-5">
                      <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
                        Posted by
                      </p>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={request.client.name} size="md" />
                        <div>
                          <p className="font-semibold text-sm">
                            {request.client.clientProfile?.organization || request.client.name}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {request.client.name}
                          </p>
                        </div>
                      </div>

                      {request.client.isVerified && (
                        <Badge variant="success" className="mb-3">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Client
                        </Badge>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-[var(--border)] text-xs">
                        <div>
                          <p className="font-bold text-sm text-[var(--foreground)]">
                            {request.client.clientProfile?.projectsPosted || 5}
                          </p>
                          <p className="text-[var(--muted-foreground)]">Posted</p>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[var(--foreground)]">
                            ⭐ {request.client.clientProfile?.rating || 4.9}
                          </p>
                          <p className="text-[var(--muted-foreground)]">Rating</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ============================================================ */
          /* MODE 2: DEDICATED PROPOSAL SUBMISSION PAGE                   */
          /* ============================================================ */
          <motion.div
            key="submit-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Header / Breadcrumb Back Button */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
              <button
                onClick={() => setIsSubmittingMode(false)}
                className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Requirement Overview
              </button>

              <Badge variant="outline" className="gap-1.5 text-xs py-1">
                <Sparkles className="h-3 w-3 text-[var(--primary)]" />
                Proposal Studio
              </Badge>
            </div>

            {submitSuccess ? (
              /* Success Confirmation View */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 max-w-lg mx-auto space-y-6"
              >
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                  <Check className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Proposal Submitted!</h2>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Your proposal of <strong className="text-[var(--foreground)]">{formatCurrency(price)}</strong> has been sent to{" "}
                    <strong>{request.client?.clientProfile?.organization || request.client?.name || "the client"}</strong>.
                  </p>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <Link href="/proposals">
                    <Button className="gap-2">
                      <FileText className="h-4 w-4" /> View My Proposals
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setIsSubmittingMode(false)}>
                    View Requirement
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Interactive Proposal Builder Form */
              <form onSubmit={handleSubmitProposal} className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Form Fields Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Top Context Header */}
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[var(--primary)] font-semibold">
                      New Proposal Application
                    </span>
                    <h1 className="text-2xl font-bold mt-0.5">{request.title}</h1>
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 p-3.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {submitError}
                    </div>
                  )}

                  {/* 1. Bid & Timeline Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">1. Pricing & Delivery Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price" className="mb-1.5 block text-sm font-medium">
                            Your Proposed Price (₹)
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)] font-semibold">
                              ₹
                            </span>
                            <Input
                              id="price"
                              type="number"
                              required
                              min="1000"
                              value={price || ""}
                              onChange={(e) => handlePriceChange(Number(e.target.value))}
                              placeholder="25000"
                              className="pl-8 text-base font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1.5">
                            Client budget: {request.budgetMin && request.budgetMax ? `${formatCurrency(request.budgetMin)} – ${formatCurrency(request.budgetMax)}` : "Open"}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="days" className="mb-1.5 block text-sm font-medium">
                            Estimated Delivery (Days)
                          </Label>
                          <div className="relative">
                            <Input
                              id="days"
                              type="number"
                              required
                              min="1"
                              max="90"
                              value={days || ""}
                              onChange={(e) => setDays(Number(e.target.value))}
                              placeholder="14"
                              className="text-base pr-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)] pointer-events-none font-medium">
                              Days
                            </span>
                          </div>
                          <p className="text-xs text-[var(--muted-foreground)] mt-1.5">
                            Realistic timeline to deliver tested software
                          </p>
                        </div>
                      </div>

                      {/* Fee Transparency Box */}
                      <div className="p-3 rounded-lg bg-[var(--muted)]/50 border border-[var(--border)] text-xs space-y-1.5">
                        <div className="flex justify-between text-[var(--muted-foreground)]">
                          <span>Gross Client Bid:</span>
                          <span>{formatCurrency(price)}</span>
                        </div>
                        <div className="flex justify-between text-[var(--muted-foreground)]">
                          <span>CampusCode Platform Fee (10%):</span>
                          <span>- {formatCurrency(platformFee)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm text-[var(--foreground)] pt-1 border-t border-[var(--border)]">
                          <span>Your Take-Home Payout:</span>
                          <span className="text-emerald-500">{formatCurrency(takeHome)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. Cover Letter & Technical Approach */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">2. Cover Letter & Solution Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        required
                        rows={6}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Hi! I have built similar systems using React & PostgreSQL. Here is how I plan to architect your solution and solve your requirements..."
                        className="text-sm leading-relaxed"
                      />
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Tip: Highlight relevant prior projects, your technical architecture, and how you will meet their deliverables.
                      </p>
                    </CardContent>
                  </Card>

                  {/* 3. Milestone Breakdown */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base">3. Project Milestones</CardTitle>
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                          Split deliverables into clear funding stages
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddMilestone}
                        className="gap-1 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Milestone
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {milestones.map((m, idx) => (
                        <div
                          key={m.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg bg-[var(--muted)]/40 border border-[var(--border)] text-sm"
                        >
                          <span className="font-bold text-xs text-[var(--muted-foreground)] px-1.5 py-0.5 rounded bg-[var(--background)]">
                            #{idx + 1}
                          </span>
                          <div className="flex-1 w-full sm:w-auto">
                            <Input
                              value={m.title}
                              onChange={(e) => handleMilestoneChange(m.id, "title", e.target.value)}
                              placeholder="Milestone description"
                              className="text-xs h-8"
                            />
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-28">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">
                                ₹
                              </span>
                              <Input
                                type="number"
                                value={m.amount || ""}
                                onChange={(e) => handleMilestoneChange(m.id, "amount", Number(e.target.value))}
                                className="text-xs h-8 pl-6 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>
                            <div className="relative w-24">
                              <Input
                                type="number"
                                value={m.durationDays || ""}
                                onChange={(e) => handleMilestoneChange(m.id, "durationDays", Number(e.target.value))}
                                className="text-xs h-8 pr-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--muted-foreground)] pointer-events-none font-medium">
                                days
                              </span>
                            </div>
                            {milestones.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMilestone(m.id)}
                                className="text-[var(--muted-foreground)] hover:text-red-500 p-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Milestone Sum Check */}
                      <div className="flex justify-between items-center text-xs pt-2">
                        <span className="text-[var(--muted-foreground)]">
                          Milestones Total: <strong>{formatCurrency(totalMilestonesAmount)}</strong>
                        </span>
                        {totalMilestonesAmount !== price && (
                          <span className="text-amber-500 font-medium">
                            ⚠️ Sum ({formatCurrency(totalMilestonesAmount)}) differs from total bid ({formatCurrency(price)})
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 4. Tech Stack Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">4. Technologies You Will Use</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(request.preferredTechnologies || ["React", "Node.js", "PostgreSQL"]).map((tech) => {
                          const isSelected = selectedTechs.includes(tech);
                          return (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => toggleTech(tech)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                                isSelected
                                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                                  : "bg-[var(--muted)] text-[var(--muted-foreground)] border-transparent hover:border-[var(--border)]"
                              }`}
                            >
                              {isSelected ? `✓ ${tech}` : `+ ${tech}`}
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsSubmittingMode(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="gap-2 px-8"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Send Proposal
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Right Context Sidebar */}
                <div className="space-y-4 lg:sticky lg:top-6 self-start">
                  <Card className="bg-[var(--muted)]/20">
                    <CardHeader>
                      <CardTitle className="text-sm">Requirement Snapshot</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                      <div>
                        <span className="text-[var(--muted-foreground)]">Client:</span>
                        <p className="font-semibold text-sm mt-0.5">
                          {request.client?.clientProfile?.organization || request.client?.name || "Verified Client"}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[var(--border)]">
                        <span className="text-[var(--muted-foreground)]">Client Budget:</span>
                        <p className="font-semibold text-sm text-[var(--primary)] mt-0.5">
                          {request.budgetMin && request.budgetMax ? `${formatCurrency(request.budgetMin)} – ${formatCurrency(request.budgetMax)}` : "Open"}
                        </p>
                      </div>
                      {request.deadline && (
                        <div className="pt-2 border-t border-[var(--border)]">
                          <span className="text-[var(--muted-foreground)]">Deadline:</span>
                          <p className="font-semibold text-[var(--foreground)] mt-0.5">
                            {formatDate(request.deadline)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-dashed bg-[var(--muted)]/10">
                    <CardContent className="p-4 space-y-2.5 text-xs text-[var(--muted-foreground)]">
                      <p className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        Winning Proposal Checklist
                      </p>
                      <ul className="space-y-1.5 list-disc pl-4 leading-relaxed">
                        <li>Break deliverables into distinct milestones</li>
                        <li>Reference concrete technical libraries</li>
                        <li>Propose realistic timeline with testing buffers</li>
                        <li>Maintain clear communication via CampusCode chat</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
