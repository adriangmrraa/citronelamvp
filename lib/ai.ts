// Rule-based AI helpers for beta (no OpenAI dependency)
// When OPENAI_API_KEY is available, these can be enhanced with real AI

export function suggestPhEc(phase: string): {
  phMin: number;
  phMax: number;
  ecMin: number;
  ecMax: number;
  advice: string;
} {
  const ranges: Record<
    string,
    { phMin: number; phMax: number; ecMin: number; ecMax: number; advice: string }
  > = {
    Germinacion: {
      phMin: 5.5,
      phMax: 6.5,
      ecMin: 0.2,
      ecMax: 0.6,
      advice: 'Mantené la humedad alta y la EC baja. Las plántulas son sensibles.',
    },
    Vegetacion: {
      phMin: 5.8,
      phMax: 6.5,
      ecMin: 0.8,
      ecMax: 1.6,
      advice: 'Incrementá la EC gradualmente. El nitrógeno es clave en esta fase.',
    },
    Floracion: {
      phMin: 6.0,
      phMax: 6.8,
      ecMin: 1.2,
      ecMax: 2.2,
      advice: 'Aumentá fósforo y potasio. Reducí el nitrógeno progresivamente.',
    },
    Senescencia: {
      phMin: 6.0,
      phMax: 6.5,
      ecMin: 0.0,
      ecMax: 0.5,
      advice: 'Fase de lavado. Solo agua pura para limpiar sales residuales.',
    },
  };
  return ranges[phase] || ranges.Vegetacion;
}

export function generateProductDescription(data: {
  name: string;
  category: string;
  genetics?: string;
  thc?: number;
  cbd?: number;
}): string {
  let desc = `${data.name} — ${data.category}.`;
  if (data.genetics) desc += ` Genética: ${data.genetics}.`;
  if (data.thc !== undefined) desc += ` THC: ${data.thc}%.`;
  if (data.cbd !== undefined) desc += ` CBD: ${data.cbd}%.`;
  desc += ' Producto de calidad verificada por Citronela.';
  return desc;
}

export function suggestGrowNotes(phase: string, ph: number, ec: number): string[] {
  const notes: string[] = [];
  const ideal = suggestPhEc(phase);
  if (ph < ideal.phMin)
    notes.push(`pH bajo (${ph}). Subilo a rango ${ideal.phMin}-${ideal.phMax}.`);
  if (ph > ideal.phMax)
    notes.push(`pH alto (${ph}). Bajalo a rango ${ideal.phMin}-${ideal.phMax}.`);
  if (ec < ideal.ecMin)
    notes.push(`EC baja (${ec}). Aumentá nutrientes a rango ${ideal.ecMin}-${ideal.ecMax}.`);
  if (ec > ideal.ecMax)
    notes.push(`EC alta (${ec}). Diluí la solución a rango ${ideal.ecMin}-${ideal.ecMax}.`);
  if (notes.length === 0) notes.push('Parámetros dentro de rango óptimo. ¡Seguí así!');
  return notes;
}
