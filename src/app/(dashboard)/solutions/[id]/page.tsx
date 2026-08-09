"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Users, CheckCircle2, Send, Calendar, DollarSign,
  AlertCircle, FileText, Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Textarea, Label } from "@/components/ui/input";
import { solutionRequests } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime, formatDate } from "@/lib/utils";

export default function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const request = solutionRequests.find((sr) => sr.id === id);
  const [showProposalForm, setShowProposalForm] = useState(false);

  if (!request) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Requirement not found</h1>
        <Link href="/solutions"><Button variant="outline" className="mt-4">Back to Solutions</Button></Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <Link href="/solutions" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Solutions
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant={request.status === "open" ? "success" : "warning"}>
                {request.status === "open" ? "Open" : "In Progress"}
              </Badge>
              <Badge variant="outline">{request.difficulty}</Badge>
              <Badge variant="outline">{request.solutionType.replace("_", " / ").toUpperCase()}</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-3">{request.title}</h1>
            <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] flex-wrap">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Posted {formatRelativeTime(request.createdAt)}</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" />{request.proposalCount} proposals</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Deadline: {formatDate(request.deadline)}</span>
            </div>
          </div>

          {/* Problem Statement */}
          <Card>
            <CardHeader><CardTitle>Problem Statement</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{request.problemStatement}</p>
            </CardContent>
          </Card>

          {/* Required Features */}
          <Card>
            <CardHeader><CardTitle>Required Features</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {request.requiredFeatures.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader><CardTitle>Preferred Technologies</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {request.preferredTechnologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1.5">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader><CardTitle>Expected Deliverables</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {request.expectedDeliverables.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-[var(--primary)] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Proposal Form */}
          {showProposalForm ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader><CardTitle>Submit Your Proposal</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">Your Proposal</Label>
                    <Textarea placeholder="Explain how you will solve this problem..." rows={5} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5 block">Estimated Delivery (days)</Label>
                      <Input type="number" placeholder="20" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Your Price (₹)</Label>
                      <Input type="number" placeholder="18000" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Technology Stack</Label>
                    <Input placeholder="React, Node.js, PostgreSQL" />
                  </div>

                  <div>
                    <Label className="mb-2 block">Milestones</Label>
                    <div className="space-y-3">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="grid grid-cols-3 gap-2">
                          <Input placeholder={`Milestone ${n}`} className="col-span-2" />
                          <Input type="number" placeholder="₹ Amount" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="w-full" onClick={() => setShowProposalForm(false)}>Cancel</Button>
                    <Button className="w-full"><Send className="h-4 w-4" />Submit Proposal</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {/* Action */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Budget</p>
                <p className="text-2xl font-bold">
                  {request.budgetMin && request.budgetMax
                    ? `${formatCurrency(request.budgetMin)} – ${formatCurrency(request.budgetMax)}`
                    : "Open to Proposals"}
                </p>
                {request.isFixedPrice && <Badge variant="secondary" className="mt-1">Fixed Price</Badge>}
              </div>

              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Deadline</p>
                <p className="font-medium">{formatDate(request.deadline)}</p>
              </div>

              <div>
                <p className="text-sm text-[var(--muted-foreground)] mb-1">Proposals</p>
                <p className="font-medium">{request.proposalCount} received</p>
              </div>

              <Button className="w-full" size="lg" onClick={() => setShowProposalForm(true)}>
                <Send className="h-4 w-4" /> Submit Proposal
              </Button>
            </CardContent>
          </Card>

          {/* Client */}
          {request.client && (
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-[var(--muted-foreground)] mb-3">Posted by</p>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={request.client.name} />
                  <div>
                    <p className="font-semibold text-sm">{request.client.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {request.client.clientProfile?.profileType}
                    </p>
                  </div>
                </div>
                {request.client.isVerified && (
                  <Badge variant="success" className="mb-2">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                  </Badge>
                )}
                <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-[var(--border)]">
                  <div>
                    <p className="font-bold text-sm">{request.client.clientProfile?.projectsPosted || 0}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Posted</p>
                  </div>
                  <div>
                    <p className="font-bold text-sm">
                      {request.client.clientProfile?.rating || 0}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
