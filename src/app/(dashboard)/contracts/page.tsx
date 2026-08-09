"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileCheck, CheckCircle2, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { contracts } from "@/lib/mock-data";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

export default function ContractsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Active Contracts</h1>
        <p className="text-[var(--muted-foreground)] mb-6">Manage your ongoing contracts and milestones</p>
      </motion.div>

      <div className="space-y-6">
        {contracts.map((contract, i) => (
          <motion.div key={contract.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card>
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">Attendance Management System</h3>
                      <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                      {contract.client && <span>Client: {contract.client.name}</span>}
                      <span>Started: {formatDate(contract.startDate)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[var(--primary)]">{formatCurrency(contract.totalAmount)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Total Contract Value</p>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-[var(--muted)]/50 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">{formatCurrency(contract.totalAmount)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Project Value</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{formatCurrency(contract.platformFee)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Platform Fee</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(contract.studentEarnings)}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Your Earnings</p>
                  </div>
                </div>

                {/* Contract Flow */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-4">
                  {["Proposal", "Accepted", "Contract", "Development", "Review", "Completed"].map((stage, idx) => {
                    const activeIdx = contract.status === "active" ? 3 : contract.status === "completed" ? 5 : 2;
                    return (
                      <div key={stage} className="flex items-center gap-1">
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                          idx <= activeIdx ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                        }`}>
                          {idx < activeIdx && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                          {stage}
                        </div>
                        {idx < 5 && <ArrowRight className="h-3 w-3 text-[var(--muted-foreground)] shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Milestones */}
                <h4 className="font-semibold text-sm mb-3">Milestones</h4>
                <div className="space-y-3">
                  {contract.milestones.map((m) => (
                    <div key={m.id} className="flex items-center gap-4 p-3 rounded-lg border border-[var(--border)]">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        m.status === "approved" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" :
                        m.status === "in_progress" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                        "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}>
                        {m.status === "approved" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{m.title}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{m.description}</p>
                      </div>
                      <Badge className={getStatusColor(m.status)} >{m.status.replace("_", " ")}</Badge>
                      <span className="font-semibold text-sm shrink-0">{formatCurrency(m.amount)}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                  {contract.projectId && (
                    <Link href={`/projects/${contract.projectId}`}>
                      <Button size="sm">Open Project</Button>
                    </Link>
                  )}
                  <Link href="/messages"><Button variant="outline" size="sm">Message Client</Button></Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {contracts.length === 0 && (
          <div className="text-center py-16">
            <FileCheck className="h-12 w-12 mx-auto text-[var(--muted-foreground)]/30 mb-4" />
            <h3 className="font-semibold mb-1">No active contracts</h3>
            <p className="text-sm text-[var(--muted-foreground)]">Contracts are created when your proposals are accepted</p>
          </div>
        )}
      </div>
    </div>
  );
}
