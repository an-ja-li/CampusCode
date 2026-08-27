"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, ExternalLink, ShoppingCart, CheckCircle2, Code2,
  ArrowLeft, Globe, FileText, GitBranch, Download, Shield, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { products as fallbackProducts, students } from "@/lib/mock-data";
import type { Product, User } from "@/types";

export default function ProductDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productId } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data) {
            setProduct(data);
            return;
          }
        }
      } catch {
        // Fallback
      }

      // Local fallback
      const fallback = fallbackProducts.find((p) => p.id === productId || p.slug === productId);
      if (!cancelled) {
        setProduct(fallback || null);
      }
      if (!cancelled) setLoading(false);
    }

    loadProduct().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          The software product you are looking for does not exist or has been removed.
        </p>
        <Link href="/marketplace">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const seller: User = (product.seller as User) || students.find((s) => s.id === product.sellerId) || students[0];
  const hasScreenshots = product.screenshots && product.screenshots.length > 0;
  const currentImage = hasScreenshots ? product.screenshots[selectedScreenshotIndex] || product.screenshots[0] : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Back */}
      <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Main Content */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
          {/* Header & Screenshots */}
          <div>
            {/* Screenshot Display */}
            {hasScreenshots ? (
              <div className="space-y-3 mb-6">
                <div className="h-72 sm:h-96 rounded-xl overflow-hidden border border-[var(--border)] bg-black/20 shadow-md">
                  <img
                    src={currentImage!}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.screenshots.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.screenshots.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedScreenshotIndex(idx)}
                        className={`h-16 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedScreenshotIndex === idx
                            ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/30 scale-105"
                            : "border-[var(--border)] opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 sm:h-80 rounded-xl bg-gradient-to-br from-[var(--muted)] to-[var(--muted)]/50 mb-6 flex items-center justify-center border border-[var(--border)]">
                <Code2 className="h-16 w-16 text-[var(--muted-foreground)]/20" />
              </div>
            )}

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
                {product.longDescription || product.description}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          {product.features && product.features.length > 0 && (
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
          )}

          {/* Tech Stack */}
          {product.technologies && product.technologies.length > 0 && (
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
          )}

          {/* Requirements */}
          {product.requirements && product.requirements.length > 0 && (
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
          )}
        </motion.div>

        {/* Sticky Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6 self-start">
          {/* Buy Card */}
          <Card>
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
                  <span className="font-medium">{new Date(product.updatedAt || Date.now()).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
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
                    {seller.studentProfile?.bio?.split(".")[0] || "Verified Developer"}
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
                  <p className="text-xs text-[var(--muted-foreground)]">Projects</p>
                </div>
                <div>
                  <p className="font-bold text-sm">{seller.studentProfile?.totalSales || 0}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Sales</p>
                </div>
                <div>
                  <p className="font-bold text-sm flex items-center justify-center gap-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {seller.studentProfile?.rating || 4.9}
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

          {/* Trust & Guarantee Card */}
          <Card className="bg-[var(--muted)]/30 border-dashed">
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                CampusCode Guarantee
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[var(--foreground)]">Verified clean code & dependencies</span>
                </div>
                <div className="flex items-start gap-2">
                  <Download className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-[var(--foreground)]">Instant repository & archive download</span>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-3.5 w-3.5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-[var(--foreground)]">Complete setup & deployment guide included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
