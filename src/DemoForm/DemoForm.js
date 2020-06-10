import React, { useState } from 'react';
import cn from 'classnames';
import Panel from '../Panel/Panel';
import NumberInput from '../NumberInput/NumberInput';
import './DemoForm.scss';

const CID = 'demo-form';

const DemoForm = ({ blue, className }) => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('12.34');
  const [value3, setValue3] = useState('12.34');

  return (
    <form>
      <Panel className={cn(CID, className)} blue={blue}>
        <NumberInput
          placeholder='value'
          value={value1}
          onValueChange={setValue1}
          min={0}
          max={100}
          ignoreEnterKey
          blue={!blue}
        />
        <NumberInput
          placeholder='value'
          value={value2}
          onValueChange={setValue2}
          min={0}
          max={100}
          ignoreEnterKey
          blue={!blue}
        />
        <NumberInput
          placeholder='value'
          value={value3}
          onValueChange={setValue3}
          min={0}
          max={100}
          ignoreEnterKey
          blue={!blue}
          disabled
        />
        <button
          className={`${CID}__submit-button`}
          onClick={() => {
            alert('Form Submitted');
          }}
        >
          Submit
        </button>
      </Panel>
    </form>
  );
};

export default DemoForm;
