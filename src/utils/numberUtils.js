export const isNumber = value => {
  return typeof value === 'number' && isFinite(value);
};

export const boundNumber = (number, min, max) => {
  if (!isNumber(number)) {
    return null;
  }

  let boundNumber = number;

  if (isNumber(min)) {
    boundNumber = Math.max(boundNumber, min);
  }

  if (isNumber(max)) {
    boundNumber = Math.min(boundNumber, max);
  }

  return boundNumber;
};

export const roundWithPrecision = (number, precision) => {
  const precisionMultiplier = 10 ** precision;
  return Math.round(number * precisionMultiplier) / precisionMultiplier;
};
