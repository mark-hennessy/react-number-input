import React from 'react';
import './App.scss';
import DemoForm from './DemoForm/DemoForm';

const CID = 'app';

export default function App() {
  return (
    <div className={CID}>
      <DemoForm formName='Form1' blue />
      <DemoForm formName='Form2' />
    </div>
  );
}
