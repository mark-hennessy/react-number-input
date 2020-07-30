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

// Mobile key handling is difficult because on-screen keyboards report
// 'e.keyCode' as 229 and 'e.key' as 'Unidentified' in onKeyDown. Firefox
// Mobile does not even fire onKeyDown for most keys. To make matters worse,
// onKeyPress is deprecated and onInput does not report keys. The alternative
// is to record the input value on render and compare it with the new input
// value in onInput to determine which key was pressed.
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

export const removeSuffix = (string, decimalSeparator) => {
  // sanitizeInputValue will remove the suffix even if it was partially deleted.
  // The suffix is not passed to sanitizeInputValue so that it gets removed and
  // does not get added back again.
  return sanitizeInputValue(string, decimalSeparator);
};

export const removeSpaces = string => {
  return string.replace(/\s/g, '');
};
