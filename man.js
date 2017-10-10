function Man(imgs, x, y) {
  this.x = x
  this.y = y
  this.imgs = imgs
  this.index = 1

  this.display = function() {
    image(this.imgs[this.index], this.x*25, this.y*25)
  }

  this.move = function(x, y) {
    this.x += x
    this.y += y
    if (!board.cells[this.x][this.y].revealed)
      board.cells[this.x][this.y].revealed = true
  }

  this.change = function(i) {
    this.index += i
    if (this.index >= this.imgs.length)
      this.index = 0
    if (this.index < 0)
      this.index = this.imgs.length -1
  }

}