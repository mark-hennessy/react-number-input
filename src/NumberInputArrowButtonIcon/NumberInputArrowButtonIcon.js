import React from 'react';
import cn from 'classnames';

import './NumberInputArrowButtonIcon.scss';

const CID = 'number-input-arrow-button-icon';

const NumberInputArrowButtonIcon = ({
  direction,
  blue,
  disabled,
  className,
}) => {
  return (
    <svg
      className={cn(CID, { [direction]: direction, blue, disabled }, className)}
      viewBox='0 0 2 1'
    >
      <polygon points='0,1 2,1 1,0' />
    </svg>
  );
};

export default NumberInputArrowButtonIcon;
