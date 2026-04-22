// @vitest-environment node
import { describe, it, expect } from 'vitest';

// Test crop validation logic (pure functions, no DB)
function validateCropInput(data: { bucketName?: string; cultivationMethod?: string }) {
  const errors: string[] = [];
  if (!data.bucketName || data.bucketName.trim().length === 0) {
    errors.push('Nombre de parcela requerido');
  }
  if (data.bucketName && data.bucketName.length > 100) {
    errors.push('Nombre demasiado largo (máx 100 caracteres)');
  }
  const validMethods = ['Hidroponia', 'Organico', 'SalesMinerales', 'Mixto'];
  if (data.cultivationMethod && !validMethods.includes(data.cultivationMethod)) {
    errors.push('Método de cultivo inválido');
  }
  return errors;
}

function validateLogInput(data: { week?: string; phase?: string; ph?: number; ec?: number }) {
  const errors: string[] = [];
  if (!data.week || data.week.trim().length === 0) {
    errors.push('Semana requerida');
  }
  const validPhases = ['Germinacion', 'Vegetacion', 'Floracion', 'Senescencia'];
  if (data.phase && !validPhases.includes(data.phase)) {
    errors.push('Fase fenológica inválida');
  }
  if (data.ph !== undefined && (data.ph < 0 || data.ph > 14)) {
    errors.push('pH debe estar entre 0 y 14');
  }
  if (data.ec !== undefined && data.ec < 0) {
    errors.push('EC no puede ser negativa');
  }
  return errors;
}

function validateLabReport(data: { collectionDate?: string; results?: string }) {
  const errors: string[] = [];
  if (!data.collectionDate) errors.push('Fecha de recolección requerida');
  if (!data.results) {
    errors.push('Resultados requeridos');
  } else {
    try {
      const parsed = JSON.parse(data.results);
      if (typeof parsed !== 'object') errors.push('Resultados deben ser un objeto JSON');
    } catch {
      errors.push('Resultados deben ser JSON válido');
    }
  }
  return errors;
}

describe('crop validation', () => {
  describe('validateCropInput', () => {
    it('should pass with valid name', () => {
      expect(validateCropInput({ bucketName: 'Mi Parcela' })).toHaveLength(0);
    });
    it('should fail without name', () => {
      expect(validateCropInput({})).toContain('Nombre de parcela requerido');
    });
    it('should fail with empty name', () => {
      expect(validateCropInput({ bucketName: '' })).toContain('Nombre de parcela requerido');
    });
    it('should fail with name too long', () => {
      expect(validateCropInput({ bucketName: 'a'.repeat(101) })).toContain('Nombre demasiado largo (máx 100 caracteres)');
    });
    it('should accept valid cultivation method', () => {
      expect(validateCropInput({ bucketName: 'Test', cultivationMethod: 'Hidroponia' })).toHaveLength(0);
    });
    it('should reject invalid cultivation method', () => {
      expect(validateCropInput({ bucketName: 'Test', cultivationMethod: 'InvalidMethod' })).toContain('Método de cultivo inválido');
    });
  });

  describe('validateLogInput', () => {
    it('should pass with valid data', () => {
      expect(validateLogInput({ week: 'Semana 1', phase: 'Vegetacion', ph: 6.5, ec: 1.2 })).toHaveLength(0);
    });
    it('should fail without week', () => {
      expect(validateLogInput({})).toContain('Semana requerida');
    });
    it('should reject invalid phase', () => {
      expect(validateLogInput({ week: 'S1', phase: 'Invalid' })).toContain('Fase fenológica inválida');
    });
    it('should reject pH out of range (too high)', () => {
      expect(validateLogInput({ week: 'S1', ph: 15 })).toContain('pH debe estar entre 0 y 14');
    });
    it('should reject negative pH', () => {
      expect(validateLogInput({ week: 'S1', ph: -1 })).toContain('pH debe estar entre 0 y 14');
    });
    it('should reject negative EC', () => {
      expect(validateLogInput({ week: 'S1', ec: -0.5 })).toContain('EC no puede ser negativa');
    });
    it('should accept pH 0 and pH 14 as valid boundaries', () => {
      expect(validateLogInput({ week: 'S1', ph: 0 })).toHaveLength(0);
      expect(validateLogInput({ week: 'S1', ph: 14 })).toHaveLength(0);
    });
  });

  describe('validateLabReport', () => {
    it('should pass with valid data', () => {
      expect(validateLabReport({
        collectionDate: '2026-04-22',
        results: '{"thc": 20.5, "cbd": 0.8}'
      })).toHaveLength(0);
    });
    it('should fail without date', () => {
      expect(validateLabReport({ results: '{}' })).toContain('Fecha de recolección requerida');
    });
    it('should fail without results', () => {
      expect(validateLabReport({ collectionDate: '2026-04-22' })).toContain('Resultados requeridos');
    });
    it('should fail with invalid JSON', () => {
      expect(validateLabReport({ collectionDate: '2026-04-22', results: 'not json' })).toContain('Resultados deben ser JSON válido');
    });
    it('should fail with non-object JSON', () => {
      expect(validateLabReport({ collectionDate: '2026-04-22', results: '"string"' })).toContain('Resultados deben ser un objeto JSON');
    });
  });
});
