import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts, comments, users } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq, asc } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();
    const postId = parseInt(params.id, 10);
    if (isNaN(postId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [row] = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        category: posts.category,
        authorId: posts.authorId,
        authorUsername: users.username,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .leftJoin(users, eq(users.id, posts.authorId))
      .where(eq(posts.id, postId));

    if (!row) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const postComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        authorId: comments.authorId,
        authorUsername: users.username,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .leftJoin(users, eq(users.id, comments.authorId))
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt));

    const formatDate = (d: Date | null) =>
      d ? new Date(d).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : '—';

    const lines: string[] = [
      `# ${row.title}`,
      ``,
      `**Categoría:** ${row.category}`,
      `**Autor:** ${row.authorUsername ?? row.authorId}`,
      `**Fecha:** ${formatDate(row.createdAt)}`,
      ``,
      `---`,
      ``,
      row.content,
      ``,
    ];

    if (postComments.length > 0) {
      lines.push(`---`, ``, `## Comentarios (${postComments.length})`, ``);
      for (const c of postComments) {
        lines.push(
          `### ${c.authorUsername ?? c.authorId} — ${formatDate(c.createdAt)}`,
          ``,
          c.content,
          ``
        );
      }
    } else {
      lines.push(`---`, ``, `_Sin comentarios._`, ``);
    }

    const text = lines.join('\n');
    const filename = `post-${postId}-${row.title.slice(0, 40).replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;

    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('GET /api/posts/[id]/export error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
