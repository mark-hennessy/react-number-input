import React from 'react';

const Panel = ({ blue, children }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '0.5rem',
        padding: '0.5rem',
        border: '1px solid lightblue',
        background: blue ? '#ebf9fd' : 'white',
      }}
    >
      {children}
    </div>
  );
};

export default Panel;
