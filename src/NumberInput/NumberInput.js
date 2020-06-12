import React, { useRef, useLayoutEffect } from 'react';
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
  placeholder,
  precision = 0,
  step = 1,
  min,
  max,
  blue,
  currency,
  disabled,
  ignoreEnterKey,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  className,
}) => {
  const logDeltaTime = useLogDeltaTime();

  const inputRef = useRef();

  const hasFocusRef = useRef();
  const selectionStateRef = useRef({});

  const getInput = () => {
    return inputRef.current;
  };

  const getInputValue = () => {
    return getInput().value;
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

  const saveSelectionState = () => {
    const input = getInput();
    const { selectionStart, selectionEnd, selectionDirection } = input;

    selectionStateRef.current = {
      ...selectionStateRef.current,
      selectionStart,
      selectionEnd,
      selectionDirection,
    };
  };

  const setValue = number => {
    saveSelectionState();
    onChange(number, getInput());
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
    // to focus the input after arrow buttons are clicked
    hasFocusRef.current = true;

    const multiplier = calculateStepMultiplier(e);
    setValue(parse(getInputNumberValue() + direction * step * multiplier));
  };

  const onStepUp = e => {
    onStep(e, 1);
  };

  const onStepDown = e => {
    onStep(e, -1);
  };

  const onKeyDownWrapper = e => {
    logDeltaTime();

    const { key } = e;
    // console.log(key);

    if (key === 'ArrowUp') {
      e.preventDefault();
      onStepUp(e);
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      onStepDown(e);
    } else if (key === 'Enter' && ignoreEnterKey) {
      // prevent forms from submitting on Enter
      e.preventDefault();
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const onFocusWrapper = e => {
    hasFocusRef.current = true;

    if (onFocus) {
      onFocus(e);
    }
  };

  const onBlurWrapper = e => {
    hasFocusRef.current = false;
    console.log('onBlur');

    if (onBlur) {
      onBlur(e);
    }
  };

  // runs after each render
  // useLayoutEffect avoids flashing because it runs before the browser has a chance to paint
  useLayoutEffect(() => {
    if (hasFocusRef.current) {
      const input = getInput();

      // will be ignored if the input already has focus
      input.focus();

      const selectionState = selectionStateRef.current;
      input.setSelectionRange(
        selectionState.selectionStart,
        selectionState.selectionEnd,
        selectionState.selectionDirection,
      );
    }
  });

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
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChangeWrapper}
        onKeyDown={onKeyDownWrapper}
        onFocus={onFocusWrapper}
        onBlur={onBlurWrapper}
        onInput={saveSelectionState}
        onSelect={saveSelectionState}
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
