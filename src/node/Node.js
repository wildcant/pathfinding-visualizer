import React from 'react'
import './node.css';

const Node = (props) => {
  const { nodePos, zInd, visited, specialNode, wall } = props;
  if (visited)
    return (<div className={'node ' + nodePos + ' visited'} style={{zIndex: zInd*-1}}></div>)
  if (typeof specialNode !== 'undefined')
    return (<div className={'node ' + nodePos + specialNode} style={{zIndex: zInd*-1}}></div>)
  if (wall){
    return (<div className={'node ' + nodePos + ' wall'} style={{zIndex: zInd*-1}}></div>)
  }
  return (<div className={'node ' + nodePos} style={{zIndex: zInd*-1}}></div>)
}


export default Node;
