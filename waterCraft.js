class WaterCraft extends WemoObject{
  constructor(img, x, y, type){
    super()
    this.x = x
    this.y = y
    this.type = type
    this.img = img
    this.index = 4
    this.landed = false
    this.stepCount = 0
  }

  display() {
    let x, y, id
    if ([0,1,4].includes(this.index)){
      x = this.type === "canoe" ? (this.x-1)*25 : this.x*25-5
      y = this.type === "canoe" ? this.y*25+topbarHeight : this.y*25+topbarHeight+3
      id = 0
    }
    else {
      x = this.x*25
      y = this.type === "canoe" ? (this.y-1)*25+topbarHeight : this.y*25+topbarHeight-5
      id = 1
    }
    image(this.img[id], x, y)
  }

  move(x, y) {
    if (this.x + x >= 0 && this.x + x < board.cols &&
      this.y + y >= 0 && this.y + y < board.rows) {
      if (["water", "river", "steppingStones"].includes(board.cells[this.x+x][this.y+y].type) ||
          (board.cells[this.x+x][this.y+y].type === "beach" &&
           ["water", "river"].includes(board.cells[this.x][this.y].type))
        ) {

        this.x += x
        this.y += y
        this.landed = board.cells[this.x][this.y].type === "beach"
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
        this.stepCount++
        man.energy -= 1.5

        if (this.type === "canoe"){
          for (let i=-1; i<=1; i++){
            for (let j = -1; j <= 1; j++){
              let a = this.x+i
              let b = this.y+j

              if (a >= 0 && a < board.cols && b >= 0 && b < board.rows){
                man.revealCell(a,b)
              }
            }
          }
        }
        else
          man.revealCell(this.x, this.y)
      }
      else
        man.revealCell(this.x+x, this.y+y)
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
