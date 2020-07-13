import React from 'react';
import DemoForm from './DemoForm/DemoForm';
import Label from './Label/Label';

export default function App() {
  return (
    <div
      style={{
        display: 'grid',
        gridGap: '1rem',
      }}
    >
      <Label large>Form 1, White Inputs</Label>
      <DemoForm formName='f1' blue />
      <Label large>
        Form 2, Blue Inputs, Duplicate of Form 1 (no need to test)
      </Label>
      <DemoForm formName='f2' />
    </div>
  );
}
