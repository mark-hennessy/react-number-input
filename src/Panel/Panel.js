import React from 'react';
import cn from 'classnames';

import './Panel.scss';

const CID = 'panel';

const Panel = ({ blue, className, children }) => {
  return <div className={cn(CID, { blue }, className)}>{children}</div>;
};

export default Panel;
