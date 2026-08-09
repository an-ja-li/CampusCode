"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Star, Clock, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { proposals } from "@/lib/mock-data";
import { formatCurrency, getStatusColor } from "@/lib/utils";

export default function ProposalsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">My Proposals</h1>
        <p className="text-[var(--muted-foreground)] mb-6">Track your submitted proposals</p>
      </motion.div>

      <div className="space-y-4">
        {proposals.map((proposal, i) => (
          <motion.div key={proposal.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Card className="card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold">AI-Powered Resume Screening System</h3>
                      <Badge className={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">{proposal.content}</p>

                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <span className="font-semibold text-[var(--primary)]">{formatCurrency(proposal.price)}</span>
                      <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <Clock className="h-3.5 w-3.5" /> {proposal.estimatedDelivery} days
                      </span>
                      <span className="text-[var(--muted-foreground)]">{proposal.milestones.length} milestones</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {proposal.technologies.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {proposal.status === "accepted" && (
                      <Link href="/contracts"><Button size="sm">View Contract</Button></Link>
                    )}
                    <Button variant="outline" size="sm"><MessageSquare className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>

                {/* Milestones Preview */}
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Milestones</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {proposal.milestones.map((m) => (
                      <div key={m.id} className="shrink-0 px-3 py-2 rounded-lg bg-[var(--muted)]/50 text-xs">
                        <p className="font-medium">{m.title}</p>
                        <p className="text-[var(--muted-foreground)]">{formatCurrency(m.amount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {proposals.length === 0 && (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 mx-auto text-[var(--muted-foreground)]/30 mb-4" />
            <h3 className="font-semibold mb-1">No proposals yet</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">Browse solution requests and submit your first proposal</p>
            <Link href="/solutions"><Button>Browse Opportunities</Button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
