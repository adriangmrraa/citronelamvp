// @vitest-environment node
import { describe, it, expect } from 'vitest';

function validateProductInput(data: { name?: string; price?: number; category?: string; stock?: number }) {
  const errors: string[] = [];
  if (!data.name || data.name.trim().length === 0) errors.push('Nombre requerido');
  if (data.name && data.name.length > 200) errors.push('Nombre demasiado largo');
  if (data.price === undefined || data.price < 0) errors.push('Precio debe ser >= 0');
  if (data.price !== undefined && !Number.isInteger(data.price)) errors.push('Precio debe ser entero (tokens)');
  const validCategories = ['Flores', 'Parafernalia', 'Geneticas'];
  if (data.category && !validCategories.includes(data.category)) errors.push('Categoría inválida');
  if (data.stock !== undefined && (data.stock < 0 || !Number.isInteger(data.stock))) errors.push('Stock debe ser entero >= 0');
  return errors;
}

function validatePurchase(buyerTokens: number, totalPrice: number, buyerId: number, sellerId: number): string | null {
  if (buyerId === sellerId) return 'No podés comprar tu propio producto';
  if (totalPrice <= 0) return 'El total debe ser mayor a 0';
  if (buyerTokens < totalPrice) return 'Tokens insuficientes';
  return null;
}

function validateReview(data: { rating?: number; comment?: string }): string[] {
  const errors: string[] = [];
  if (data.rating === undefined) errors.push('Rating requerido');
  else if (data.rating < 1 || data.rating > 5 || !Number.isInteger(data.rating)) errors.push('Rating debe ser entre 1 y 5');
  if (data.comment !== undefined && data.comment.length > 1000) errors.push('Comentario demasiado largo');
  return errors;
}

function calculateReputation(reviews: { rating: number }[]): { avgRating: number; reviewCount: number } {
  if (reviews.length === 0) return { avgRating: 0, reviewCount: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { avgRating: Math.round((sum / reviews.length) * 10) / 10, reviewCount: reviews.length };
}

describe('marketplace validation', () => {
  describe('validateProductInput', () => {
    it('should pass with valid product', () => {
      expect(validateProductInput({ name: 'Purple Kush', price: 50, category: 'Flores', stock: 5 })).toHaveLength(0);
    });
    it('should fail without name', () => {
      expect(validateProductInput({ price: 50 })).toContain('Nombre requerido');
    });
    it('should fail with empty name', () => {
      expect(validateProductInput({ name: '', price: 50 })).toContain('Nombre requerido');
    });
    it('should fail with long name', () => {
      expect(validateProductInput({ name: 'a'.repeat(201), price: 50 })).toContain('Nombre demasiado largo');
    });
    it('should fail with negative price', () => {
      expect(validateProductInput({ name: 'Test', price: -1 })).toContain('Precio debe ser >= 0');
    });
    it('should fail with float price', () => {
      expect(validateProductInput({ name: 'Test', price: 10.5 })).toContain('Precio debe ser entero (tokens)');
    });
    it('should accept price 0 (free)', () => {
      expect(validateProductInput({ name: 'Test', price: 0 })).toHaveLength(0);
    });
    it('should fail with invalid category', () => {
      expect(validateProductInput({ name: 'Test', price: 50, category: 'Bad' })).toContain('Categoría inválida');
    });
    it('should fail with negative stock', () => {
      expect(validateProductInput({ name: 'Test', price: 50, stock: -1 })).toContain('Stock debe ser entero >= 0');
    });
  });

  describe('validatePurchase', () => {
    it('should pass with sufficient tokens', () => {
      expect(validatePurchase(300, 100, 1, 2)).toBeNull();
    });
    it('should fail with insufficient tokens', () => {
      expect(validatePurchase(50, 100, 1, 2)).toBe('Tokens insuficientes');
    });
    it('should fail when buying own product', () => {
      expect(validatePurchase(300, 100, 1, 1)).toBe('No podés comprar tu propio producto');
    });
    it('should fail with zero total', () => {
      expect(validatePurchase(300, 0, 1, 2)).toBe('El total debe ser mayor a 0');
    });
    it('should pass with exact token amount', () => {
      expect(validatePurchase(100, 100, 1, 2)).toBeNull();
    });
  });

  describe('validateReview', () => {
    it('should pass with valid review', () => {
      expect(validateReview({ rating: 5, comment: 'Excelente!' })).toHaveLength(0);
    });
    it('should fail without rating', () => {
      expect(validateReview({})).toContain('Rating requerido');
    });
    it('should fail with rating 0', () => {
      expect(validateReview({ rating: 0 })).toContain('Rating debe ser entre 1 y 5');
    });
    it('should fail with rating 6', () => {
      expect(validateReview({ rating: 6 })).toContain('Rating debe ser entre 1 y 5');
    });
    it('should fail with float rating', () => {
      expect(validateReview({ rating: 3.5 })).toContain('Rating debe ser entre 1 y 5');
    });
    it('should fail with long comment', () => {
      expect(validateReview({ rating: 5, comment: 'a'.repeat(1001) })).toContain('Comentario demasiado largo');
    });
    it('should accept rating without comment', () => {
      expect(validateReview({ rating: 4 })).toHaveLength(0);
    });
  });

  describe('calculateReputation', () => {
    it('should return 0 for no reviews', () => {
      const rep = calculateReputation([]);
      expect(rep.avgRating).toBe(0);
      expect(rep.reviewCount).toBe(0);
    });
    it('should calculate average correctly', () => {
      const rep = calculateReputation([{ rating: 5 }, { rating: 3 }, { rating: 4 }]);
      expect(rep.avgRating).toBe(4);
      expect(rep.reviewCount).toBe(3);
    });
    it('should round to 1 decimal', () => {
      const rep = calculateReputation([{ rating: 5 }, { rating: 4 }]);
      expect(rep.avgRating).toBe(4.5);
    });
    it('should handle single review', () => {
      const rep = calculateReputation([{ rating: 3 }]);
      expect(rep.avgRating).toBe(3);
      expect(rep.reviewCount).toBe(1);
    });
  });
});
