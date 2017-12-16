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

  isNextToSquare(x1, y1, x2, y2){ //no diagonals      NOT USED YET
    for (let i = -1; i <= 1; i++){
      for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
        let a = x1+i, b = y1+j;
        if (a === x2 && b === y2)
          return true
      }
    }
    return false
  },

  isNearSquare(x1, y1, x2, y2){ //with diagonals
    for (let x = x1-1; x <= x1+1; x++){
      for (let y = y1-1; y <= y1+1; y++){
        if (x === x2 && y === y2)
          return true
      }
    }
    return false
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
    let diff = toX-curX
    return diff >= 90 ? curX+Math.floor(diff/6)-5 : diff <= -90 ? curX+Math.floor(diff/6)+5 :
               diff >= 10 ? curX+10 : diff <= -10 ? curX-10 : toX
  },

  withinBounds(x,y){
    return x >= 0 && x < board.cols && y >= 0 && y < board.rows
  },

  looker(id){
    if (id === "active")
      return board.cells[active.x][active.y]
    if (id === "man")
      return board.cells[man.x][man.y]
    if (id === "mouse")
      return board.cells[floor(mouseX/25)][floor((mouseY-topbarHeight)/25)]

  },

  randomPicker(type){
    let count = 0
    while (count < 80){
      let x = floor(random(0, board.cols))
      let y = floor(random(0, board.rows))
      if (board.cells[x][y].type === type){
        return {x: x, y: y, cell: board.cells[x][y], count: count}
      }
      count++
    }
    return count
  }
}

class WemoObject {
  import(obj) {
    for (let key in obj){
      this[key] = obj[key]
    }
  }

  export(){
    let output = {}
    let items = Object.keys(this)
    for (let i = 0; i < items.length; i++){
      if (typeof this[items[i]] !== "function" && !["img", "bombs"].includes(items[i]))
        output[items[i]] = this[items[i]]
    }
    return output
  }
}