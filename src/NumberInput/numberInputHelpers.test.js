import {
  containsNumber,
  formatValue,
  germanLocalePostFormatter,
  germanLocalePreParser,
  parseToNumber,
  parseValue,
} from './numberInputHelpers';

describe('numberInputHelpers', () => {
  const mockPreParser = string => {
    // The currency symbol will get parsed out by parseFloat
    return string.replace(',', '.');
  };

  describe('parseToNumber', () => {
    it('works without a preParser', () => {
      expect(parseToNumber(undefined, null)).toBe(NaN);
      expect(parseToNumber(null, null)).toBe(NaN);

      expect(parseToNumber(0, null)).toBe(0);
      expect(parseToNumber(12, null)).toBe(12);
      expect(parseToNumber(-12, null)).toBe(-12);
      expect(parseToNumber(12.34, null)).toBe(12.34);

      expect(parseToNumber('0', null)).toBe(0);
      expect(parseToNumber('12', null)).toBe(12);
      expect(parseToNumber(' 12 ', null)).toBe(12);
      expect(parseToNumber('-12', null)).toBe(-12);
      expect(parseToNumber('12 €', null)).toBe(12);

      expect(parseToNumber('12.', null)).toBe(12);
      expect(parseToNumber('12.0', null)).toBe(12);
      expect(parseToNumber('.12', null)).toBe(0.12);
      expect(parseToNumber('0.12', null)).toBe(0.12);
      expect(parseToNumber('12.34', null)).toBe(12.34);
    });

    it('works with a preParser', () => {
      expect(parseToNumber(undefined, null)).toBe(NaN);
      expect(parseToNumber(null, null)).toBe(NaN);

      expect(parseToNumber(0, mockPreParser)).toBe(0);
      expect(parseToNumber(12, mockPreParser)).toBe(12);
      expect(parseToNumber(-12, mockPreParser)).toBe(-12);
      expect(parseToNumber(12.34, mockPreParser)).toBe(12.34);

      expect(parseToNumber('0', mockPreParser)).toBe(0);
      expect(parseToNumber('12', mockPreParser)).toBe(12);
      expect(parseToNumber(' 12 ', mockPreParser)).toBe(12);
      expect(parseToNumber('-12', mockPreParser)).toBe(-12);
      expect(parseToNumber('12 €', mockPreParser)).toBe(12);

      expect(parseToNumber('12,', mockPreParser)).toBe(12);
      expect(parseToNumber('12,0', mockPreParser)).toBe(12);
      expect(parseToNumber(',12', mockPreParser)).toBe(0.12);
      expect(parseToNumber('0,12', mockPreParser)).toBe(0.12);
      expect(parseToNumber('12,34', mockPreParser)).toBe(12.34);
    });
  });

  describe('containsNumber', () => {
    it('returns false when there are no numbers', () => {
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

    it('supports fancy string input with preParser', () => {
      expect(containsNumber('12,', mockPreParser)).toBe(true);
      expect(containsNumber('12,0', mockPreParser)).toBe(true);
      expect(containsNumber(',12', mockPreParser)).toBe(true);
      expect(containsNumber('0,12', mockPreParser)).toBe(true);
      expect(containsNumber('12,34', mockPreParser)).toBe(true);
    });
  });

  describe('parseValue', () => {
    it('parses invalid values', () => {
      expect(parseValue(undefined)).toBe(0);
      expect(parseValue(null)).toBe(0);
      expect(parseValue('')).toBe(0);
      expect(parseValue(' ')).toBe(0);
      expect(parseValue('blah')).toBe(0);
      expect(parseValue('€')).toBe(0);

      expect(parseValue('', null, 100, null)).toBe(100);
      expect(parseValue('', null, null, -100)).toBe(-100);
    });

    it('parses string values', () => {
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

  describe('formatValue', () => {
    it('formats invalid values to empty string', () => {
      expect(formatValue(undefined)).toBe('');
      expect(formatValue(null)).toBe('');
      expect(formatValue(NaN)).toBe('');
      expect(formatValue(Infinity)).toBe('');
      expect(formatValue(-Infinity)).toBe('');
      expect(formatValue(false)).toBe('');
      expect(formatValue(true)).toBe('');
      expect(formatValue('')).toBe('');
    });

    it('formats string values (just in case)', () => {
      expect(formatValue('1234', null)).toBe('1234');
      expect(formatValue('12.34', null)).toBe('12.34');
      expect(formatValue('12.5', null)).toBe('12.5');
      expect(formatValue('12.5 €', null)).toBe('12.5');
    });

    it('formats number values', () => {
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

    it('supports post formatting', () => {
      const postFormatter = (v, isCurrency) => {
        return isCurrency ? `${v} €` : `${v}`;
      };

      expect(formatValue(12.5, 2, null, null, false, postFormatter)).toBe(
        '12.50',
      );

      expect(formatValue(12.5, 2, null, null, true, postFormatter)).toBe(
        '12.50 €',
      );
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
