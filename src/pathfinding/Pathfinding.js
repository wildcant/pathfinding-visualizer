import React from 'react';
import Node from '../node/Node';
import './pathfinding.css';
  
class Pathfinding extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      matrix: [],
      sourceNode: null,
      endNode: null
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

  Dijkstra = ({matrix, sourceNode, endNode}) => {
    let unvisitedNodes = this.getAllNodes(matrix);
    /*
    while(!!unvisitedNodes.length) {
      unvisitedNodes = this.sortNodes(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      if (closestNode.isWall) continue;

    }
    */
  }

  sortNodes = (nodes) => {
    nodes.sort((node_a, node_b) => {return node_a-node_b})
    return nodes;
  }

  getAllNodes = (matrix) => {
    const nodes = [];
    for (const row of matrix) {
      for (const el of row) {
        nodes.push(el.props)
      }
    }
    return nodes;
  }

  getNeighborsNodes = (parentNode, matrix) => {
    const nodePos = parentNode.props.nodePos;
    const [i, j] = nodePos.split(" ");
    if (i < 0 && i > matrix.length && j < 0 && j > matrix[i].length) {
    }
  }

  visitNode = (nodePos, matrix) => {
    const [i, j] = nodePos.split(" ");
    let updatedNode = this.createNode(nodePos, i, j, true, false);
    matrix[i][j] = updatedNode;
    this.setState(matrix)
  }
  setWall = (currentNode) => {
    let isNormal = currentNode.className.search(/[0-9]/)  !== -1;
    if (this.isDrawing && isNormal && currentNode !== this.previousNode){
      let i = parseInt(currentNode.classList[1]);
      let j = parseInt(currentNode.classList[2]);
      if (!j && j!==0)
        j=i;
      if (!!this.state.matrix[i][j]) {
        if (!!this.state.matrix[i][j].props.specialNode) {
          return;
        }
      }
      let isWall = currentNode.className.search('wall') !== -1;
      if (isWall) {
        let matrix = this.state.matrix;
        let updatedNode = this.createNode(`${i} ${j}`, i, j, false, false);
        matrix[i][j] = updatedNode;
        this.setState({matrix})
      } else {
        let matrix = this.state.matrix;
        let updatedNode = this.createNode(`${i} ${j}`, i, j, false, true);
        matrix[i][j] = updatedNode;
        this.setState({matrix})
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
  createNode = (nodePos, i, j, visited, isWall, specialNode) => {
    if (!!specialNode)
      return <Node specialNode={specialNode} nodePos={nodePos} dist={specialNode===' init-point' ? 0 : Infinity} zInd={i+j} key={`node${i}${j}`} wall={isWall}></Node>;
    return <Node nodePos={nodePos} dist={Infinity} visited={visited} parent={null} zInd={i+j} key={`node${i}${j}`} wall={isWall}></Node>;
  }

  initNodeMatrix = (cols, rows) => {
    let matrix = new Array(rows);
    let delta = 1/(rows/2);
    let x = 0;
    let endNode, sourceNode;
    for (let i = 0; i < rows; i++) {
      if (i < Math.floor(rows*3/5))
        x +=delta
      else
        x-=delta 
      let currentColSize = Math.ceil(cols*x);
      matrix[i] = new Array(currentColSize);
      for (let j = 0; j < currentColSize; j++){
        let initPoint = i === Math.floor(rows/2) && j === Math.floor(cols*0.1);
        let endPoint =  i === Math.floor(rows/2) && j === Math.floor(cols*0.9);
        if (initPoint){
          matrix[i][j] =  this.createNode(`${i} ${j}`, i, j, false, false, ' init-point');
          sourceNode = matrix[i][j];
        }
        else if (endPoint){
          matrix[i][j] = this.createNode(`${i} ${j}`, i, j, false, false, ' end-point');
          endNode = matrix[i][j];
        }
        else
          matrix[i][j] = this.createNode(`${i} ${j}`, i, j, false, false);
      }
    }
    return {matrix, sourceNode, endNode};
  }
  
  setNodeMatrix = () => {
    const {innerHeight, innerWidth} = window;
    const { nodeWidth, nodeHeight } = this.nodeSize;
    let cols = Math.floor(innerWidth/nodeWidth);
    let rows = Math.floor(innerHeight/nodeHeight)*2;
    let nodesState = this.initNodeMatrix(cols, rows);
    this.setState(nodesState);
  }

  handleResize = () => {
    this.setNodeMatrix();
  } 
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.setNodeMatrix();
  }
  render() {
    return ( 
      <div>
        {/* <div onClick={() => this.visitNode('0 0')}>Visit node</div> */}
        <div onClick={() => this.Dijkstra(this.state)}>Visit node</div>
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
      </div>
    )
  }
}
export default Pathfinding;
