import React, { forwardRef } from 'react';
import cn from 'classnames';
import { buildDataCyString } from '../utils/cypressUtils';
import './StandardInput.scss';

const CID = 'standard-input';

const StandardInput = ({
  type,
  name,
  value,
  valueTransform,
  placeholder,
  blue,
  error,
  disabled,
  onChange,
  onValueChange,
  onKeyDown,
  onFocus,
  onBlur,
  onSelect,
  className,
  dataCy,
}, ref) => {
  const transform = valueTransform || (v => v);
  const stringValue = value !== undefined && value !== null ? `${value}` : '';
  const transformedValue = transform(stringValue);

  const onChangeWrapper = e => {
    const { name, value } = e.target;
    const newValue = transform(value);
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
      value={transformedValue}
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
