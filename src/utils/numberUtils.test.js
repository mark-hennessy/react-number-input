import { boundNumber, isNumber, roundWithPrecision } from './numberUtils';

describe('numberUtils', () => {
  describe('isNumber', () => {
    it('detects invalid numbers', () => {
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(NaN)).toBe(false);
      expect(isNumber(Infinity)).toBe(false);
      expect(isNumber(-Infinity)).toBe(false);
      expect(isNumber(false)).toBe(false);
      expect(isNumber(true)).toBe(false);
      expect(isNumber('')).toBe(false);
      expect(isNumber('1234')).toBe(false);
      expect(isNumber('12.34')).toBe(false);
    });

    it('detects valid numbers', () => {
      expect(isNumber(-12.34)).toBe(true);
      expect(isNumber(-1)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(1)).toBe(true);
      expect(isNumber(1234)).toBe(true);
      expect(isNumber(12.34)).toBe(true);
      expect(isNumber(0.1234)).toBe(true);
    });
  });

  describe('boundNumber', () => {
    it('returns null for invalid input', () => {
      expect(boundNumber(undefined, 0, 100)).toBeNull();
      expect(boundNumber(null, 0, 100)).toBeNull();
      expect(boundNumber(NaN, 0, 100)).toBeNull();
      expect(boundNumber(Infinity, 0, 100)).toBeNull();
      expect(boundNumber(-Infinity, 0, 100)).toBeNull();
      expect(boundNumber(false)).toBeNull();
      expect(boundNumber(true)).toBeNull();
      expect(boundNumber('')).toBeNull();
      expect(boundNumber('1234')).toBeNull();
      expect(boundNumber('12.34')).toBeNull();
    });

    it('works without min', () => {
      expect(boundNumber(Number.MIN_SAFE_INTEGER - 1, null, 100)).toBe(
        Number.MIN_SAFE_INTEGER,
      );
      expect(boundNumber(-1, null, 100)).toBe(-1);
      expect(boundNumber(0, null, 100)).toBe(0);
      expect(boundNumber(12, null, 100)).toBe(12);
      expect(boundNumber(12.34, null, 100)).toBe(12.34);
      expect(boundNumber(100, null, 100)).toBe(100);
      expect(boundNumber(101, null, 100)).toBe(100);
      expect(boundNumber(Number.MAX_SAFE_INTEGER + 1, null, 100)).toBe(
        100,
      );
    });

    it('works without max', () => {
      expect(boundNumber(Number.MIN_SAFE_INTEGER - 1, 0, null)).toBe(0);
      expect(boundNumber(-1, 0, null)).toBe(0);
      expect(boundNumber(0, 0, null)).toBe(0);
      expect(boundNumber(12, 0, null)).toBe(12);
      expect(boundNumber(12.34, 0, null)).toBe(12.34);
      expect(boundNumber(100, 0, null)).toBe(100);
      expect(boundNumber(101, 0, null)).toBe(101);
      expect(boundNumber(Number.MAX_SAFE_INTEGER + 1, 0, null)).toBe(
        Number.MAX_SAFE_INTEGER,
      );
    });

    it('works without min and max', () => {
      expect(
        boundNumber(Number.MIN_SAFE_INTEGER - 1, null, null),
      ).toBe(Number.MIN_SAFE_INTEGER);
      expect(boundNumber(-1, null, null)).toBe(-1);
      expect(boundNumber(0, null, null)).toBe(0);
      expect(boundNumber(12, null, null)).toBe(12);
      expect(boundNumber(12.34, null, null)).toBe(12.34);
      expect(boundNumber(100, null, null)).toBe(100);
      expect(boundNumber(101, null, null)).toBe(101);
      expect(
        boundNumber(Number.MAX_SAFE_INTEGER + 1, null, null),
      ).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('works with min and max', () => {
      expect(boundNumber(Number.MIN_SAFE_INTEGER - 1, 0, 100)).toBe(0);
      expect(boundNumber(-1, 0, 100)).toBe(0);
      expect(boundNumber(0, 0, 100)).toBe(0);
      expect(boundNumber(12, 0, 100)).toBe(12);
      expect(boundNumber(12.34, 0, 100)).toBe(12.34);
      expect(boundNumber(100, 0, 100)).toBe(100);
      expect(boundNumber(101, 0, 100)).toBe(100);
      expect(boundNumber(Number.MAX_SAFE_INTEGER + 1, 0, 100)).toBe(100);
    });
  });

  describe('roundWithPrecision', () => {
    it('works with 0', () => {
      expect(roundWithPrecision(0, 0)).toBe(0);
      expect(roundWithPrecision(0, 2)).toBe(0);
    });

    it('works with negative numbers', () => {
      expect(roundWithPrecision(-42.482153827, 0)).toBe(-42);
      expect(roundWithPrecision(-42.482153827, 1)).toBe(-42.5);
      expect(roundWithPrecision(-42.482153827, 2)).toBe(-42.48);
      expect(roundWithPrecision(-42.482153827, 3)).toBe(-42.482);
      expect(roundWithPrecision(-42.482153827, 4)).toBe(-42.4822);
      expect(roundWithPrecision(-42.482153827, 5)).toBe(-42.48215);
      expect(roundWithPrecision(-42.482153827, 6)).toBe(-42.482154);
    });

    it('works with positive numbers', () => {
      expect(roundWithPrecision(42.482153827, 0)).toBe(42);
      expect(roundWithPrecision(42.482153827, 1)).toBe(42.5);
      expect(roundWithPrecision(42.482153827, 2)).toBe(42.48);
      expect(roundWithPrecision(42.482153827, 3)).toBe(42.482);
      expect(roundWithPrecision(42.482153827, 4)).toBe(42.4822);
      expect(roundWithPrecision(42.482153827, 5)).toBe(42.48215);
      expect(roundWithPrecision(42.482153827, 6)).toBe(42.482154);
    });
  });
});
