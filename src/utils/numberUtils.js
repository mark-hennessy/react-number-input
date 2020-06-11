export const isNumber = value => {
  return typeof value === 'number' && isFinite(value);
};

export const boundNumber = (
  number,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
) => {
  if (!isNumber(number)) {
    return null;
  }

  return Math.min(Math.max(number, min), max);
};

export const roundWithPrecision = (number, precision) => {
  const precisionMultiplier = 10 ** precision;
  return Math.round(number * precisionMultiplier) / precisionMultiplier;
};
