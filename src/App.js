import React, { useState } from 'react';
import './App.css';
import TreeSelect from './components/TreeSelect';

import jsonData from './sample_data/example4_7.json';

const getNodeId = node => {
  return node.id;
};

const prepareTreeData = data => {
  return data.children;
};

const getNodeLabel = node => {
  return node.name; 
}

const initialState = {
  excludedNodeIds: {9152504008413740345: true, 9148879237013563820: true, 9154321648813881105: true, 9135532327813517376: true},
  selectedNodeIds: {9135348560013466694: true}
};

function App() {
  const [state, setState] = useState(initialState);

  const onChange = data => {
    setState(data);
  }
  console.log('selected state', state);

  const rootsArray = prepareTreeData(jsonData); // get root array
  return (
    <div className="App">
      <header className="App-header">
        <TreeSelect data={rootsArray} getNodeId={getNodeId} onChange={onChange} getNodeLabel={getNodeLabel} included={state.selectedNodeIds} excluded={state.excludedNodeIds}/>
        <p>
          Edit <code>src/App.js</code> and savdewdedqedqdqRreload.
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
