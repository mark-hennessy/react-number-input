import { isNumber } from '../utils/numberUtils';

export const parseValue = value => {
  const number = parseFloat(value);
  return isNumber(number) ? number : '';
};
