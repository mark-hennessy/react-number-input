import React from 'react';

const Label = ({ large, children }) => {
  return (
    <div
      style={{
        fontWeight: 'bold',
        marginBottom: '0.25rem',
        fontSize: large ? '1.5rem' : '1rem',
      }}
    >
      {children}
    </div>
  );
};

export default Label;
