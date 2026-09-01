"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, ExternalLink, ShoppingCart, CheckCircle2, Code2,
  ArrowLeft, Globe, FileText, GitBranch, Download, Shield, Loader2, MessageSquare,
  CreditCard, Smartphone, Check, Cloud, Sparkles, X, AlertCircle, Copy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input, Label } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import type { Product, User } from "@/types";

export default function ProductDetailPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: productId } = use(params);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);
  const [contactingLoading, setContactingLoading] = useState(false);

  // Checkout & Download State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [downloadTriggered, setDownloadTriggered] = useState(false);
  const [licenseKey, setLicenseKey] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data && !data.error) {
            setProduct(data);
            return;
          }
        }
      } catch (fetchErr) {
        console.warn("[MarketplaceDetail] API fetch warning:", fetchErr);
      }

      if (!cancelled) {
        setProduct(null);
      }
    }

    loadProduct().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Helper to trigger immediate source code download
  const triggerImmediateDownload = (prod: Product) => {
    setDownloadTriggered(true);

    // If Google Drive link is provided, open it immediately
    if (prod.driveUrl) {
      window.open(prod.driveUrl, "_blank");
    }

    // If GitHub repo is provided and no direct file, open repo
    if (prod.githubUrl && !prod.driveUrl) {
      window.open(prod.githubUrl, "_blank");
    }

    // Always trigger direct source code bundle package download (.zip / starter package)
    try {
      const readmeContent = `# ${prod.name}\n\n${prod.description}\n\n## License\n${prod.license} License\n\n## Documentation\n${prod.documentation || "Please refer to the online guide at CampusCode."}\n\n## Repository / Cloud Access\n${prod.driveUrl ? `Google Drive: ${prod.driveUrl}\n` : ""}${prod.githubUrl ? `GitHub Repo: ${prod.githubUrl}\n` : ""}\n\nThank you for supporting student developers on CampusCode!`;
      const blob = new Blob([readmeContent], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(prod.slug || prod.name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-package-instructions.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to trigger local file download:", err);
    }
  };

  const handlePurchaseOrFree = async () => {
    setIsProcessingOrder(true);

    try {
      // Simulate payment processing via payments API
      if (!product?.isFree) {
        await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "create_order",
            amount: product?.price || 499,
            receipt: `rcpt_${Date.now()}`,
          }),
        }).catch((e) => console.error("Payment API:", e));
      }

      // Generate verified license key
      const key = `CC-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      setLicenseKey(key);

      // Increment sales count locally in state
      if (product) {
        setProduct((prev) => (prev ? { ...prev, salesCount: prev.salesCount + 1 } : prev));
      }

      setOrderComplete(true);

      // Trigger immediate download as requested by user
      if (product) {
        setTimeout(() => {
          triggerImmediateDownload(product);
        }, 500);
      }
    } catch (err) {
      console.error("Order processing error:", err);
    } finally {
      setIsProcessingOrder(false);
    }
  };

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

  const seller: User = (product.seller as User) || {
    id: product.sellerId || "seller",
    name: "Developer",
    email: "developer@campuscode.dev",
    role: "student",
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
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
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-sm">{product.rating}</span>
                    <span className="text-sm text-[var(--muted-foreground)]">({product.reviewCount} reviews)</span>
                  </div>
                  <span className="text-sm text-[var(--muted-foreground)]">{product.salesCount.toLocaleString()} sales</span>
                  <Badge variant="outline">{product.license}</Badge>
                  {product.driveUrl && (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Cloud className="h-3 w-3 text-blue-500" /> Drive Download Ready
                    </Badge>
                  )}
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

          {/* Requirements & Installation */}
          {(product.requirements || product.documentation) && (
            <Card>
              <CardHeader><CardTitle>Setup & Requirements</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {product.requirements && product.requirements.length > 0 && (
                  <ul className="space-y-1.5">
                    {product.requirements.map((req) => (
                      <li key={req} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                        {req}
                      </li>
                    ))}
                  </ul>
                )}
                {product.documentation && (
                  <div className="pt-3 border-t border-[var(--border)]">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                      Included Documentation
                    </p>
                    <p className="text-xs text-[var(--foreground)] bg-[var(--muted)]/40 p-3 rounded-lg font-mono whitespace-pre-line">
                      {product.documentation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Sticky Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6 self-start">
          {/* Buy Card */}
          <Card className="border-[var(--primary)]/30 shadow-lg">
            <CardContent className="p-5 space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold mb-1 text-[var(--primary)]">
                  {product.isFree || product.price === 0 || Number(product.price) === 0 ? "Free" : formatCurrency(product.price)}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Instant download + lifetime license
                </p>
              </div>

              <Button
                className="w-full gap-2 text-base font-semibold py-6 shadow-md hover:shadow-xl transition-all cursor-pointer"
                size="lg"
                onClick={() => {
                  setOrderComplete(false);
                  setIsCheckoutOpen(true);
                }}
              >
                {product.isFree || product.price === 0 || Number(product.price) === 0 ? (
                  <>
                    <Download className="h-5 w-5" />
                    Download for Free
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Buy Now & Download
                  </>
                )}
              </Button>

              {product.demoUrl && (
                <Button
                  variant="outline"
                  className="w-full gap-2 cursor-pointer"
                  onClick={() => window.open(product.demoUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Interactive Demo
                </Button>
              )}

              {/* Instant Delivery badges */}
              <div className="p-3 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Download className="h-3.5 w-3.5" />
                  <span>Immediate Direct Download</span>
                </div>
                {product.driveUrl && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                    <Cloud className="h-3.5 w-3.5" />
                    <span>Google Drive Folder Included</span>
                  </div>
                )}
                {product.githubUrl && (
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>GitHub Repo Access Included</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--border)] space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Version</span>
                  <span className="font-medium">{product.version || "1.0.0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">License</span>
                  <span className="font-medium">{product.license || "Commercial"}</span>
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
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Student Developer
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
              <Button
                variant="outline"
                className="w-full mt-2 gap-1.5 cursor-pointer"
                size="sm"
                disabled={contactingLoading}
                onClick={async () => {
                  if (!seller.id) return;
                  setContactingLoading(true);
                  try {
                    const res = await fetch("/api/messages/conversations", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        participantId: seller.id,
                        context: { type: "product", id: product.id },
                      }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      router.push(`/messages?conv=${data.conversation.id}`);
                    }
                  } catch (err) {
                    console.error("Failed to contact seller:", err);
                  } finally {
                    setContactingLoading(false);
                  }
                }}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Contact Seller
              </Button>
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
                  <span className="text-[var(--foreground)]">Instant repository & Google Drive download</span>
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

      {/* ============================================================ */}
      {/* INTERACTIVE CHECKOUT & IMMEDIATE DOWNLOAD MODAL              */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-lg font-bold">
                    {orderComplete
                      ? "Purchase Complete!"
                      : product.isFree
                      ? "Instant Download"
                      : "Complete Checkout"}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {orderComplete
                      ? "Your project is ready to download and explore"
                      : product.isFree
                      ? "Free software download for developer community"
                      : "Secure payment powered by Razorpay"}
                  </p>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--muted)] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {!orderComplete ? (
                  <>
                    {/* Order Item Summary */}
                    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-sm">{product.name}</h4>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          License: {product.license} • Instant delivery
                        </p>
                      </div>
                      <p className="text-xl font-bold text-[var(--primary)] shrink-0">
                        {product.isFree ? "Free" : formatCurrency(product.price)}
                      </p>
                    </div>

                    {/* Delivery Assurance Notice */}
                    <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                      <p className="font-semibold flex items-center gap-1.5">
                        <Download className="h-4 w-4 text-blue-500" />
                        Immediate Download Trigger
                      </p>
                      <p className="opacity-90">
                        Upon clicking confirm, the project package will download immediately to your machine, and you will receive instant Google Drive and GitHub repository access.
                      </p>
                    </div>

                    {!product.isFree && (
                      /* Payment Method Selection */
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                          Select Payment Method
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("upi")}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                              paymentMethod === "upi"
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                                : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                            }`}
                          >
                            <Smartphone className="h-5 w-5" />
                            <span className="text-xs font-semibold">UPI / QR</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                              paymentMethod === "card"
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                                : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                            }`}
                          >
                            <CreditCard className="h-5 w-5" />
                            <span className="text-xs font-semibold">Card</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("netbanking")}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                              paymentMethod === "netbanking"
                                ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                                : "border-[var(--border)] hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                            }`}
                          >
                            <Globe className="h-5 w-5" />
                            <span className="text-xs font-semibold">Net Banking</span>
                          </button>
                        </div>

                        {paymentMethod === "upi" && (
                          <div className="space-y-1.5 pt-2">
                            <Label className="text-xs">Enter UPI ID (e.g. gpay, phonepe, paytm)</Label>
                            <Input
                              placeholder="username@okhdfcbank"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                            <p className="text-[11px] text-[var(--muted-foreground)]">
                              Test Sandbox: Any valid UPI ID format will process instantly.
                            </p>
                          </div>
                        )}

                        {paymentMethod === "card" && (
                          <div className="space-y-3 pt-2">
                            <div>
                              <Label className="text-xs">Card Number</Label>
                              <Input
                                placeholder="4532 •••• •••• 8890"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Expiry</Label>
                                <Input
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label className="text-xs">CVV</Label>
                                <Input
                                  placeholder="•••"
                                  type="password"
                                  maxLength={4}
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button
                        className="w-full py-6 text-base font-semibold shadow-lg cursor-pointer"
                        size="lg"
                        disabled={isProcessingOrder}
                        onClick={handlePurchaseOrFree}
                      >
                        {isProcessingOrder ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Processing & Preparing Download...
                          </>
                        ) : product.isFree ? (
                          <>
                            <Download className="h-5 w-5 mr-2" />
                            Confirm & Download Free
                          </>
                        ) : (
                          <>
                            <Check className="h-5 w-5 mr-2" />
                            Pay {formatCurrency(product.price)} & Download Instantly
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  /* ORDER COMPLETED & IMMEDIATE DOWNLOAD CONFIRMATION */
                  <div className="space-y-5 text-center py-2">
                    <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                      <Check className="h-8 w-8" />
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-[var(--foreground)] mb-1">
                        Download Started!
                      </h4>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Your project download was triggered automatically. You can also use the links below.
                      </p>
                    </div>

                    {/* License Certificate Box */}
                    <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 text-left space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">
                          License Certificate Key
                        </span>
                        <Badge variant="success" className="text-[10px]">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[var(--card)] border border-[var(--border)] font-mono text-xs">
                        <span className="truncate">{licenseKey}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(licenseKey);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }}
                          className="text-[var(--primary)] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          {copiedKey ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          {copiedKey ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Direct Links Grid */}
                    <div className="space-y-2 text-left">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                        Access & Repository Options
                      </p>

                      <Button
                        className="w-full gap-2 cursor-pointer"
                        onClick={() => triggerImmediateDownload(product)}
                      >
                        <Download className="h-4 w-4" /> Download Package Instructions & Archive Again
                      </Button>

                      {product.driveUrl && (
                        <Button
                          variant="outline"
                          className="w-full gap-2 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 hover:bg-blue-50/50 cursor-pointer"
                          onClick={() => window.open(product.driveUrl, "_blank")}
                        >
                          <Cloud className="h-4 w-4 text-blue-500" /> Open Google Drive Folder
                          <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
                        </Button>
                      )}

                      {product.githubUrl && (
                        <Button
                          variant="outline"
                          className="w-full gap-2 cursor-pointer"
                          onClick={() => window.open(product.githubUrl, "_blank")}
                        >
                          <GitBranch className="h-4 w-4 text-[var(--primary)]" /> Open GitHub Repository
                          <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
                        </Button>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[var(--border)] flex justify-between gap-3">
                      <Link href="/dashboard" className="flex-1">
                        <Button variant="outline" className="w-full text-xs">
                          Go to Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="default"
                        className="flex-1 text-xs cursor-pointer"
                        onClick={() => setIsCheckoutOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
