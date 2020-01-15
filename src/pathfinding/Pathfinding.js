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
    const visitedNodes = []
    const grid = this.getAllNodes(matrix);
    let unvisitedNodes = grid.slice();
    while(!!unvisitedNodes.length) {
      this.sortNodes(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();
      if (closestNode.wall) continue;
      if (closestNode.dist === Infinity) return visitedNodes;
      // if (closestNode.nodePos === endNode.props.nodePos) return visitedNodes;
      if (closestNode.nodePos === endNode.props.nodePos) break;
      this.visitNode(closestNode)
      visitedNodes.push(closestNode);
      unvisitedNodes = this.updateUnvisitedNodes(closestNode, matrix, unvisitedNodes);
    }
  }

  updateUnvisitedNodes = (node, matrix, unvisitedNodes) => {
    const unvisitedNeighbors = this.getNeighborsNodes(node, matrix);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.dist = node.dist + 1;
      neighbor.parent = node;
    }
    return unvisitedNodes = unvisitedNodes.map(node => unvisitedNeighbors.find(un => un.nodePos === node.nodePos) || node);
  }
  getNeighborsNodes = (node, matrix) => {
    const neighbors = [];
    const i = parseInt(node.nodePos.split(" ")[0]);
    const j = parseInt(node.nodePos.split(" ")[1]);
    if (i > 0 && j < matrix[i-1].length) {
      neighbors.push(Object.assign({}, matrix[i-1][j].props))
    };
    if (i < matrix.length-1 && j < matrix[i+1].length) {
      neighbors.push(Object.assign({}, matrix[i+1][j].props));  
    }
    if (j > 0) {
      neighbors.push(Object.assign({}, matrix[i][j-1].props));
    }
    if (j < matrix[i].length-1) {
      neighbors.push(Object.assign({}, matrix[i][j+1].props));
    }
    return neighbors.filter(neighbor => !neighbor.visited)
  }

  visitNode = (node) => {
    if (!!node.specialNode) return;
    const [i, j] = node.nodePos.split(" ");
    let matrix = this.state.matrix;
    let updatedNode = this.createNode(node.nodePos, parseInt(i), parseInt(j), true, false);
    matrix[i][j] = updatedNode;
    this.setState(matrix)
  }
  sortNodes = (unvisitedNodes) => {
    unvisitedNodes.sort((node_a, node_b) => {return node_a.dist-node_b.dist})
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
  createNode = (nodePos, i, j, visited, isWall, parent, specialNode) => {
    if (!!specialNode)
      return <Node specialNode={specialNode} visited={visited} nodePos={nodePos} dist={specialNode===' init-point' ? 0 : Infinity} zInd={i+j} key={`node${i}${j}`} wall={isWall}></Node>;
    return <Node nodePos={nodePos} dist={Infinity} visited={visited} parent={parent} zInd={i+j} key={`node${i}${j}`} wall={isWall}></Node>;
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
          matrix[i][j] =  this.createNode(`${i} ${j}`, i, j, false, false, null, ' init-point');
          sourceNode = matrix[i][j];
        }
        else if (endPoint){
          matrix[i][j] = this.createNode(`${i} ${j}`, i, j, false, false, null, ' end-point');
          endNode = matrix[i][j];
        }
        else
          matrix[i][j] = this.createNode(`${i} ${j}`, i, j, false, false, null);
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
