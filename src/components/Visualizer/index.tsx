import React from 'react';
import Node from '../Node';
import iNode from '../../types/Node'
import { dijkstra, getNodesInShortestPathOrder } from '../../algorithms/dijkstra';
import './index.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

type MyState = {
   grid: iNode[][];
   mouseIsPressed: boolean;
}

export default class Visualizer extends React.Component<{}, MyState> {
   state: MyState = {
      grid: [[]],
      mouseIsPressed: false,
   };

   componentDidMount() {
      const grid = getInitialGrid();
      this.setState({ grid });
   }

   handleMouseDown(row: number, col: number) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
   }

   handleMouseEnter(row: number, col: number) {
      if (!this.state.mouseIsPressed) return;
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid });
   }

   handleMouseUp() {
      this.setState({ mouseIsPressed: false });
   }

   animateDijkstra(visitedNodesInOrder: iNode[], nodesInShortestPathOrder: iNode[]) {
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
         if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
               this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
         }
         setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`)!.className =
               'node node-visited';
         }, 10 * i);
      }
   }

   animateShortestPath(nodesInShortestPathOrder: iNode[]) {
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
         setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`)!.className =
               'node node-shortest-path';
         }, 50 * i);
      }
   }

   visualizeDijkstra() {
      const { grid } = this.state;
      const startNode = grid[START_NODE_ROW][START_NODE_COL];
      const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
      const visitedNodesInOrder = dijkstra(grid, startNode, finishNode)!;
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
   }

   render() {
      const { grid, mouseIsPressed } = this.state;

      return (
         <>
            <button onClick={() => this.visualizeDijkstra()}>
               Visualize Dijkstra's Algorithm
            </button>
            <div className="grid">
               {grid.map((row, rowIdx) => {
                  return (
                     <div key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                           const { row, col, isFinish, isStart, isWall } = node;
                           return (
                              <Node
                                 key={nodeIdx}
                                 col={col}
                                 isFinish={isFinish}
                                 isStart={isStart}
                                 isWall={isWall}
                                 mouseIsPressed={mouseIsPressed}
                                 onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                 onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                 onMouseUp={() => this.handleMouseUp()}
                                 row={row}
                              />
                           );
                        })}
                     </div>
                  );
               })}
            </div>
         </>
      );
   }
}

const getInitialGrid = () => {
   const grid = [];
   const nRows = 20, nCols = 50;

   for (let row = 0; row < nRows; row++) {
      const currentRow = [];
      for (let col = 0; col < nCols; col++) {
         currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
   }

   return grid;
};

const createNode = (col: number, row: number) => {
   return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
   };
};

const getNewGridWithWallToggled = (grid: MyState["grid"], row: number, col: number) => {
   const newGrid = grid.slice();
   const node = newGrid[row][col];
   const newNode = {
      ...node,
      isWall: !node.isWall,
   };
   newGrid[row][col] = newNode;
   return newGrid;
};