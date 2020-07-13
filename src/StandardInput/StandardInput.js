import React, { forwardRef, useRef } from 'react';
import cn from 'classnames';
import { buildDataCyString } from '../utils/cypressUtils';
import './StandardInput.scss';
import createInputTransformationProps from '../utils/createInputTransformationProps';

const CID = 'standard-input';

const StandardInput = (
  {
    type,
    name,
    value,
    placeholder,
    rightIcon,
    blue,
    error,
    disabled,
    alwaysShowShadow,
    allCaps,
    onChange,
    onValueChange,
    onKeyDown,
    onInput,
    onFocus,
    onBlur,
    onSelect,
    className,
    inputClassName,
    dataCy,
    inputKey,
  },
  ref,
) => {
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  // Use null when disabled because it even prevents click focus.
  // -1 would prevent keyboard focus, but still allow click focus.
  const wrapperTabIndexRef = useRef(disabled ? null : 0);

  const setInputRef = input => {
    // inputRef is needed for internal use since ref is an optional prop
    inputRef.current = input;

    if (ref) {
      ref.current = input;
    }
  };

  const setWrapperTabIndex = tabIndex => {
    wrapperTabIndexRef.current = tabIndex;
    wrapperRef.current.tabIndex = tabIndex;
  };

  const onWrapperFocus = e => {
    inputRef.current.focus();
  };

  const onInputFocus = e => {
    // This tabIndex logic ensures that tab and shift-tab navigation works as
    // usual even if the 'inputKey' prop is used to force React to create a new
    // input instance each render. Focus would be lost without this.
    setWrapperTabIndex(-1);

    if (onFocus) {
      onFocus(e);
    }
  };

  const onInputBlur = e => {
    setWrapperTabIndex(0);

    if (onBlur) {
      onBlur(e);
    }
  };

  const { transformedValue, onChangeWrapper } = createInputTransformationProps({
    value,
    allCaps,
    onChange,
    onValueChange,
  });

  return (
    <div
      ref={wrapperRef}
      className={cn(
        CID,
        {
          blue,
          error,
          disabled,
          alwaysShowShadow,
          hasRightIcon: !!rightIcon,
        },
        className,
      )}
      data-cy={dataCy || buildDataCyString(name, 'input')}
      tabIndex={wrapperTabIndexRef.current}
      onFocus={onWrapperFocus}
    >
      <input
        key={inputKey}
        ref={setInputRef}
        className={cn(`${CID}__input`, inputClassName)}
        type={type}
        name={name}
        value={transformedValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChangeWrapper}
        onKeyDown={onKeyDown}
        onInput={onInput}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        onSelect={onSelect}
        spellCheck='false'
        // the wrapper will redirect focus to the input programmatically
        tabIndex={-1}
      />
      {rightIcon && (
        <div className={`${CID}__right-icon-container`}>{rightIcon}</div>
      )}
    </div>
  );
};

export default forwardRef(StandardInput);
