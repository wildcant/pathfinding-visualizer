import React from 'react';
import Node from '../node/Node';
import './pathfinding.css';
  
class Pathfinding extends React.Component {
  constructor(props){
    super(props);
    this.matrix= [];
    this.state = {
      matrix: null
    }
    this.nodeSize = {
      nodeWidth: 80,
      nodeHeight: 80
    }
    this.isDrawing = false;
    this.previousNode = null;
    this.mouseEvents = {
      down: 'mousedown',
      up: 'mouseup',
      move: 'mousemove',
      leave: 'mouseleave'
    }
  }
  setWall = (currentNode) => {
    let isNormal = currentNode.className.search('normal')  !== -1;
    if (this.isDrawing && isNormal && currentNode !== this.previousNode){
      let isWall = currentNode.className.search('wall') !== -1;
      if (isWall)
        currentNode.classList.remove("wall")
      else
        currentNode.classList.add("wall")
      this.previousNode = currentNode
    }
  }
  handleDrawing = (e) => {
    const { down, leave, move, up} = this.mouseEvents;
    let mouseEv = e.type;
    let currentNode = e.target;
    if (mouseEv === down) {
      e.preventDefault();
      this.isDrawing = true;
      this.setWall(currentNode);
    } else if (mouseEv === up || mouseEv === leave) {
      this.isDrawing = false;
      this.previousNode = null;
    } else if (mouseEv === move){
      this.setWall(currentNode);
    }
  }
  createNode = (nodePos, i, j) => {
    return <Node nodePos={nodePos} zInd={i+j} key={`node${i}${j}`}></Node>;
  }

  initNodeMatrix = (cols, rows) => {
    let matrix = new Array(rows);
    let delta = 1/(rows/2);
    let x = 0;
    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(cols);
      if (i < Math.floor(rows*3/5)) {x +=delta} 
      else if (i > Math.floor(rows*3/5)) {x-=delta} 
      else {x = 1}
      for (let j = 0; j < Math.ceil(cols*x); j++){
        let initPoint = i === Math.floor(rows/2) && j === Math.floor(cols*0.1);
        let endPoint =  i === Math.floor(rows/2) && j === Math.floor(cols*0.9);
        if (initPoint)
          matrix[i][j] =  this.createNode('init-point', i, j);
        else if (endPoint)
          matrix[i][j] = this.createNode('end-point', i, j);
        else
          matrix[i][j] = this.createNode(`normal${i}${j}`, i, j);
      }
    }
    return matrix;
  }
  
  setNodeMatrix = (height, width) => {
    const { nodeWidth, nodeHeight } = this.nodeSize;
    let cols = Math.floor(width/nodeWidth);
    let rows = Math.floor(height/nodeHeight)*2;
    let matrix = this.initNodeMatrix(cols, rows);
    return matrix;
  }

  handleResize = () => {
    const {innerHeight, innerWidth} = window;
    let matrix= this.setNodeMatrix(innerHeight, innerWidth);
    this.setState({matrix: matrix})
  } 
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    const {innerHeight, innerWidth} = window;
    let matrix= this.setNodeMatrix(innerHeight, innerWidth);
    this.setState({matrix: matrix})
  }
  render() {
    return ( 
      <div 
      onMouseDown={this.handleDrawing}
      onMouseMove={this.handleDrawing} 
      onMouseUp={this.handleDrawing} 
      onMouseLeave={this.handleDrawing}
        className="matrix">
          {this.state.matrix === null ? 'Loading' :
          this.state.matrix.map((row, rowId, rows) => {
            if (rowId > rows.length/2)
              return <div className='row end' key={rowId}>{row}</div>
            return <div className='row start' key={rowId}>{row}</div>
          })}
      </div>
    )
  }
}
export default Pathfinding;
