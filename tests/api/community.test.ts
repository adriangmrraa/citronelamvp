// @vitest-environment node
import { describe, it, expect } from 'vitest';

function validatePostInput(data: { title?: string; content?: string; category?: string }) {
  const errors: string[] = [];
  if (!data.title || data.title.trim().length === 0) errors.push('Título requerido');
  if (data.title && data.title.length > 200) errors.push('Título demasiado largo');
  if (!data.content || data.content.trim().length === 0) errors.push('Contenido requerido');
  const validCategories = ['Clases', 'Investigaciones', 'FAQ', 'Debates', 'Papers', 'Noticias', 'Anuncios'];
  if (data.category && !validCategories.includes(data.category)) errors.push('Categoría inválida');
  return errors;
}

function validateCommentInput(data: { content?: string }) {
  const errors: string[] = [];
  if (!data.content || data.content.trim().length === 0) errors.push('Contenido requerido');
  if (data.content && data.content.length > 5000) errors.push('Comentario demasiado largo');
  return errors;
}

function validateReactionType(type: string): boolean {
  return ['Interesante', 'Util', 'Cientifico'].includes(type);
}

describe('community validation', () => {
  describe('validatePostInput', () => {
    it('should pass with valid post', () => {
      expect(validatePostInput({ title: 'Test', content: 'Content here', category: 'Debates' })).toHaveLength(0);
    });
    it('should fail without title', () => {
      expect(validatePostInput({ content: 'x' })).toContain('Título requerido');
    });
    it('should fail with empty title', () => {
      expect(validatePostInput({ title: '  ', content: 'x' })).toContain('Título requerido');
    });
    it('should fail with long title', () => {
      expect(validatePostInput({ title: 'a'.repeat(201), content: 'x' })).toContain('Título demasiado largo');
    });
    it('should fail without content', () => {
      expect(validatePostInput({ title: 'Test' })).toContain('Contenido requerido');
    });
    it('should fail with invalid category', () => {
      expect(validatePostInput({ title: 'T', content: 'C', category: 'Invalid' })).toContain('Categoría inválida');
    });
    it('should accept all valid categories', () => {
      const cats = ['Clases', 'Investigaciones', 'FAQ', 'Debates', 'Papers', 'Noticias', 'Anuncios'];
      cats.forEach(c => {
        expect(validatePostInput({ title: 'T', content: 'C', category: c })).toHaveLength(0);
      });
    });
    it('should accept post without category (defaults in DB)', () => {
      expect(validatePostInput({ title: 'T', content: 'C' })).toHaveLength(0);
    });
  });

  describe('validateCommentInput', () => {
    it('should pass with valid comment', () => {
      expect(validateCommentInput({ content: 'Good post!' })).toHaveLength(0);
    });
    it('should fail without content', () => {
      expect(validateCommentInput({})).toContain('Contenido requerido');
    });
    it('should fail with empty content', () => {
      expect(validateCommentInput({ content: '' })).toContain('Contenido requerido');
    });
    it('should fail with long comment', () => {
      expect(validateCommentInput({ content: 'a'.repeat(5001) })).toContain('Comentario demasiado largo');
    });
  });

  describe('validateReactionType', () => {
    it('should accept Interesante', () => {
      expect(validateReactionType('Interesante')).toBe(true);
    });
    it('should accept Util', () => {
      expect(validateReactionType('Util')).toBe(true);
    });
    it('should accept Cientifico', () => {
      expect(validateReactionType('Cientifico')).toBe(true);
    });
    it('should reject invalid type', () => {
      expect(validateReactionType('Like')).toBe(false);
    });
    it('should reject empty string', () => {
      expect(validateReactionType('')).toBe(false);
    });
  });
});
