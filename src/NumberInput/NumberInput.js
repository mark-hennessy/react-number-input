import React, { useLayoutEffect, useRef, useState } from 'react';
import cn from 'classnames';
import {
  containsNumber,
  findKeyFromDiff,
  formatValue,
  parseValue,
} from './numberInputHelpers';
import { buildDataCyString } from '../utils/cypressUtils';
import StandardInput from '../StandardInput/StandardInput';
import NumberInputArrowButtons from '../NumberInputArrowButtons/NumberInputArrowButtons';

const CID = 'number-input';

const NumberInput = ({
  name,
  value,
  placeholder,
  precision = 0,
  step = 1,
  min,
  max,
  decimalSeparator = ',',
  currency,
  currencySymbol = '€',
  blue,
  error,
  disabled,
  ignoreEnterKey,
  onChange,
  onValueChange,
  onFocus,
  onBlur,
  className,
  dataCy,
}) => {
  const [valueOverride, setValueOverride] = useState(null);
  const inputRef = useRef(null);
  const hasFocusRef = useRef(false);
  const selectionStateSnapshotRef = useRef({});
  const previousInputValueRef = useRef(null);

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

  const setInputValue = inputValue => {
    // The input is a controlled component, and thus requires the value to be
    // set via a state change (either by setNumberValue or setValueOverride).
    //
    // React uses a timer internally to reset the value if it is not followed
    // by a state change. The onKeyDown-preventDefault combo can be used to set
    // the input's value without changing state, but it is not a viable
    // solution for mobile because mobile relies on onInput for key detection.
    //
    // Setting the value without state in addition to with state is needed so
    // that a cursor position can be set in-sync with the new value.
    getInput().value = inputValue;

    // It's common and intended for this to get set and then immediately
    // cleared by setNumberValue in the same render. The override is only used
    // as a fallback in case setNumberValue ends up not getting called. The
    // override value is useful for temporarily rendering non-numeric values.
    setValueOverride(inputValue);
  };

  const getSelectionState = () => {
    const inputValue = getInputValue();

    const { selectionStart, selectionEnd, selectionDirection } = getInput();
    const isRangeSelected = selectionStart !== selectionEnd;
    const selectedRangeLength = selectionEnd - selectionStart;
    const isAllTextSelected =
      isRangeSelected && selectedRangeLength === inputValue.length;

    return {
      selectionStart,
      selectionEnd,
      selectionDirection,
      isRangeSelected,
      selectedRangeLength,
      isAllTextSelected,
    };
  };

  const snapshotSelectionState = () => {
    selectionStateSnapshotRef.current = getSelectionState();
  };

  const setSelectionState = selectionState => {
    const { selectionStart, selectionEnd, selectionDirection } = selectionState;

    getInput().setSelectionRange(
      selectionStart,
      selectionEnd,
      selectionDirection,
    );

    // This is important because setSelectionRange will trigger onSelect and
    // snapshotSelectionState as a result if called from onKeyDown, but not if
    // called from onInput.
    snapshotSelectionState();
  };

  const setCursorPosition = position => {
    setSelectionState({ selectionStart: position, selectionEnd: position });
  };

  const restoreSelectionState = () => {
    setSelectionState(selectionStateSnapshotRef.current);
  };

  const setNumberValue = number => {
    // Clear the value override so the actual value will show next render.
    setValueOverride(null);

    const { name } = getInput();

    if (onChange) {
      const e = {
        target: {
          name,
          value: number,
        },
      };

      onChange(e);
    }

    if (onValueChange) {
      onValueChange(number, name);
    }
  };

  const forceInputValueToNumber = bound => {
    const inputValue = getInputValue();

    // if inputValue is not parsable to a number, then set it to null so it
    // doesn't get converted to 0. The input wouldn't be clearable otherwise.
    const number = containsNumber(inputValue, decimalSeparator)
      ? parse(inputValue, bound)
      : null;

    setNumberValue(number);
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
    const inputValue = getInputValue();
    const inputNumberValue = parse(inputValue, true);
    const newNumberValue = parse(inputNumberValue + stepSize * direction, true);
    const newInputValue = format(newNumberValue);

    // move the cursor to the end
    setInputValue(newInputValue);
    setCursorPosition(newInputValue.replace(suffix, '').length);

    // trigger onChange
    setNumberValue(newNumberValue);

    // to prevent up/down arrow keys from opening the auto-complete dropdown
    e.preventDefault();
  };

  const onStepUp = e => {
    onStep(e, 1);
  };

  const onStepDown = e => {
    onStep(e, -1);
  };

  const checkForEnterKey = (e, key) => {
    // Enter should not submit the form if ignoreEnterKey is specified
    if (key === 'Enter' && ignoreEnterKey) {
      e.preventDefault();
    }
  };

  const checkForUpDownArrowKey = (e, key) => {
    if (key === 'ArrowUp') {
      onStepUp(e);
    } else if (key === 'ArrowDown') {
      onStepDown(e);
    }
  };

  const checkForDeleteKey = (e, key) => {
    const inputValue = getInputValue();
    const selectionState = getSelectionState();
    const { selectionStart: cursorPosition, isRangeSelected } = selectionState;
    const charRightOfCursor = inputValue.charAt(cursorPosition);

    // Delete should skip the decimal separator
    if (
      key === 'Delete' &&
      !isRangeSelected &&
      charRightOfCursor === decimalSeparator
    ) {
      setInputValue(inputValue);
      setCursorPosition(cursorPosition + 1);
      e.preventDefault();
    }
    // Delete should delete the character to the right of the cursor or move
    // the cursor to the right if the character can't be deleted
    else if (
      key === 'Delete' &&
      !isRangeSelected &&
      charRightOfCursor !== decimalSeparator
    ) {
      const textAfterDelete =
        inputValue.slice(0, cursorPosition) +
        inputValue.slice(cursorPosition + 1);

      const newNumberValue = parse(textAfterDelete, false);
      const newInputValue = format(newNumberValue);
      setInputValue(newInputValue);

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

      // trigger onChange
      setNumberValue(newNumberValue);
      e.preventDefault();
    }
  };

  const checkForBackspaceKey = (e, key, inputValue, selectionState) => {
    const { selectionStart: cursorPosition, isRangeSelected } = selectionState;
    const charLeftOfCursor = inputValue.charAt(cursorPosition - 1);

    // Backspace should skip the decimal separator
    if (
      key === 'Backspace' &&
      !isRangeSelected &&
      charLeftOfCursor === decimalSeparator
    ) {
      setInputValue(inputValue);
      setCursorPosition(cursorPosition - 1);
      e.preventDefault();
    }
    // Backspace from "0|,00" should clear the input
    else if (
      key === 'Backspace' &&
      !isRangeSelected &&
      cursorPosition === 1 &&
      parse(inputValue.substring(1, inputValue.length), false) === 0
    ) {
      setNumberValue(null);
      e.preventDefault();
    }
  };

  const checkForSpaceKey = (e, key, inputValue, selectionState) => {
    const { selectionStart: cursorPosition, isRangeSelected } = selectionState;

    // Space should move the cursor forward without adding a space
    if (key === ' ' && !isRangeSelected) {
      setInputValue(inputValue);
      setCursorPosition(cursorPosition + 1);
      e.preventDefault();
    }
  };

  const checkForMinusKey = (e, key, inputValue) => {
    // '-' should be valid in an empty input
    if (key === '-' && !inputValue.length) {
      setInputValue('-');
      setCursorPosition(1);
      e.preventDefault();
    }
    // -0 should be converted to 0 or 0,00 € depending on formatting
    else if (inputValue === '-' && key === '0') {
      setInputValue('0');
      setCursorPosition(1);
      setNumberValue(0);
      e.preventDefault();
    }
  };

  const onKeyDown = e => {
    const inputValue = getInputValue();
    previousInputValueRef.current = inputValue;
    const key = e.key;

    // Desktop-only key logic
    // For Mobile, Enter behaves differently and Up/Down/Delete don't exist.
    checkForEnterKey(e, key);
    checkForUpDownArrowKey(e, key);
    checkForDeleteKey(e, key);
  };

  const onInput = e => {
    const previousInputValue = previousInputValueRef.current;
    const previousSelectionState = selectionStateSnapshotRef.current;
    const inputValue = getInputValue();

    // Mobile key handling is difficult because mobile on-screen keyboards
    // report 'e.keyCode' as 229 and 'e.key' as 'Unidentified' in onKeyDown.
    // onKeyPress is deprecated, and onInput does not report keys at all.
    // The alternative is to record the old input value in onKeyDown and
    // compare it with the new input value in onInput to determine which
    // key was pressed.
    const key = findKeyFromDiff(previousInputValue, inputValue);

    // Desktop & Mobile key logic
    checkForBackspaceKey(e, key, previousInputValue, previousSelectionState);
    checkForSpaceKey(e, key, previousInputValue, previousSelectionState);
    checkForMinusKey(e, key, previousInputValue, previousSelectionState);

    if (!e.isDefaultPrevented()) {
      snapshotSelectionState();
      forceInputValueToNumber(false);
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
    // after it, and to bound valid values to the min/max if specified
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

      // needed for up/down arrow keys
      restoreSelectionState();
    }
  });

  return (
    <StandardInput
      ref={inputRef}
      className={cn(CID, className)}
      dataCy={dataCy || buildDataCyString(name, 'number-input')}
      type='text'
      name={name}
      value={valueOverride || format(value)}
      placeholder={placeholder}
      iconContent={
        <NumberInputArrowButtons
          blue={blue}
          error={error}
          disabled={disabled}
          onStepUp={onStepUp}
          onStepDown={onStepDown}
        />
      }
      blue={blue}
      error={error}
      disabled={disabled}
      onKeyDown={onKeyDown}
      onInput={onInput}
      onFocus={onFocusWrapper}
      onBlur={onBlurWrapper}
      onSelect={snapshotSelectionState}
    />
  );
};

export default NumberInput;
