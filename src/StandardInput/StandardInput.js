import React, { forwardRef } from 'react';
import cn from 'classnames';
import { buildDataCyString } from '../utils/cypressUtils';
import './StandardInput.scss';

const CID = 'standard-input';

const StandardInput = ({
  type,
  name,
  value,
  placeholder,
  blue,
  error,
  disabled,
  allCaps,
  onChange,
  onValueChange,
  onKeyDown,
  onFocus,
  onBlur,
  onSelect,
  className,
  dataCy,
}, ref) => {
  const transformValue = rawValue => {
    // convert undefined and null to ''
    // convert 5 to '5'
    let newValue = rawValue !== undefined && rawValue !== null ? `${rawValue}` : '';

    if (allCaps) {
      newValue = rawValue.toUpperCase();
    }

    return newValue;
  };

  const onChangeWrapper = e => {
    const { name, value } = e.target;
    const newValue = transformValue(value);
    e.target.value = newValue;

    if (onChange) {
      onChange(e);
    }

    if (onValueChange) {
      onValueChange(newValue, name);
    }
  };

  return (
    <input
      ref={ref}
      className={cn(CID, { blue, error, disabled }, className)}
      data-cy={dataCy || buildDataCyString(`${name}-input`)}
      type={type || 'text'}
      name={name}
      value={transformValue(value)}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChangeWrapper}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onSelect={onSelect}
      spellCheck='false'
    />
  );
};

export default forwardRef(StandardInput);
