import React from 'react';
import './App.scss';
import NumberInputPanel from './NumberInputPanel/NumberInputPanel';
import Panel from './Panel/Panel';

const CID = 'app';

export default function App() {
  return (
    <div className={CID}>
      <form className={`${CID}__form`}>
        <NumberInputPanel blue />
        <NumberInputPanel />
        <Panel>
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
    </div>
  );
}
