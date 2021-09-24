let helpers = {
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

  isNextToTile(x, y, tile){ //accepts a string or array as type
    for (let i = -1; i <= 1; i++){
      for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
        let a = x+i, b = y+j;
        if (this.withinBounds(a,b)){
          if (tile.includes(board.cells[a][b].tile))
            return {x: a, y: b}
        }
      }
    }
    return false
  },

  // isNextToSquare(x1, y1, x2, y2){ //no diagonals      **NOT USED YET
  //   for (let i = -1; i <= 1; i++){
  //     for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
  //       let a = x1+i, b = y1+j;
  //       if (a === x2 && b === y2)
  //         return true
  //     }
  //   }
  //   return false
  // },

  isNearSquare(x1, y1, x2, y2){ //with diagonals
    return (abs(x1-x2) < 2) && (abs(y1-y2) < 2)
  },

  nearbyType(x,y, type){ //returns the cell data if found, otherwise false
    for (let i = x-1; i <= x+1; i++){
      for (let j = y-1; j <= y+1; j++){
        if (this.withinBounds(i,j)){
          if (board.cells[i][j].type === type)
            return Object.assign({x: i, y: j}, board.cells[i][j])
        }
      }
    }
    return false
  },

  smoothChange(curX, toX){
    let div = 5
    let diff = toX-curX
    return diff >= 75 ? curX+Math.floor(diff/div)-5 : diff <= -75 ? curX+Math.floor(diff/div)+5 :
               diff >= 10 ? curX+10 : diff <= -10 ? curX-10 : toX
  },

  withinBounds(x,y){
    return x >= 0 && x < board.cols && y >= 0 && y < board.rows
  },

  looker(id,y){
    if (id === "active")
      return board.cells[active.x][active.y]
    if (id === "man")
      return board.cells[man.x][man.y]
    if (id === "mouse")
      return board.cells[floor(mouseX/25)][floor((mouseY-topbarHeight)/25)]
    else if (y)
      return board.cells[id][y]
  },

  randomPicker(type){//string or array
    let count = 0
    while (count < 100){
      let x = floor(random(0, board.cols))
      let y = floor(random(0, board.rows))
      if (type.includes(board.cells[x][y].type)){
        return {x: x, y: y, cell: board.cells[x][y], count: count}
      }
      count++
    }
    return false
  },

  countTypes(b){//count num of each type of cell in the board
    let output = {}
    for (let i = 0; i <b.cells.length; i++) {
      for (let j = 0; j< b.cells[i].length; j++){
        let type = b.cells[i][j].type
        output[type] = output[type] || 0
        output[type]++
      }
    }
    return output
  },

  sortedTypes(){
    let t = this.countTypes(board)
    let output = []
    for (k in t){
      output.push({type: k, num: t[k]})
    }
    return output.sort((a,b) => a.num-b.num)
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
  },

  skip(hours){
    board.wemoMins += (hours*60)
    timer.resume()
  },

  cheat(){
    let cell = this.nearbyType(active.x, active.y, "construction")
    if (cell){
      let item = cell.construction
      if (item.type === "raft"){
        vehicles.addRaft(cell.x, cell.y)
        cell = board.cells[cell.x][cell.y]
        cell.type = cell.tile.replace(/\d+$/, "")
      }
      else if (item.type === "steppingStones"){
        cell = board.cells[cell.x][cell.y]
        cell.type = "steppingStones"
      }
      else if (item.type === "campsite"){
        let site = {type: "campsite", x: cell.x, y: cell.y, items: [], fireValue: 0}
        let id = board.buildings.length
        board.buildings.push(site)
        for (let i = cell.x; i <= cell.x+1; i++){
          for (let j = cell.y; j <= cell.y+1; j++){
            board.cells[i][j].type = "campsite"
            board.cells[i][j].id = id
          }
        }
        for (var k = options.build.length - 1; k >= 0; k--) {
          if (["bow", "arrows", "claypot"].includes(options.build[k].name)){
            options.build[k].active = true
          }
        }
      }
      delete cell.construction
    }
  }
}
