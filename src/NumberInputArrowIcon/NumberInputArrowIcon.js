import React from 'react';
import cn from 'classnames';

import './NumberInputArrowIcon.scss';

const CID = 'number-input-arrow-icon';

const NumberInputArrowIcon = ({
  direction,
  blue,
  error,
  disabled,
  className,
}) => {
  return (
    <svg
      className={cn(CID, { [direction]: direction, blue, error, disabled }, className)}
      viewBox='0 0 2 1'
    >
      <polygon points='0,1 2,1 1,0' />
    </svg>
  );
};

export default NumberInputArrowIcon;
