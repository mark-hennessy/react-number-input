import {
  parseValue,
  germanLocalePreParser,
  containsNumber,
  formatValue,
  germanLocalePostFormatter,
} from './numberInputHelpers';

describe('numberInputHelpers', () => {
  describe('parseValue', () => {
    it('', () => {});

    it('supports pre parsing', () => {
      expect(parseValue('12,5', 0, null, null, v => v.replace(',', '.'))).toBe(
        13,
      );
    });
  });

  describe('germanLocalePreParser', () => {
    it('replaces comma with period', () => {
      expect(germanLocalePreParser('1234')).toBe('1234');
      expect(germanLocalePreParser('12,34')).toBe('12.34');
      expect(germanLocalePreParser('12,5')).toBe('12.5');
      expect(germanLocalePreParser('12,50')).toBe('12.50');
    });
  });

  describe('containsNumber', () => {
    it('returns false for invalid input', () => {
      expect(containsNumber(undefined)).toBe(false);
      expect(containsNumber(null)).toBe(false);
      expect(containsNumber(NaN)).toBe(false);
      expect(containsNumber(Infinity)).toBe(false);
      expect(containsNumber(-Infinity)).toBe(false);
      expect(containsNumber(false)).toBe(false);
      expect(containsNumber(true)).toBe(false);
      expect(containsNumber('')).toBe(false);
      expect(containsNumber(' ')).toBe(false);
      expect(containsNumber('€')).toBe(false);
    });

    it('returns true for valid input', () => {
      expect(containsNumber(0)).toBe(true);
      expect(containsNumber(-12)).toBe(true);
      expect(containsNumber(12)).toBe(true);
      expect(containsNumber(12.34)).toBe(true);

      expect(containsNumber('0')).toBe(true);
      expect(containsNumber('-12')).toBe(true);
      expect(containsNumber('12')).toBe(true);
      expect(containsNumber('12.34')).toBe(true);
      expect(containsNumber(' 12.34 ')).toBe(true);
      expect(containsNumber('12.34 €')).toBe(true);
    });
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

    it('supports post formatting', () => {
      expect(formatValue(12.5, 2, null, null, v => `${v} €`)).toBe('12.50 €');
    });
  });

  describe('germanLocalePostFormatter', () => {
    it('formats numbers', () => {
      expect(germanLocalePostFormatter('1234', false)).toBe('1234');
      expect(germanLocalePostFormatter('12.34', false)).toBe('12,34');
      expect(germanLocalePostFormatter('12.5', false)).toBe('12,5');
      expect(germanLocalePostFormatter('12.50', false)).toBe('12,50');
    });

    it('formats currency', () => {
      expect(germanLocalePostFormatter('1234', true)).toBe('1234 €');
      expect(germanLocalePostFormatter('12.34', true)).toBe('12,34 €');
      expect(germanLocalePostFormatter('12.5', true)).toBe('12,5 €');
      expect(germanLocalePostFormatter('12.50', true)).toBe('12,50 €');
    });
  });
});
