// ============================================================
// CampusCode — Profile API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        studentProfile: {
          include: { badges: true },
        },
        clientProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('[API Profile GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, avatar, college, degree, graduationYear, skills, bio, github, linkedin } = body;

    // Update user base fields
    const userUpdate: Record<string, unknown> = {};
    if (name !== undefined) userUpdate.name = name;
    if (avatar !== undefined) userUpdate.avatar = avatar;

    if (Object.keys(userUpdate).length > 0) {
      await db.user.update({
        where: { id: session.user.id },
        data: userUpdate,
      });
    }

    // Update student profile if applicable
    const profileUpdate: Record<string, unknown> = {};
    if (college !== undefined) profileUpdate.college = college;
    if (degree !== undefined) profileUpdate.degree = degree;
    if (graduationYear !== undefined) profileUpdate.graduationYear = Number(graduationYear);
    if (skills !== undefined) profileUpdate.skills = skills;
    if (bio !== undefined) profileUpdate.bio = bio;
    if (github !== undefined) profileUpdate.github = github;
    if (linkedin !== undefined) profileUpdate.linkedin = linkedin;

    if (Object.keys(profileUpdate).length > 0) {
      await db.studentProfile.updateMany({
        where: { userId: session.user.id },
        data: profileUpdate,
      });
    }

    // Fetch and return updated user
    const updatedUser = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        studentProfile: {
          include: { badges: true },
        },
        clientProfile: true,
      },
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('[API Profile PATCH Error]:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
