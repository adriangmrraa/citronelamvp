import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { requireAdmin } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    const body = await request.json();
    const { action, isPinned, isImmutable } = body;

    if (action === 'delete') {
      await db.delete(posts).where(eq(posts.id, id));
      return NextResponse.json({ success: true, deleted: true });
    }

    const updates: Record<string, unknown> = {};
    if (typeof isPinned === 'boolean') updates.isPinned = isPinned;
    if (typeof isImmutable === 'boolean') updates.isImmutable = isImmutable;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    const [updated] = await db.update(posts).set(updates).where(eq(posts.id, id)).returning();

    return NextResponse.json({ post: updated });
  } catch (error) {
    if (error instanceof Error && (error.message === 'No autenticado' || error.message === 'No autorizado')) {
      const status = error.message === 'No autenticado' ? 401 : 403;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error('PATCH /api/admin/posts/[id] error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
