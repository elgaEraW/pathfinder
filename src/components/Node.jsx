import React, { Component } from "react";
import "../css/Node.css";

class Node extends Component {
  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      isVisited,
      isWall,
      isPath,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;
    let className = "node";
    if (isStart) className = "node node-start";
    else if (isFinish) className = "node node-end";
    else if (isVisited) className = "node node-visited";
    else if (isWall) className = "node node-wall";
    if (isPath && !isStart && !isFinish) className = "node node-path";
    return (
      <div
        id={`node-${row}-${col}`}
        className={className}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
      ></div>
    );
  }
}

export default Node;
