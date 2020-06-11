import {
  hasNumber,
  toNumber,
  formatValue,
  germanLocaleFormatter,
} from './numberInputHelpers';

describe('numberInputHelpers', () => {
  describe('hasNumber', () => {
    it('returns false for invalid input', () => {
      expect(hasNumber(undefined)).toBe(false);
      expect(hasNumber(null)).toBe(false);
      expect(hasNumber(NaN)).toBe(false);
      expect(hasNumber(Infinity)).toBe(false);
      expect(hasNumber(-Infinity)).toBe(false);
      expect(hasNumber(false)).toBe(false);
      expect(hasNumber(true)).toBe(false);
      expect(hasNumber('')).toBe(false);
      expect(hasNumber('€')).toBe(false);
    });

    it('returns true for valid input', () => {
      expect(hasNumber(0)).toBe(true);
      expect(hasNumber(-12)).toBe(true);
      expect(hasNumber(12)).toBe(true);
      expect(hasNumber(12.34)).toBe(true);

      expect(hasNumber('0')).toBe(true);
      expect(hasNumber('-12')).toBe(true);
      expect(hasNumber('12')).toBe(true);
      expect(hasNumber('12.34')).toBe(true);
      expect(hasNumber(' 12.34 ')).toBe(true);
      expect(hasNumber('12.34 €')).toBe(true);
    });
  });

  describe('toNumber', () => {
    it('', () => {
      // expect(toNumber('0')).toBe(true);
    });

    it('', () => {});
  });

  describe('formatValue', () => {
    it('returns empty string for invalid input', () => {
      expect(formatValue(undefined)).toBe('');
      expect(formatValue(null)).toBe('');
      expect(formatValue(NaN)).toBe('');
      expect(formatValue(Infinity)).toBe('');
      expect(formatValue(-Infinity)).toBe('');
      expect(formatValue(false)).toBe('');
      expect(formatValue(true)).toBe('');
      expect(formatValue('')).toBe('');
    });

    it('supports string value', () => {
      expect(formatValue('1234')).toBe('1234');
      expect(formatValue('12.34')).toBe('12');
      expect(formatValue('12.5')).toBe('13');
    });

    it('supports number value', () => {
      expect(formatValue(1234)).toBe('1234');
      expect(formatValue(12.34)).toBe('12');
      expect(formatValue(12.5)).toBe('13');
    });

    it('supports precision', () => {
      expect(formatValue(1234, 0)).toBe('1234');
      expect(formatValue(1234, 1)).toBe('1234.0');

      expect(formatValue(12.34, 0)).toBe('12');
      expect(formatValue(12.34, 1)).toBe('12.3');
      expect(formatValue(12.34, 2)).toBe('12.34');

      expect(formatValue(12.5, 0)).toBe('13');
      expect(formatValue(12.5, 1)).toBe('12.5');
      expect(formatValue(12.5, 2)).toBe('12.50');
    });

    it('supports unbound precision', () => {
      expect(formatValue(12.0123456789, null)).toBe('12.0123456789');
      expect(formatValue(12.0123456789, 11)).toBe('12.01234567890');
    });

    it('supports custom formatting', () => {
      expect(formatValue(12.5, 2, v => `${v} €`)).toBe('12.50 €');
    });
  });

  describe('germanLocaleFormatter', () => {
    it('formats numbers', () => {
      expect(germanLocaleFormatter('1234', false)).toBe('1234');
      expect(germanLocaleFormatter('12.34', false)).toBe('12,34');
      expect(germanLocaleFormatter('12.5', false)).toBe('12,5');
      expect(germanLocaleFormatter('12.50', false)).toBe('12,50');
    });

    it('formats currency', () => {
      expect(germanLocaleFormatter('1234', true)).toBe('1234 €');
      expect(germanLocaleFormatter('12.34', true)).toBe('12,34 €');
      expect(germanLocaleFormatter('12.5', true)).toBe('12,5 €');
      expect(germanLocaleFormatter('12.50', true)).toBe('12,50 €');
    });
  });
});
