function Man(imgs, x, y) {
  this.x = x
  this.y = y
  this.imgs = imgs
  this.index = 0

  this.display = function() {
    image(this.imgs[this.index], this.x*25, this.y*25)
  }

  this.move = function(x, y) {
    if (this.x + x >= 0 && this.x + x < cols &&
      this.y + y >= 0 && this.y + y < rows){
      if (board.cells[this.x+x][this.y+y].type !== "water"){
        this.x += x
        this.y += y
        if (!board.cells[this.x][this.y].revealed)
          board.cells[this.x][this.y].revealed = true
      }
    }
  }

  this.change = function(i) {
    this.index += i
    if (this.index >= this.imgs.length)
      this.index = 0
    if (this.index < 0)
      this.index = this.imgs.length -1
  }

}