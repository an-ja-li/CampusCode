"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Shield, Palette, CreditCard, Globe, Code2,
  Moon, Sun, Monitor, Save,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { currentUser } from "@/lib/mock-data";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = currentUser;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
      </motion.div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Profile Photo</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar name={user.name} size="xl" />
                    <div>
                      <Button variant="outline" size="sm">Upload Photo</Button>
                      <p className="text-xs text-[var(--muted-foreground)] mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5 block">Full Name</Label>
                      <Input defaultValue={user.name} />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Email</Label>
                      <Input defaultValue={user.email} type="email" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Bio</Label>
                    <Textarea defaultValue={user.studentProfile?.bio} rows={3} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5 block">College</Label>
                      <Input defaultValue={user.studentProfile?.college} />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">Degree</Label>
                      <Input defaultValue={user.studentProfile?.degree} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1.5 block">GitHub</Label>
                      <Input defaultValue={user.studentProfile?.github} />
                    </div>
                    <div>
                      <Label className="mb-1.5 block">LinkedIn</Label>
                      <Input defaultValue={user.studentProfile?.linkedin} />
                    </div>
                  </div>
                  <Button><Save className="h-4 w-4" /> Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.studentProfile?.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1.5">{skill}</Badge>
                    ))}
                  </div>
                  <Input placeholder="Add a skill..." />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "New proposal received", desc: "When someone submits a proposal on your requirement" },
                    { label: "Proposal accepted", desc: "When your proposal is accepted by a client" },
                    { label: "New message", desc: "When you receive a new message" },
                    { label: "Milestone completed", desc: "When a milestone is marked as complete" },
                    { label: "Payment received", desc: "When you receive a payment" },
                    { label: "New opportunities", desc: "When matching solution requests are posted" },
                    { label: "Product sale", desc: "When someone purchases your product" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{item.desc}</p>
                      </div>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" /> Email
                        </label>
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded" /> Push
                        </label>
                      </div>
                    </div>
                  ))}
                  <Button><Save className="h-4 w-4" /> Save Preferences</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">New Password</Label>
                    <Input type="password" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Confirm New Password</Label>
                    <Input type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Connected Accounts</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Google", connected: true },
                    { name: "GitHub", connected: true },
                  ].map((acc) => (
                    <div key={acc.name} className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-[var(--muted-foreground)]" />
                        <span className="font-medium text-sm">{acc.name}</span>
                      </div>
                      <Badge variant={acc.connected ? "success" : "secondary"}>
                        {acc.connected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-red-200 dark:border-red-900/30">
                <CardHeader><CardTitle className="text-red-500">Danger Zone</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">Once you delete your account, there is no going back.</p>
                  <Button variant="destructive">Delete Account</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "appearance" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "light", label: "Light", icon: Sun },
                      { id: "dark", label: "Dark", icon: Moon },
                      { id: "system", label: "System", icon: Monitor },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        className="p-4 rounded-xl border-2 border-[var(--border)] text-center hover:border-[var(--primary)]/30 transition-all cursor-pointer"
                      >
                        <theme.icon className="h-6 w-6 mx-auto mb-2 text-[var(--muted-foreground)]" />
                        <p className="text-sm font-medium">{theme.label}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">UPI ID</Label>
                    <Input placeholder="yourname@paytm" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Bank Account Number</Label>
                    <Input placeholder="XXXXXXXXXXXX" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">IFSC Code</Label>
                    <Input placeholder="SBIN0001234" />
                  </div>
                  <Button><Save className="h-4 w-4" /> Save Payment Details</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Tax Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block">PAN Number</Label>
                    <Input placeholder="ABCDE1234F" />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">GST Number (optional)</Label>
                    <Input placeholder="22AAAAA0000A1Z5" />
                  </div>
                  <Button><Save className="h-4 w-4" /> Save Tax Info</Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
