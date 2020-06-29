import React from 'react';
import cn from 'classnames';
import NumberInputArrowButton from '../NumberInputArrowButton/NumberInputArrowButton';
import './NumberInputArrowButtons.scss';

const CID = 'number-input-arrow-buttons';

const NumberInputArrowButtons = ({
  blue,
  error,
  disabled,
  onStepUp,
  onStepDown,
  className,
}) => {
  return (
    <div className={cn(CID, className)}>
      <NumberInputArrowButton
        direction='up'
        blue={blue}
        error={error}
        disabled={disabled}
        onClick={onStepUp}
      />
      <NumberInputArrowButton
        direction='down'
        blue={blue}
        error={error}
        disabled={disabled}
        onClick={onStepDown}
      />
    </div>
  );
};

export default NumberInputArrowButtons;
