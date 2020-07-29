import {
  boundNumber,
  isNumber,
  roundWithPrecision,
} from '../utils/numberUtils';

export const parseToNumber = (numberOrString, decimalSeparator) => {
  let string = `${numberOrString}`;
  if (decimalSeparator) {
    string = string.replace(decimalSeparator, '.');
  }

  return parseFloat(string);
};

export const containsNumber = (numberOrString, decimalSeparator) => {
  const number = parseToNumber(numberOrString, decimalSeparator);
  return isNumber(number);
};

export const parseValue = (
  numberOrString,
  precision = 0,
  min,
  max,
  decimalSeparator,
) => {
  let number = parseToNumber(numberOrString, decimalSeparator);
  if (!isNumber(number)) {
    number = 0;
  }

  number = roundWithPrecision(number, isNumber(precision) ? precision : 10);
  number = boundNumber(number, min, max);
  return number;
};

export const formatValue = (
  numberOrString,
  precision = 0,
  min,
  max,
  decimalSeparator,
  suffix,
) => {
  if (!containsNumber(numberOrString)) {
    return '';
  }

  const number = parseValue(numberOrString, precision, min, max);

  let formattedString = isNumber(precision)
    ? number.toFixed(precision)
    : `${number}`;

  if (decimalSeparator) {
    formattedString = formattedString.replace('.', decimalSeparator);
  }

  if (suffix) {
    formattedString = `${formattedString}${suffix}`;
  }

  return formattedString;
};

export const findCharAdditions = (previousString, currentString) => {
  const changes = [];

  const charQueue = previousString.split('');
  for (const c of currentString) {
    const [p] = charQueue;
    if (p !== c) {
      changes.push(c);
    } else {
      charQueue.shift();
    }
  }

  return changes;
};

export const findKeyFromDiff = (previousString, currentString) => {
  let key = '';

  if (typeof previousString === 'string' && typeof currentString === 'string') {
    const lengthDifference = currentString.length - previousString.length;
    if (lengthDifference === 1) {
      const additions = findCharAdditions(previousString, currentString);
      if (additions.length === 1) {
        [key] = additions;
      }
    } else if (lengthDifference === -1) {
      const removals = findCharAdditions(currentString, previousString);
      if (removals.length === 1) {
        key = 'Backspace';
      }
    }
  }

  return key;
};

export const removeSuffix = string => {
  // Remove one or more non-digit characters at the end so the suffix is
  // removed even if it was partially deleted by Backspace.
  return string.replace(/\D+$/, '');
};

export const removeSpaces = string => {
  return string.replace(/\s/g, '');
};

export const hasDecimalSeparator = (string, decimalSeparator) => {
  // match a period or the custom decimal separator
  return new RegExp(`[.${decimalSeparator}]`).test(string);
};

export const removeDuplicateDecimalSeparators = (string, decimalSeparator) => {
  let result = string;

  // replace all '.' with custom decimal separators
  result = result.replace(/\./g, decimalSeparator);

  if (result.includes(decimalSeparator)) {
    const lengthUpToAndIncludingFirstSeparator =
      result.indexOf(decimalSeparator) + 1;

    const valueUpToAndIncludingFirstSeparator = result.substring(
      0,
      lengthUpToAndIncludingFirstSeparator,
    );

    const valueAfterFirstSeparator = result.substring(
      lengthUpToAndIncludingFirstSeparator,
      result.length,
    );

    const valueAfterFirstSeparatorWithSeparatorsRemoved = valueAfterFirstSeparator.replace(
      new RegExp(`\\${decimalSeparator}`, 'g'),
      '',
    );

    result =
      valueUpToAndIncludingFirstSeparator +
      valueAfterFirstSeparatorWithSeparatorsRemoved;
  }

  return result;
};

export const sanitizeInputValue = (
  string,
  decimalSeparator = '.',
  suffix = '',
) => {
  let result = removeDuplicateDecimalSeparators(string, decimalSeparator);

  // remove everything that is not a digit or the decimal separator
  result = result.replace(new RegExp(`[^\\d${decimalSeparator}]`, 'g'), '');

  // only add the suffix back if the result is not empty
  return result ? result + suffix : result;
};
