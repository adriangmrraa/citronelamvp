import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/lib/auth';

describe('auth utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await hashPassword('test123');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('test123');
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should produce different hashes for same password (bcrypt salting)', async () => {
      const hash1 = await hashPassword('test123');
      const hash2 = await hashPassword('test123');
      expect(hash1).not.toBe(hash2);
    });

    it('should produce a bcrypt hash (starts with $2b$)', async () => {
      const hash = await hashPassword('any-password');
      expect(hash).toMatch(/^\$2[ab]\$/);
    });

    it('should handle special characters in password', async () => {
      const hash = await hashPassword('p@$$w0rd!#%&*()');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('p@$$w0rd!#%&*()');
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const hash = await hashPassword('mypassword');
      const result = await verifyPassword('mypassword', hash);
      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const hash = await hashPassword('mypassword');
      const result = await verifyPassword('wrongpassword', hash);
      expect(result).toBe(false);
    });

    it('should reject empty password against hash', async () => {
      const hash = await hashPassword('mypassword');
      const result = await verifyPassword('', hash);
      expect(result).toBe(false);
    });

    it('should reject password that is a substring of the real one', async () => {
      const hash = await hashPassword('supersecret');
      const result = await verifyPassword('super', hash);
      expect(result).toBe(false);
    });

    it('should reject password with different casing', async () => {
      const hash = await hashPassword('MyPassword');
      const result = await verifyPassword('mypassword', hash);
      expect(result).toBe(false);
    });

    it('should verify special character passwords correctly', async () => {
      const password = 'p@$$w0rd!';
      const hash = await hashPassword(password);
      expect(await verifyPassword(password, hash)).toBe(true);
      expect(await verifyPassword('p@$$w0rd', hash)).toBe(false);
    });
  });
});
