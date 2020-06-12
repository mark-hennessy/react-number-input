import React, { useRef } from 'react';
import cn from 'classnames';
import {
  parseValue,
  germanLocalePreParser,
  formatValue,
  germanLocalePostFormatter,
} from './numberInputHelpers';
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

  const getInputValue = () => {
    return inputRef.current.value;
  };

  const setValue = value => {
    onChange(value, inputRef.current);
  };

  const onChangeWrapper = () => {
    const inputValue = getInputValue();

    // if inputValue is "", then set the value to null so "" does not get converted to 0
    const parsedValue = inputValue
      ? parseValue(inputValue, precision, min, max, germanLocalePreParser)
      : null;

    setValue(parsedValue);
  };

  const onStep = (e, direction) => {
    // const input = inputRef.current;
    // e.preventDefault();
    // e.stopPropagation();
    console.log('onStep click');
  };

  const onKeyDown = e => {
    const { key } = e;
    console.log(key);

    if (key === 'ArrowUp') {
      console.log('ArrowUp');
    } else if (key === 'ArrowDown') {
      console.log('ArrowDown');
    } else if (key === 'Enter' && ignoreEnterKey) {
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

  const formattedValue = formatValue(
    value,
    precision,
    min,
    max,
    currency,
    germanLocalePostFormatter,
  );

  return (
    <div className={cn(CID, { blue, disabled }, className)}>
      <input
        ref={inputRef}
        className={`${CID}__input`}
        type='text'
        name={name}
        value={formattedValue}
        onChange={onChangeWrapper}
        onKeyDown={onKeyDown}
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
