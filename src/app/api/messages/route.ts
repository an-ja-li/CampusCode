// ============================================================
// CampusCode — Messages & Conversations API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// GET: Fetch conversations list or messages for a specific conversation
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    // ── Fetch messages for a specific conversation ──
    if (conversationId) {
      // Verify user is a participant
      const participant = await db.conversationParticipant.findUnique({
        where: {
          conversationId_userId: {
            conversationId,
            userId,
          },
        },
      });

      if (!participant) {
        return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
      }

      const messages = await db.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
              role: true,
            },
          },
        },
      });

      return NextResponse.json({ messages });
    }

    // ── Fetch all conversations for the current user ──
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                isVerified: true,
                clientProfile: {
                  select: {
                    organization: true,
                    website: true,
                    description: true,
                    rating: true,
                    reviewCount: true,
                    projectsPosted: true,
                  },
                },
                studentProfile: {
                  select: {
                    college: true,
                    degree: true,
                    graduationYear: true,
                    skills: true,
                    bio: true,
                    level: true,
                    rating: true,
                    reviewCount: true,
                    completedProjects: true,
                    portfolioUrl: true,
                    github: true,
                    linkedin: true,
                  },
                },
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Calculate unread counts per conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await db.message.count({
          where: {
            conversationId: conv.id,
            isRead: false,
            senderId: { not: userId },
          },
        });

        return {
          ...conv,
          lastMessage: conv.messages[0] || null,
          unreadCount,
        };
      })
    );

    return NextResponse.json({
      conversations: conversationsWithUnread,
      total: conversationsWithUnread.length,
    });
  } catch (error) {
    console.error('[API Messages GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST: Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, content, type, attachmentUrl } = body;

    if (!conversationId || (!content?.trim() && !attachmentUrl)) {
      return NextResponse.json({ error: 'conversationId and content or attachment are required' }, { status: 400 });
    }

    // Verify user is a participant
    const participant = await db.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
    }

    // Determine type
    let messageType: 'TEXT' | 'FILE' | 'IMAGE' | 'SYSTEM' = 'TEXT';
    if (type) {
      const upper = type.toUpperCase();
      if (['TEXT', 'FILE', 'IMAGE', 'SYSTEM'].includes(upper)) {
        messageType = upper as 'TEXT' | 'FILE' | 'IMAGE' | 'SYSTEM';
      }
    }

    // Create the message
    const newMessage = await db.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: content?.trim() || (messageType === 'IMAGE' ? '📷 Image' : '📎 Attachment'),
        type: messageType,
        attachmentUrl: attachmentUrl || null,
        isRead: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // Update conversation timestamp
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('[API Messages POST Error]:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
