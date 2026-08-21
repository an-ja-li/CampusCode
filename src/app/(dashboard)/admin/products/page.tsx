"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Eye, CheckCircle2, XCircle, Star, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "pending" | "published">("all");

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === "pending" && p.status !== "pending_review") return false;
    if (tab === "published" && p.status !== "published") return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Product Moderation</h1>
        <p className="text-[var(--muted-foreground)] mb-6">Review and manage marketplace products</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "pending", "published"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors cursor-pointer ${
              tab === t ? "bg-[var(--primary)] text-white" : "bg-[var(--muted)] text-[var(--muted-foreground)]"
            }`}
          >
            {t === "all" ? `All (${products.length})` : t === "pending" ? "Pending Review" : "Published"}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        <Input placeholder="Search products..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">Product</th>
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">Seller</th>
                  <th className="py-3 px-4 text-right font-medium text-[var(--muted-foreground)]">Price</th>
                  <th className="py-3 px-4 text-right font-medium text-[var(--muted-foreground)]">Rating</th>
                  <th className="py-3 px-4 text-right font-medium text-[var(--muted-foreground)]">Sales</th>
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">Listed</th>
                  <th className="py-3 px-4 text-right font-medium text-[var(--muted-foreground)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)] capitalize">{product.category}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{product.seller?.name || "—"}</td>
                    <td className="py-3 px-4 text-right font-medium">{product.isFree ? "Free" : formatCurrency(product.price)}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{product.rating}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">{product.salesCount}</td>
                    <td className="py-3 px-4">
                      <Badge variant={product.status === "published" ? "success" : product.status === "pending_review" ? "warning" : "secondary"}>
                        {product.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{formatDate(product.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="sm"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="outline" size="sm" className="text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500"><XCircle className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
