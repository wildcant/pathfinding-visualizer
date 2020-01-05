import React from 'react';
import Node from '../node/Node';
import { withWindowSize } from 'react-fns';
import './pathfinding.css';
  
class Pathfinding extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      matrix: []
    }
    this.nodeAtrr = {
      nodeWidth: 60,
      nodeHeight: 60,
    }
    this.orientation = 'start';
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
    let delta = 1/(rows/2);
    let x = 0;
    for (let i = 0; i < rows*2; i++) {
      matrix[i] = new Array(cols);
      if (i < Math.floor(rows*2/4)) {
        this.orientation = 'start';
        x +=delta;
      } else if (i > Math.floor(rows*3/4)) {
        this.orientation = 'end';
        x-=delta;
      } else {
        x = 0.98;
      }
      console.log(Math.floor(cols*x));
      for (let j = 0; j < Math.floor(cols*x); j++){
        let initPoint = i === Math.floor(rows/2) && j === Math.floor(cols*0.1);
        let endPoint =  i === Math.floor(rows/2) && j === Math.floor(cols*0.8);
        if (initPoint){
          matrix[i][j] =  <Node nodePos={"init-point"} zInd={i+j} key={`node${i}${j}`}></Node>
        } else if (endPoint){
          console.log("endpoint")
          matrix[i][j] = <Node nodePos={'end-point'} zInd={i+j} key={`node${i}${j}`}></Node>;
        } else {
          matrix[i][j] = <Node nodePos={`normal${i}${j}`} zInd={i+j} key={`node${i}${j}`}></Node>;
        }
      }
      matrix[i] = React.createElement('div', {className: 'row '+ this.orientation, key: i}, matrix[i]);
    }
    return matrix;
  }
  setNodeMatrix = () => {
    const { nodeWidth, nodeHeight } = this.nodeAtrr;
    let {width, height} = this.props;
    let cols = Math.floor(width/nodeWidth);
    let rows = Math.floor(height/nodeHeight);
    console.log(cols, rows);
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
        className="matrix">
          {this.setNodeMatrix()}
      </div>
    )
  }
}
export default withWindowSize(Pathfinding);
