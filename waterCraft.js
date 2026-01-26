class WaterCraft {
  constructor(obj){
    this.x = obj.x
    this.y = obj.y
    this.type = obj.type
    this.index = 3
    this.landed = obj.landed
  }

  export(){
    return {x: this.x, y: this.y, type: this.type, landed: this.landed}
  }

  display() {
    let x, y, id
    if ([0,1].includes(this.index)){
      x = this.type === "canoe" ? (this.x-1)*25 : this.x*25-5
      y = this.type === "canoe" ? this.y*25+topbarHeight : this.y*25+topbarHeight+3
      id = 0
    }
    else {
      x = this.x*25
      y = this.type === "canoe" ? (this.y-1)*25+topbarHeight : this.y*25+topbarHeight-5
      id = 1
    }
    image(tiles[this.type][id], x, y)
  }

  move(x, y) {
    if (helpers.withinBounds(this.x+x, this.y+y)) {
      let cell = board.cells[this.x][this.y]
      let newCell = board.cells[this.x+x][this.y+y]
      
      if (["water", "river", "steppingStones"].includes(newCell.type) ||
          ["grassBeach", "beach", "star"].includes(newCell.type) &&
           ["water", "river"].includes(cell.type)
        ) {

        this.landed = ["grassBeach", "beach"].includes(newCell.type)
        this.x += x
        this.y += y
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
        man.energy -= 2
        if (newCell.type === "star")
          board.claimStar(this.x, this.y, newCell)
      }
    }
  }

  isBeside(type){
    if ([0,1].includes(this.index)){
      for (let x=0, y= -1; y<2; y+=2){
        let i = this.x+x, j = this.y+y;
        if (i >= 0 && i < board.cols && j >= 0 && j < board.rows){
          if (board.cells[i][j].type === type)
            return true
        }
      }
    }
    else {
      for (let x= -1, y=0; x<2; x+=2){
        let i = this.x+x, j = this.y+y;
        if (i >= 0 && i < board.cols && j >= 0 && j < board.rows){
          if (board.cells[i][j].type === type)
            return true
        }
      }
    }
    return false
  }
}
