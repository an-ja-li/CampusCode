// ============================================================
// CampusCode — Conversations API (Find or Create)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// POST: Find an existing 1-on-1 conversation or create a new one
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const body = await request.json();
    let { participantId, proposalId, contractId, context } = body;

    // Auto-resolve participantId if context or IDs are provided
    if (!participantId) {
      const propId = proposalId || (context?.type === 'proposal' ? context.id : null);
      const contId = contractId || (context?.type === 'contract' ? context.id : null);

      if (propId) {
        const prop = await db.proposal.findUnique({
          where: { id: propId },
          include: { solutionRequest: true },
        });
        if (prop) {
          if (prop.studentId === currentUserId) {
            participantId = prop.solutionRequest.clientId;
          } else {
            participantId = prop.studentId;
          }
        }
      } else if (contId) {
        const cont = await db.contract.findUnique({
          where: { id: contId },
        });
        if (cont) {
          if (cont.studentId === currentUserId) {
            participantId = cont.clientId;
          } else {
            participantId = cont.studentId;
          }
        }
      }
    }

    if (!participantId) {
      return NextResponse.json({ error: 'participantId could not be determined' }, { status: 400 });
    }

    if (participantId === currentUserId) {
      return NextResponse.json({ error: 'Cannot create conversation with yourself' }, { status: 400 });
    }

    // Verify the target user exists
    const targetUser = await db.user.findUnique({
      where: { id: participantId },
      select: { id: true, name: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if a conversation already exists between the two users
    const existingConversation = await db.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: currentUserId } } },
          { participants: { some: { userId: participantId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                clientProfile: { select: { organization: true } },
                studentProfile: { select: { college: true } },
              },
            },
          },
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json({ conversation: existingConversation, isNew: false });
    }

    // Create a new conversation with both participants
    const newConversation = await db.conversation.create({
      data: {
        projectId: context?.projectId || null,
        participants: {
          create: [
            { userId: currentUserId },
            { userId: participantId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
                clientProfile: { select: { organization: true } },
                studentProfile: { select: { college: true } },
              },
            },
          },
        },
      },
    });

    // If context is provided, send a system message to start the conversation
    if (context?.type || proposalId || contractId) {
      const type = context?.type || (proposalId ? 'proposal' : contractId ? 'contract' : 'general');
      const contextMessages: Record<string, string> = {
        proposal: 'Conversation started regarding project proposal.',
        contract: 'Conversation started regarding active contract.',
        product: 'Conversation started from a marketplace listing.',
      };

      await db.message.create({
        data: {
          conversationId: newConversation.id,
          senderId: currentUserId,
          content: contextMessages[type] || 'Conversation started.',
          type: 'SYSTEM',
          isRead: true,
        },
      });

      await db.conversation.update({
        where: { id: newConversation.id },
        data: { updatedAt: new Date() },
      });
    }

    return NextResponse.json({ conversation: newConversation, isNew: true }, { status: 201 });
  } catch (error) {
    console.error('[API Conversations POST Error]:', error);
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
  }
}
