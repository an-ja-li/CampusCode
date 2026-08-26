"use client";

import { motion } from "framer-motion";
import { Wallet as WalletIcon, TrendingUp, Clock, DollarSign, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/lib/user-store";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function EarningsPage() {
  const { user } = useAuth();
  const { stats, contracts } = useUserData();

  const totalEarned = stats.totalEarnings;
  const pendingAmount = contracts
    .filter((c) => c.status === "active")
    .reduce((sum, c) => sum + (c.studentEarnings || 0), 0);
  const availableBalance = Math.max(0, totalEarned - pendingAmount);

  const earningsChartData = [
    { month: "Jan", earnings: 0 },
    { month: "Feb", earnings: 0 },
    { month: "Mar", earnings: 0 },
    { month: "Apr", earnings: 0 },
    { month: "May", earnings: 0 },
    { month: "Jun", earnings: 0 },
    { month: "Jul", earnings: Math.round(totalEarned * 0.4) },
    { month: "Aug", earnings: totalEarned },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Earnings & Wallet</h1>
        <p className="text-[var(--muted-foreground)] mb-6">Track your software sales, milestone payouts, and withdrawal balances.</p>
      </motion.div>

      {/* Wallet Cards */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3 opacity-80">
              <WalletIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Available Balance</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(availableBalance)}</p>
            <Button
              size="sm"
              disabled={availableBalance === 0}
              className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0 disabled:opacity-50"
            >
              Withdraw Funds
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3 text-[var(--muted-foreground)]">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Pending Escrow</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(pendingAmount)}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">Held in milestone escrow</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3 text-[var(--muted-foreground)]">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-medium">Total Earned</span>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(totalEarned)}</p>
            <p className="text-xs text-emerald-600 mt-2">90% net creator royalty</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Earnings Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value) || 0), "Earnings"]}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                    }}
                  />
                  <Area type="monotone" dataKey="earnings" stroke="var(--primary)" strokeWidth={2} fill="url(#earnGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
