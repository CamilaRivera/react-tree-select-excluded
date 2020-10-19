import React, { useState } from 'react';
import { useTreeSelectContext } from './contextProvider/TreeSelectContext';

import './Node.css';

const Node = ({ node, isParentSelected = false, isParentExcluded = false }) => {
  const [expanded, setExpanded] = useState(true);
  // const [selected, setSelected] = useState(false);
  const { addSelectedNode, isSelected, removeSelectedNode, getNodeLabel } = useTreeSelectContext();
  const selected = isSelected(node);

  const excluded = (selected && isParentSelected) || isParentExcluded;

  const checkChildren = data => {
    if (data.children) {
      return data.children.map(child => <Node key={child.id} node={child} isParentSelected={selected || isParentSelected} isParentExcluded={excluded}/>)
    }
  }

  const handleExpandedClick = () => {
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    if (selected) {
      removeSelectedNode(node);
    } 
    else {
      addSelectedNode(node);
    }
  };

  const leaf = !Array.isArray(node.children) || node.children.length === 0;

  let nodeClass = 'node';
  if (leaf) {
    nodeClass += ' leaf'; 
  }
  if (selected) {
    nodeClass += ' selected';
  }
  nodeClass +=  expanded ? ' expanded' : ' collapsed';
  if (isParentSelected) {
    nodeClass += ' parent-selected';
  }
  if (excluded) {
    nodeClass += ' excluded';
  }


  return (
    <div className={nodeClass}>
      <div className="buttons">
        {leaf && <div className="expand-button placeholder"></div>}
        {!leaf && expanded && <div className="expand-button" onClick={handleExpandedClick}>-</div>}
        {!leaf && !expanded && <div className="expand-button" onClick={handleExpandedClick}>+</div>}
        <div className="select-button" onClick={handleSelect}>S</div>
        <div className="node-name" onClick={handleSelect}>{getNodeLabel(node)}</div>
      </div>
      {expanded && <div>{checkChildren(node)}</div>}
    </div>
  )
}

export default Node;