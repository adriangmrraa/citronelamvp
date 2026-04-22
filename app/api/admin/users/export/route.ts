import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();
    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        tokens: users.tokens,
        isVerified: users.isVerified,
        emailVerified: users.emailVerified,
        planType: users.planType,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(asc(users.createdAt));

    const header = 'id,username,email,role,tokens,isVerified,emailVerified,planType,createdAt\n';
    const rows = allUsers
      .map((u) => {
        const email = (u.email ?? '').replace(/,/g, ' ');
        const username = (u.username ?? '').replace(/,/g, ' ');
        const createdAt = u.createdAt ? new Date(u.createdAt).toISOString() : '';
        return `${u.id},${username},${email},${u.role},${u.tokens ?? 0},${u.isVerified},${u.emailVerified},${u.planType},${createdAt}`;
      })
      .join('\n');

    const csv = header + rows;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="users.csv"',
      },
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('GET /api/admin/users/export error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
