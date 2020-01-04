import React from 'react'
import Node from '../node/Node';
import './pathfinding.css';
import { withWindowSize } from 'react-fns';

class Pathfinding extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      nodeWidth: 30,
      nodeHeight: 30,
    }
    this.isDrawing = false;
    this.mouseEvents = {
      down: 'mousedown',
      up: 'mouseup',
      move: 'mousemove',
      leave: 'mouseleave'
    }
    this.NodesRef = {}
    this.RefMatrix = null;
    // this.setNodeReference = (element) => {
    //   console.log(element)
    //   this.NodesRef[`${element.props.nodePos}`] = element.props.nodePos;
    // }
  }
  toggleNode = () => {
    console.log(this)
  }

  initNodeMatrix = (cols, rows) => {
    let matrix = new Array(rows);
    this.RefMatrix = new Array(rows); 
    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(cols);
      this.RefMatrix[i] = new Array(cols);
      for (let j = 0; j < cols; j++){
        if (i === Math.floor(rows/2) && j === Math.floor(cols/5)){
          this.RefMatrix[i][j] = <Node nodePos={"init-point"} key={"node"+i+j}></Node>;
          matrix[i][j] = this.RefMatrix[i][j] ;
        } else {
          this.RefMatrix[i][j] = <Node wall={this.toggleNode} toggle={this.toggleNode} nodePos={"normal-"+i+"-"+j} key={"node"+i+j}></Node>;
          matrix[i][j] = this.RefMatrix[i][j];
        }
      }
      matrix[i] = React.createElement('div', {className: 'row', key: i}, matrix[i]);
    }
    return matrix;
  }
  setNodeMatrix = () => {
    const { nodeWidth, nodeHeight } = this.state;
    let {width, height} = this.props;
    let cols = Math.floor(width*0.96/nodeWidth);
    let rows = Math.floor(height*0.5/nodeHeight);
    let matrix = this.initNodeMatrix(cols, rows);
    return matrix;
  } 
  handleDrawing = (e) => {
    const { down, leave, move, up} = this.mouseEvents;
    let mouseEv = e.type;
    if (mouseEv === down) {
      this.isDrawing = true;
      e.preventDefault();
    } else if (mouseEv === up || mouseEv === leave) {
      this.isDrawing = false;
    } else if (mouseEv === move){
      if (this.isDrawing){
        console.log('inside')
        // console.log(e.target.className)
        let node = e.target.className.split(" ");
        if (node[0] == 'node') {
          let x = node[1].split("-")[1];
          let y = node[1].split("-")[2];
          console.log(this.RefMatrix[x][y]);
        }
      }
    }
  }
  render() {
    console.log("here")
    return ( 
      <div onMouseDown={this.handleDrawing} onMouseMove={this.handleDrawing} onMouseUp={this.handleDrawing} onMouseLeave={this.handleDrawing} className="node-matrix">{this.setNodeMatrix()}</div>
    )
  }
}

export default withWindowSize(Pathfinding);