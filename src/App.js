import React from 'react';
import DemoForm from './DemoForm/DemoForm';

export default function App() {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '1rem',
      }}
    >
      <div>
        <h2 style={{ marginBottom: '0.5rem' }}>Form 1, White Inputs</h2>
        <DemoForm formName='f1' blue />
      </div>
      <div>
        <h2 style={{ marginBottom: '0.5rem' }}>
          Form 2, Blue Inputs, Duplicate of Form 1 (no need to test)
        </h2>
        <DemoForm formName='f2' />
      </div>
    </div>
  );
}
