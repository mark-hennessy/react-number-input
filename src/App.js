import React from 'react';
import './App.scss';
import DemoForm from './DemoForm/DemoForm';
import Label from './Label/Label';

const CID = 'app';

export default function App() {
  return (
    <div className={CID}>
      <Label>Form 1, White Inputs</Label>
      <DemoForm formName='f1' blue />
      <Label>Form 2, Blue Inputs, Duplicate Of Form 1 (no need to test)</Label>
      <DemoForm formName='f2' />
    </div>
  );
}
