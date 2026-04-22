import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments, posts, users } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, asc } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = parseInt(params.id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, postId));
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const rows = await db
      .select({
        id: comments.id,
        content: comments.content,
        postId: comments.postId,
        authorId: comments.authorId,
        authorUsername: users.username,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .leftJoin(users, eq(users.id, comments.authorId))
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt));

    return NextResponse.json({ comments: rows });
  } catch (error) {
    console.error('GET /api/posts/[id]/comments error:', error);
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
    const { content } = body;

    const errors: string[] = [];
    if (!content || content.trim().length === 0) errors.push('Contenido requerido');
    if (content && content.length > 5000) errors.push('Comentario demasiado largo');

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const [created] = await db
      .insert(comments)
      .values({
        content: content.trim(),
        postId,
        authorId: session.userId,
      })
      .returning();

    return NextResponse.json({ comment: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/posts/[id]/comments error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
