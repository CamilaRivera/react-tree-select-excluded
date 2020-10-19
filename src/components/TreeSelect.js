import React from 'react';
import { TreeSelectProvider } from './contextProvider/TreeSelectContext';
import Node from './Node';

import './TreeSelect.css';

const TreeSelect = ({data, getNodeId, onChange, getNodeLabel}) => {
  return ( 
    <TreeSelectProvider roots={data} getNodeId={getNodeId} onChange={onChange} getNodeLabel={getNodeLabel}>
      <div className="tree-select-container">
        {data.map(node => {
          return <Node key={node.id} node={node}/>
        })}
      </div>
    </TreeSelectProvider>
  );
}

export default TreeSelect;