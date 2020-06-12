import {
  isNumber,
  boundNumber,
  roundWithPrecision,
} from '../utils/numberUtils';

export const parseValue = (
  numberOrString,
  precision = 0,
  min,
  max,
  preParser,
) => {
  const string = `${numberOrString}`;
  const preParsedString = preParser ? preParser(string) : string;
  let number = parseFloat(preParsedString);
  if (!isNumber(number)) {
    number = 0;
  }

  number = roundWithPrecision(number, isNumber(precision) ? precision : 10);
  number = boundNumber(number, min, max);
  return number;
};

export const germanLocalePreParser = string => {
  // The € symbol will get parsed out by parseFloat
  return string.replace(',', '.');
};

export const containsNumber = numberOrString => {
  const number = parseFloat(numberOrString);
  return isNumber(number);
};

export const formatValue = (
  numberOrString,
  precision = 0,
  min,
  max,
  isCurrency,
  postFormatter,
) => {
  if (!containsNumber(numberOrString)) {
    return '';
  }

  const number = parseValue(numberOrString, precision, min, max);

  let formattedString =
    precision !== null ? number.toFixed(precision) : `${number}`;

  if (postFormatter) {
    formattedString = postFormatter(formattedString, isCurrency);
  }

  return formattedString;
};

export const germanLocalePostFormatter = (string, isCurrency) => {
  let formattedString = string.replace('.', ',');

  if (isCurrency) {
    formattedString = `${formattedString} €`;
  }

  return formattedString;
};
