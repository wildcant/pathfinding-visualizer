import React from 'react'
import Node from '../node/Node';
import './pathfinding.css';
import { withWindowSize } from 'react-fns';

class Pathfinding extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      matrix: []
    }
    this.nodeAtrr = {
      nodeWidth: 30,
      nodeHeight: 30,
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
      if (isWall) {
      currentNode.classList.remove("wall");
      } else {
        currentNode.classList.add("wall");
      }
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
  initNodeMatrix = (cols, rows) => {
    let matrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(cols);
      for (let j = 0; j < cols; j++){
        let initPoint = i === Math.floor(rows/5) && j === Math.floor(cols/2);
        let endPoint = false;
        if (initPoint){
          matrix[i][j] =  <Node nodePos={"init-point"} key={`node${i}${j}`}></Node>
        } else if (endPoint){
          matrix[i][j] = <Node nodePos={'end-point'} key={`node${i}${j}`}></Node>;
        } else {
          matrix[i][j] = <Node nodePos={`normal${i}${j}`} key={`node${i}${j}`}></Node>;
        }
      }
      matrix[i] = React.createElement('div', {className: 'row', key: i}, matrix[i]);
    }
    return matrix;
  }
  setNodeMatrix = () => {
    const { nodeWidth, nodeHeight } = this.nodeAtrr;
    let {width, height} = this.props;
    let cols = Math.floor(width/nodeWidth);
    let rows = Math.floor(height*0.6/nodeHeight);
    let matrix = this.initNodeMatrix(cols, rows);
    return matrix;
  }
  render() {
    return ( 
      <div 
        onMouseDown={this.handleDrawing}
        onMouseMove={this.handleDrawing} 
        onMouseUp={this.handleDrawing} 
        onMouseLeave={this.handleDrawing} 
        className="node-matrix">
          {this.setNodeMatrix()}
      </div>
    )
  }
}

export default withWindowSize(Pathfinding);