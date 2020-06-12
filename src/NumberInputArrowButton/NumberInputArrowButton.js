import React from 'react';
import cn from 'classnames';
import NumberInputArrowButtonIcon from '../NumberInputArrowButtonIcon/NumberInputArrowButtonIcon';
import useLogDeltaTime from '../utils/useLogDeltaTime';

import './NumberInputArrowButton.scss';

const CID = 'number-input-arrow-button';

const NumberInputArrowButton = ({
  direction,
  blue,
  disabled,
  onClick,
  className,
}) => {
  const logDeltaTime = useLogDeltaTime();

  return (
    <button
      className={cn(CID, { disabled }, className)}
      type='button'
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => {
        logDeltaTime();
        console.log('mouseDown');
      }}
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
