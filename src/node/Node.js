import React from 'react'
import PropTypes from 'prop-types';
import './node.css';

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeType: '',
      nodePos: props.nodePos
    }
  }
  convertNode = (e) => {
    let currentClass = e.target.className;
    let w = ' wall';
    let init = 'init-point';
    let end = 'end-point';
    let specialNode = currentClass.search(init) !== -1 && currentClass.search(end) !== -1;
    if (!specialNode){
      let nodeType = currentClass.search(w) === -1 ? w : ''; 
      this.setState({nodeType: nodeType});
    }
    if (specialNode) {

    }
  }
  render() {
    const {nodePos, nodeType} = this.state;
    return (
      <div className={'node ' + nodePos + nodeType}></div>
    )
  }
}

Node.propTypes = {
  nodePos: PropTypes.string.isRequired,
  toggle: PropTypes.func,
  wall: PropTypes.string
}

export default Node;