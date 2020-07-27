import React, { Component } from "react";
import Node from "./Node";
import "../css/PathVisualizer.css";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithm/dijkstra";

const MAX_ROW = 20;
const MAX_COL = 50;
const START_NODE_ROW = Math.floor(Math.random() * MAX_ROW);
const START_NODE_COL = Math.floor((Math.random() * MAX_COL) / 2);
const END_NODE_ROW = Math.floor(Math.random() * MAX_ROW);
const END_NODE_COL = Math.floor((Math.random() * MAX_COL) / 2 + MAX_COL / 2);
const TIMEOUT = 5;

class PathFinderVisualizer extends Component {
  constructor() {
    super();

    this.state = {
      grid: [],
      isMousePressed: false,
    };
  }

  generateGrid = () => {
    const nodes = [];

    for (let row = 0; row < MAX_ROW; row++) {
      const currentRow = [];
      for (let col = 0; col < MAX_COL; col++) {
        let node = this.createNode(row, col);
        if (
          node.isStart &&
          document.getElementById(`node-${node.row}-${node.col}`)
        )
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-start";
        else if (
          node.isFinish &&
          document.getElementById(`node-${node.row}-${node.col}`)
        )
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-end";
        else if (document.getElementById(`node-${node.row}-${node.col}`))
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        currentRow.push(node);
      }
      nodes.push(currentRow);
    }

    return nodes;
  };

  createNode = (row, col) => {
    let currentNode = {
      row,
      col,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === END_NODE_ROW && col === END_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      isPath: false,
    };
    return currentNode;
  };

  componentDidMount() {
    const grid = this.generateGrid();
    this.setState({
      grid,
    });
  }

  animate = (visitedNodesInOrder) => {
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isFinish)
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
      }, TIMEOUT * i);
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          this.drawShortestPath(this.state.grid[END_NODE_ROW][END_NODE_COL]);
        }, TIMEOUT * i);
      }
    }
  };

  drawShortestPath = (node) => {
    const path = getNodesInShortestPathOrder(node);
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const node = path[i];
        if (!node.isStart && !node.isFinish)
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-path";
      }, TIMEOUT * i);
    }
  };

  visualizeDijkstra = () => {
    const grid = this.state.grid;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[END_NODE_ROW][END_NODE_COL];

    const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    this.animate(visitedNodesInOrder);
  };

  handleMouseDown = (row, col) => {
    if (
      !(
        (row === START_NODE_ROW && col === START_NODE_COL) ||
        (row === END_NODE_ROW && col === END_NODE_COL)
      )
    ) {
      const newGrid = this.getNewGridWithWalls(this.state.grid, row, col);
      this.setState({
        grid: newGrid,
        isMousePressed: true,
      });
    }
  };

  handleMouseEnter = (row, col) => {
    if (
      this.state.isMousePressed &&
      !(
        (row === START_NODE_ROW && col === START_NODE_COL) ||
        (row === END_NODE_ROW && col === END_NODE_COL)
      )
    ) {
      const newGrid = this.getNewGridWithWalls(this.state.grid, row, col);
      this.setState({
        grid: newGrid,
      });
    }
  };

  handleMouseUp = () => {
    this.setState({
      isMousePressed: false,
    });
  };

  getNewGridWithWalls = (grid, row, col) => {
    const newGrid = grid.slice();
    newGrid[row][col].isWall = !grid[row][col].isWall;
    return newGrid;
  };

  reset = () => {
    this.setState({
      grid: this.generateGrid(),
    });
  };

  render() {
    return (
      <>
        <button onClick={this.visualizeDijkstra} className="start-button">
          Visualize
        </button>
        <button onClick={this.reset} className="reset-button">
          Reset
        </button>
        <div className="grid">
          {this.state.grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  return (
                    <Node
                      key={nodeIdx}
                      row={node.row}
                      col={node.col}
                      isStart={node.isStart}
                      isFinish={node.isFinish}
                      isVisited={node.isVisited}
                      isWall={node.isWall}
                      isPath={node.isPath}
                      onMouseDown={() =>
                        this.handleMouseDown(node.row, node.col)
                      }
                      onMouseEnter={() =>
                        this.handleMouseEnter(node.row, node.col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
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

export default PathFinderVisualizer;
