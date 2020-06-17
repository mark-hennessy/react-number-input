import React, { useState } from 'react';
import cn from 'classnames';
import Panel from '../Panel/Panel';
import NumberInput from '../NumberInput/NumberInput';
import './DemoForm.scss';

const CID = 'demo-form';

const DemoForm = ({ formName, blue, className }) => {
  const getInputName = inputNum => {
    return `${formName}_v${inputNum}`;
  };

  let inputCounter = 1;

  const [state, setState] = useState({
    [getInputName(inputCounter++)]: null,
    [getInputName(inputCounter++)]: 150,
    [getInputName(inputCounter++)]: 12.34,
    [getInputName(inputCounter++)]: 12.34,
    [getInputName(inputCounter++)]: 12.34,
  });

  const connectToState = inputName => {
    return {
      name: inputName,
      value: state[inputName],
      onChange: (value, input) => {
        setState({ ...state, [input.name]: value });
      },
      placeholder: 'value',
      blue: !blue,
    };
  };

  inputCounter = 1;

  return (
    <form name={formName}>
      <Panel className={cn(CID, className)} blue={blue}>
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
          ignoreEnterKey
        />
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
          min={100}
          max={200}
        />
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
          placeholder='1,3'
          step={0.1}
          precision={1}
          min={1}
          max={6}
        />
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
          precision={2}
          currency
        />
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
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
