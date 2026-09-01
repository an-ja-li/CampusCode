// ============================================================
// CampusCode — Contract Milestones & Escrow Release API Route
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
    const { id: contractId } = await params;
    const body = await request.json();
    const { action, milestoneId, notes, repoLink, driveLink } = body;

    const contract = await db.contract.findUnique({
      where: { id: contractId },
      include: { milestones: true },
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    if (action === 'submit') {
      // Student submits milestone deliverables
      const updated = await db.contractMilestone.update({
        where: { id: milestoneId },
        data: {
          status: 'SUBMITTED',
          description: notes ? `${notes} ${repoLink ? `| Repo: ${repoLink}` : ''}` : undefined,
        },
      });

      return NextResponse.json({ success: true, milestone: updated });
    }

    if (action === 'approve') {
      // Client approves milestone and releases payout
      const milestone = await db.contractMilestone.findUnique({
        where: { id: milestoneId },
      });

      if (!milestone) {
        return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
      }

      await db.contractMilestone.update({
        where: { id: milestoneId },
        data: {
          status: 'APPROVED',
          completedAt: new Date(),
        },
      });

      // Check if all milestones are approved
      const remaining = await db.contractMilestone.count({
        where: {
          contractId,
          status: { not: 'APPROVED' },
        },
      });

      if (remaining === 0) {
        await db.contract.update({
          where: { id: contractId },
          data: { status: 'COMPLETED' },
        });
      } else {
        // Activate next pending milestone
        const nextPending = await db.contractMilestone.findFirst({
          where: { contractId, status: 'PENDING' },
          orderBy: { createdAt: 'asc' },
        });

        if (nextPending) {
          await db.contractMilestone.update({
            where: { id: nextPending.id },
            data: { status: 'IN_PROGRESS' },
          });
        }
      }

      // Update student profile earnings
      await db.studentProfile.update({
        where: { userId: contract.studentId },
        data: {
          totalEarnings: { increment: milestone.amount * 0.9 },
        },
      }).catch((e) => console.error('[Update Earnings Error]:', e));

      return NextResponse.json({ success: true, isFullyCompleted: remaining === 0 });
    }

    if (action === 'request_revision') {
      const updated = await db.contractMilestone.update({
        where: { id: milestoneId },
        data: {
          status: 'REVISION_REQUESTED',
        },
      });

      return NextResponse.json({ success: true, milestone: updated });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[API Contract Milestone Error]:', error);
    return NextResponse.json({ error: 'Failed to process milestone action' }, { status: 500 });
  }
}
