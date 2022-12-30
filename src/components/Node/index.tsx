import React from 'react';
import type INode from '../../types/Node';
import './index.css';

interface Props extends INode {
   mouseIsPressed: boolean,
   onMouseEnter: (row: number, col: number) => void,
   onMouseUp: () => void,
   onMouseDown: (row: number, col: number) => void,
}

export default class Node extends React.Component<Props, {}> {
   render() {
      const {
         col,
         row,
         isFinish,
         isStart,
         isWall,
         onMouseEnter,
         onMouseUp,
         onMouseDown,
      } = this.props;
      const extraClassName = isFinish
         ? 'node-finish'
         : isStart
            ? 'node-start'
            : isWall
               ? 'node-wall'
               : '';

      return (
         <div
            id={`node-${row}-${col}`}
            className={`node ${extraClassName}`}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}
            onMouseDown={() => onMouseDown(row, col)}
         ></div>
      );
   }
}

