import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/session';
import { generateProductDescription } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const { name, category, genetics, thc, cbd } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'name requerido' }, { status: 400 });
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return NextResponse.json({ error: 'category requerida' }, { status: 400 });
    }

    // If OPENAI_API_KEY is set, this is where real AI would be called.
    // For beta, we use rule-based template generation.
    const description = generateProductDescription({
      name: name.trim(),
      category: category.trim(),
      genetics: genetics ? String(genetics) : undefined,
      thc: thc !== undefined ? Number(thc) : undefined,
      cbd: cbd !== undefined ? Number(cbd) : undefined,
    });

    return NextResponse.json({
      description,
      source: process.env.OPENAI_API_KEY ? 'openai-ready' : 'rule-based',
    });
  } catch {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
}
