import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import shortid from 'shortid';
import { isNumber } from '../utils/numberUtils';

const CID = 'number-input';

const NumberInput = ({
  name,
  value,
  placeholder,
  precision = 0,
  step = 1,
  min = 0,
  max,
  decimalSeparator = ',',
  currency,
  currencySymbol = '€',
  blue,
  error,
  disabled,
  alwaysShowShadow,
  centerAlign,
  preventSubmitOnEnter,
  onChange,
  onValueChange,
  onFocus,
  onBlur,
  className,
  inputClassName,
  dataCy,
}) => {
  const [overrides, setOverrides] = useState({
    inputValue: null,
  });

  const inputRef = useRef(null);
  const previousInputValueRef = useRef(null);
  const previousSelectionStateRef = useRef({});
  const hasFocusRef = useRef(false);

  // undefined is important since null is a valid key value
  const inputKeyRef = useRef(undefined);

  const suffix = currency ? ` ${currencySymbol}` : '';
  const isMobile = useMemo(() => /Mobi/.test(navigator.userAgent), []);
  const isFirefox = useMemo(() => /Firefox/.test(navigator.userAgent), []);

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

  const getInputValueOverride = () => {
    return overrides.inputValue;
  };

  const setInputValueOverride = inputValue => {
    // inputValueOverride state is wrapped in an object to ensure a new render
    // when set even if the override value does not change. This is needed
    // because React requires user input to result in a new render even if the
    // displayed value does not change.
    setOverrides({
      ...overrides,
      inputValue,
    });
  };

  const getInput = () => {
    return inputRef.current;
  };

  const getInputValue = () => {
    return getInput().value;
  };

  const getPreviousInputValue = () => {
    return previousInputValueRef.current;
  };

  const setInputValue = inputValue => {
    // The input is a controlled component, and thus requires the value to be
    // set via a state change (setNumberValue or setInputValueOverride).
    //
    // React uses a timer internally to reset the value if it's not followed
    // by a state change. The onKeyDown-preventDefault combo can be used to set
    // the input's value without changing state, but it's not a viable solution
    // for Mobile because Mobile relies on the onInput event.
    //
    // Setting the value without state in addition to with state is needed so
    // that a cursor position can be set in-sync with the new value.
    getInput().value = inputValue;

    // It's common and intended for this to get set and then immediately
    // cleared by setNumberValue in the same render. The override is only used
    // as a fallback in case setNumberValue ends up not getting called. The
    // override value is useful for temporarily rendering non-numeric values.
    setInputValueOverride(inputValue);
  };

  const getSelectionState = () => {
    const { selectionStart, selectionEnd, selectionDirection } = getInput();

    const { length } = getInputValue();

    const isRangeSelected = selectionStart !== selectionEnd;
    const selectedRangeLength = selectionEnd - selectionStart;
    const isAllTextSelected = isRangeSelected && selectedRangeLength === length;

    return {
      selectionStart,
      selectionEnd,
      selectionDirection,
      isRangeSelected,
      selectedRangeLength,
      isAllTextSelected,
    };
  };

  const getPreviousSelectionState = () => {
    return previousSelectionStateRef.current;
  };

  const snapshotSelectionState = () => {
    previousSelectionStateRef.current = getSelectionState();
  };

  const setSelectionState = selectionState => {
    const { selectionStart, selectionEnd, selectionDirection } = selectionState;

    // ignore selection state if not initialized
    if (!isNumber(selectionStart)) {
      return;
    }

    getInput().setSelectionRange(
      selectionStart,
      selectionEnd,
      selectionDirection,
    );

    // this is important because setSelectionRange will not trigger onSelect
    // if called from onInput
    snapshotSelectionState();
  };

  const setCursorPosition = position => {
    setSelectionState({ selectionStart: position, selectionEnd: position });
  };

  const restoreSelectionState = () => {
    setSelectionState(getPreviousSelectionState());
  };

  const setNumberValue = number => {
    // Clear the value override so the actual value will show next render.
    setInputValueOverride(null);

    const { name } = getInput();

    // Use the empty string instead of null to represent an empty input in case
    // there are apps that repopulate the input with a default value when null.
    const value = number !== null ? number : '';

    if (onChange) {
      const e = {
        target: {
          name,
          value,
        },
      };

      onChange(e);
    }

    if (onValueChange) {
      onValueChange(value, name);
    }
  };

  const forceInputValueToNumber = bound => {
    const inputValue = getInputValue();

    // if inputValue is not parsable to a number, then set it to null so it
    // does not get converted to 0. The input would not be clearable otherwise.
    const number = containsNumber(inputValue, decimalSeparator)
      ? parse(inputValue, bound)
      : null;

    setNumberValue(number);
  };

  const calculateStepMultiplier = e => {
    if (e.ctrlKey || e.metaKey) {
      return 0.1;
    }

    if (e.shiftKey) {
      return 10;
    }

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
    const newInputValueWithoutSuffix = newInputValue.replace(suffix, '');

    // move the cursor to the end
    setInputValue(newInputValue);
    setCursorPosition(newInputValueWithoutSuffix.length);

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
    if (key === 'Enter') {
      // force the value to a number before form submission.
      forceInputValueToNumber(true);

      if (preventSubmitOnEnter) {
        e.preventDefault();
      }
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
    // the cursor to the right if the character cannot be deleted
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

      // so cursor position can be set in sync with the new value
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

  const checkForDecimalSeparator = (
    e,
    key,
    newInputValue,
    newSelectionState,
  ) => {
    const { selectionStart: cursorPosition } = newSelectionState;

    const separators = `[.${decimalSeparator}]`;

    // match a period or the custom separator
    const separatorPattern = new RegExp(separators);

    // match 2 periods, 2 custom custom separators, or a combination of both
    const separatorTwicePattern = new RegExp(`${separators}{2}`);

    const newValueWithoutDuplicateSeparators = newInputValue.replace(
      separatorTwicePattern,
      decimalSeparator,
    );

    const numberRemoved =
      newInputValue.length - newValueWithoutDuplicateSeparators.length;

    if (numberRemoved) {
      setInputValue(newValueWithoutDuplicateSeparators);

      const adjustedPosition = cursorPosition - numberRemoved;
      const nextChar = newValueWithoutDuplicateSeparators[adjustedPosition];
      const isSeparatorToTheRight = separatorPattern.test(nextChar);
      const forwardMovement = isSeparatorToTheRight ? 1 : 0;
      setCursorPosition(adjustedPosition + forwardMovement);

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

    const numberRemoved =
      valueWithoutSuffix.length - valueWithoutSuffixAndSpaces.length;

    if (numberRemoved > 0) {
      setInputValue(valueWithoutSpaces);

      // Space should move the cursor forward without adding a space
      if (key === ' ') {
        setCursorPosition(cursorPosition);
      }
      // Otherwise assume range selection or copy/paste and keep the cursor
      // where it is but account for the removed spaces.
      else {
        setCursorPosition(cursorPosition - numberRemoved);
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
    if (!isNumber(min) || min < 0) {
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
    }
  };

  const onKeyDown = e => {
    const { key } = e;

    // The previous state is actually the current state because the input has
    // not been updated yet.
    const previousInputValue = getInputValue();
    const previousSelectionState = getSelectionState();

    /// Desktop-only key logic ///

    // For Mobile, Enter behaves differently, and Up/Down/Delete do not exist.
    // Mobile browsers do not report the key correctly, and Firefox Mobile
    // does not even fire onKeyDown for most keys.
    checkForEnterKey(e, key, previousInputValue, previousSelectionState);
    checkForUpDownArrowKey(e, key, previousInputValue, previousSelectionState);
    checkForDeleteKey(e, key, previousInputValue, previousSelectionState);
  };

  const onInput = e => {
    const previousInputValue = getPreviousInputValue();
    const previousSelectionState = getPreviousSelectionState();
    const newInputValue = getInputValue();
    const newSelectionState = getSelectionState();

    // Mobile key handling is difficult because on-screen keyboards report
    // 'e.keyCode' as 229 and 'e.key' as 'Unidentified' in onKeyDown. Also,
    // onKeyPress is deprecated and onInput does not report keys.
    // The alternative is to record the input value on render and compare it
    // with the new input value in onInput to determine which key was pressed.
    const key = findKeyFromDiff(previousInputValue, newInputValue);

    /// Desktop & Mobile key logic ///

    // checkForBackspaceKey uses previous values to match checkForDeleteKey
    checkForBackspaceKey(e, key, previousInputValue, previousSelectionState);

    // these use the new values for simplicity
    checkForDecimalSeparator(e, key, newInputValue, newSelectionState);
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

    // This is needed to clear invalid values such as '-' without a number
    // after it, and to bound valid values to the min/max if specified.
    forceInputValueToNumber(true);

    if (onBlur) {
      onBlur(e);
    }
  };

  const onSelect = () => {
    snapshotSelectionState();
  };

  // runs after each render
  // useLayoutEffect avoids flashing because it runs before the browser has a
  // chance to paint
  useLayoutEffect(() => {
    previousInputValueRef.current = getInputValue();

    if (hasFocusRef.current) {
      getInput().focus();
      restoreSelectionState();
    }
  });

  const inputValueOverride = getInputValueOverride();

  // the empty string should be allowed as an override even though it's falsy
  const valueToDisplay =
    inputValueOverride !== null ? inputValueOverride : format(value);

  const previousValue = getPreviousInputValue();

  // Create a new input when the new value matches the old to fix a Firefox
  // Mobile and iOS issue that happens when user input does not result in a
  // change to the input's value. This is the case when the user presses the
  // space bar, tries to delete the currency suffix, tries to delete ',00' in
  // an input with precision={2}, and so on.
  // Only create a new input if the input has not just blurred to avoid
  // breaking keyboard Tab and Shift Tab navigation.
  if (valueToDisplay === previousValue && hasFocusRef.current) {
    inputKeyRef.current = shortid.generate();
  }

  return (
    <StandardInput
      ref={inputRef}
      className={cn(CID, className)}
      inputKey={inputKeyRef.current}
      inputClassName={cn(`${CID}__input`, inputClassName)}
      dataCy={dataCy || buildDataCyString(name, 'number-input')}
      // Firefox Mobile doesn't support inputMode, and type 'text' in Firefox
      // uses an aggressive emoji auto-suggest that glitches the input.
      type={isFirefox && isMobile ? 'tel' : 'text'}
      // ask Mobile browsers that support inputMode to show the number pad
      inputMode='decimal'
      name={name}
      value={valueToDisplay}
      placeholder={placeholder}
      rightIcon={
        !isMobile && (
          <NumberInputArrowButtons
            blue={blue}
            error={error}
            disabled={disabled}
            onStepUp={onStepUp}
            onStepDown={onStepDown}
          />
        )
      }
      blue={blue}
      error={error}
      disabled={disabled}
      alwaysShowShadow={alwaysShowShadow}
      centerAlign={centerAlign}
      onKeyDown={onKeyDown}
      onInput={onInput}
      onFocus={onFocusWrapper}
      onBlur={onBlurWrapper}
      onSelect={onSelect}
    />
  );
};

export default NumberInput;
