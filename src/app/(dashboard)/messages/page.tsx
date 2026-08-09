"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Paperclip, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { conversations, messages as allMessages } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

export default function MessagesPage() {
  const [selectedConv, setSelectedConv] = useState(conversations[0]?.id || "");
  const [newMessage, setNewMessage] = useState("");

  const currentMessages = allMessages.filter((m) => m.conversationId === selectedConv);
  const currentConv = conversations.find((c) => c.id === selectedConv);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-[var(--border)] flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-[var(--border)]">
          <h2 className="font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input placeholder="Search conversations..." className="pl-10 h-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const otherUser = conv.participants.find((p) => p.id !== "u1") || conv.participants[0];
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                className={`w-full flex items-center gap-3 p-4 border-b border-[var(--border)] text-left transition-colors cursor-pointer ${
                  selectedConv === conv.id ? "bg-[var(--primary)]/5" : "hover:bg-[var(--muted)]"
                }`}
              >
                <Avatar name={otherUser.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{otherUser.name}</p>
                    <span className="text-[10px] text-[var(--muted-foreground)] shrink-0">
                      {conv.lastMessage ? formatRelativeTime(conv.lastMessage.createdAt) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] truncate">
                    {conv.lastMessage?.content || "No messages"}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="h-5 min-w-5 px-1.5 text-[10px]">{conv.unreadCount}</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConv ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 flex items-center gap-3 border-b border-[var(--border)] shrink-0">
              <Avatar name={currentConv.participants.find((p) => p.id !== "u1")?.name || "User"} />
              <div>
                <p className="font-semibold text-sm">
                  {currentConv.participants.find((p) => p.id !== "u1")?.name}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {currentConv.projectId ? "Project conversation" : "Direct message"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((msg) => {
                if (msg.type === "system") {
                  return (
                    <div key={msg.id} className="text-center">
                      <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1 rounded-full">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                const isSent = msg.senderId !== "c1";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${isSent ? "chat-bubble-sent" : "chat-bubble-received"} px-4 py-2.5`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isSent ? "text-white/60" : "text-[var(--muted-foreground)]"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="shrink-0 text-[var(--muted-foreground)]">
                  <Paperclip className="h-4.5 w-4.5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && setNewMessage("")}
                />
                <Button size="icon" className="shrink-0">
                  <Send className="h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <p className="font-semibold mb-1">Select a conversation</p>
              <p className="text-sm text-[var(--muted-foreground)]">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
