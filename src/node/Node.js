import React from 'react'
import PropTypes from 'prop-types';
import './node.css';

const Node = (props) => {
  const { nodePos, zInd } = props;
  return (<div className={'node ' + nodePos} style={{zIndex: zInd*-1}}></div>)
}


Node.propTypes = {
  nodePos: PropTypes.string.isRequired
}

export default Node;
