import {
  isNumber,
  boundNumber,
  roundWithPrecision,
} from '../utils/numberUtils';

export const hasNumber = value => {
  let number = parseFloat(value);
  return isNumber(number);
};

export const toNumber = (value, precision, min, max) => {
  let number = parseFloat(value);
  if (!isNumber(number)) {
    number = 0;
  }

  number = roundWithPrecision(number, precision === null ? 10 : precision);
  number = boundNumber(number, min, max);

  return number;
};

export const formatValue = (value, precision = 0, suffix) => {
  if (!hasNumber(value)) {
    return '';
  }

  const number = toNumber(value, precision);

  let formattedValue = `${number}`;
  formattedValue = formattedValue.replace('.', ',');

  if (suffix) {
    formattedValue = `${formattedValue}${suffix}`;
  }

  return formattedValue;
};
