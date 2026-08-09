"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, ExternalLink, ShoppingCart, CheckCircle2, Code2,
  ArrowLeft, Globe, FileText, GitBranch, Download, Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { products, students } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productId } = use(params);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Product not found</h1>
        <Link href="/marketplace"><Button variant="outline" className="mt-4">Back to Marketplace</Button></Link>
      </div>
    );
  }

  const seller = product.seller || students[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Back */}
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            {/* Screenshot placeholder */}
            <div className="h-64 sm:h-80 rounded-xl bg-gradient-to-br from-[var(--muted)] to-[var(--muted)]/50 mb-6 flex items-center justify-center">
              <Code2 className="h-16 w-16 text-[var(--muted-foreground)]/20" />
            </div>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-sm">{product.rating}</span>
                    <span className="text-sm text-[var(--muted-foreground)]">({product.reviewCount} reviews)</span>
                  </div>
                  <span className="text-sm text-[var(--muted-foreground)]">{product.salesCount.toLocaleString()} sales</span>
                  <Badge variant="outline">{product.license}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--primary)]">
                  {product.isFree ? "Free" : formatCurrency(product.price)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)] whitespace-pre-line">
                {product.longDescription}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader><CardTitle>Features</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card>
            <CardHeader><CardTitle>Tech Stack</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {product.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1.5">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader><CardTitle>What&apos;s Included</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-2">
                {product.includes.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[var(--primary)] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Score */}
          <Card>
            <CardHeader><CardTitle>Product Quality</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(product.qualityScore)
                  .filter(([key]) => key !== "overall")
                  .map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className="font-medium">{value}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--muted)]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            value >= 90 ? "bg-emerald-500" : value >= 70 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="font-semibold">Overall Score</span>
                  <span className="text-xl font-bold text-[var(--primary)]">{product.qualityScore.overall}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Installation */}
          <Card>
            <CardHeader><CardTitle>Installation Guide</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-sm bg-[var(--muted)] rounded-lg p-4 overflow-x-auto whitespace-pre-wrap font-mono">
                {product.installationGuide}
              </pre>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {product.requirements.map((req) => (
                  <li key={req} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--muted-foreground)]" />
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {/* Buy Card */}
          <Card className="sticky top-4">
            <CardContent className="p-5 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold mb-1">
                  {product.isFree ? "Free" : formatCurrency(product.price)}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">One-time purchase</p>
              </div>

              <Button className="w-full" size="lg">
                <ShoppingCart className="h-4 w-4" />
                {product.isFree ? "Get for Free" : "Buy Now"}
              </Button>

              {product.demoUrl && (
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Button>
              )}

              <div className="pt-3 border-t border-[var(--border)] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Version</span>
                  <span className="font-medium">{product.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">License</span>
                  <span className="font-medium">{product.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Category</span>
                  <span className="font-medium capitalize">{product.category.replace("-", " / ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Updated</span>
                  <span className="font-medium">{new Date(product.updatedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={seller.name} size="lg" />
                <div>
                  <h3 className="font-semibold">{seller.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {seller.studentProfile?.bio.split(".")[0]}
                  </p>
                </div>
              </div>

              {seller.isVerified && (
                <Badge variant="success" className="mb-3">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Student
                </Badge>
              )}

              <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[var(--border)]">
                <div>
                  <p className="font-bold text-sm">{seller.studentProfile?.completedProjects || 0}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Products</p>
                </div>
                <div>
                  <p className="font-bold text-sm">{seller.studentProfile?.totalSales || 0}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Sales</p>
                </div>
                <div>
                  <p className="font-bold text-sm flex items-center justify-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {seller.studentProfile?.rating || 0}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Rating</p>
                </div>
              </div>

              <Link href={`/portfolio/${seller.studentProfile?.portfolioUrl || seller.id}`}>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
