import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Pure validation helpers — extracted from API route logic, no DB dependency
// ---------------------------------------------------------------------------

function validateRegistration(data: { username?: string; email?: string; password?: string }) {
  const errors: string[] = [];
  if (!data.username) errors.push('Usuario requerido');
  else if (data.username.length < 3) errors.push('Usuario debe tener al menos 3 caracteres');
  if (!data.email) errors.push('Email requerido');
  if (!data.password) errors.push('Contraseña requerida');
  else if (data.password.length < 6) errors.push('Contraseña debe tener al menos 6 caracteres');
  return errors;
}

function validateTokenAmount(amount: unknown): boolean {
  return typeof amount === 'number' && amount > 0 && Number.isInteger(amount);
}

function validateCultivatorAssignment(cultivatorId: unknown, patientId: unknown): boolean {
  return (
    typeof cultivatorId === 'number' &&
    typeof patientId === 'number' &&
    cultivatorId !== patientId &&
    cultivatorId > 0 &&
    patientId > 0
  );
}

// ---------------------------------------------------------------------------

describe('validation helpers', () => {
  describe('validateRegistration', () => {
    it('should pass with all valid fields', () => {
      const errors = validateRegistration({ username: 'test', email: 'a@b.com', password: '123456' });
      expect(errors).toHaveLength(0);
    });

    it('should pass with a longer valid username', () => {
      const errors = validateRegistration({ username: 'juancitoelmejor', email: 'juan@mail.com', password: 'securepwd' });
      expect(errors).toHaveLength(0);
    });

    it('should fail without username', () => {
      const errors = validateRegistration({ email: 'a@b.com', password: '123456' });
      expect(errors).toContain('Usuario requerido');
    });

    it('should fail with username shorter than 3 chars', () => {
      const errors = validateRegistration({ username: 'ab', email: 'a@b.com', password: '123456' });
      expect(errors).toContain('Usuario debe tener al menos 3 caracteres');
    });

    it('should NOT fail with username exactly 3 chars', () => {
      const errors = validateRegistration({ username: 'abc', email: 'a@b.com', password: '123456' });
      expect(errors).not.toContain('Usuario debe tener al menos 3 caracteres');
    });

    it('should fail without email', () => {
      const errors = validateRegistration({ username: 'test', password: '123456' });
      expect(errors).toContain('Email requerido');
    });

    it('should fail without password', () => {
      const errors = validateRegistration({ username: 'test', email: 'a@b.com' });
      expect(errors).toContain('Contraseña requerida');
    });

    it('should fail with password shorter than 6 chars', () => {
      const errors = validateRegistration({ username: 'test', email: 'a@b.com', password: '12345' });
      expect(errors).toContain('Contraseña debe tener al menos 6 caracteres');
    });

    it('should NOT fail with password exactly 6 chars', () => {
      const errors = validateRegistration({ username: 'test', email: 'a@b.com', password: '123456' });
      expect(errors).not.toContain('Contraseña debe tener al menos 6 caracteres');
    });

    it('should collect all three errors when all fields are empty', () => {
      const errors = validateRegistration({});
      expect(errors).toContain('Usuario requerido');
      expect(errors).toContain('Email requerido');
      expect(errors).toContain('Contraseña requerida');
      expect(errors.length).toBeGreaterThanOrEqual(3);
    });

    it('should collect both username and password errors simultaneously', () => {
      const errors = validateRegistration({ username: 'a', email: 'a@b.com', password: '123' });
      expect(errors).toContain('Usuario debe tener al menos 3 caracteres');
      expect(errors).toContain('Contraseña debe tener al menos 6 caracteres');
    });
  });

  describe('validateTokenAmount', () => {
    it('should accept a standard positive integer (300 tokens)', () => {
      expect(validateTokenAmount(300)).toBe(true);
    });

    it('should accept the minimum valid amount (1)', () => {
      expect(validateTokenAmount(1)).toBe(true);
    });

    it('should reject zero', () => {
      expect(validateTokenAmount(0)).toBe(false);
    });

    it('should reject negative amounts', () => {
      expect(validateTokenAmount(-100)).toBe(false);
      expect(validateTokenAmount(-1)).toBe(false);
    });

    it('should reject decimal / float values', () => {
      expect(validateTokenAmount(10.5)).toBe(false);
      expect(validateTokenAmount(0.1)).toBe(false);
    });

    it('should reject numeric strings', () => {
      expect(validateTokenAmount('300')).toBe(false);
      expect(validateTokenAmount('1')).toBe(false);
    });

    it('should reject null', () => {
      expect(validateTokenAmount(null)).toBe(false);
    });

    it('should reject undefined', () => {
      expect(validateTokenAmount(undefined)).toBe(false);
    });

    it('should reject NaN', () => {
      expect(validateTokenAmount(NaN)).toBe(false);
    });

    it('should reject Infinity', () => {
      expect(validateTokenAmount(Infinity)).toBe(false);
    });

    it('should reject objects and arrays', () => {
      expect(validateTokenAmount({})).toBe(false);
      expect(validateTokenAmount([])).toBe(false);
    });
  });

  describe('validateCultivatorAssignment', () => {
    it('should accept a valid distinct assignment', () => {
      expect(validateCultivatorAssignment(1, 2)).toBe(true);
    });

    it('should accept large valid IDs', () => {
      expect(validateCultivatorAssignment(150, 500)).toBe(true);
    });

    it('should reject when cultivator and patient are the same user', () => {
      expect(validateCultivatorAssignment(1, 1)).toBe(false);
      expect(validateCultivatorAssignment(42, 42)).toBe(false);
    });

    it('should reject cultivatorId of 0 (invalid DB id)', () => {
      expect(validateCultivatorAssignment(0, 1)).toBe(false);
    });

    it('should reject patientId of 0', () => {
      expect(validateCultivatorAssignment(1, 0)).toBe(false);
    });

    it('should reject negative cultivatorId', () => {
      expect(validateCultivatorAssignment(-1, 2)).toBe(false);
    });

    it('should reject negative patientId', () => {
      expect(validateCultivatorAssignment(1, -2)).toBe(false);
    });

    it('should reject non-numeric cultivatorId (string)', () => {
      expect(validateCultivatorAssignment('a', 1)).toBe(false);
    });

    it('should reject non-numeric patientId (string)', () => {
      expect(validateCultivatorAssignment(1, 'b')).toBe(false);
    });

    it('should reject null values', () => {
      expect(validateCultivatorAssignment(null, 1)).toBe(false);
      expect(validateCultivatorAssignment(1, null)).toBe(false);
    });

    it('should reject undefined values', () => {
      expect(validateCultivatorAssignment(undefined, 1)).toBe(false);
      expect(validateCultivatorAssignment(1, undefined)).toBe(false);
    });
  });
});
