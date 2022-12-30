interface Node {
   row: number,
   col: number,
   isFinish: boolean,
   isStart: boolean,
   isWall: boolean,
   distance?: number,
   isVisited?: boolean,
   previousNode?: Node | null
}

export default Node;

