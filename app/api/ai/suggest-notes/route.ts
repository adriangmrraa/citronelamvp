import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { suggestGrowNotes } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { phase, ph, ec } = body;

    if (!phase || typeof phase !== 'string') {
      return NextResponse.json({ error: 'phase requerida' }, { status: 400 });
    }

    const phNum = parseFloat(ph);
    const ecNum = parseFloat(ec);

    if (isNaN(phNum) || isNaN(ecNum)) {
      return NextResponse.json({ error: 'ph y ec deben ser números válidos' }, { status: 400 });
    }

    const notes = suggestGrowNotes(phase, phNum, ecNum);

    return NextResponse.json({
      phase,
      ph: phNum,
      ec: ecNum,
      notes,
      source: 'rule-based',
    });
  } catch {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
}
