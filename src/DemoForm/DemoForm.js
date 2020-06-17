import React, { useState } from 'react';
import cn from 'classnames';
import Panel from '../Panel/Panel';
import NumberInput from '../NumberInput/NumberInput';
import Label from '../Label/Label';
import './DemoForm.scss';

const CID = 'demo-form';

const DemoForm = ({ formName, blue, className }) => {
  const getInputName = inputNum => {
    return `${formName}_v${inputNum}`;
  };

  let inputCounter = 1;

  const [state, setState] = useState({
    [getInputName(inputCounter++)]: null,
    [getInputName(inputCounter++)]: 100,
    [getInputName(inputCounter++)]: 1.6,
    [getInputName(inputCounter++)]: 12.34,
    [getInputName(inputCounter++)]: 12.34,
  });

  const connectToState = inputName => {
    return {
      name: inputName,
      value: state[inputName],
      onChange: (value, name) => {
        setState({ ...state, [name]: value });
      },
      placeholder: 'value',
      blue: !blue,
    };
  };

  inputCounter = 1;

  return (
    <form name={formName}>
      <Panel className={cn(CID, className)} blue={blue}>
        <Label>Whole Number</Label>
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
          ignoreEnterKey
        />
        <Label>Whole Number, 100 min, 200 max</Label>
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
          min={100}
          max={200}
        />
        <Label>German School Grade</Label>
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
          placeholder='1,3'
          step={0.1}
          precision={1}
          min={1}
          max={6}
        />
        <Label>Decimal Number, Currency</Label>
        <NumberInput
          {...connectToState(getInputName(inputCounter++))}
          precision={2}
          currency
        />
        <Label>Decimal Number, Currency, Disabled</Label>
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
