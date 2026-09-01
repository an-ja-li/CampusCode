// ============================================================
// CampusCode — Notifications API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'u1';
    const unreadOnly = searchParams.get('unread') === 'true';

    try {
      const dbNotifications = await db.notification.findMany({
        where: {
          userId,
          ...(unreadOnly ? { isRead: false } : {}),
        },
        orderBy: { createdAt: 'desc' },
      });

      const unreadCount = await db.notification.count({
        where: { userId, isRead: false },
      });

      return NextResponse.json({
        notifications: dbNotifications || [],
        unreadCount,
      });
    } catch {
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
      });
    }
  } catch (error) {
    console.error('[API Notifications Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, notificationId, userId } = body;

    if (action === 'mark_read' && notificationId) {
      try {
        await db.notification.update({
          where: { id: notificationId },
          data: { isRead: true },
        });
      } catch {
        // Fallback
      }
      return NextResponse.json({ success: true, id: notificationId });
    }

    if (action === 'mark_all_read' && userId) {
      try {
        await db.notification.updateMany({
          where: { userId, isRead: false },
          data: { isRead: true },
        });
      } catch {
        // Fallback
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action parameters' }, { status: 400 });
  } catch (error) {
    console.error('[API Notifications Patch Error]:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
