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
    iconContent,
    blue,
    error,
    disabled,
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
        { 'has-icon-content': !!iconContent, blue, error, disabled },
        className,
      )}
      data-cy={dataCy || buildDataCyString(name, 'input')}
    >
      <input
        key={inputKey}
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
      {iconContent && (
        <div className={`${CID}__icon-container`}>{iconContent}</div>
      )}
    </div>
  );
};

export default forwardRef(StandardInput);
