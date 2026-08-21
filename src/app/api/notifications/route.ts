// ============================================================
// CampusCode — Notifications API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { notifications } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'u1';
  const unreadOnly = searchParams.get('unread') === 'true';

  let filtered = notifications.filter((n) => n.userId === userId);
  if (unreadOnly) {
    filtered = filtered.filter((n) => !n.isRead);
  }

  return NextResponse.json({
    notifications: filtered,
    unreadCount: filtered.filter((n) => !n.isRead).length,
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { action, notificationId } = body;

  if (action === 'mark_read') {
    return NextResponse.json({ success: true, id: notificationId });
  }
  if (action === 'mark_all_read') {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
