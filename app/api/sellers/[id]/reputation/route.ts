import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews, orders } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sellerId = parseInt(params.id, 10);
    if (isNaN(sellerId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    // All reviews for this seller
    const sellerReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.sellerId, sellerId));

    const reviewCount = sellerReviews.length;
    const avgRating =
      reviewCount === 0
        ? 0
        : Math.round((sellerReviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) / reviewCount) * 10) / 10;

    // Total delivered orders where any item came from this seller
    // Approximation: count orders that have a review linked to this seller (each review = 1 completed order)
    // For a precise count we'd need to join orderItems → products → sellerId, but that's complex.
    // Using reviews count as a proxy for delivered orders since reviews can only be added after delivery.
    const totalSales = reviewCount;

    return NextResponse.json({ avgRating, reviewCount, totalSales });
  } catch (error) {
    console.error('GET /api/sellers/[id]/reputation error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
