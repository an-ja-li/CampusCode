// ============================================================
// CampusCode — Messages & Conversations API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { conversations as mockConversations, messages as mockMessages } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');

    if (conversationId) {
      try {
        const dbMessages = await db.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: 'asc' },
          include: {
            sender: true,
          },
        });

        if (dbMessages && dbMessages.length > 0) {
          return NextResponse.json({ messages: dbMessages });
        }
      } catch {
        // Fallback
      }

      const msgs = mockMessages.filter((m) => m.conversationId === conversationId);
      return NextResponse.json({ messages: msgs });
    }

    try {
      const dbConversations = await db.conversation.findMany({
        where: userId
          ? {
              participants: {
                some: { userId },
              },
            }
          : undefined,
        orderBy: { updatedAt: 'desc' },
        include: {
          participants: {
            include: { user: true },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (dbConversations && dbConversations.length > 0) {
        return NextResponse.json({ conversations: dbConversations, total: dbConversations.length });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({ conversations: mockConversations, total: mockConversations.length });
  } catch (error) {
    console.error('[API Messages Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    try {
      const newMessage = await db.message.create({
        data: {
          conversationId: body.conversationId,
          senderId: body.senderId || 'u1',
          content: body.content,
          type: body.type ? body.type.toUpperCase() : 'TEXT',
          attachmentUrl: body.attachmentUrl || null,
          isRead: false,
        },
        include: {
          sender: true,
        },
      });

      // Update conversation timestamp
      await db.conversation.update({
        where: { id: body.conversationId },
        data: { updatedAt: new Date() },
      }).catch(() => {});

      return NextResponse.json(newMessage, { status: 201 });
    } catch {
      return NextResponse.json(
        {
          id: `msg_${Date.now()}`,
          ...body,
          createdAt: new Date().toISOString(),
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[API Messages Create Error]:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
