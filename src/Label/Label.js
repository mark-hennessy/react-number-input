import React from 'react';
import cn from 'classnames';

import './Label.scss';

const CID = 'label';

const Label = ({ className, children }) => {
  return <div className={cn(CID, className)}>{children}</div>;
};

export default Label;
