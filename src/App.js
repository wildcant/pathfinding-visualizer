import React from 'react';
import Pathfinding from './pathfinding/Pathfinding';
import './App.css';

function App() {
  return (
    <main>
      <h1>Path finding visualizer</h1>
      <Pathfinding className="dinamic-matrix"></Pathfinding>
    </main>
  );
}

export default App;
