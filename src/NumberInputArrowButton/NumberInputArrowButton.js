import React from 'react';
import cn from 'classnames';
import NumberInputArrowButtonIcon from '../NumberInputArrowButtonIcon/NumberInputArrowButtonIcon';

import './NumberInputArrowButton.scss';

const CID = 'number-input-arrow-button';

const NumberInputArrowButton = ({
  direction,
  blue,
  disabled,
  onClick,
  className,
}) => {
  return (
    <button
      className={cn(CID, { disabled }, className)}
      type='button'
      disabled={disabled}
      onClick={onClick}
      tabIndex={-1}
    >
      <NumberInputArrowButtonIcon
        direction={direction}
        blue={blue}
        disabled={disabled}
      />
    </button>
  );
};

export default NumberInputArrowButton;
