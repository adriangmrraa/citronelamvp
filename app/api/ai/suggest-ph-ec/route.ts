import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { suggestPhEc } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { phase } = body;

    if (!phase || typeof phase !== 'string') {
      return NextResponse.json({ error: 'phase requerida' }, { status: 400 });
    }

    const result = suggestPhEc(phase);

    return NextResponse.json({
      phase,
      ...result,
      source: 'rule-based',
    });
  } catch {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
}
