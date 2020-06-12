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
  blue,
  currency,
  disabled,
  ignoreEnterKey,
  onBlur,
  className,
}) => {
  const inputRef = useRef();

  const getInputValue = () => {
    return inputRef.current.value;
  };

  const parse = numberOrString => {
    return parseValue(
      numberOrString,
      precision,
      min,
      max,
      germanLocalePreParser,
    );
  };

  const getInputNumberValue = () => {
    return parse(getInputValue());
  };

  const setValue = number => {
    onChange(number, inputRef.current);
  };

  const onChangeWrapper = () => {
    // if inputValue is "", then set the value to null so "" does not get converted to 0
    const number = getInputValue() ? getInputNumberValue() : null;

    setValue(number);
  };

  const onStep = delta => {
    setValue(parse(getInputNumberValue() + delta));
  };

  const onStepUp = () => {
    onStep(step);
  };

  const onStepDown = () => {
    onStep(-step);
  };

  const onKeyDown = e => {
    const { key } = e;
    // console.log(key);

    if (key === 'ArrowUp') {
      onStepUp();
    } else if (key === 'ArrowDown') {
      onStepDown();
    } else if (key === 'Enter' && ignoreEnterKey) {
      // prevent forms from submitting on Enter
      e.preventDefault();
    }
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
        placeholder={placeholder}
        disabled={disabled}
      />
      <div className={`${CID}__arrow-buttons`}>
        <NumberInputArrowButton
          direction='up'
          blue={blue}
          disabled={disabled}
          onClick={onStepUp}
        />
        <NumberInputArrowButton
          direction='down'
          blue={blue}
          disabled={disabled}
          onClick={onStepDown}
        />
      </div>
    </div>
  );
};

export default NumberInput;
