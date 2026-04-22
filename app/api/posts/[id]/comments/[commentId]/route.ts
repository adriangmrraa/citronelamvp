import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/db/schema';
import { requireAuth } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await requireAuth();
    const postId = parseInt(params.id, 10);
    const commentId = parseInt(params.commentId, 10);

    if (isNaN(postId) || isNaN(commentId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [comment] = await db.select().from(comments).where(eq(comments.id, commentId));
    if (!comment || comment.postId !== postId) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }

    const isAdmin = session.role === 'ADMIN' || session.role === 'STAFF';
    if (comment.authorId !== session.userId && !isAdmin) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    await db.delete(comments).where(eq(comments.id, commentId));

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'No autenticado') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    console.error('DELETE /api/posts/[id]/comments/[commentId] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
