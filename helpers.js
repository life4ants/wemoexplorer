let helpers = {
  ringList: [
    [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}],
    [{x:-1,y:-1},{x:1,y:-1},{x:1,y:1},{x:-1,y:-1}],
    [{x:-2,y:1},{x:-2,y:0},{x:-2,y:-1},{x:-1,y:-2},{x:0,y:-2},{x:1,y:-2},
      {x:2,y:-1},{x:2,y:0},{x:2,y:1},{x:1,y:2},{x:0,y:2},{x:-1,y:2}]
    ],

  isNextToType(x, y, type){ //accepts a string or array as type
    for (let i = -1; i <= 1; i++){
      for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
        let a = x+i, b = y+j;
        if (this.withinBounds(a,b)){
          if (type.includes(board.cells[a][b].type))
            return true
        }
      }
    }
    return false
  },

  isNearSquare(x1, y1, x2, y2){ //with diagonals
    return (abs(x1-x2) < 2) && (abs(y1-y2) < 2)
  },

  nearbyType(x,y, type){ //returns the cell coordiants if found, otherwise false
    for (let i = x-1; i <= x+1; i++){
      for (let j = y-1; j <= y+1; j++){
        if (this.withinBounds(i,j)){
          if (board.cells[i][j].type === type)
            return {x: i, y: j}
        }
      }
    }
    return false
  },

  smoothChange(curX, toX){
    let base = 75
    let div = base/15
    let diff = toX-curX
    return diff >= base ? curX+Math.floor(diff/div)-5 : diff <= -base ? curX+Math.floor(diff/div)+5 :
               diff >= 10 ? curX+10 : diff <= -10 ? curX-10 : toX
  },

  withinBounds(x,y){
    return x >= 0 && x < board.cols && y >= 0 && y < board.rows
  },

  canWalk(x,y){
    if (tutorial.active && board.level === 0){
      return x >= 0 && x < tutorial.xbound && y >= 0 && y < tutorial.ybound
    }
    return x >= 0 && x < board.cols && y >= 0 && y < board.rows
  },

  getAllTypes(b){//count num of each type of cell in a board
    let output = {}
    for (let i = 0; i <b.cells.length; i++) {
      for (let j = 0; j< b.cells[i].length; j++){
        let type = b.cells[i][j].type
        output[type] = output[type] || []
        output[type].push({x:i,y:j})
      }
    }
    return output
  },

  getCellsByType(type){//get all cells of a type in the current board
    let output = []
    for (let i = 0; i <board.cells.length; i++) {
      for (let j = 0; j< board.cells[i].length; j++){
        if (board.cells[i][j].type === type){
          output.push(Object.assign(board.cells[i][j], {x: i, y: j}))
        }
      }
    }
    return output
  },

  removeDir(d, dirs){//given a current direction and a list of directions, remove the opposite of the current direction
    let nd = d > 1 ? (!(d-2))+2 : (!d)+0
    let t = dirs.findIndex(e => e === nd)
    if (t !== -1)
      dirs.splice(t,1)
    return dirs
  },

  walkableDirs(x,y){
    let pdirs = [
      [1,0],//right
      [-1,0],//left
      [0,-1],//up
      [0,1]//down
    ]
    let output = []
    for (let i = 0; i < pdirs.length; i++){
      let a = x+pdirs[i][0], b = y+pdirs[i][1]
      if (this.withinBounds(a,b) && !nonWalkable.includes(board.cells[a][b].type))
        output.push(i)
    }
    return output
  }
}
