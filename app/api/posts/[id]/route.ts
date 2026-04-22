import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, users, comments, reactions } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, count } from 'drizzle-orm';

const VALID_CATEGORIES = ['Clases', 'Investigaciones', 'FAQ', 'Debates', 'Papers', 'Noticias', 'Anuncios'] as const;
type PostCategory = (typeof VALID_CATEGORIES)[number];

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [row] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        category: posts.category,
        youtubeLink: posts.youtubeLink,
        fileUrl: posts.fileUrl,
        authorId: posts.authorId,
        authorUsername: users.username,
        likes: posts.likes,
        isPinned: posts.isPinned,
        isImmutable: posts.isImmutable,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .leftJoin(users, eq(users.id, posts.authorId))
      .where(eq(posts.id, id));

    if (!row) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const [{ commentsCount }] = await db
      .select({ commentsCount: count() })
      .from(comments)
      .where(eq(comments.postId, id));

    const [{ reactionsCount }] = await db
      .select({ reactionsCount: count() })
      .from(reactions)
      .where(eq(reactions.postId, id));

    return NextResponse.json({ post: { ...row, commentsCount, reactionsCount } });
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const isAdmin = session.role === 'ADMIN' || session.role === 'STAFF';
    if (post.authorId !== session.userId && !isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (post.isImmutable) {
      return NextResponse.json({ error: 'Este post no puede ser editado' }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, category, youtubeLink, fileUrl } = body;

    const errors: string[] = [];
    if (title !== undefined && (!title || title.trim().length === 0)) errors.push('Título requerido');
    if (title && title.length > 200) errors.push('Título demasiado largo');
    if (content !== undefined && (!content || content.trim().length === 0)) errors.push('Contenido requerido');
    if (category && !VALID_CATEGORIES.includes(category)) errors.push('Categoría inválida');

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (category !== undefined) updates.category = category as PostCategory;
    if (youtubeLink !== undefined) updates.youtubeLink = youtubeLink;
    if (fileUrl !== undefined) updates.fileUrl = fileUrl;

    const [updated] = await db
      .update(posts)
      .set(updates)
      .where(eq(posts.id, id))
      .returning();

    return NextResponse.json({ post: updated });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const isAdmin = session.role === 'ADMIN' || session.role === 'STAFF';
    if (post.authorId !== session.userId && !isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await db.delete(posts).where(eq(posts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
