import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';

export const TreeSelectContext = createContext();

export const useTreeSelectContext = () => {
  return useContext(TreeSelectContext);
};

const getAncestors = (nodes, getNodeId, ancestors = {}) => {
  const mapAncestors = {};
  nodes.forEach(node => {
    const nodeId = getNodeId(node)
    if (mapAncestors[nodeId]) {
      mapAncestors[nodeId] = { ...mapAncestors[nodeId], ...ancestors }
    } else {
      mapAncestors[nodeId] = ancestors;
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      const childrenAncestors = getAncestors(node.children, getNodeId, {...ancestors, [nodeId]: true});
      Object.assign(mapAncestors, childrenAncestors);
    }
  });
  return mapAncestors;
};

const getDescendants = ancestorsMap => {
  const descendantsMap = {};
  Object.keys(ancestorsMap).forEach(nodeId => {
    const ancestors = ancestorsMap[nodeId];
    Object.keys(ancestors).forEach(ancestorId => {
      if (!descendantsMap[ancestorId]) {
        descendantsMap[ancestorId] = {};
      }
      descendantsMap[ancestorId][nodeId] = true;
    });
  });
  return descendantsMap;
};

// const getDescendants = (nodes, getNodeId) => {
//   const mapDescendants = {};
//   nodes.forEach(node => {
//     const nodeDescendants = {};
//     if (Array.isArray(node.children) && node.children.length > 0) {
//       node.children.forEach(child => {
//         nodeDescendants[getNodeId(child)] = true;
//       });
//       const childrenDescendants = getDescendants(node.children, getNodeId);
//       Object.assign
//     }

//     mapDescendants[getNodeId(node)] = nodeDescendants;

//     const directDescendants = node.children;
//     if (Array.isArray(directDescendants) && directDescendants.length > 0) {
//       directDescendants.forEach(descendant => {
//         const currentDescendants = mapDescendants[getNodeId(node)]
//         mapDescendants[getNodeId(node)] = {...currentDescendants, [getNodeId(descendant)]: true}
//         if (Array.isArray(descendant.children) && descendant.children.length > 0) {
//           descendant.children.forEach( child => {
//             const childDescendants = getDescendants(descendant, getNodeId);
//             mapDescendants[getNodeId(node)] = {...currentDescendants, ...childDescendants}
//           })
//         }
//       });
//     }
//   });
//   return mapDescendants;
// };

const getProcessedState = (selectedNodes, nodeToAncestors) => {
  const selectedNodeIds = {};
  const excludedNodeIds = {};
  const selectedNodesArray = Object.keys(selectedNodes);
  selectedNodesArray.forEach(selectedNode => {
      let selectedAncestors = 0;
      for (const ancestor in nodeToAncestors[selectedNode]) {
        if (selectedNodes[ancestor]) {
          selectedAncestors += 1;
        } 
        if (selectedAncestors >= 2) {
          return;
        }
      };

      if (selectedAncestors === 0 ) {
        // is selected node and no ancestor is selected
        selectedNodeIds[selectedNode] = true;
      } else if (selectedAncestors === 1) {
        // is selected node and 1 ancestor is selected
        excludedNodeIds[selectedNode] = true;
      }

  });

  return {selectedNodeIds, excludedNodeIds};
}

// dado un node si el descendiente esta seleccionado


export const TreeSelectProvider = ({ children, roots, getNodeId, onChange, getNodeLabel }) => {
  const [selectedNodes, setSelectedNodes] = useState({});
  const nodeToAncestors =  useMemo(() => {
    return getAncestors(roots, getNodeId);
  }, [roots]);

  const nodeToDescendants = useMemo(() => {
    return getDescendants(nodeToAncestors);
  }, [roots]);


  useEffect(() => {
    if (onChange) {
      onChange(getProcessedState(selectedNodes, nodeToAncestors));
    }
  }, [selectedNodes]);


  const addSelectedNode = node => {
    setSelectedNodes(prev => {
      const nodeId = getNodeId(node);
      if (!prev[nodeId]) {
        const newSelected = {...prev, [nodeId]: true };
        Object.keys(newSelected).forEach(elementId => {
          if (nodeId in nodeToAncestors[elementId]) {
            // nodeId is ancestor of elementId, remove elementId!
            delete newSelected[elementId];
          }
        });
        return newSelected;
      } 
      return prev;
    });
  };

  const removeSelectedNode = node => {
    const nodeId = getNodeId(node);
    setSelectedNodes(prev => {
      if (prev[nodeId]) {
        const newSelected = { ...selectedNodes } 
        delete newSelected[nodeId];
        Object.keys(newSelected).forEach(elementId => {
          if (nodeId in nodeToAncestors[elementId]) {
            // nodeId is ancestor of elementId, remove elementId!
            delete newSelected[elementId];
          }
        });
        return newSelected;
      } 
      return prev;
    });
  };

  const isSelected = node => {
    if (selectedNodes[getNodeId(node)]) {
      return true;
    }
    return false;
  };

  const isDescendantSelected = node => {
    const descendantsFromNode = nodeToDescendants[getNodeId(node)];
    if (!descendantsFromNode) {
      return false;
    }
    // for (const descendant in descendantsFromNode) {
    //   if (selectedNodes[descendant]) {
    //     return true;
    //   }
    // };
    for (const selectedId in selectedNodes) {
      if (descendantsFromNode[selectedId]) {
        return true;
      }
    };
    return false;
  }

  const context = {
    selectedNodes,
    addSelectedNode,
    removeSelectedNode,
    isSelected,
    getNodeLabel,
    isDescendantSelected,
  };

  return <TreeSelectContext.Provider value={context}>{children}</TreeSelectContext.Provider>;
};
