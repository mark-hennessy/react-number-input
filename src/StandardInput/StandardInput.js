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
  disabled,
  ignoreEnterKey,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  onSelect,
  className,
  dataCy,
}, ref) => {
  return (
    <input
      ref={ref}
      className={cn(CID, { blue, disabled }, className)}
      data-cy={dataCy || buildDataCyString(`${name}-input`)}
      type={type || 'text'}
      name={name}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      onSelect={onSelect}
    />
  );
};

export default forwardRef(StandardInput);
