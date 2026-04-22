import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subscriptions, posts } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, and } from 'drizzle-orm';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const postId = parseInt(params.id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, postId));
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const [existing] = await db
      .select()
      .from(subscriptions)
      .where(and(eq(subscriptions.userId, session.userId), eq(subscriptions.postId, postId)));

    if (existing) {
      await db.delete(subscriptions).where(eq(subscriptions.id, existing.id));
      return NextResponse.json({ subscribed: false });
    }

    await db.insert(subscriptions).values({
      userId: session.userId,
      postId,
    });

    return NextResponse.json({ subscribed: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/posts/[id]/subscribe error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
