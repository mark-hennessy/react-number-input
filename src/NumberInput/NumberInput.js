import React, { useRef } from 'react';
import cn from 'classnames';
import { boundNumber } from '../utils/numberUtils';
import { formatValue, germanLocaleFormatter } from './numberInputHelpers';
import NumberInputArrowButton from '../NumberInputArrowButton/NumberInputArrowButton';

import './NumberInput.scss';

const CID = 'number-input';

const NumberInput = ({
  name,
  value,
  onChange,
  precision = 0,
  step = 1,
  min,
  max,
  placeholder,
  title,
  blue,
  currency,
  disabled,
  ignoreEnterKey,
  className,
}) => {
  const inputRef = useRef();

  const internalValueRef = useRef();

  const onChangeWrapper = e => {
    const input = e.target;
    const { value } = input;

    // allow the input to be cleared
    // if (!value) {
    //   onValueChange("");
    //   return;
    // }

    const sanitizedValue = value.replace(/[^\d,]/g, '').replace(/,/g, '.');
    internalValueRef.current = sanitizedValue;

    console.log('strippedValue', sanitizedValue);

    const number = parseFloat(sanitizedValue);
    const boundedNumber = boundNumber(number, min, max);

    console.log('boundedNumber', boundedNumber);

    if (onChange) {
      onChange(boundedNumber, inputRef.current);
    }
  };

  const onStep = (e, direction) => {
    // const input = inputRef.current;
    // e.preventDefault();
    // e.stopPropagation();
    console.log('onStep click');
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

  const customFormatter = v => {
    return germanLocaleFormatter(v, currency);
  }

  const formattedValue = formatValue(value, precision, min, max, customFormatter);

  return (
    <div className={cn(CID, { blue, disabled }, className)}>
      <input
        ref={inputRef}
        className={`${CID}__input`}
        type='text'
        name={name}
        value={formattedValue}
        onChange={onChangeWrapper}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
        onInvalid={onInvalid}
        placeholder={placeholder}
        title={title}
        disabled={disabled}
      />
      <div className={`${CID}__arrow-buttons`}>
        <NumberInputArrowButton
          direction='up'
          blue={blue}
          disabled={disabled}
          onClick={e => onStep(e, 1)}
        />
        <NumberInputArrowButton
          direction='down'
          blue={blue}
          disabled={disabled}
          onClick={e => onStep(e, -1)}
        />
      </div>
    </div>
  );
};

export default NumberInput;
