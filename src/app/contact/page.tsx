"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    // Simulate contact submission
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs mx-auto">Get in Touch</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Contact the CampusCode Team</h1>
          <p className="text-[var(--muted-foreground)] text-sm sm:text-base">
            Have questions about student developer verification, escrow contracts, or university partnerships? We are here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            <Card className="border-[var(--border)]">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Email Support</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">support@campuscode.dev</p>
                  <p className="text-xs text-[var(--muted-foreground)]">partnerships@campuscode.dev</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)]">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Community Discord</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">discord.gg/campuscode</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Over 10,000 active students</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--border)]">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Headquarters</h3>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    CampusCode Inc.<br />
                    Koramangala, Bengaluru, Karnataka 560034
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            <Card className="border-[var(--border)] shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {isSent ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold">Message Delivered</h3>
                    <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
                      Thank you for reaching out! Our developer relations team will get back to you within 24 hours.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setIsSent(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Your Name *</Label>
                        <Input
                          placeholder="Harsh Vardhan"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Email Address *</Label>
                        <Input
                          type="email"
                          placeholder="harsh@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs font-semibold mb-1 block">Subject</Label>
                      <Input
                        placeholder="Inquiry about college partnerships / developer hiring"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-xs font-semibold mb-1 block">Message *</Label>
                      <Textarea
                        rows={5}
                        placeholder="How can we help you?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full gap-2 cursor-pointer">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" /> Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
