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
    <div className={cn(CID, { disabled }, className)} onClick={onClick}>
      <NumberInputArrowButtonIcon
        direction={direction}
        blue={blue}
        disabled={disabled}
      />
    </div>
  );
};

export default NumberInputArrowButton;
