import { parseValue } from './numberInputHelpers';

describe('numberInputHelpers', () => {
  describe('parseValue', () => {
    it('returns the empty string for invalid input', () => {
      expect(parseValue(undefined)).toBe('');
      expect(parseValue(null)).toBe('');
      expect(parseValue('')).toBe('');
      expect(parseValue('text')).toBe('');
    });

    it('supports whole and decimal numbers', () => {
      expect(parseValue('0')).toBe(0);
      expect(parseValue('12')).toBe(12);
      expect(parseValue('12.34')).toBe(12.34);
    });
  });
});
