import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import {
  containsNumber,
  findKeyFromDiff,
  formatValue,
  hasDecimalSeparator,
  parseValue,
  removeSuffix,
  sanitizeInputValue,
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

  const setNumberValue = value => {
    // clear the value override so the actual value will show next render
    setInputValueOverride(null);

    const { name } = getInput();

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

    // If inputValue is not parsable to a number, then set it to null so it
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
    const newInputValueWithoutSuffix = removeSuffix(
      newInputValue,
      decimalSeparator,
    );

    // move the cursor to the end
    setInputValue(newInputValue);
    setCursorPosition(newInputValueWithoutSuffix.length);

    // trigger onChange
    setNumberValue(newNumberValue);

    // prevent up/down arrow keys from opening the auto-complete dropdown
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
      // force the value to a number before form submission
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

  // handle Desktop key logic
  const onKeyDown = e => {
    const { key } = e;

    // previous state is the current state because the input has not updated
    const previousInputValue = getInputValue();
    const previousSelectionState = getSelectionState();

    // Desktop only because Enter behaves differently on Mobile
    checkForEnterKey(e, key, previousInputValue, previousSelectionState);

    // Desktop only because Up/Down/Delete do not exist on Mobile
    checkForUpDownArrowKey(e, key, previousInputValue, previousSelectionState);
  };

  // handle Desktop & Mobile key logic
  const onInput = () => {
    const previousInputValue = getPreviousInputValue();
    const newInputValue = getInputValue();
    const newSelectionState = getSelectionState();

    const sanitizedInputValue = sanitizeInputValue(
      newInputValue,
      decimalSeparator,
      suffix,
    );

    const key = findKeyFromDiff(previousInputValue, newInputValue);

    const { selectionStart: cursorPosition } = newSelectionState;

    const removedCharacterCount =
      newInputValue.length - sanitizedInputValue.length;

    const decimalSeparatorOffset =
      hasDecimalSeparator(key, decimalSeparator) &&
      hasDecimalSeparator(
        previousInputValue[cursorPosition - 1],
        decimalSeparator,
      ) &&
      hasDecimalSeparator(newInputValue[cursorPosition], decimalSeparator)
        ? 1
        : 0;

    setInputValue(sanitizedInputValue);
    setCursorPosition(
      cursorPosition - removedCharacterCount + decimalSeparatorOffset,
    );
  };

  const onFocusWrapper = e => {
    hasFocusRef.current = true;

    if (onFocus) {
      onFocus(e);
    }
  };

  const onBlurWrapper = e => {
    hasFocusRef.current = false;

    // parse and bound the value
    forceInputValueToNumber(true);

    if (onBlur) {
      onBlur(e);
    }
  };

  const onSelect = () => {
    const {
      isRangeSelected,
      selectionStart: cursorPosition,
    } = getSelectionState();

    const maxCursorPosition = removeSuffix(getInputValue(), decimalSeparator)
      .length;

    if (!isRangeSelected && cursorPosition > maxCursorPosition) {
      setCursorPosition(maxCursorPosition);
    } else {
      snapshotSelectionState();
    }
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
  // change to the input's value. It's important to only create a new input if
  // the input has not just blurred to avoid breaking keyboard Tab navigation.
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
      // Firefox Mobile doesn't support inputMode, and type 'text' without
      // inputMode causes problems due to emoji auto-suggest
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
