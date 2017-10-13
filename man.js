function Man(imgs, x, y) {
  this.x = x
  this.y = y
  this.imgs = imgs
  this.index = 0
  this.isRidingCanoe = true

  this.display = function() {
    if (!this.isRidingCanoe)
      image(this.imgs[this.index], this.x*25, this.y*25)
  }

  this.move = function(x, y) {
    if (this.x + x >= 0 && this.x + x < cols &&
      this.y + y >= 0 && this.y + y < rows){
      if (!["water", "rockEdge"].includes(board.cells[this.x+x][this.y+y].type)){
        this.x += x
        this.y += y
        if (!board.cells[this.x][this.y].revealed)
          board.cells[this.x][this.y].revealed = true
      }
      else if (board.cells[this.x+x][this.y+y].type === "rockEdge"){
        if (!board.cells[this.x+x][this.y+y].revealed)
          board.cells[this.x+x][this.y+y].revealed = true
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

  this.dismount = function(){
    if (this.isRidingCanoe && canoe.landed){
      let x = canoe.x
      let y = canoe.y
      switch(canoe.index){
        case 0:
          x++
          break
        case 1:
          x--
          break
        case 2:
          y--
          break
        case 3:
          y++
          break
      }
      this.x = x
      this.y = y
      this.isRidingCanoe = false
      active = man
      canoe.index = [0,1].includes(canoe.index) ? 4 : 5
    }
    else if (!this.isRidingCanoe && isNextTo(this.x, this.y, canoe.x, canoe.y)){
      active = canoe
      this.isRidingCanoe = true
      canoe.index = canoe.index === 4 ? 0 : 2
    }
  }

}