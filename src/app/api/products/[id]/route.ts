// ============================================================
// CampusCode — Product Detail API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let product = null;
    try {
      product = await db.product.findFirst({
        where: {
          OR: [
            { id },
            { slug: id },
          ],
        },
        include: {
          seller: {
            include: {
              studentProfile: {
                include: { badges: true },
              },
            },
          },
          reviews: true,
        },
      });
    } catch (dbErr) {
      console.warn('[API Product Detail DB Warning]:', dbErr);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[API Product Detail GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const product = await db.product.findUnique({
      where: { id },
      select: { sellerId: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Product Delete Error]:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
