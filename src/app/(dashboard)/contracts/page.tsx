"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileCheck, DollarSign, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { useUserData } from "@/lib/user-store";

export default function ContractsPage() {
  const { contracts, isLoaded } = useUserData();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-1">Active Contracts</h1>
          <p className="text-[var(--muted-foreground)]">Manage client contracts, milestone deliverables, and payments</p>
        </div>
      </motion.div>

      {!isLoaded ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 w-36 rounded bg-[var(--muted)]" />
                <div className="h-5 w-20 rounded-full bg-[var(--muted)]" />
              </div>
              <div className="flex gap-6">
                <div className="h-4 w-28 rounded bg-[var(--muted)]" />
                <div className="h-4 w-32 rounded bg-[var(--muted)]" />
                <div className="h-4 w-24 rounded bg-[var(--muted)]" />
              </div>
            </div>
          ))}
        </div>
      ) : contracts.length > 0 ? (
        <div className="space-y-4">
          {contracts.map((contract, i) => (
            <motion.div key={contract.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Link href={`/contracts/${contract.id}`}>
                <Card className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-base">Contract #{contract.id.slice(-6).toUpperCase()}</h3>
                          <Badge className={getStatusColor(contract.status)}>{contract.status.replace("_", " ")}</Badge>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)] flex-wrap mb-4">
                          <span>Total: <strong className="text-[var(--foreground)]">{formatCurrency(contract.totalAmount)}</strong></span>
                          <span>Your Payout: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(contract.studentEarnings)}</strong></span>
                          <span>Started: {formatDate(contract.startDate)}</span>
                        </div>
                      </div>

                      <Button size="sm">View Contract Details</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] mx-auto mb-4">
            <FileCheck className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold mb-1">No active contracts yet</h3>
          <p className="text-sm text-[var(--muted-foreground)] max-w-sm mx-auto mb-6">
            When a client accepts your proposal, a secure milestone contract will be created automatically here.
          </p>
          <Link href="/solutions">
            <Button className="gap-2">
              Browse Client Requests <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
