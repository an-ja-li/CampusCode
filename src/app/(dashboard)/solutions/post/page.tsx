"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Lightbulb, Settings,
  FileText, Calendar, DollarSign, Upload, Eye, Rocket,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { SOLUTION_TYPES, BUDGET_RANGES, TECHNOLOGIES } from "@/lib/constants";

const steps = [
  { id: 1, label: "Problem", icon: Lightbulb },
  { id: 2, label: "Solution Type", icon: Settings },
  { id: 3, label: "Requirements", icon: FileText },
  { id: 4, label: "Budget", icon: DollarSign },
  { id: 5, label: "Deadline", icon: Calendar },
  { id: 6, label: "Attachments", icon: Upload },
  { id: 7, label: "Publish", icon: Rocket },
];

export default function PostRequirementPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [pricingType, setPricingType] = useState<"fixed" | "open">("fixed");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Post a Requirement</h1>
        <p className="text-[var(--muted-foreground)] mb-8">Describe your software need and let student developers build it</p>
      </motion.div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1">
            <button
              onClick={() => s.id <= step && setStep(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                step === s.id ? "bg-[var(--primary)] text-white" : step > s.id ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              }`}
            >
              {step > s.id ? <CheckCircle2 className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className={`w-4 h-0.5 shrink-0 ${step > s.id ? "bg-emerald-400" : "bg-[var(--border)]"}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>What problem do you want solved?</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Requirement Title</Label>
                <Input placeholder="e.g., AI-Powered Resume Screening System" />
              </div>
              <div>
                <Label className="mb-1.5 block">Describe Your Problem</Label>
                <Textarea placeholder="Describe the problem you need solved in detail. What are you trying to achieve? What are the pain points?" rows={6} />
              </div>
              <div className="p-4 rounded-lg bg-[var(--muted)]/50 text-sm">
                <p className="font-medium mb-1">💡 Example:</p>
                <p className="text-[var(--muted-foreground)]">I need a web application for managing inventory for a small retail business. Currently we track everything in spreadsheets which leads to errors and stock-outs.</p>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => setStep(2)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>What type of solution do you need?</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3">
                {SOLUTION_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedType === type.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:border-[var(--primary)]/30"
                    }`}
                  >
                    <p className="font-medium text-sm">{type.label}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(3)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Requirements & Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Required Features</Label>
                <Textarea placeholder="List the features you need (one per line)..." rows={5} />
              </div>
              <div>
                <Label className="mb-1.5 block">Preferred Technology</Label>
                <Input placeholder="React, Node.js, PostgreSQL..." />
              </div>
              <div>
                <Label className="mb-1.5 block">Integrations</Label>
                <Input placeholder="Payment gateway, Email, SMS..." />
              </div>
              <div>
                <Label className="mb-1.5 block">Platform</Label>
                <select className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
                  <option>Web</option>
                  <option>Mobile (Android)</option>
                  <option>Mobile (iOS)</option>
                  <option>Mobile (Both)</option>
                  <option>Desktop</option>
                  <option>Web + Mobile</option>
                </select>
              </div>
              <div>
                <Label className="mb-1.5 block">Expected Deliverables</Label>
                <Textarea placeholder="Source code, Documentation, Deployment..." rows={3} />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(4)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Budget</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setPricingType("fixed")}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${pricingType === "fixed" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)]"}`}
                >
                  <p className="font-semibold">Fixed Price</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Set a budget range</p>
                </button>
                <button
                  onClick={() => setPricingType("open")}
                  className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${pricingType === "open" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)]"}`}
                >
                  <p className="font-semibold">Open to Proposals</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Let developers suggest</p>
                </button>
              </div>

              {pricingType === "fixed" && (
                <div className="space-y-2">
                  {BUDGET_RANGES.filter((b) => b.id !== "custom").map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setSelectedBudget(budget.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer text-left ${
                        selectedBudget === budget.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:bg-[var(--muted)]"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full border-2 ${selectedBudget === budget.id ? "border-[var(--primary)] bg-[var(--primary)]" : "border-[var(--border)]"}`} />
                      <span className="text-sm font-medium">{budget.label}</span>
                    </button>
                  ))}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <Label className="mb-1.5 block">Custom Min (₹)</Label>
                      <Input type="number" placeholder="5000" />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Custom Max (₹)</Label>
                      <Input type="number" placeholder="50000" />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(5)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 5 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Timeline & Priority</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Expected Completion Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label className="mb-1.5 block">Priority</Label>
                <select className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
                  <option value="low">Low — Flexible timeline</option>
                  <option value="medium">Medium — Within deadline</option>
                  <option value="high">High — Urgent requirement</option>
                </select>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(4)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(6)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 6 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Attachments</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center">
                <Upload className="h-10 w-10 mx-auto text-[var(--muted-foreground)]/50 mb-3" />
                <p className="text-sm font-medium mb-1">Upload Reference Files</p>
                <p className="text-xs text-[var(--muted-foreground)]">PDFs, images, requirement documents, wireframes</p>
                <Button variant="outline" size="sm" className="mt-3">Choose Files</Button>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(5)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(7)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {step === 7 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="text-center">
            <CardContent className="p-8 sm:p-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-6">
                <Rocket className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Ready to publish?</h2>
              <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">Your requirement will be visible to student developers who can submit proposals.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => setStep(6)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Link href="/solutions">
                  <Button size="lg"><Rocket className="h-4 w-4" /> Publish Requirement</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
