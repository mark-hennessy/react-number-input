import { isNumber, roundWithPrecision } from '../utils/numberUtils';

export const formatValue = (value, precision = 0, suffix) => {
  let number = parseFloat(value);
  if (!isNumber(number)) {
    return '';
  }

  number = roundWithPrecision(number, precision === null ? 10 : precision);

  let formattedValue = `${number}`;
  formattedValue = formattedValue.replace('.', ',');

  if (suffix) {
    formattedValue = `${formattedValue}${suffix}`;
  }

  return formattedValue;
};
