function Canoe(imgs, x, y) {
  this.x = x
  this.y = y
  this.imgs = imgs
  this.index = 0
  this.landed = false

  this.display = function() {
    let x = [0,1,4].includes(this.index) ? (this.x-1)*25 : this.x*25
    let y = [0,1,4].includes(this.index) ? this.y*25 : (this.y-1)*25

    image(this.imgs[this.index], x, y)

  }

  this.move = function(x, y) {
    if (this.x + x >= 0 && this.x + x < cols &&
      this.y + y >= 0 && this.y + y < rows) {
      if (board.cells[this.x+x][this.y+y].type === "water" ||
          (board.cells[this.x+x][this.y+y].type === "beach" &&
           board.cells[this.x][this.y].type === "water")
        ) {

        this.x += x
        this.y += y
        this.landed = board.cells[this.x][this.y].type === "beach"

        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3

        for (let i=-1; i<=1; i++){
          for (let j = -1; j <= 1; j++){
            let a = this.x+i
            let b = this.y+j

            if (a >= 0 && a < cols && b >= 0 && b < rows && !board.cells[a][b].revealed)
              board.cells[a][b].revealed = true
          }
        }
      }
      // else if (board.cells[this.x][this.y].type === "beach" &&
      //        board.cells[this.x+x][this.y+y].type != "water"){
      //   man.dismount()
      // }
    }
  }
}