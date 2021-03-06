import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import NumberInputArrowIcon from '../NumberInputArrowIcon/NumberInputArrowIcon';

import './NumberInputArrowButton.scss';

const CID = 'number-input-arrow-button';

const NumberInputArrowButton = ({
  direction,
  blue,
  error,
  disabled,
  onClick,
  className,
}) => {
  const timeoutRef = useRef(NaN);

  const clearCurrentTimeout = () => {
    clearTimeout(timeoutRef.current);
  };

  const clickAndRepeat = (e, isRecursiveCall) => {
    clearCurrentTimeout();

    // register the timeout before handling the click to ensure consistent timing
    timeoutRef.current = setTimeout(
      () => {
        clickAndRepeat(e, true);
      },
      isRecursiveCall ? 50 : 500,
    );

    onClick(e);
  };

  const handleInteractionStart = e => {
    if (disabled) {
      return;
    }

    // needed because the event is reused in timeout callbacks
    e.persist();

    // prevents the button from stealing focus from the input, and prevents
    // mobile devices from creating a virtual onMouseDown after onTouchStart
    e.preventDefault();

    clickAndRepeat(e);
  };

  const handleInteractionEnd = e => {
    if (disabled) {
      return;
    }

    // prevents mobile devices from creating a virtual onMouseUp after onTouchEnd
    e.preventDefault();

    clearCurrentTimeout();
  };

  useEffect(() => {
    // onUnmount
    return clearCurrentTimeout;
  }, []);

  return (
    <button
      className={cn(CID, { disabled }, className)}
      type='button'
      disabled={disabled}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
      onMouseLeave={handleInteractionEnd}
      // touch events are needed because mobile deices only fire virtual mouse
      // events for short taps and not long touches
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onTouchMove={handleInteractionEnd}
      tabIndex={-1}
    >
      <NumberInputArrowIcon
        direction={direction}
        blue={blue}
        error={error}
        disabled={disabled}
      />
    </button>
  );
};

export default NumberInputArrowButton;
