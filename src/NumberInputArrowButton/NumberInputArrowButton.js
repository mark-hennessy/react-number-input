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
  const timeoutRef = useRef();

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

  return (
    <button
      className={cn(CID, { disabled }, className)}
      type='button'
      disabled={disabled}
      onMouseDown={e => {
        // needed because this React synthetic event is reused in timeout callbacks
        e.persist();

        // prevents the button from stealing focus from the input
        e.preventDefault();

        clickAndRepeat(e);
      }}
      onMouseUp={clearCurrentTimeout}
      // for when the mouse leaves the button while pressed down
      onMouseLeave={clearCurrentTimeout}
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
