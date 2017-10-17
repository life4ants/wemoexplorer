function Man(imgs, x, y) {
  this.x = x
  this.y = y
  this.imgs = imgs
  this.index = 0
  this.isRidingCanoe = true
  this.hasBackpack = false

  this.display = function() {
    if (!this.isRidingCanoe){
      let offset = this.hasBackpack ? 4 : 0
      image(this.imgs[this.index+offset], this.x*25, this.y*25+topbarHeight)
    }
  }

  this.move = function(x, y) {
    //check for edge case
    if (this.x + x >= 0 && this.x + x < cols &&
      this.y + y >= 0 && this.y + y < rows){
       //check for forbidden cells
      if (!["water", "rockEdge"].includes(board.cells[this.x+x][this.y+y].type)){
        //move and set image index
        this.x += x
        this.y += y
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
        // reveal cell
        if (!board.cells[this.x][this.y].revealed)
          board.cells[this.x][this.y].revealed = true
        //check for available actions
        if (["pit", "sandpit"].includes(board.cells[this.x][this.y].type)){
            paused = true
            showCount = 30
            message = "You died in a " + board.cells[this.x][this.y].type + "!!!!"
        }
      }
      //reveal rockEdge cells
      else if (board.cells[this.x+x][this.y+y].type === "rockEdge"){
        if (!board.cells[this.x+x][this.y+y].revealed)
          board.cells[this.x+x][this.y+y].revealed = true
      }
    }
  }

  this.dismount = function(){
    if (this.isRidingCanoe && (canoe.landed || isNearType(canoe.x, canoe.y, "dock"))){
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
      this.index = canoe.index
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