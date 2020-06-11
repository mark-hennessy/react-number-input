import React, { useState } from 'react';
import cn from 'classnames';
import Panel from '../Panel/Panel';
import NumberInput from '../NumberInput/NumberInput';
import './DemoForm.scss';

const CID = 'demo-form';

const DemoForm = ({ formName, blue, className }) => {
  const [state, setState] = useState({
    value1: '',
    value2: '12.34',
    value3: '12.34',
    value4: '12.34',
  });

  const connectToState = stateKey => {
    return {
      name: stateKey,
      value: state[stateKey],
      onChange: (value, input) => {
        setState({ ...state, [input.name]: value });
      },
      placeholder: 'value',
      blue: !blue,
    };
  };

  let inputId = 1;

  return (
    <form name={formName}>
      <Panel className={cn(CID, className)} blue={blue}>
        <NumberInput {...connectToState(`value${inputId++}`)} ignoreEnterKey />
        <NumberInput
          {...connectToState(`value${inputId++}`)}
          placeholder='1,3'
          step={0.1}
          precision={1}
          min={1}
          max={6}
        />
        <NumberInput
          {...connectToState(`value${inputId++}`)}
          precision={2}
          currency
        />
        <NumberInput
          {...connectToState(`value${inputId++}`)}
          precision={2}
          currency
          disabled
        />

        <div className={`${CID}__form-state`}>
          {JSON.stringify(state, undefined, 2)}
        </div>
        <button
          className={`${CID}__submit-button`}
          type='submit'
          onClick={() => {
            alert(`${formName} Submitted`);
          }}
        >
          Submit
        </button>
      </Panel>
    </form>
  );
};

export default DemoForm;
