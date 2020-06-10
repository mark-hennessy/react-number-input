import { isNumber, boundNumber } from './numberUtils';

describe('numberUtils', () => {
  it('isNumber', () => {
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

    expect(isNumber(-12.34)).toBe(true);
    expect(isNumber(-1)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(1)).toBe(true);
    expect(isNumber(1234)).toBe(true);
    expect(isNumber(12.34)).toBe(true);
    expect(isNumber(0.1234)).toBe(true);
  });

  describe('boundNumber', () => {
    it('ignores value when not a number', () => {
      expect(boundNumber(undefined, 0, 100)).toBeUndefined();
      expect(boundNumber(null, 0, 100)).toBeNull();
      expect(boundNumber(false, 0, 100)).toBe(false);
      expect(boundNumber('hello', 0, 100)).toBe('hello');
      expect(boundNumber('12', 0, 100)).toBe('12');
    });

    it('works without min', () => {
      expect(boundNumber(-1, undefined, 100)).toBe(-1);
      expect(boundNumber(12, undefined, 100)).toBe(12);
      expect(boundNumber(12.34, undefined, 100)).toBe(12.34);
      expect(boundNumber(101, undefined, 100)).toBe(100);
    });

    it('works without max', () => {
      expect(boundNumber(-1, 0, undefined)).toBe(0);
      expect(boundNumber(12, 0, undefined)).toBe(12);
      expect(boundNumber(12.34, 0, undefined)).toBe(12.34);
      expect(boundNumber(101, 0, undefined)).toBe(101);
    });

    it('works without min and max', () => {
      expect(boundNumber(-1, undefined, undefined)).toBe(-1);
      expect(boundNumber(12, undefined, undefined)).toBe(12);
      expect(boundNumber(12.34, undefined, undefined)).toBe(12.34);
      expect(boundNumber(101, undefined, undefined)).toBe(101);
    });

    it('works with min and max', () => {
      expect(boundNumber(-1, 0, 100)).toBe(0);
      expect(boundNumber(0, 0, 100)).toBe(0);
      expect(boundNumber(12, 0, 100)).toBe(12);
      expect(boundNumber(12.34, 0, 100)).toBe(12.34);
      expect(boundNumber(100, 0, 100)).toBe(100);
      expect(boundNumber(101, 0, 100)).toBe(100);
    });
  });
});
