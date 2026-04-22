import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';

export async function GET() {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
    const allUsers = await db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      tokens: users.tokens,
      isVerified: users.isVerified,
      emailVerified: users.emailVerified,
      planType: users.planType,
      isCultivator: users.isCultivator,
      createdAt: users.createdAt,
    }).from(users).orderBy(users.createdAt);
    return NextResponse.json({ users: allUsers });
  } catch (error) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
}
