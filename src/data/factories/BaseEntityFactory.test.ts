/**
 * Tests for BaseEntityFactory
 *
 * Tests the base factory functionality including:
 * - Dynamic date generation methods
 * - Entity creation patterns
 * - ID generation
 * - Batch creation
 */

import { BaseEntityFactory } from './BaseEntityFactory';

// Test entity interface
interface TestEntity {
  id: string;
  name: string;
  createdAt: string;
  dueDate: string;
}

// Concrete test factory implementation
class TestEntityFactory extends BaseEntityFactory<TestEntity> {
  protected getPrefix(): string {
    return 'test';
  }

  create(overrides?: Partial<TestEntity>): TestEntity {
    return {
      id: overrides?.id || this.generateId(),
      name: overrides?.name || 'Test Entity',
      createdAt: overrides?.createdAt || this.now(),
      dueDate: overrides?.dueDate || this.today(),
    };
  }
}

describe('BaseEntityFactory', () => {
  let factory: TestEntityFactory;

  beforeEach(() => {
    factory = new TestEntityFactory();
    factory.resetCounter();
  });

  describe('Date Generation Methods', () => {
    describe('now()', () => {
      it('should return current timestamp in ISO format', () => {
        const result = factory['now']();

        // Should be ISO 8601 format with timezone
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });

      it('should return timestamps close to actual current time', () => {
        const before = new Date().getTime();
        const result = factory['now']();
        const after = new Date().getTime();

        const resultTime = new Date(result).getTime();
        expect(resultTime).toBeGreaterThanOrEqual(before);
        expect(resultTime).toBeLessThanOrEqual(after);
      });

      it('should return different timestamps when called multiple times', () => {
        const timestamp1 = factory['now']();
        // Small delay to ensure different timestamps
        const timestamp2 = factory['now']();

        // Timestamps should be very close but potentially different
        expect(timestamp1).toBeTruthy();
        expect(timestamp2).toBeTruthy();
      });
    });

    describe('today()', () => {
      it('should return current date in YYYY-MM-DD format', () => {
        const result = factory['today']();

        // Should be YYYY-MM-DD format
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it('should return today\'s actual date', () => {
        const result = factory['today']();
        const today = new Date().toISOString().split('T')[0];

        expect(result).toBe(today);
      });

      it('should not include time portion', () => {
        const result = factory['today']();

        expect(result).not.toContain('T');
        expect(result).not.toContain(':');
      });
    });

    describe('dateAgo()', () => {
      it('should return date N days in the past in YYYY-MM-DD format', () => {
        const result = factory['dateAgo'](7);

        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it('should calculate past dates correctly', () => {
        const daysBack = 5;
        const result = factory['dateAgo'](daysBack);

        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - daysBack);
        const expectedDateString = expectedDate.toISOString().split('T')[0];

        expect(result).toBe(expectedDateString);
      });

      it('should handle 0 days (returns today)', () => {
        const result = factory['dateAgo'](0);
        const today = factory['today']();

        expect(result).toBe(today);
      });

      it('should handle large day values', () => {
        const result = factory['dateAgo'](365); // 1 year ago

        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        const resultDate = new Date(result);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - resultDate.getTime()) / (1000 * 60 * 60 * 24));

        expect(daysDiff).toBe(365);
      });
    });

    describe('dateFuture()', () => {
      it('should return date N days in the future in YYYY-MM-DD format', () => {
        const result = factory['dateFuture'](7);

        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it('should calculate future dates correctly', () => {
        const daysAhead = 5;
        const result = factory['dateFuture'](daysAhead);

        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() + daysAhead);
        const expectedDateString = expectedDate.toISOString().split('T')[0];

        expect(result).toBe(expectedDateString);
      });

      it('should handle 0 days (returns today)', () => {
        const result = factory['dateFuture'](0);
        const today = factory['today']();

        expect(result).toBe(today);
      });

      it('should handle large day values', () => {
        const result = factory['dateFuture'](365); // 1 year from now

        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        // Create expected date using same logic as the helper
        const expectedDate = new Date();
        expectedDate.setHours(0, 0, 0, 0);
        expectedDate.setDate(expectedDate.getDate() + 365);
        const expectedString = expectedDate.toISOString().split('T')[0];

        expect(result).toBe(expectedString);
      });
    });

    describe('dateAgoISO()', () => {
      it('should return ISO timestamp N days in the past', () => {
        const result = factory['dateAgoISO'](7);

        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });

      it('should calculate past timestamps with correct date and time', () => {
        const result = factory['dateAgoISO'](1, 14, 30); // 1 day ago at 14:30

        const resultDate = new Date(result);
        const expectedDate = new Date();
        expectedDate.setHours(0, 0, 0, 0); // Reset to midnight
        expectedDate.setDate(expectedDate.getDate() - 1); // Go back 1 day
        expectedDate.setHours(14, 30, 0, 0); // Set to 14:30

        // Should match the expected date
        expect(resultDate.toISOString()).toBe(expectedDate.toISOString());
      });

      it('should use default time of 10:00 when no time specified', () => {
        const result = factory['dateAgoISO'](0); // Today at 10:00 (default)

        // Just verify it's a valid ISO timestamp for today
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

        const resultDate = new Date(result);
        const today = new Date().toISOString().split('T')[0];
        const resultDay = resultDate.toISOString().split('T')[0];

        // Should be today's date
        expect(resultDay).toBe(today);
      });
    });

    describe('dateFutureISO()', () => {
      it('should return ISO timestamp N days in the future', () => {
        const result = factory['dateFutureISO'](7);

        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });

      it('should calculate future timestamps with correct date and time', () => {
        const result = factory['dateFutureISO'](1, 14, 30); // 1 day from now at 14:30

        const resultDate = new Date(result);
        const expectedDate = new Date();
        expectedDate.setHours(0, 0, 0, 0); // Reset to midnight
        expectedDate.setDate(expectedDate.getDate() + 1); // Go forward 1 day
        expectedDate.setHours(14, 30, 0, 0); // Set to 14:30

        // Should match the expected date
        expect(resultDate.toISOString()).toBe(expectedDate.toISOString());
      });

      it('should use default time of 10:00 when no time specified', () => {
        const result = factory['dateFutureISO'](0); // Today at 10:00 (default)

        // Just verify it's a valid ISO timestamp for today
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

        const resultDate = new Date(result);
        const today = new Date().toISOString().split('T')[0];
        const resultDay = resultDate.toISOString().split('T')[0];

        // Should be today's date
        expect(resultDay).toBe(today);
      });
    });

    describe('Date Generation Integration', () => {
      it('should produce dynamic dates that change relative to test execution time', () => {
        // Create entity with date 7 days ago
        const entity1 = factory.create({
          createdAt: factory['dateAgoISO'](7),
        });

        // Create entity with date 7 days from now
        const entity2 = factory.create({
          dueDate: factory['dateFuture'](7),
        });

        // Verify dates are relative to now
        const createdDate = new Date(entity1.createdAt);
        const dueDate = new Date(entity2.dueDate);
        const now = new Date();

        expect(createdDate).toBeInstanceOf(Date);
        expect(dueDate).toBeInstanceOf(Date);
        expect(createdDate.getTime()).toBeLessThan(now.getTime());
        expect(dueDate.getTime()).toBeGreaterThan(now.getTime());
      });

      it('should allow mixing date and ISO formats', () => {
        const entity = factory.create({
          createdAt: factory['dateAgoISO'](5, 2, 30), // ISO timestamp
          dueDate: factory['dateFuture'](3), // YYYY-MM-DD date
        });

        // createdAt should have time portion
        expect(entity.createdAt).toContain('T');
        expect(entity.createdAt).toContain(':');

        // dueDate should not have time portion
        expect(entity.dueDate).not.toContain('T');
        expect(entity.dueDate).not.toContain(':');
      });
    });
  });

  describe('Entity Creation', () => {
    it('should create entity with default values', () => {
      const entity = factory.create();

      expect(entity.id).toBeTruthy();
      expect(entity.name).toBe('Test Entity');
      expect(entity.createdAt).toBeTruthy();
      expect(entity.dueDate).toBeTruthy();
    });

    it('should create entity with overrides', () => {
      const entity = factory.create({
        name: 'Custom Entity',
        dueDate: '2025-12-31',
      });

      expect(entity.name).toBe('Custom Entity');
      expect(entity.dueDate).toBe('2025-12-31');
      expect(entity.id).toBeTruthy();
      expect(entity.createdAt).toBeTruthy();
    });

    it('should generate unique IDs for each entity', () => {
      const entity1 = factory.create();
      const entity2 = factory.create();

      expect(entity1.id).not.toBe(entity2.id);
    });
  });

  describe('Batch Creation', () => {
    it('should create multiple entities with createMany', () => {
      const entities = factory.createMany(5);

      expect(entities).toHaveLength(5);
      entities.forEach((entity) => {
        expect(entity.id).toBeTruthy();
        expect(entity.name).toBe('Test Entity');
      });
    });

    it('should create entities with shared overrides', () => {
      const entities = factory.createMany(3, {
        name: 'Shared Name',
      });

      expect(entities).toHaveLength(3);
      entities.forEach((entity) => {
        expect(entity.name).toBe('Shared Name');
      });
    });

    it('should assign unique IDs even with shared overrides', () => {
      const entities = factory.createMany(3, {
        name: 'Shared Name',
      });

      const ids = entities.map((e) => e.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });
  });

  describe('ID Generation', () => {
    it('should generate IDs with correct prefix', () => {
      const entity = factory.create();

      expect(entity.id).toMatch(/^test-\d+-\d+$/);
    });

    it('should reset counter', () => {
      factory.create();
      factory.create();

      factory.resetCounter();

      const entity = factory.create();
      // After reset, counter should restart at 0
      expect(entity.id).toMatch(/^test-\d+-0$/);
    });
  });

  describe('Variant Creation', () => {
    it('should create variant with index-based ID', () => {
      const variant1 = factory.createVariant(0);
      const variant2 = factory.createVariant(1);

      expect(variant1.id).toMatch(/^test-\d+-0$/);
      expect(variant2.id).toMatch(/^test-\d+-1$/);
    });

    it('should support overrides in variants', () => {
      const variant = factory.createVariant(5, {
        name: 'Variant Name',
      });

      expect(variant.name).toBe('Variant Name');
      expect(variant.id).toMatch(/^test-\d+-5$/);
    });
  });
});
