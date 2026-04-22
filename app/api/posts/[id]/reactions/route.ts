import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reactions, posts } from '@/db/schema';
import { requireAuth, getSession } from '@/lib/session';
import { eq, and, count, sql } from 'drizzle-orm';

const VALID_REACTION_TYPES = ['Interesante', 'Util', 'Cientifico'] as const;
type ReactionType = (typeof VALID_REACTION_TYPES)[number];

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = parseInt(params.id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const session = await getSession();

    const allReactions = await db
      .select({
        type: reactions.type,
        userId: reactions.userId,
      })
      .from(reactions)
      .where(eq(reactions.postId, postId));

    const counts: Record<string, number> = { Interesante: 0, Util: 0, Cientifico: 0 };
    let userReaction: string | null = null;

    for (const r of allReactions) {
      counts[r.type] = (counts[r.type] ?? 0) + 1;
      if (session && r.userId === session.userId) {
        userReaction = r.type;
      }
    }

    return NextResponse.json({ counts, userReaction });
  } catch (error) {
    console.error('GET /api/posts/[id]/reactions error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json();
    const { type } = body;

    if (!type || !VALID_REACTION_TYPES.includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de reacción inválido. Valores: Interesante, Util, Cientifico' },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(reactions)
      .where(and(eq(reactions.userId, session.userId), eq(reactions.postId, postId)));

    if (existing) {
      if (existing.type === type) {
        // Same type → toggle off, decrement likes
        await db.delete(reactions).where(eq(reactions.id, existing.id));
        await db
          .update(posts)
          .set({ likes: sql`${posts.likes} - 1` })
          .where(eq(posts.id, postId));
        return NextResponse.json({ action: 'removed', type });
      } else {
        // Different type → update type only (likes count stays the same)
        await db
          .update(reactions)
          .set({ type: type as ReactionType })
          .where(eq(reactions.id, existing.id));
        return NextResponse.json({ action: 'updated', type });
      }
    }

    // No existing reaction → insert + increment likes
    await db.insert(reactions).values({
      type: type as ReactionType,
      userId: session.userId,
      postId,
    });
    await db
      .update(posts)
      .set({ likes: sql`${posts.likes} + 1` })
      .where(eq(posts.id, postId));

    return NextResponse.json({ action: 'added', type });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/posts/[id]/reactions error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
