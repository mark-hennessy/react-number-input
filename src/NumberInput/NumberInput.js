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

  const parse = (numberOrString, bound) => {
    return bound
      ? parseValue(numberOrString, precision, min, max, decimalSeparator)
      : parseValue(numberOrString, precision, null, null, decimalSeparator);
  };

  const format = numberOrString => {
    return formatValue(
      numberOrString,
      precision,
      // bounding to min/max will happen onBlur
      null,
      null,
      decimalSeparator,
      suffix,
    );
  };

  const getInput = () => {
    return inputRef.current;
  };

  const getInputValue = () => {
    return getInput().value;
  };

  const setInputValueWithoutTriggeringOnChange = value => {
    getInput().value = value;
  };

  const getInputNumberValue = bound => {
    return parse(getInputValue(), bound);
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
    onChange(number, getInput().name);
  };

  const forceInputValueToNumber = bound => {
    // if inputValue is not parsable to a number, then set it to null so it
    // doesn't get converted to 0. The input wouldn't be clearable otherwise.
    const number = containsNumber(getInputValue(), decimalSeparator)
      ? getInputNumberValue(bound)
      : null;

    setValue(number);
  };

  const onChangeWrapper = () => {
    forceInputValueToNumber(false);
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
    const newUnboundNumberValue =
      getInputNumberValue(true) + stepSize * direction;

    const newNumberValue = parse(newUnboundNumberValue, true);
    const newInputValue = format(newNumberValue);

    // move the cursor to the end
    setInputValueWithoutTriggeringOnChange(newInputValue);
    setCursorPosition(newInputValue.replace(suffix, '').length);

    // to trigger onChange
    setValue(newNumberValue);
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

    // Enter should not submit the form if ignoreEnterKey is specified
    if (key === 'Enter' && ignoreEnterKey) {
      e.preventDefault();
    }
  };

  const checkForBackspaceOrDeleteKey = e => {
    const { key } = e;

    const inputValue = getInputValue();
    const [cursorPosition] = getSelectionState();
    const charLeftOfCursor = inputValue.charAt(cursorPosition - 1);
    const charRightOfCursor = inputValue.charAt(cursorPosition);

    // Backspace should skip the decimal separator
    if (
      key === 'Backspace' &&
      !isRangeSelected() &&
      charLeftOfCursor === decimalSeparator
    ) {
      e.preventDefault();
      setCursorPosition(cursorPosition - 1);
    }
    // Delete should skip the decimal separator
    else if (
      key === 'Delete' &&
      !isRangeSelected() &&
      charRightOfCursor === decimalSeparator
    ) {
      e.preventDefault();
      setCursorPosition(cursorPosition + 1);
    }
    // Delete should delete the character to the right of the cursor or move
    // the cursor to the right if the character can't be deleted
    else if (
      key === 'Delete' &&
      !isRangeSelected() &&
      charRightOfCursor !== decimalSeparator
    ) {
      e.preventDefault();
      const textAfterDelete =
        inputValue.slice(0, cursorPosition) +
        inputValue.slice(cursorPosition + 1);

      const newNumberValue = parse(textAfterDelete, false);
      const newInputValue = format(newNumberValue);

      setInputValueWithoutTriggeringOnChange(newInputValue);
      if (
        // Delete from "|0,12" should move the cursor to the right
        (cursorPosition < inputValue.indexOf(decimalSeparator) &&
          // the value will change, but length should not
          newInputValue.length === inputValue.length) ||
        // Delete from "0,|00" should move the cursor to the right
        (cursorPosition > inputValue.indexOf(decimalSeparator) &&
          // the value and length should be the same
          newInputValue === inputValue)
      ) {
        setCursorPosition(cursorPosition + 1);
      } else {
        setCursorPosition(cursorPosition);
      }

      // to trigger onChange
      setValue(newNumberValue);
    }
    // Backspace from "0|,00" should clear the input
    else if (
      key === 'Backspace' &&
      !isRangeSelected() &&
      cursorPosition === 1 &&
      parse(inputValue.substring(1, inputValue.length), false) === 0
    ) {
      e.preventDefault();
      setValue(null);
    }
  };

  const checkForMinusKey = e => {
    const { key } = e;
    const inputValue = getInputValue();

    // '-' should be valid in an empty input
    if (key === '-' && (!inputValue.length || isAllTextSelected())) {
      e.preventDefault();
      setInputValueWithoutTriggeringOnChange('-');
    }
    // -0 should be converted to 0 or 0,00 € depending on formatting
    else if (
      inputValue.startsWith('-') &&
      inputValue.length === 1 &&
      key === '0'
    ) {
      e.preventDefault();
      setInputValueWithoutTriggeringOnChange(format(0));
      setCursorPosition(1);
    }
  };

  const checkForSpaceKey = e => {
    const { key } = e;

    const [cursorPosition] = getSelectionState();

    // Space should be ignored but move the cursor forward
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

    // this is needed to clear invalid values such as '-' without a number
    // after it, and to bound valid values to min/max if specified
    forceInputValueToNumber(true);

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
