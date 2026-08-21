// ============================================================
// CampusCode — Messages API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { conversations, messages } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');

  if (conversationId) {
    const msgs = messages.filter((m) => m.conversationId === conversationId);
    return NextResponse.json({ messages: msgs });
  }

  return NextResponse.json({ conversations, total: conversations.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(
    {
      id: `msg_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    },
    { status: 201 }
  );
}
