import React, { useRef } from 'react';
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
  const initialTimerIdRef = useRef();
  const repeatTimerIdRef = useRef();

  const clearTimers = () => {
    clearTimeout(initialTimerIdRef.current);
    clearInterval(repeatTimerIdRef.current);
  };

  return (
    <button
      className={cn(CID, { disabled }, className)}
      type='button'
      disabled={disabled}
      onMouseDown={e => {
        // needed because this React synthetic event is reused in the timer callbacks
        e.persist();

        // register timers before handling the click to
        // ensure consistent time intervals
        initialTimerIdRef.current = setTimeout(() => {
          repeatTimerIdRef.current = setInterval(() => {
            onClick(e);
          }, 33);

          onClick(e);
        }, 500);

        onClick(e);
      }}
      onMouseUp={clearTimers}
      // for when the mouse leaves the button while pressed down
      onMouseLeave={clearTimers}
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
