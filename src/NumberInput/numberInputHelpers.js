import {
  boundNumber,
  isNumber,
  roundWithPrecision,
} from '../utils/numberUtils';

export const parseToNumber = (numberOrString, preParser) => {
  const string = `${numberOrString}`;
  const preParsedValue = preParser ? preParser(string) : string;
  return parseFloat(preParsedValue);
};

export const containsNumber = (numberOrString, preParser) => {
  const number = parseToNumber(numberOrString, preParser);
  return isNumber(number);
};

export const parseValue = (
  numberOrString,
  precision = 0,
  min,
  max,
  preParser,
) => {
  let number = parseToNumber(numberOrString, preParser);
  if (!isNumber(number)) {
    number = 0;
  }

  number = roundWithPrecision(number, isNumber(precision) ? precision : 10);
  number = boundNumber(number, min, max);
  return number;
};

export const germanLocalePreParser = string => {
  // The currency symbol will get parsed out by parseFloat
  return string.replace(',', '.');
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
