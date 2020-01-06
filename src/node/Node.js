import React from 'react'
import PropTypes from 'prop-types';
import './node.css';

const Node = (props) => {
  const { nodePos, zInd, visited } = props;
  if (visited)
    return (<div className={'node ' + nodePos + ' visited'} style={{zIndex: zInd*-1}}></div>)
  return (<div className={'node ' + nodePos} style={{zIndex: zInd*-1}}></div>)
}


Node.propTypes = {
  nodePos: PropTypes.string.isRequired
}

export default Node;
