import React, { useLayoutEffect, useRef } from 'react';
import cn from 'classnames';
import {
  containsNumber,
  formatValue,
  germanLocalePostFormatter,
  germanLocalePreParser,
  parseValue,
} from './numberInputHelpers';
import NumberInputArrowButton from '../NumberInputArrowButton/NumberInputArrowButton';
import { createInstanceLogger } from '../utils/debugUtils';
import { buildDataCyString } from '../utils/cypressUtils';
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
  const log = createInstanceLogger(name, 'f1_v3');
  log('render');

  const inputRef = useRef(null);

  const hasFocusRef = useRef(false);
  const selectionStateRef = useRef([]);

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
    selectionStateRef.current = [
      input.selectionStart,
      input.selectionEnd,
      input.selectionDirection,
    ];

    log('saveSelectionState', selectionStateRef.current);
  };

  const restoreSelectionState = () => {
    const selectionState = selectionStateRef.current;
    log('restoreSelectionState', selectionState);
    if (selectionState.length) {
      getInput().setSelectionRange(...selectionState);
    }
  };

  const setValue = number => {
    saveSelectionState();

    if (number !== value) {
      log('number changed', number, value);
      onChange(number, getInput());
    } else {
      log('number did not change', number, value);
    }
  };

  const onChangeWrapper = () => {
    // if inputValue is not parsable to a number, then set it to null so it doesn't get
    // converted to 0. The input wouldn't be clearable otherwise.
    const number = containsNumber(getInputValue())
      ? getInputNumberValue()
      : null;

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
    const { key } = e;
    // log(key);

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

    if (onBlur) {
      onBlur(e);
    }
  };

  // runs after each render
  // useLayoutEffect avoids flashing because it runs before the browser has a chance to paint
  useLayoutEffect(() => {
    if (hasFocusRef.current) {
      getInput().focus();
      restoreSelectionState();
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
        data-cy={buildDataCyString(`${name}-number-input`)}
        type='text'
        name={name}
        value={formattedValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChangeWrapper}
        onKeyDown={onKeyDownWrapper}
        onFocus={onFocusWrapper}
        onBlur={onBlurWrapper}
        // onSelect={saveSelectionState}
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
