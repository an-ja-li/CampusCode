"use client";

import { motion } from "framer-motion";
import { Wallet as WalletIcon, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studentWallet, earningsData, transactions } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function EarningsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Earnings</h1>
        <p className="text-[var(--muted-foreground)] mb-6">Track your earnings and transactions</p>
      </motion.div>

      {/* Wallet Cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3 opacity-80">
              <WalletIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Available Balance</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(studentWallet.available)}</p>
            <Button size="sm" className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0">
              Withdraw
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3 text-[var(--muted-foreground)]">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(studentWallet.pending)}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">From active milestones</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3 text-[var(--muted-foreground)]">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Total Earned</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(studentWallet.totalEarned)}</p>
            <p className="text-xs text-emerald-600 mt-2">↑ 18% from last month</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mb-8">
          <CardHeader><CardTitle>Earnings Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${v / 1000}K`} />
                  <Tooltip formatter={(value: any) => [formatCurrency(Number(value) || 0), "Earnings"]} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "0.5rem" }} />
                  <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} fill="url(#earningsGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === "payment" ? "bg-emerald-100 dark:bg-emerald-900/30" :
                    tx.type === "payout" ? "bg-blue-100 dark:bg-blue-900/30" :
                    tx.type === "commission" ? "bg-amber-100 dark:bg-amber-900/30" :
                    "bg-red-100 dark:bg-red-900/30"
                  }`}>
                    {tx.type === "payment" || tx.type === "payout" ? (
                      <ArrowDownRight className={`h-5 w-5 ${tx.type === "payment" ? "text-emerald-600" : "text-blue-600"}`} />
                    ) : (
                      <ArrowUpRight className={`h-5 w-5 ${tx.type === "commission" ? "text-amber-600" : "text-red-600"}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{formatRelativeTime(tx.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-semibold text-sm ${tx.type === "commission" ? "text-red-500" : "text-emerald-600"}`}>
                      {tx.type === "commission" ? "-" : "+"}{formatCurrency(tx.amount)}
                    </p>
                    <Badge variant={tx.status === "completed" ? "success" : "warning"} className="text-[10px]">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
