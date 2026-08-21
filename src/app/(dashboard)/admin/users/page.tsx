"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, Ban, MoreHorizontal, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { students } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const allUsers = students;
  const filtered = allUsers.filter(
    (u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">User Management</h1>
        <p className="text-[var(--muted-foreground)] mb-6">Manage all registered users</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input placeholder="Search users..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="h-4 w-4" /> Filters</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">User</th>
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">Role</th>
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">Status</th>
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">College</th>
                  <th className="py-3 px-4 text-left font-medium text-[var(--muted-foreground)]">Joined</th>
                  <th className="py-3 px-4 text-right font-medium text-[var(--muted-foreground)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)]/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      {user.isVerified ? (
                        <Badge variant="success"><ShieldCheck className="h-3 w-3 mr-1" />Verified</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{user.studentProfile?.college || "—"}</td>
                    <td className="py-3 px-4 text-[var(--muted-foreground)]">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {!user.isVerified && <Button variant="outline" size="sm">Verify</Button>}
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600"><Ban className="h-3.5 w-3.5" /></Button>
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
