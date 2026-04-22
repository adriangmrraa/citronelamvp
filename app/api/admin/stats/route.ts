import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, crops, orders, posts, events, tokenTransactions } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, sql, gte } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      usersCount,
      pendingCount,
      emailVerifiedCount,
      cropsCount,
      ordersCount,
      tokensSum,
      postsWeekCount,
      eventsCount,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.isVerified, false)),
      db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.emailVerified, true)),
      db.select({ count: sql<number>`count(*)` }).from(crops),
      db.select({ count: sql<number>`count(*)` }).from(orders),
      db.select({ total: sql<number>`coalesce(sum(${tokenTransactions.amount}), 0)` }).from(tokenTransactions),
      db.select({ count: sql<number>`count(*)` }).from(posts).where(gte(posts.createdAt, oneWeekAgo)),
      db.select({ count: sql<number>`count(*)` }).from(events),
    ]);

    const totalUsers = Number(usersCount[0]?.count ?? 0);
    const pendingUsers = Number(pendingCount[0]?.count ?? 0);
    const emailVerified = Number(emailVerifiedCount[0]?.count ?? 0);
    const totalCrops = Number(cropsCount[0]?.count ?? 0);
    const totalOrders = Number(ordersCount[0]?.count ?? 0);
    const totalTokens = Number(tokensSum[0]?.total ?? 0);
    const postsThisWeek = Number(postsWeekCount[0]?.count ?? 0);
    const totalEvents = Number(eventsCount[0]?.count ?? 0);

    const emailVerificationRate = totalUsers > 0 ? Math.round((emailVerified / totalUsers) * 100) : 0;
    const verifiedRate = totalUsers > 0 ? Math.round(((totalUsers - pendingUsers) / totalUsers) * 100) : 0;

    return NextResponse.json({
      totalUsers,
      pendingUsers,
      emailVerifiedCount: emailVerified,
      emailVerificationRate,
      verifiedRate,
      totalCrops,
      totalOrders,
      totalTokens,
      postsThisWeek,
      totalEvents,
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('GET /api/admin/stats error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
