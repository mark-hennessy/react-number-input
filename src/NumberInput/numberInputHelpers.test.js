import {
  containsNumber,
  formatValue,
  parseToNumber,
  parseValue,
} from './numberInputHelpers';

describe('numberInputHelpers', () => {
  describe('parseToNumber', () => {
    it('handles invalid input', () => {
      expect(parseToNumber(undefined)).toBe(NaN);
      expect(parseToNumber(null)).toBe(NaN);
      expect(parseToNumber(NaN)).toBe(NaN);
      expect(parseToNumber(Infinity)).toBe(Infinity);
      expect(parseToNumber(-Infinity)).toBe(-Infinity);
      expect(parseToNumber(false)).toBe(NaN);
      expect(parseToNumber(true)).toBe(NaN);
      expect(parseToNumber('')).toBe(NaN);
      expect(parseToNumber(' ')).toBe(NaN);
      expect(parseToNumber('-')).toBe(NaN);
      expect(parseToNumber('€')).toBe(NaN);
      expect(parseToNumber('text')).toBe(NaN);
    });

    it('supports number input', () => {
      expect(parseToNumber(0, null)).toBe(0);
      expect(parseToNumber(12, null)).toBe(12);
      expect(parseToNumber(-12, null)).toBe(-12);
      expect(parseToNumber(12.34, null)).toBe(12.34);
    });

    it('supports string input', () => {
      expect(parseToNumber('0')).toBe(0);
      expect(parseToNumber('12')).toBe(12);
      expect(parseToNumber(' 12 ')).toBe(12);
      expect(parseToNumber('-12')).toBe(-12);
      expect(parseToNumber('12 €')).toBe(12);

      expect(parseToNumber('12.')).toBe(12);
      expect(parseToNumber('12.0')).toBe(12);
      expect(parseToNumber('.12')).toBe(0.12);
      expect(parseToNumber('0.12')).toBe(0.12);
      expect(parseToNumber('12.34')).toBe(12.34);
    });

    it('supports custom decimal separator', () => {
      expect(parseToNumber('12,', ',')).toBe(12);
      expect(parseToNumber('12,0', ',')).toBe(12);
      expect(parseToNumber(',12', ',')).toBe(0.12);
      expect(parseToNumber('0,12', ',')).toBe(0.12);
      expect(parseToNumber('12,34', ',')).toBe(12.34);
    });
  });

  describe('containsNumber', () => {
    it('handles invalid input', () => {
      expect(containsNumber(undefined)).toBe(false);
      expect(containsNumber(null)).toBe(false);
      expect(containsNumber(NaN)).toBe(false);
      expect(containsNumber(Infinity)).toBe(false);
      expect(containsNumber(-Infinity)).toBe(false);
      expect(containsNumber(false)).toBe(false);
      expect(containsNumber(true)).toBe(false);
      expect(containsNumber('')).toBe(false);
      expect(containsNumber(' ')).toBe(false);
      expect(containsNumber('-')).toBe(false);
      expect(containsNumber('€')).toBe(false);
      expect(containsNumber('text')).toBe(false);
    });

    it('supports number input', () => {
      expect(containsNumber(0)).toBe(true);
      expect(containsNumber(12)).toBe(true);
      expect(containsNumber(-12)).toBe(true);
      expect(containsNumber(12.34)).toBe(true);
    });

    it('supports string input', () => {
      expect(containsNumber('0')).toBe(true);
      expect(containsNumber('12')).toBe(true);
      expect(containsNumber(' 12 ')).toBe(true);
      expect(containsNumber('-12')).toBe(true);
      expect(containsNumber('12 €')).toBe(true);

      expect(containsNumber('12.')).toBe(true);
      expect(containsNumber('12.0')).toBe(true);
      expect(containsNumber('.12')).toBe(true);
      expect(containsNumber('0.12')).toBe(true);
      expect(containsNumber('12.34')).toBe(true);
    });

    it('supports custom decimal separator', () => {
      expect(containsNumber('12,', ',')).toBe(true);
      expect(containsNumber('12,0', ',')).toBe(true);
      expect(containsNumber(',12', ',')).toBe(true);
      expect(containsNumber('0,12', ',')).toBe(true);
      expect(containsNumber('12,34', ',')).toBe(true);
    });
  });

  describe('parseValue', () => {
    it('handles invalid input', () => {
      expect(parseValue(undefined)).toBe(0);
      expect(parseValue(null)).toBe(0);
      expect(parseValue(NaN)).toBe(0);
      expect(parseValue(Infinity)).toBe(0);
      expect(parseValue(-Infinity)).toBe(0);
      expect(parseValue(false)).toBe(0);
      expect(parseValue(true)).toBe(0);
      expect(parseValue('')).toBe(0);
      expect(parseValue(' ')).toBe(0);
      expect(parseValue('-')).toBe(0);
      expect(parseValue('€')).toBe(0);
      expect(parseValue('text')).toBe(0);
    });

    it('handles invalid input according to min/max', () => {
      expect(parseValue('', null, 100, null)).toBe(100);
      expect(parseValue('', null, null, -100)).toBe(-100);
    });

    it('supports string input', () => {
      expect(parseValue('1234', null)).toBe(1234);
      expect(parseValue('12.34', null)).toBe(12.34);
      expect(parseValue('12.5', null)).toBe(12.5);
      expect(parseValue('12.5 €', null)).toBe(12.5);
    });

    it('supports precision', () => {
      expect(parseValue('1234', 0)).toBe(1234);
      expect(parseValue('1234', 1)).toBe(1234);
      expect(parseValue('1234', 2)).toBe(1234);

      expect(parseValue('12.34', 0)).toBe(12);
      expect(parseValue('12.34', 1)).toBe(12.3);
      expect(parseValue('12.34', 2)).toBe(12.34);

      expect(parseValue('12.5', 0)).toBe(13);
      expect(parseValue('12.5', 1)).toBe(12.5);
      expect(parseValue('12.5', 2)).toBe(12.5);

      expect(parseValue('12.0123456789', undefined)).toBe(12);
      expect(parseValue('12.0123456789', null)).toBe(12.0123456789);
      expect(parseValue('12.0123456789', 11)).toBe(12.0123456789);
    });

    it('supports min/max', () => {
      expect(parseValue('-1.5', 0, null, 100)).toBe(-1);
      expect(parseValue('-1.5', 0, 0, 100)).toBe(0);
      expect(parseValue('0', 0, 0, 100)).toBe(0);
      expect(parseValue('100', 0, 0, 100)).toBe(100);
      expect(parseValue('100.5', 0, 0, 100)).toBe(100);
      expect(parseValue('100.5', 0, 0, null)).toBe(101);
    });

    it('supports custom decimal separator', () => {
      expect(parseValue('12,5', 0, null, null, ',')).toBe(13);
      expect(parseValue('12,5', 1, null, null, ',')).toBe(12.5);
    });
  });

  describe('formatValue', () => {
    it('handles invalid input', () => {
      expect(formatValue(undefined)).toBe('');
      expect(formatValue(null)).toBe('');
      expect(formatValue(NaN)).toBe('');
      expect(formatValue(Infinity)).toBe('');
      expect(formatValue(-Infinity)).toBe('');
      expect(formatValue(false)).toBe('');
      expect(formatValue(true)).toBe('');
      expect(formatValue('')).toBe('');
      expect(formatValue(' ')).toBe('');
      expect(formatValue('-')).toBe('');
      expect(formatValue('€')).toBe('');
      expect(formatValue('text')).toBe('');
    });

    it('supports string input (just in case)', () => {
      expect(formatValue('1234', null)).toBe('1234');
      expect(formatValue('12.34', null)).toBe('12.34');
      expect(formatValue('12.5', null)).toBe('12.5');
      expect(formatValue('12.5 €', null)).toBe('12.5');
    });

    it('supports number input', () => {
      expect(formatValue(1234, null)).toBe('1234');
      expect(formatValue(12.34, null)).toBe('12.34');
      expect(formatValue(12.5, null)).toBe('12.5');
    });

    it('supports precision', () => {
      expect(formatValue(1234, 0)).toBe('1234');
      expect(formatValue(1234, 1)).toBe('1234.0');
      expect(formatValue(1234, 2)).toBe('1234.00');

      expect(formatValue(12.34, 0)).toBe('12');
      expect(formatValue(12.34, 1)).toBe('12.3');
      expect(formatValue(12.34, 2)).toBe('12.34');

      expect(formatValue(12.5, 0)).toBe('13');
      expect(formatValue(12.5, 1)).toBe('12.5');
      expect(formatValue(12.5, 2)).toBe('12.50');

      expect(formatValue(12.0123456789, undefined)).toBe('12');
      expect(formatValue(12.0123456789, null)).toBe('12.0123456789');
      expect(formatValue(12.0123456789, 11)).toBe('12.01234567890');
    });

    it('supports min/max', () => {
      expect(formatValue(-1.5, 0, null, 100)).toBe('-1');
      expect(formatValue(-1.5, 0, 0, 100)).toBe('0');
      expect(formatValue(0, 0, 0, 100)).toBe('0');
      expect(formatValue(100, 0, 0, 100)).toBe('100');
      expect(formatValue(100.5, 0, 0, 100)).toBe('100');
      expect(formatValue(100.5, 0, 0, null)).toBe('101');
    });

    it('supports custom decimal separator', () => {
      expect(formatValue(12.5, 2, null, null, ',')).toBe('12,50');
    });

    it('supports suffix', () => {
      expect(formatValue(12.5, 2, null, null, ',', ' €')).toBe('12,50 €');
    });
  });
});
