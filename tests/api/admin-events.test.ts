// @vitest-environment node
import { describe, it, expect } from 'vitest';

function validateEventInput(data: { title?: string; description?: string; date?: string; time?: string; location?: string; capacity?: number }) {
  const errors: string[] = [];
  if (!data.title || data.title.trim().length === 0) errors.push('Título requerido');
  if (!data.description || data.description.trim().length === 0) errors.push('Descripción requerida');
  if (!data.date) errors.push('Fecha requerida');
  if (!data.time) errors.push('Hora requerida');
  if (!data.location || data.location.trim().length === 0) errors.push('Ubicación requerida');
  if (data.capacity !== undefined && (data.capacity < 1 || !Number.isInteger(data.capacity))) errors.push('Capacidad debe ser entero >= 1');
  return errors;
}

function validateTicketCategory(data: { name?: string; price?: number }) {
  const errors: string[] = [];
  if (!data.name || data.name.trim().length === 0) errors.push('Nombre de categoría requerido');
  if (data.price === undefined || data.price < 0) errors.push('Precio debe ser >= 0');
  if (data.price !== undefined && !Number.isInteger(data.price)) errors.push('Precio debe ser entero');
  return errors;
}

function calculateAdminStats(data: { totalUsers: number; pendingUsers: number; emailVerified: number; totalCrops: number; totalOrders: number; totalTokens: number; postsThisWeek: number }) {
  return {
    ...data,
    emailVerificationRate: data.totalUsers > 0 ? Math.round((data.emailVerified / data.totalUsers) * 100) : 0,
    verifiedRate: data.totalUsers > 0 ? Math.round(((data.totalUsers - data.pendingUsers) / data.totalUsers) * 100) : 0,
  };
}

describe('admin & events validation', () => {
  describe('validateEventInput', () => {
    it('should pass with valid event', () => {
      expect(validateEventInput({ title: 'Taller', description: 'Desc', date: '2026-05-01', time: '18:00', location: 'Centro' })).toHaveLength(0);
    });
    it('should fail without title', () => {
      expect(validateEventInput({ description: 'D', date: 'd', time: 't', location: 'L' })).toContain('Título requerido');
    });
    it('should fail without description', () => {
      expect(validateEventInput({ title: 'T', date: 'd', time: 't', location: 'L' })).toContain('Descripción requerida');
    });
    it('should fail without date', () => {
      expect(validateEventInput({ title: 'T', description: 'D', time: 't', location: 'L' })).toContain('Fecha requerida');
    });
    it('should fail without time', () => {
      expect(validateEventInput({ title: 'T', description: 'D', date: 'd', location: 'L' })).toContain('Hora requerida');
    });
    it('should fail without location', () => {
      expect(validateEventInput({ title: 'T', description: 'D', date: 'd', time: 't' })).toContain('Ubicación requerida');
    });
    it('should fail with capacity 0', () => {
      expect(validateEventInput({ title: 'T', description: 'D', date: 'd', time: 't', location: 'L', capacity: 0 })).toContain('Capacidad debe ser entero >= 1');
    });
    it('should fail with negative capacity', () => {
      expect(validateEventInput({ title: 'T', description: 'D', date: 'd', time: 't', location: 'L', capacity: -5 })).toContain('Capacidad debe ser entero >= 1');
    });
    it('should collect multiple errors', () => {
      expect(validateEventInput({}).length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('validateTicketCategory', () => {
    it('should pass with valid data', () => {
      expect(validateTicketCategory({ name: 'General', price: 50 })).toHaveLength(0);
    });
    it('should fail without name', () => {
      expect(validateTicketCategory({ price: 50 })).toContain('Nombre de categoría requerido');
    });
    it('should fail with negative price', () => {
      expect(validateTicketCategory({ name: 'VIP', price: -10 })).toContain('Precio debe ser >= 0');
    });
    it('should accept price 0 (free)', () => {
      expect(validateTicketCategory({ name: 'Free', price: 0 })).toHaveLength(0);
    });
  });

  describe('calculateAdminStats', () => {
    it('should calculate email verification rate', () => {
      const stats = calculateAdminStats({ totalUsers: 100, pendingUsers: 20, emailVerified: 80, totalCrops: 50, totalOrders: 30, totalTokens: 15000, postsThisWeek: 12 });
      expect(stats.emailVerificationRate).toBe(80);
      expect(stats.verifiedRate).toBe(80);
    });
    it('should handle zero users', () => {
      const stats = calculateAdminStats({ totalUsers: 0, pendingUsers: 0, emailVerified: 0, totalCrops: 0, totalOrders: 0, totalTokens: 0, postsThisWeek: 0 });
      expect(stats.emailVerificationRate).toBe(0);
      expect(stats.verifiedRate).toBe(0);
    });
    it('should round rates', () => {
      const stats = calculateAdminStats({ totalUsers: 3, pendingUsers: 1, emailVerified: 2, totalCrops: 0, totalOrders: 0, totalTokens: 0, postsThisWeek: 0 });
      expect(stats.emailVerificationRate).toBe(67);
      expect(stats.verifiedRate).toBe(67);
    });
  });
});
