// @vitest-environment node
import { describe, it, expect } from 'vitest';

function validateNotificationMessage(message: unknown): string | null {
  if (message === null || message === undefined || typeof message !== 'string') return 'Mensaje requerido';
  if (message.trim().length === 0) return 'Mensaje no puede estar vacío';
  if (message.length > 500) return 'Mensaje demasiado largo (máx 500)';
  return null;
}

function validateBroadcastTarget(target: unknown): string | null {
  const valid = ['all', 'verified', 'cultivators', 'admins'];
  if (!target || typeof target !== 'string') return 'Target requerido';
  if (!valid.includes(target)) return 'Target inválido: debe ser all, verified, cultivators o admins';
  return null;
}

function formatNotification(type: string, data: Record<string, string>): string {
  switch (type) {
    case 'user_approved': return `Tu cuenta fue aprobada. ¡Bienvenido a Citronela!`;
    case 'tokens_granted': return `Recibiste ${data.amount} tokens.`;
    case 'order_status': return `Tu orden #${data.orderId} cambió a: ${data.status}`;
    case 'new_comment': return `${data.author} comentó en tu post "${data.postTitle}"`;
    case 'crop_feedback': return `Recibiste feedback en tu cultivo "${data.cropName}"`;
    case 'marketing': return data.message;
    default: return data.message || 'Nueva notificación';
  }
}

// AI helpers — rule-based for beta (no OpenAI)
function suggestPhEc(phase: string): { phMin: number; phMax: number; ecMin: number; ecMax: number; advice: string } {
  const ranges: Record<string, { phMin: number; phMax: number; ecMin: number; ecMax: number; advice: string }> = {
    Germinacion: { phMin: 5.5, phMax: 6.5, ecMin: 0.2, ecMax: 0.6, advice: 'Mantené la humedad alta y la EC baja. Las plántulas son sensibles.' },
    Vegetacion: { phMin: 5.8, phMax: 6.5, ecMin: 0.8, ecMax: 1.6, advice: 'Incrementá la EC gradualmente. El nitrógeno es clave en esta fase.' },
    Floracion: { phMin: 6.0, phMax: 6.8, ecMin: 1.2, ecMax: 2.2, advice: 'Aumentá fósforo y potasio. Reducí el nitrógeno progresivamente.' },
    Senescencia: { phMin: 6.0, phMax: 6.5, ecMin: 0.0, ecMax: 0.5, advice: 'Fase de lavado. Solo agua pura para limpiar sales residuales.' },
  };
  return ranges[phase] || ranges.Vegetacion;
}

function generateProductDescription(data: { name: string; category: string; genetics?: string; thc?: number; cbd?: number }): string {
  let desc = `${data.name} — ${data.category}.`;
  if (data.genetics) desc += ` Genética: ${data.genetics}.`;
  if (data.thc !== undefined) desc += ` THC: ${data.thc}%.`;
  if (data.cbd !== undefined) desc += ` CBD: ${data.cbd}%.`;
  desc += ' Producto de calidad verificada por Citronela.';
  return desc;
}

function suggestGrowNotes(phase: string, ph: number, ec: number): string[] {
  const notes: string[] = [];
  const ideal = suggestPhEc(phase);
  if (ph < ideal.phMin) notes.push(`pH bajo (${ph}). Subilo a rango ${ideal.phMin}-${ideal.phMax}.`);
  if (ph > ideal.phMax) notes.push(`pH alto (${ph}). Bajalo a rango ${ideal.phMin}-${ideal.phMax}.`);
  if (ec < ideal.ecMin) notes.push(`EC baja (${ec}). Aumentá nutrientes a rango ${ideal.ecMin}-${ideal.ecMax}.`);
  if (ec > ideal.ecMax) notes.push(`EC alta (${ec}). Diluí la solución a rango ${ideal.ecMin}-${ideal.ecMax}.`);
  if (notes.length === 0) notes.push('Parámetros dentro de rango óptimo. ¡Seguí así!');
  return notes;
}

