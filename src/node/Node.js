import React from 'react'
import PropTypes from 'prop-types';
import './node.css';

const Node = (props) => {
  return (<div className={'node ' + props.nodePos}></div>)
}

Node.propTypes = {
  nodePos: PropTypes.string.isRequired
}

export default Node;
