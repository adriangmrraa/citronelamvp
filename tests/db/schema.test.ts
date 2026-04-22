import { describe, it, expect } from 'vitest';
import * as schema from '@/db/schema';

describe('database schema', () => {
  describe('core tables', () => {
    it('should export users table', () => {
      expect(schema.users).toBeDefined();
    });

    it('should export crops table', () => {
      expect(schema.crops).toBeDefined();
    });

    it('should export cropLogs table', () => {
      expect(schema.cropLogs).toBeDefined();
    });

    it('should export products table', () => {
      expect(schema.products).toBeDefined();
    });

    it('should export orders table', () => {
      expect(schema.orders).toBeDefined();
    });

    it('should export posts table', () => {
      expect(schema.posts).toBeDefined();
    });

    it('should export events table', () => {
      expect(schema.events).toBeDefined();
    });
  });

  describe('Phase 1 tables', () => {
    it('should export userDocuments table', () => {
      expect(schema.userDocuments).toBeDefined();
    });

    it('should export solidaryCultivators table', () => {
      expect(schema.solidaryCultivators).toBeDefined();
    });

    it('should export tokenTransactions table', () => {
      expect(schema.tokenTransactions).toBeDefined();
    });

    it('should export labReports table', () => {
      expect(schema.labReports).toBeDefined();
    });
  });

  describe('drizzle table objects have expected shape', () => {
    it('users table should have id column', () => {
      expect(schema.users.id).toBeDefined();
    });

    it('solidaryCultivators table should have cultivatorUserId column', () => {
      expect(schema.solidaryCultivators.cultivatorUserId).toBeDefined();
    });

    it('tokenTransactions table should have amount column', () => {
      expect(schema.tokenTransactions.amount).toBeDefined();
    });

    it('labReports table should have cropId column', () => {
      expect(schema.labReports.cropId).toBeDefined();
    });
  });

  describe('type exports — compile-time validation', () => {
    it('should export User and NewUser types', () => {
      // These assertions are type-level; if they compile the types exist
      const _select: schema.User | undefined = undefined;
      const _insert: schema.NewUser | undefined = undefined;
      expect(true).toBe(true);
    });

    it('should export UserDocument and NewUserDocument types', () => {
      const _select: schema.UserDocument | undefined = undefined;
      const _insert: schema.NewUserDocument | undefined = undefined;
      expect(true).toBe(true);
    });

    it('should export SolidaryCultivator and NewSolidaryCultivator types', () => {
      const _select: schema.SolidaryCultivator | undefined = undefined;
      const _insert: schema.NewSolidaryCultivator | undefined = undefined;
      expect(true).toBe(true);
    });

    it('should export TokenTransaction and NewTokenTransaction types', () => {
      const _select: schema.TokenTransaction | undefined = undefined;
      const _insert: schema.NewTokenTransaction | undefined = undefined;
      expect(true).toBe(true);
    });

    it('should export LabReport and NewLabReport types', () => {
      const _select: schema.LabReport | undefined = undefined;
      const _insert: schema.NewLabReport | undefined = undefined;
      expect(true).toBe(true);
    });

    it('should export Crop and NewCrop types', () => {
      const _select: schema.Crop | undefined = undefined;
      const _insert: schema.NewCrop | undefined = undefined;
      expect(true).toBe(true);
    });
  });
});
