export const isNumber = value => {
  return typeof value === 'number' && isFinite(value);
};

export const boundNumber = (number, min, max) => {
  if (!isNumber(number)) {
    return null;
  }

  const minOrDefault = isNumber(min) ? min : Number.MIN_SAFE_INTEGER;
  const maxOrDefault = isNumber(max) ? max : Number.MAX_SAFE_INTEGER;

  return Math.min(Math.max(number, minOrDefault), maxOrDefault);
};

export const roundWithPrecision = (number, precision) => {
  const precisionMultiplier = 10 ** precision;
  return Math.round(number * precisionMultiplier) / precisionMultiplier;
};
