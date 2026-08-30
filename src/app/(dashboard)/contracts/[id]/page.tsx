"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, DollarSign, Calendar, CheckCircle2, Circle,
  AlertCircle, MessageSquare, Star, ShieldCheck, FileCheck, Upload, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { contracts as fallbackContracts } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { Contract, ContractMilestoneItem } from "@/types";

function getMilestoneIcon(status: ContractMilestoneItem["status"]) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />;
    case "submitted":
      return <Upload className="h-5 w-5 text-blue-500" />;
    case "revision_requested":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Circle className="h-5 w-5 text-[var(--muted-foreground)]" />;
  }
}

function getMilestoneBadgeVariant(status: ContractMilestoneItem["status"]): "success" | "warning" | "default" | "destructive" | "secondary" {
  switch (status) {
    case "approved": return "success";
    case "in_progress": return "warning";
    case "submitted": return "default";
    case "revision_requested": return "destructive";
    default: return "secondary";
  }
}

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const isClient = user?.role?.toLowerCase() === "client";
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadContract() {
      try {
        const res = await fetch(`/api/contracts/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data && !data.error) {
            setContract(data);
            return;
          }
        }
      } catch {
        // Fallback
      }

      const fallback = fallbackContracts.find((c) => c.id === params.id);
      if (!cancelled && fallback) {
        setContract(fallback);
      }
    }

    loadContract().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Contract Not Found</h1>
        <p className="text-[var(--muted-foreground)] mb-4">The contract you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/contracts"><Button variant="outline">Back to Contracts</Button></Link>
      </div>
    );
  }

  const approvedMilestones = contract.milestones.filter((m) => m.status === "approved");
  const releasedAmount = approvedMilestones.reduce((s, m) => s + m.amount, 0);
  const progressPct = Math.round((releasedAmount / contract.totalAmount) * 100);
  const activeMilestone = contract.milestones.find((m) => m.status === "in_progress");

  // Contract lifecycle steps
  const steps = [
    { label: "Proposal Sent", completed: true },
    { label: "Accepted", completed: true },
    { label: "Contract Created", completed: true },
    { label: "In Development", completed: contract.status === "active" || contract.status === "in_review" || contract.status === "completed" },
    { label: "Under Review", completed: contract.status === "in_review" || contract.status === "completed" },
    { label: "Completed", completed: contract.status === "completed" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <Link href="/contracts" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Contracts
      </Link>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(contract.status)}>{contract.status.replace("_", " ")}</Badge>
              <span className="text-xs text-[var(--muted-foreground)]">Started {formatDate(contract.startDate)}</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Contract #{contract.id.slice(-6).toUpperCase()}</h1>
            <p className="text-[var(--muted-foreground)] text-sm">
              {contract.student?.name} ↔ {contract.client?.name}
            </p>
          </div>
          <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-1.5"
                disabled={messagingLoading}
                onClick={async () => {
                  const otherUserId = isClient ? contract.studentId : contract.clientId;
                  setMessagingLoading(true);
                  try {
                    const res = await fetch("/api/messages/conversations", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        participantId: otherUserId,
                        contractId: contract.id,
                        context: { type: "contract", id: contract.id },
                      }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      router.push(`/messages?conv=${data.conversation.id}`);
                    }
                  } catch (err) {
                    console.error("Failed to start conversation:", err);
                  } finally {
                    setMessagingLoading(false);
                  }
                }}
              >
                <MessageSquare className="h-4 w-4" />
                {isClient ? "Message Developer" : "Message Client"}
              </Button>
            {!isClient && activeMilestone && (
              <Button className="gap-1.5">
                <Upload className="h-4 w-4" /> Submit Milestone
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contract Lifecycle Stepper */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between overflow-x-auto gap-1">
              {steps.map((step, idx) => (
                <div key={step.label} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center text-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                      step.completed
                        ? "bg-emerald-500 text-white"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                    }`}>
                      {step.completed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <p className={`text-[10px] mt-1.5 whitespace-nowrap ${step.completed ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-[var(--muted-foreground)]"}`}>
                      {step.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 rounded ${step.completed ? "bg-emerald-500" : "bg-[var(--border)]"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Summary */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader><CardTitle className="text-lg">Financial Overview</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-[var(--muted)]/30">
                    <p className="text-xl font-bold">{formatCurrency(contract.totalAmount)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {isClient ? "Total Contract" : "Project Value"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(releasedAmount)}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {isClient ? "Paid Out" : "Platform Fee (10%)"}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(isClient ? Math.max(0, contract.totalAmount - releasedAmount) : contract.studentEarnings)}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {isClient ? "In Escrow" : "Your Earnings"}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[var(--muted-foreground)]">Payment Progress</span>
                    <span className="font-semibold">{formatCurrency(releasedAmount)} / {formatCurrency(contract.totalAmount)} ({progressPct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--muted)]">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Milestones */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader><CardTitle className="text-lg">Milestones</CardTitle></CardHeader>
              <CardContent className="space-y-0">
                {contract.milestones.map((milestone, idx) => (
                  <div key={milestone.id} className="relative">
                    {/* Timeline connector */}
                    {idx < contract.milestones.length - 1 && (
                      <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                        milestone.status === "approved" ? "bg-emerald-300 dark:bg-emerald-700" : "bg-[var(--border)]"
                      }`} />
                    )}
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[var(--muted)]/30 transition-colors">
                      <div className="shrink-0 mt-0.5">
                        {getMilestoneIcon(milestone.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{milestone.title}</h4>
                          <Badge variant={getMilestoneBadgeVariant(milestone.status)} className="text-[10px]">
                            {milestone.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] mb-2">{milestone.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {formatCurrency(milestone.amount)}</span>
                          {milestone.dueDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Due: {formatDate(milestone.dueDate)}</span>}
                          {milestone.approvedAt && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Approved {formatDate(milestone.approvedAt)}</span>}
                        </div>
                      </div>
                      {/* Milestone actions */}
                      <div className="shrink-0">
                        {milestone.status === "in_progress" && !isClient && (
                          <Button size="sm" className="text-xs gap-1">
                            <Upload className="h-3 w-3" /> Submit
                          </Button>
                        )}
                        {milestone.status === "in_progress" && isClient && (
                          <Badge variant="warning" className="text-xs">In Development</Badge>
                        )}
                        {milestone.status === "submitted" && isClient && (
                          <Button size="sm" className="text-xs gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <CheckCircle2 className="h-3 w-3" /> Approve & Release
                          </Button>
                        )}
                        {milestone.status === "submitted" && !isClient && (
                          <Badge variant="default" className="text-xs">Awaiting Review</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Client</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name={contract.client?.name || "Client"} size="lg" />
                  <div>
                    <p className="font-semibold">{contract.client?.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{contract.client?.clientProfile?.organization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{contract.client?.clientProfile?.rating}</span>
                  <span className="text-[var(--muted-foreground)]">({contract.client?.clientProfile?.reviewCount} reviews)</span>
                </div>
                {contract.client?.isVerified && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Organization
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Student Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Developer</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar name={contract.student?.name || "Developer"} size="lg" />
                  <div>
                    <p className="font-semibold">{contract.student?.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{contract.student?.studentProfile?.college}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{contract.student?.studentProfile?.rating}</span>
                  <span className="text-[var(--muted-foreground)]">• {contract.student?.studentProfile?.completedProjects} projects</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contract Details */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader><CardTitle className="text-base">Contract Details</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Contract ID</span><span className="font-mono">{contract.id}</span></div>
                <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Start Date</span><span>{formatDate(contract.startDate)}</span></div>
                {contract.expectedEndDate && <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Expected End</span><span>{formatDate(contract.expectedEndDate)}</span></div>}
                <div className="flex justify-between"><span className="text-[var(--muted-foreground)]">Milestones</span><span>{approvedMilestones.length} / {contract.milestones.length} completed</span></div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
