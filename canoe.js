function Canoe(imgs, x, y) {
  this.x = x
  this.y = y
  this.imgs = imgs
  this.index = 0

  this.display = function() {
    let x = [0,1].includes(this.index) ? (this.x-1)*25 : this.x*25
    let y = [0,1].includes(this.index) ? this.y*25 : (this.y-1)*25

    image(this.imgs[this.index], x, y)

  }

  this.move = function(x, y) {
    this.x += x
    this.y += y

    this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3

    for (let i=-1; i<=1; i++){
      for (let j = -1; j <= 1; j++){
        let a = this.x+i
        let b = this.y+j

        if (a >= 0 && a < 60 && b >= 0 && b < 45 && !board.cells[a][b].revealed)
          board.cells[a][b].revealed = true
      }
    }
  }
}