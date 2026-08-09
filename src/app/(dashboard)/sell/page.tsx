"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Upload, Code2,
  FileText, Image, DollarSign, Eye, Rocket, Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { CATEGORIES, TECHNOLOGIES, LICENSES } from "@/lib/constants";

const steps = [
  { id: 1, label: "Basic Info", icon: FileText },
  { id: 2, label: "Technology", icon: Code2 },
  { id: 3, label: "Media", icon: Image },
  { id: 4, label: "Files", icon: Upload },
  { id: 5, label: "Pricing", icon: DollarSign },
  { id: 6, label: "Preview", icon: Eye },
  { id: 7, label: "Publish", icon: Rocket },
];

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [pricing, setPricing] = useState<"free" | "paid">("paid");
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedLicense, setSelectedLicense] = useState("Commercial");

  const toggleTech = (tech: string) => {
    setSelectedTech((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Publish to Marketplace</h1>
        <p className="text-[var(--muted-foreground)] mb-8">List your software for sale on CampusCode</p>
      </motion.div>

      {/* Step Indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1">
            <button
              onClick={() => s.id <= step && setStep(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                step === s.id
                  ? "bg-[var(--primary)] text-white"
                  : step > s.id
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)]"
              }`}
            >
              {step > s.id ? <CheckCircle2 className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 shrink-0 ${step > s.id ? "bg-emerald-400" : "bg-[var(--border)]"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Product Name</Label>
                <Input placeholder="AI Resume Analyzer" />
              </div>
              <div>
                <Label className="mb-1.5 block">Short Description</Label>
                <Input placeholder="AI-powered resume analysis and scoring system" />
              </div>
              <div>
                <Label className="mb-1.5 block">Detailed Description</Label>
                <Textarea placeholder="Describe your product in detail..." rows={6} />
              </div>
              <div>
                <Label className="mb-1.5 block">Category</Label>
                <select className="flex h-10 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-1.5 block">Tags</Label>
                <Input placeholder="AI, NLP, Resume, HR Tech (comma separated)" />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => setStep(2)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Technology */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Technology Stack</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Languages & Frameworks</Label>
                <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[var(--border)] max-h-48 overflow-y-auto">
                  {TECHNOLOGIES.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        selectedTech.includes(tech)
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
                <Label className="mb-1.5 block">Database</Label>
                <Input placeholder="PostgreSQL, MongoDB..." />
              </div>
              <div>
                <Label className="mb-1.5 block">APIs & Integrations</Label>
                <Input placeholder="OpenAI, Stripe, Google Maps..." />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(3)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Media */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Screenshots & Media</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Screenshots</Label>
                <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-[var(--primary)]/30 transition-colors">
                  <Upload className="h-10 w-10 mx-auto text-[var(--muted-foreground)]/50 mb-3" />
                  <p className="text-sm font-medium mb-1">Upload Screenshots</p>
                  <p className="text-xs text-[var(--muted-foreground)]">PNG, JPG up to 5MB each. Recommended: 1280×720</p>
                  <Button variant="outline" size="sm" className="mt-3">Choose Files</Button>
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">Demo URL</Label>
                <Input placeholder="https://demo.yourproject.com" />
              </div>
              <div>
                <Label className="mb-1.5 block">Demo Video URL</Label>
                <Input placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(4)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 4: Files */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Files & Documentation</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">Source Code</Label>
                <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-[var(--muted-foreground)]/50 mb-2" />
                  <p className="text-sm font-medium mb-1">Upload Source Code</p>
                  <p className="text-xs text-[var(--muted-foreground)]">.zip archive up to 100MB</p>
                  <Button variant="outline" size="sm" className="mt-3">Choose File</Button>
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block">GitHub Repository (optional)</Label>
                <Input placeholder="https://github.com/username/repo" />
              </div>
              <div>
                <Label className="mb-1.5 block">Documentation</Label>
                <Textarea placeholder="Installation steps, usage guide, API docs..." rows={5} />
              </div>
              <div>
                <Label className="mb-1.5 block">Requirements</Label>
                <Textarea placeholder="Node.js 18+, PostgreSQL 14+, etc." rows={3} />
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(5)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 5: Pricing */}
      {step === 5 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Pricing & License</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Pricing Model</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPricing("free")}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      pricing === "free" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)]"
                    }`}
                  >
                    <p className="font-semibold">Free</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Open to everyone</p>
                  </button>
                  <button
                    onClick={() => setPricing("paid")}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      pricing === "paid" ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)]"
                    }`}
                  >
                    <p className="font-semibold">Paid</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Set your price</p>
                  </button>
                </div>
              </div>

              {pricing === "paid" && (
                <div>
                  <Label className="mb-1.5 block">Price (₹)</Label>
                  <Input type="number" placeholder="499" />
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">Platform fee: 10%. You receive 90% of each sale.</p>
                </div>
              )}

              <div>
                <Label className="mb-3 block">License</Label>
                <div className="space-y-2">
                  {LICENSES.map((lic) => (
                    <button
                      key={lic.id}
                      onClick={() => setSelectedLicense(lic.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer text-left ${
                        selectedLicense === lic.id ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[var(--border)] hover:bg-[var(--muted)]"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full border-2 ${selectedLicense === lic.id ? "border-[var(--primary)] bg-[var(--primary)]" : "border-[var(--border)]"}`} />
                      <div>
                        <p className="text-sm font-medium">{lic.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{lic.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(4)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(6)}>Next <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 6: Preview */}
      {step === 6 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Preview Your Listing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="h-48 rounded-xl bg-gradient-to-br from-[var(--muted)] to-[var(--muted)]/50 flex items-center justify-center">
                <Code2 className="h-12 w-12 text-[var(--muted-foreground)]/20" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">Your Product Name</h2>
                <p className="text-[var(--muted-foreground)] text-sm">Your product description will appear here.</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Category</Badge>
                {selectedTech.slice(0, 4).map((t) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {pricing === "free" ? "Free" : "₹499"}
                </span>
                <Badge variant="outline">{selectedLicense}</Badge>
              </div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(5)}><ArrowLeft className="h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(7)}>Looks Good <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 7: Publish */}
      {step === 7 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="text-center">
            <CardContent className="p-8 sm:p-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-6">
                <Rocket className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Ready to publish?</h2>
              <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
                Your product will be reviewed and published to the marketplace within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={() => setStep(6)}><ArrowLeft className="h-4 w-4" /> Back to Preview</Button>
                <Link href="/marketplace">
                  <Button size="lg"><Rocket className="h-4 w-4" /> Publish Product</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
