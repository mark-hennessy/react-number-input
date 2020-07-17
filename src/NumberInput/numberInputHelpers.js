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
