// ============================================================
// CampusCode — Accept Proposal & Create Contract API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch proposal with requirement and milestones
    const proposal = await db.proposal.findUnique({
      where: { id },
      include: {
        solutionRequest: true,
        milestones: true,
        student: true,
      },
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Verify current user is the owner of the solution request
    if (proposal.solutionRequest.clientId !== session.user.id) {
      return NextResponse.json({ error: 'Only the requirement owner can accept proposals' }, { status: 403 });
    }

    // Update proposal status to ACCEPTED
    await db.proposal.update({
      where: { id },
      data: { status: 'ACCEPTED' },
    });

    // Update solution request status to IN_PROGRESS
    await db.solutionRequest.update({
      where: { id: proposal.solutionRequestId },
      data: { status: 'IN_PROGRESS' },
    });

    // Calculate platform fee and student earnings
    const totalAmount = Number(proposal.price);
    const platformFee = Math.round(totalAmount * 0.1);
    const studentEarnings = totalAmount - platformFee;

    // Create Contract with milestones
    const contract = await db.contract.create({
      data: {
        solutionRequestId: proposal.solutionRequestId,
        proposalId: proposal.id,
        studentId: proposal.studentId,
        clientId: session.user.id,
        totalAmount,
        platformFee,
        studentEarnings,
        status: 'ACTIVE',
        milestones: {
          create: proposal.milestones.map((m, idx) => ({
            title: m.title,
            description: m.description || '',
            amount: Number(m.amount),
            status: idx === 0 ? 'IN_PROGRESS' : 'PENDING',
          })),
        },
      },
      include: {
        milestones: true,
      },
    });

    // Create or find a conversation between client and student
    let conv = await db.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: session.user.id } } },
          { participants: { some: { userId: proposal.studentId } } },
        ],
      },
    });

    if (!conv) {
      conv = await db.conversation.create({
        data: {
          participants: {
            create: [
              { userId: session.user.id },
              { userId: proposal.studentId },
            ],
          },
        },
      });
    }

    // Add milestone / contract started system message
    await db.message.create({
      data: {
        conversationId: conv.id,
        senderId: session.user.id,
        content: `Contract #${contract.id.slice(-6).toUpperCase()} started! Milestone 1 is now in progress.`,
        type: 'SYSTEM',
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      contractId: contract.id,
      conversationId: conv.id,
    });
  } catch (error) {
    console.error('[API Proposal Accept Error]:', error);
    return NextResponse.json({ error: 'Failed to accept proposal' }, { status: 500 });
  }
}
