import React, { forwardRef } from 'react';
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
    centerAlign,
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
  },
  ref,
) => {
  const { transformedValue, onChangeWrapper } = createInputTransformationProps({
    value,
    allCaps,
    onChange,
    onValueChange,
  });

  return (
    <div
      className={cn(
        CID,
        {
          blue,
          error,
          disabled,
          alwaysShowShadow,
          centerAlign,
          hasRightIcon: !!rightIcon,
        },
        className,
      )}
      data-cy={dataCy || buildDataCyString(name, 'input')}
    >
      <input
        ref={ref}
        className={cn(`${CID}__input`, inputClassName)}
        type={type || 'text'}
        name={name}
        value={transformedValue}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChangeWrapper}
        onKeyDown={onKeyDown}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        onSelect={onSelect}
        spellCheck='false'
      />
      {rightIcon && (
        <div className={`${CID}__right-icon-container`}>{rightIcon}</div>
      )}
    </div>
  );
};

export default forwardRef(StandardInput);
