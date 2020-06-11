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

  number = roundWithPrecision(number, precision !== null ? precision : 10);
  number = boundNumber(number, min, max);

  return number;
};

export const formatValue = (value, precision = 0, customFormatter) => {
  if (!hasNumber(value)) {
    return '';
  }

  const number = toNumber(value, precision);

  let formattedValue =
    precision !== null ? number.toFixed(precision) : `${number}`;

  if (customFormatter) {
    formattedValue = customFormatter(formattedValue);
  }

  return formattedValue;
};

export const germanLocaleFormatter = (value, isCurrency) => {
  let formattedValue = value.replace('.', ',');

  if (isCurrency) {
    formattedValue = `${formattedValue} €`;
  }

  return formattedValue;
};
