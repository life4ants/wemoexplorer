function Canoe(imgs, x, y) {
  this.x = x
  this.y = y
  this.imgs = imgs
  this.index = 0
  this.landed = false
  this.stepCount = 0

  this.display = function() {
    let x = [0,1,4].includes(this.index) ? (this.x-1)*25 : this.x*25
    let y = [0,1,4].includes(this.index) ? this.y*25+topbarHeight : (this.y-1)*25+topbarHeight

    image(this.imgs[this.index], x, y)

  }

  this.move = function(x, y) {
    if (this.x + x >= 0 && this.x + x < cols &&
      this.y + y >= 0 && this.y + y < rows) {
      if (["water", "river"].includes(board.cells[this.x+x][this.y+y].type) ||
          (board.cells[this.x+x][this.y+y].type === "beach" &&
           board.cells[this.x][this.y].type === "water")
        ) {

        this.x += x
        this.y += y
        this.landed = board.cells[this.x][this.y].type === "beach"
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
        this.stepCount++
        man.energy -= 2

        for (let i=-1; i<=1; i++){
          for (let j = -1; j <= 1; j++){
            let a = this.x+i
            let b = this.y+j

            if (a >= 0 && a < cols && b >= 0 && b < rows && !board.cells[a][b].revealed)
              board.cells[a][b].revealed = true
          }
        }
      }
    }
  }

  this.isBeside = function(type){
    if ([0,1].includes(this.index)){
      for (let x=0, y= -1; y<2; y+=2){
        let i = this.x+x, j = this.y+y;
        if (i >= 0 && i < cols && j >= 0 && j < rows){
          if (board.cells[i][j].type === type)
            return true
        }
      }
    }
    else {
      for (let x= -1, y=0; x<2; x+=2){
        let i = this.x+x, j = this.y+y;
        if (i >= 0 && i < cols && j >= 0 && j < rows){
          if (board.cells[i][j].type === type)
            return true
        }
      }
    }
    return false
  }
}