import React, { useRef } from 'react';
import cn from 'classnames';
import {
  parseValue,
  germanLocalePreParser,
  formatValue,
  germanLocalePostFormatter,
} from './numberInputHelpers';
import NumberInputArrowButton from '../NumberInputArrowButton/NumberInputArrowButton';
import useLogDeltaTime from '../utils/useLogDeltaTime';

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
  const logDeltaTime = useLogDeltaTime();

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

  const calculateStepMultiplier = e => {
    if (e.ctrlKey || e.metaKey) return 0.1;
    if (e.shiftKey) return 10;
    return 1;
  };

  const onStep = (e, direction) => {
    const multiplier = calculateStepMultiplier(e);
    setValue(parse(getInputNumberValue() + direction * step * multiplier));
  };

  const onKeyDown = e => {
    logDeltaTime();

    const { key } = e;
    // console.log(key);

    if (key === 'ArrowUp') {
      e.preventDefault();
      onStep(e, 1);
    } else if (key === 'ArrowDown') {
      // TODO: check if preventDefault is needed
      e.preventDefault();
      onStep(e, -1);
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
          onClick={e => {
            onStep(e, 1);
          }}
        />
        <NumberInputArrowButton
          direction='down'
          blue={blue}
          disabled={disabled}
          onClick={e => {
            onStep(e, -1);
          }}
        />
      </div>
    </div>
  );
};

export default NumberInput;
