import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, users, comments, reactions } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, desc, ilike, and, count, sql } from 'drizzle-orm';

const VALID_CATEGORIES = ['Clases', 'Investigaciones', 'FAQ', 'Debates', 'Papers', 'Noticias', 'Anuncios'] as const;
type PostCategory = (typeof VALID_CATEGORIES)[number];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') ?? 'newest';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [];
    if (category && VALID_CATEGORIES.includes(category as PostCategory)) {
      conditions.push(eq(posts.category, category as PostCategory));
    }
    if (search && search.trim().length > 0) {
      conditions.push(ilike(posts.title, `%${search.trim()}%`));
    }

    const orderBy = sort === 'popular' ? desc(posts.likes) : desc(posts.createdAt);

    const rows = await db
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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ posts: rows, page, limit });
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { title, content, category, youtubeLink, fileUrl } = body;

    const errors: string[] = [];
    if (!title || title.trim().length === 0) errors.push('Título requerido');
    if (title && title.length > 200) errors.push('Título demasiado largo');
    if (!content || content.trim().length === 0) errors.push('Contenido requerido');
    if (category && !VALID_CATEGORIES.includes(category)) errors.push('Categoría inválida');

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const [created] = await db
      .insert(posts)
      .values({
        title: title.trim(),
        content: content.trim(),
        category: category ?? 'Debates',
        youtubeLink: youtubeLink ?? null,
        fileUrl: fileUrl ?? null,
        authorId: session.userId,
      })
      .returning();

    return NextResponse.json({ post: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
