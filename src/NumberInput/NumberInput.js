import React from 'react';
import cn from 'classnames';
import { parseValue } from './numberInputHelpers';
import { boundNumber } from '../utils/numberUtils';
import NumberInputArrowButton from '../NumberInputArrowButton/NumberInputArrowButton';

import './NumberInput.scss';

const CID = 'number-input';

const NumberInput = ({
  name,
  placeholder,
  value,
  onValueChange,
  min,
  max,
  precision,
  currency,
  schoolGrade,
  ignoreEnterKey,
  blue,
  disabled,
  className,
}) => {
  const onChange = e => {
    const input = e.target;
    const rawValue = input.value;

    // allow the input to be cleared
    // if (!rawValue) {
    //   onValueChange("");
    //   return;
    // }

    const value = parseValue(rawValue);
    const boundedValue = boundNumber(value, min, max);

    onValueChange(boundedValue);
  };

  const onKeyPress = e => {
    if (ignoreEnterKey && e.key === 'Enter') {
      // prevent forms from submitting on Enter
      e.preventDefault();
    }
  };

  const onBlur = e => {};

  const onInvalid = e => {
    // prevent the HTML 5 form validation popup from opening even though
    // the 'pattern' attribute is set on the input
    e.preventDefault();
  };

  const increment = () => {};

  const decrement = () => {};

  return (
    <div className={cn(CID, { blue, disabled }, className)}>
      <input
        className={`${CID}__input`}
        type='text'
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
        onInvalid={onInvalid}
        pattern='[\d,]'
        disabled={disabled}
      />
      <div className={`${CID}__arrow-buttons`}>
        <NumberInputArrowButton
          direction='up'
          blue={blue}
          disabled={disabled}
          onClick={increment}
        />
        <NumberInputArrowButton
          direction='down'
          blue={blue}
          disabled={disabled}
          onClick={decrement}
        />
      </div>
    </div>
  );
};

export default NumberInput;
