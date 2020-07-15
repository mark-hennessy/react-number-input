import React, { useState } from 'react';
import Panel from '../Panel/Panel';
import NumberInput from '../NumberInput/NumberInput';
import Label from '../Label/Label';
import StandardInput from '../StandardInput/StandardInput';

const DemoForm = ({ formName, blue }) => {
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
    [getInputName(inputCounter++)]: 12.34,
    [getInputName(inputCounter++)]: 'text',
  });

  const getStateAsJson = () => {
    return JSON.stringify(state, undefined, 2);
  };

  const connectToState = inputName => {
    return {
      name: inputName,
      value: state[inputName],
      onValueChange: (value, name) => {
        setState({ ...state, [name]: value });
      },
      placeholder: 'value',
      blue: !blue,
    };
  };

  // reset the counter so it can be reused
  inputCounter = 1;

  return (
    <form name={formName}>
      <Panel blue={blue}>
        <div>
          <Label>Whole Number, No Submit on Enter</Label>
          <NumberInput
            {...connectToState(getInputName(inputCounter++))}
            preventSubmitOnEnter
          />
        </div>
        <div>
          <Label>Whole Number, 100 min, 200 max</Label>
          <NumberInput
            {...connectToState(getInputName(inputCounter++))}
            min={100}
            max={200}
          />
        </div>
        <div>
          <Label>German School Grade</Label>
          <NumberInput
            {...connectToState(getInputName(inputCounter++))}
            placeholder='1,3'
            step={0.1}
            precision={1}
            min={1}
            max={6}
          />
        </div>
        <div>
          <Label>Decimal Number, Currency</Label>
          <NumberInput
            {...connectToState(getInputName(inputCounter++))}
            precision={2}
            currency
          />
        </div>
        <div>
          <Label>Decimal Number, Currency, Disabled</Label>
          <NumberInput
            {...connectToState(getInputName(inputCounter++))}
            precision={2}
            currency
            disabled
          />
        </div>
        <div>
          <Label>Decimal Number, Currency, Error</Label>
          <NumberInput
            {...connectToState(getInputName(inputCounter++))}
            precision={2}
            currency
            error
          />
        </div>
        <div>
          <Label>Text Input (ALL CAPS)</Label>
          <StandardInput
            {...connectToState(getInputName(inputCounter++))}
            allCaps
          />
        </div>

        <div style={{ whiteSpace: 'pre' }}>{getStateAsJson()}</div>
        <button
          style={{ justifySelf: 'start' }}
          type='submit'
          onClick={e => {
            alert(`${formName} Submitted
${getStateAsJson()}`);

            // don't actually submit the form
            e.preventDefault();
          }}
        >
          Submit
        </button>
      </Panel>
    </form>
  );
};

export default DemoForm;
