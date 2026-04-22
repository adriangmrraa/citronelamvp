import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, users } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    await requireAdmin();

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
      .orderBy(desc(posts.createdAt));

    return NextResponse.json({ posts: rows });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      const status = error.message === 'No autenticado' ? 401 : 403;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error('GET /api/admin/posts error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
