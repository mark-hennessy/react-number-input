import React, { useLayoutEffect, useRef } from 'react';
import cn from 'classnames';
import { containsNumber, formatValue, parseValue } from './numberInputHelpers';
import NumberInputArrowButton from '../NumberInputArrowButton/NumberInputArrowButton';
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
  decimalSeparator = ',',
  currency,
  currencySymbol = '€',
  disabled,
  ignoreEnterKey,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  className,
}) => {
  const inputRef = useRef(null);
  const hasFocusRef = useRef(false);
  const selectionStateSnapshotRef = useRef([]);

  const suffix = currency ? ` ${currencySymbol}` : '';

  const getInput = () => {
    return inputRef.current;
  };

  const getInputValue = () => {
    return getInput().value;
  };

  const setInputValue = value => {
    getInput().value = value;
  };

  const parse = numberOrString => {
    return parseValue(numberOrString, precision, min, max, decimalSeparator);
  };

  const format = numberOrString => {
    return formatValue(
      numberOrString,
      precision,
      min,
      max,
      decimalSeparator,
      suffix,
    );
  };

  const getInputNumberValue = () => {
    return parse(getInputValue());
  };

  const getSelectionState = () => {
    const input = getInput();
    return [input.selectionStart, input.selectionEnd, input.selectionDirection];
  };

  const snapshotSelectionState = () => {
    selectionStateSnapshotRef.current = getSelectionState();
  };

  const setCursorPosition = position => {
    getInput().setSelectionRange(position, position);
  };

  const restoreSelectionState = () => {
    const selectionState = selectionStateSnapshotRef.current;
    if (!selectionState || selectionState.length < 2) {
      return;
    }

    getInput().setSelectionRange(...selectionState);
  };

  const isRangeSelected = () => {
    const [selectionStart, selectionEnd] = getSelectionState();
    return selectionStart !== selectionEnd;
  };

  const isAllTextSelected = () => {
    const [selectionStart, selectionEnd] = getSelectionState();
    const selectionLength = selectionEnd - selectionStart;
    return selectionLength === getInputValue().length;
  };

  const setValue = number => {
    snapshotSelectionState();
    onChange(number, getInput());
  };

  const forceInputValueToNumber = () => {
    // if inputValue is not parsable to a number, then set it to null so it doesn't get
    // converted to 0. The input wouldn't be clearable otherwise.
    const number = containsNumber(getInputValue(), decimalSeparator)
      ? getInputNumberValue()
      : null;

    setValue(number);
  };

  const onChangeWrapper = () => {
    forceInputValueToNumber();
  };

  const calculateStepMultiplier = e => {
    if (e.ctrlKey || e.metaKey) return 0.1;
    if (e.shiftKey) return 10;
    return 1;
  };

  const onStep = (e, direction) => {
    // to focus the input after arrow buttons are clicked
    hasFocusRef.current = true;

    const stepMultiplier = calculateStepMultiplier(e);
    const minStepSize = precision > 0 ? precision / 10 : 1;
    const stepSize = Math.max(step * stepMultiplier, minStepSize);
    setValue(parse(getInputNumberValue() + direction * stepSize));
  };

  const onStepUp = e => {
    onStep(e, 1);
  };

  const onStepDown = e => {
    onStep(e, -1);
  };

  const checkForUpDownArrowKey = e => {
    const { key } = e;

    if (key === 'ArrowUp') {
      e.preventDefault();
      onStepUp(e);
    } else if (key === 'ArrowDown') {
      e.preventDefault();
      onStepDown(e);
    }
  };

  const checkForEnterKey = e => {
    const { key } = e;

    if (key === 'Enter' && ignoreEnterKey) {
      // prevent forms from submitting on Enter
      e.preventDefault();
    }
  };

  const checkForBackspaceOrDeleteKey = e => {
    const { key } = e;

    const inputValue = getInputValue();
    const [cursorPosition] = getSelectionState();
    const charLeftOfCursor = inputValue.charAt(cursorPosition - 1);
    const charRightOfCursor = inputValue.charAt(cursorPosition);

    if (
      key === 'Backspace' &&
      !isRangeSelected() &&
      charLeftOfCursor === decimalSeparator
    ) {
      e.preventDefault();
      setCursorPosition(cursorPosition - 1);
    } else if (
      key === 'Delete' &&
      !isRangeSelected() &&
      (charRightOfCursor === decimalSeparator ||
        (cursorPosition === 0 && charRightOfCursor === '0'))
    ) {
      e.preventDefault();
      setCursorPosition(cursorPosition + 1);
    }
  };

  const checkForMinusKey = e => {
    const { key } = e;
    const inputValue = getInputValue();

    // allow the user to type '-' into an empty input
    if (key === '-' && (!inputValue.length || isAllTextSelected())) {
      e.preventDefault();
      setInputValue('-');
    }
    // convert -0 to 0 or 0,00 € or 100,00 € depending on formatting and
    // min/max value
    else if (
      inputValue.startsWith('-') &&
      inputValue.length === 1 &&
      key === '0'
    ) {
      e.preventDefault();
      const newValue = format(0);
      setInputValue(newValue);
      if (newValue.includes(decimalSeparator)) {
        setCursorPosition(newValue.indexOf(decimalSeparator));
      } else {
        const newValueWithoutSuffix = newValue.replace(suffix, '');
        setCursorPosition(newValueWithoutSuffix.length);
      }
    }
  };

  const checkForSpaceKey = e => {
    const { key } = e;

    const [cursorPosition] = getSelectionState();

    if (key === ' ' && !isRangeSelected()) {
      e.preventDefault();
      setCursorPosition(cursorPosition + 1);
    }
  };

  const onKeyDownWrapper = e => {
    checkForUpDownArrowKey(e);
    checkForEnterKey(e);
    checkForBackspaceOrDeleteKey(e);
    checkForMinusKey(e);
    checkForSpaceKey(e);

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

    forceInputValueToNumber();

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

  return (
    <div className={cn(CID, { blue, disabled }, className)}>
      <input
        ref={inputRef}
        className={`${CID}__input`}
        data-cy={buildDataCyString(`${name}-number-input`)}
        type='text'
        name={name}
        value={format(value)}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChangeWrapper}
        onKeyDown={onKeyDownWrapper}
        onFocus={onFocusWrapper}
        onBlur={onBlurWrapper}
        onSelect={snapshotSelectionState}
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
