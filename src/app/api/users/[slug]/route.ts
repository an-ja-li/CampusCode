// ============================================================
// CampusCode — Public User/Student Portfolio API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
    const cleanTarget = cleanSlug.replace(/^@/, '');

    // Query Neon PostgreSQL database for matching user
    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: cleanSlug },
          { id: cleanTarget },
          { studentProfile: { portfolioUrl: cleanSlug } },
          { studentProfile: { portfolioUrl: `@${cleanTarget}` } },
          { studentProfile: { portfolioUrl: cleanTarget } },
          { name: { equals: cleanSlug, mode: 'insensitive' } },
        ],
      },
      include: {
        studentProfile: {
          include: { badges: true },
        },
        clientProfile: true,
        products: {
          where: { status: 'PUBLISHED' },
        },
        ownedProjects: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = dbUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('[API Public User GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
