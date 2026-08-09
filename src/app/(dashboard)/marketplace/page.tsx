"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search, Star, Filter, SlidersHorizontal, Grid3X3, List,
  ArrowUpDown, Code2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
    if (priceFilter === "free" && !p.isFree) return false;
    if (priceFilter === "paid" && p.isFree) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "popular") return b.salesCount - a.salesCount;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Software Marketplace</h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          Discover and purchase software built by student developers
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="h-10 rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
            <select
              className="h-10 rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results Count */}
      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        {filtered.length} {filtered.length === 1 ? "product" : "products"} found
      </p>

      {/* Product Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
          >
            <Link href={`/marketplace/${product.id}`}>
              <Card className="card-hover h-full">
                <CardContent className="p-5">
                  {/* Thumbnail */}
                  <div className="h-40 rounded-lg bg-gradient-to-br from-[var(--muted)] to-[var(--muted)]/50 mb-4 flex items-center justify-center relative overflow-hidden">
                    <Code2 className="h-10 w-10 text-[var(--muted-foreground)]/30" />
                    {product.isFree && (
                      <Badge variant="success" className="absolute top-2 right-2">Free</Badge>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
                    <span className="font-bold text-[var(--primary)] whitespace-nowrap text-sm">
                      {product.isFree ? "Free" : formatCurrency(product.price)}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {product.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                    {product.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{product.technologies.length - 3}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-[var(--foreground)]">{product.rating}</span>
                      <span>({product.reviewCount})</span>
                    </div>
                    <span>{product.salesCount.toLocaleString()} sales</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Code2 className="h-12 w-12 mx-auto text-[var(--muted-foreground)]/30 mb-4" />
          <h3 className="font-semibold mb-1">No products found</h3>
          <p className="text-sm text-[var(--muted-foreground)]">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
