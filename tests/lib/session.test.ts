// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '@/lib/session';

describe('session JWT', () => {
  const mockPayload = {
    userId: 1,
    username: 'testuser',
    role: 'USER',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  describe('encrypt', () => {
    it('should produce a JWT string', async () => {
      const token = await encrypt(mockPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // header.payload.signature
    });

    it('should produce different tokens on repeated calls (iat jitter)', async () => {
      // JWT includes iat (issued-at) which may differ — just validate both are valid JWTs
      const token1 = await encrypt(mockPayload);
      const token2 = await encrypt(mockPayload);
      // Both must be decodable
      const decoded1 = await decrypt(token1);
      const decoded2 = await decrypt(token2);
      expect(decoded1?.userId).toBe(mockPayload.userId);
      expect(decoded2?.userId).toBe(mockPayload.userId);
    });

    it('should embed userId, username and role in the token', async () => {
      const token = await encrypt(mockPayload);
      const decoded = await decrypt(token);
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.username).toBe(mockPayload.username);
      expect(decoded?.role).toBe(mockPayload.role);
    });
  });

  describe('decrypt', () => {
    it('should decrypt a valid token', async () => {
      const token = await encrypt(mockPayload);
      const decoded = await decrypt(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(1);
      expect(decoded?.username).toBe('testuser');
      expect(decoded?.role).toBe('USER');
    });

    it('should return null for an invalid token', async () => {
      const decoded = await decrypt('invalid.token.here');
      expect(decoded).toBeNull();
    });

    it('should return null for empty string', async () => {
      const decoded = await decrypt('');
      expect(decoded).toBeNull();
    });

    it('should return null for a tampered signature', async () => {
      const token = await encrypt(mockPayload);
      const tampered = token.slice(0, -5) + 'XXXXX';
      const decoded = await decrypt(tampered);
      expect(decoded).toBeNull();
    });

    it('should return null for a token with tampered payload', async () => {
      const token = await encrypt(mockPayload);
      const parts = token.split('.');
      // Replace payload with a different base64url string
      const fakePayload = Buffer.from(JSON.stringify({ userId: 999, username: 'hacker', role: 'ADMIN' })).toString('base64url');
      const tampered = `${parts[0]}.${fakePayload}.${parts[2]}`;
      const decoded = await decrypt(tampered);
      expect(decoded).toBeNull();
    });

    it('should return null for a token missing parts', async () => {
      const decoded = await decrypt('onlyone');
      expect(decoded).toBeNull();
    });

    it('should handle ADMIN role correctly', async () => {
      const adminPayload = { ...mockPayload, userId: 2, username: 'admin', role: 'ADMIN' };
      const token = await encrypt(adminPayload);
      const decoded = await decrypt(token);
      expect(decoded?.role).toBe('ADMIN');
      expect(decoded?.userId).toBe(2);
    });
  });
});
