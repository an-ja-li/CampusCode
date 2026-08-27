// ============================================================
// CampusCode — Registration API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, college, degree, graduationYear, skills, bio, organization, website, description } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Determine role
    const userRole = role === 'client' ? 'CLIENT' : 'STUDENT';

    // Create user with profile in a transaction
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          role: userRole as 'STUDENT' | 'CLIENT',
          isVerified: true,
        },
      });

      if (userRole === 'STUDENT') {
        await tx.studentProfile.create({
          data: {
            userId: newUser.id,
            college: college || 'University',
            degree: degree || 'Computer Science',
            graduationYear: Number(graduationYear) || 2026,
            skills: Array.isArray(skills) ? skills : ['React', 'TypeScript', 'Next.js'],
            bio: bio || '',
            level: 'BEGINNER',
          },
        });
      } else {
        await tx.clientProfile.create({
          data: {
            userId: newUser.id,
            organization: organization || name.trim(),
            website: website || null,
            description: description || bio || '',
          },
        });
      }

      return newUser;
    });

    // Return user without password
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API Register Error]:', error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
