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
  inputClassName,
  dataCy,
}) => {
  const inputRef = useRef(null);
  const hasFocusRef = useRef(false);
  const selectionStateRef = useRef({});
  const previousInputValueRef = useRef(null);
  const [valueOverride, setValueOverride] = useState(null);

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
    // solution for mobile because mobile relies on onInput.
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
    selectionStateRef.current = getSelectionState();
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
    setSelectionState(selectionStateRef.current);
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

  const checkForDeleteKey = (
    e,
    key,
    previousInputValue,
    previousSelectionState,
  ) => {
    const {
      selectionStart: cursorPosition,
      isRangeSelected,
    } = previousSelectionState;

    const charRightOfCursor = previousInputValue.charAt(cursorPosition);

    // Delete should skip the decimal separator
    if (
      key === 'Delete' &&
      !isRangeSelected &&
      charRightOfCursor === decimalSeparator
    ) {
      setInputValue(previousInputValue);
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
        previousInputValue.slice(0, cursorPosition) +
        previousInputValue.slice(cursorPosition + 1);

      const newNumberValue = parse(textAfterDelete, false);
      const newInputValue = format(newNumberValue);
      setInputValue(newInputValue);

      if (
        // Delete from "|0,12" should move the cursor to the right
        (cursorPosition < previousInputValue.indexOf(decimalSeparator) &&
          // the value will change, but length should not
          newInputValue.length === previousInputValue.length) ||
        // Delete from "0,|00" should move the cursor to the right
        (cursorPosition > previousInputValue.indexOf(decimalSeparator) &&
          // the value and length should be the same
          newInputValue === previousInputValue)
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

  const checkForBackspaceKey = (
    e,
    key,
    previousInputValue,
    previousSelectionState,
  ) => {
    const {
      selectionStart: cursorPosition,
      isRangeSelected,
    } = previousSelectionState;

    const charLeftOfCursor = previousInputValue.charAt(cursorPosition - 1);
    const charRightOfCursor = previousInputValue.charAt(cursorPosition);

    // Backspace should skip the decimal separator
    if (
      key === 'Backspace' &&
      !isRangeSelected &&
      charLeftOfCursor === decimalSeparator
    ) {
      setInputValue(previousInputValue);
      setCursorPosition(cursorPosition - 1);
      e.preventDefault();
    }
    // Backspace from "0|,00" or "3|,34"
    else if (
      key === 'Backspace' &&
      !isRangeSelected &&
      cursorPosition === 1 &&
      charRightOfCursor === decimalSeparator
    ) {
      const newInputValue = previousInputValue.substring(
        1,
        previousInputValue.length,
      );

      // Backspace from "0|,00" should clear the input
      if (parse(newInputValue, false) === 0) {
        setNumberValue(null);
      }
      // Backspace from "3|,34" should set the input value to ",34"
      else {
        setInputValue(newInputValue);
      }

      setCursorPosition(0);
      e.preventDefault();
    }
  };

  const checkForSpaceKey = (e, key, newInputValue, newSelectionState) => {
    const { selectionStart: cursorPosition } = newSelectionState;

    // Remove 1 or more non-digit characters at the end of the value, so the
    // suffix is removed even if it was partially deleted by Backspace.
    const valueWithoutSuffix = newInputValue.replace(/\D+$/, '');

    const valueWithoutSuffixAndSpaces = valueWithoutSuffix.replace(/\s/g, '');
    const valueWithoutSpaces = valueWithoutSuffixAndSpaces + suffix;

    const numberOfSpacesRemoved =
      valueWithoutSuffix.length - valueWithoutSuffixAndSpaces.length;

    if (numberOfSpacesRemoved > 0) {
      setInputValue(valueWithoutSpaces);

      // Space should move the cursor forward without adding a space
      if (key === ' ') {
        setCursorPosition(cursorPosition);
      }
      // Otherwise assume range selection or copy/paste and keep the cursor
      // where it is but account for the spaces removed.
      else {
        setCursorPosition(cursorPosition - numberOfSpacesRemoved);
      }

      // Force the value to a number in case it was copy/pasted.
      // onChange listeners would not be informed of the new value without this.
      // Bounding will happen on blur so the user can type impartial numbers
      // without interference.
      forceInputValueToNumber(false);

      e.preventDefault();
    }
  };

  const checkForMinusKey = (e, key, newInputValue) => {
    // '-' should be allowed even though it's not a number
    if (newInputValue === '-') {
      setInputValue('-');
      setCursorPosition(1);
      e.preventDefault();
    }
    // -0 should be converted to 0
    else if (newInputValue === '-0') {
      setInputValue('0');
      setCursorPosition(1);
      setNumberValue(0);
      e.preventDefault();
    }
  };

  const onKeyDown = e => {
    const key = e.key;
    const previousInputValue = getInputValue();
    const previousSelectionState = getSelectionState();

    // Desktop-only key logic
    // For Mobile, Enter behaves differently, and Up/Down/Delete don't exist.
    // Mobile browsers don't report the key correctly, and Firefox Mobile
    // doesn't even fire onKeyDown for most keys.
    checkForEnterKey(e, key, previousInputValue, previousSelectionState);
    checkForUpDownArrowKey(e, key, previousInputValue, previousSelectionState);
    checkForDeleteKey(e, key, previousInputValue, previousSelectionState);
  };

  const onInput = e => {
    const previousInputValue = previousInputValueRef.current;
    const previousSelectionState = selectionStateRef.current;
    const newInputValue = getInputValue();
    const newSelectionState = getSelectionState();

    // Mobile key handling is difficult because mobile on-screen keyboards
    // report 'e.keyCode' as 229 and 'e.key' as 'Unidentified' in onKeyDown.
    // onKeyPress is deprecated, and onInput does not report keys at all.
    // The alternative is to record the input value on render and compare it
    // with the new input value in onInput to determine which key was pressed.
    const key = findKeyFromDiff(previousInputValue, newInputValue);

    // Desktop & Mobile key logic
    // checkForBackspaceKey uses previous values to match checkForDeleteKey
    checkForBackspaceKey(e, key, previousInputValue, previousSelectionState);

    // these use the new values for simplicity
    checkForSpaceKey(e, key, newInputValue, newSelectionState);
    checkForMinusKey(e, key, newInputValue, newSelectionState);

    if (!e.isDefaultPrevented()) {
      // cursor position moved due to input, so snapshot it.
      snapshotSelectionState();

      // bounding will happen on blur so the user can type impartial numbers
      // without interference.
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
  // useLayoutEffect avoids flashing because it runs before the browser has a
  // chance to paint
  useLayoutEffect(() => {
    const previousInputValue = getInputValue();
    previousInputValueRef.current = previousInputValue;

    if (hasFocusRef.current) {
      getInput().focus();
      restoreSelectionState();
    }
  });

  // valueOverride may be an empty string
  const valueToDisplay = valueOverride !== null ? valueOverride : format(value);

  return (
    <StandardInput
      ref={inputRef}
      className={cn(CID, className)}
      inputClassName={cn(`${CID}__input`, inputClassName)}
      dataCy={dataCy || buildDataCyString(name, 'number-input')}
      type='text'
      name={name}
      value={valueToDisplay}
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
