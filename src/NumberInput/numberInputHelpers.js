import {
  isNumber,
  boundNumber,
  roundWithPrecision,
} from '../utils/numberUtils';

export const parseValue = (value, precision = 0, min, max, preParser) => {
  const valueToParse = preParser ? preParser(value) : value;
  let number = parseFloat(valueToParse);
  if (!isNumber(number)) {
    number = 0;
  }

  number = roundWithPrecision(number, isNumber(precision) ? precision : 10);
  number = boundNumber(number, min, max);
  return number;
};

export const germanLocalePreParser = value => {
  return value.replace(',', '.');
};

export const containsNumber = value => {
  const number = parseFloat(value);
  return isNumber(number);
};

export const formatValue = (value, precision = 0, min, max, postFormatter) => {
  if (!containsNumber(value)) {
    return '';
  }

  const number = parseValue(value, precision, min, max);

  let formattedValue =
    precision !== null ? number.toFixed(precision) : `${number}`;

  if (postFormatter) {
    formattedValue = postFormatter(formattedValue);
  }

  return formattedValue;
};

export const germanLocalePostFormatter = (stringValue, isCurrency) => {
  let formattedValue = stringValue.replace('.', ',');

  if (isCurrency) {
    formattedValue = `${formattedValue} €`;
  }

  return formattedValue;
};
