export const isNumber = value => {
  return typeof value === 'number' && isFinite(value);
};

export const boundNumber = (value, min, max) => {
  if (!isNumber(value)) {
    return value;
  }

  let result = value;

  if (isNumber(min)) {
    result = Math.max(result, min);
  }

  if (isNumber(max)) {
    result = Math.min(result, max);
  }

  return result;
};