describe('notifications', () => {
  describe('validateNotificationMessage', () => {
    it('should pass with valid message', () => {
      expect(validateNotificationMessage('Hola mundo')).toBeNull();
    });
    it('should fail with empty', () => {
      expect(validateNotificationMessage('')).toBe('Mensaje no puede estar vacío');
    });
    it('should fail with null', () => {
      expect(validateNotificationMessage(null)).toBe('Mensaje requerido');
    });
    it('should fail with too long', () => {
      expect(validateNotificationMessage('a'.repeat(501))).toBe('Mensaje demasiado largo (máx 500)');
    });
    it('should accept exactly 500 chars', () => {
      expect(validateNotificationMessage('a'.repeat(500))).toBeNull();
    });
  });

  describe('validateBroadcastTarget', () => {
    it('should accept all', () => { expect(validateBroadcastTarget('all')).toBeNull(); });
    it('should accept verified', () => { expect(validateBroadcastTarget('verified')).toBeNull(); });
    it('should accept cultivators', () => { expect(validateBroadcastTarget('cultivators')).toBeNull(); });
    it('should accept admins', () => { expect(validateBroadcastTarget('admins')).toBeNull(); });
    it('should reject invalid', () => { expect(validateBroadcastTarget('invalid')).not.toBeNull(); });
    it('should reject null', () => { expect(validateBroadcastTarget(null)).not.toBeNull(); });
  });

  describe('formatNotification', () => {
    it('should format user_approved', () => {
      expect(formatNotification('user_approved', {})).toContain('aprobada');
    });
    it('should format tokens_granted', () => {
      expect(formatNotification('tokens_granted', { amount: '300' })).toContain('300 tokens');
    });
    it('should format order_status', () => {
      expect(formatNotification('order_status', { orderId: '5', status: 'Entregado' })).toContain('#5');
    });
    it('should format new_comment', () => {
      expect(formatNotification('new_comment', { author: 'Juan', postTitle: 'Test' })).toContain('Juan');
    });
    it('should format marketing', () => {
      expect(formatNotification('marketing', { message: 'Promo!' })).toBe('Promo!');
    });
    it('should handle unknown type', () => {
      expect(formatNotification('unknown', { message: 'Algo' })).toBe('Algo');
    });
  });
});

describe('AI helpers (rule-based)', () => {
  describe('suggestPhEc', () => {
    it('should return ranges for Germinacion', () => {
      const r = suggestPhEc('Germinacion');
      expect(r.phMin).toBeLessThan(r.phMax);
      expect(r.ecMin).toBeLessThan(r.ecMax);
      expect(r.advice).toBeDefined();
    });
    it('should return ranges for Floracion', () => {
      const r = suggestPhEc('Floracion');
      expect(r.ecMax).toBeGreaterThan(1);
    });
    it('should default to Vegetacion for unknown phase', () => {
      const r = suggestPhEc('Unknown');
      expect(r).toEqual(suggestPhEc('Vegetacion'));
    });
  });

  describe('generateProductDescription', () => {
    it('should include name and category', () => {
      const desc = generateProductDescription({ name: 'Purple Kush', category: 'Flores' });
      expect(desc).toContain('Purple Kush');
      expect(desc).toContain('Flores');
    });
    it('should include THC/CBD when provided', () => {
      const desc = generateProductDescription({ name: 'Test', category: 'Flores', thc: 20, cbd: 1 });
      expect(desc).toContain('20%');
      expect(desc).toContain('1%');
    });
    it('should include genetics when provided', () => {
      const desc = generateProductDescription({ name: 'Test', category: 'Flores', genetics: 'Indica' });
      expect(desc).toContain('Indica');
    });
  });

  describe('suggestGrowNotes', () => {
    it('should flag low pH', () => {
      const notes = suggestGrowNotes('Vegetacion', 4.0, 1.0);
      expect(notes.some(n => n.includes('bajo'))).toBe(true);
    });
    it('should flag high EC', () => {
      const notes = suggestGrowNotes('Vegetacion', 6.0, 3.0);
      expect(notes.some(n => n.includes('alta'))).toBe(true);
    });
    it('should return positive when in range', () => {
      const notes = suggestGrowNotes('Vegetacion', 6.0, 1.2);
      expect(notes[0]).toContain('óptimo');
    });
  });
});
