import React from 'react';
import cn from 'classnames';

import './Label.scss';

const CID = 'label';

const Label = ({ large, className, children }) => {
  return <div className={cn(CID, { large }, className)}>{children}</div>;
};

export default Label;
