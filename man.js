function Man(imgs, x, y) {
  this.x = x
  this.y = y
  this.imgs = imgs
  this.index = 0
  this.isRidingCanoe = true
  this.hasBackpack = false
  this.isNextToFire = false
  this.fireId = null
  this.stepCount = 0
  this.energy = 5000
  this.inPit = false
  this.vomit = false

  this.display = function() {
    if (!this.isRidingCanoe){
      let offset = this.hasBackpack ? 4 : 0
      if (this.inPit){
        let size = showCount-25
        if (size > 0){
          imageMode(CENTER)
          image(this.imgs[this.index+offset], this.x*25+12.5, this.y*25+topbarHeight+12.5, size, size)
          imageMode(CORNER)
        }
      }
      else {
        let id = this.vomit ? 8 : this.index+offset
        image(this.imgs[id], this.x*25, this.y*25+topbarHeight)
      }
    }
  }

  this.move = function(x, y) {
    //check for edge case
    if (this.x + x >= 0 && this.x + x < cols &&
      this.y + y >= 0 && this.y + y < rows){
       //check for forbidden cells
      if (!["water", "rockEdge", "firepit"].includes(board.cells[this.x+x][this.y+y].type)){
        //move and set image index
        this.x += x
        this.y += y
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
        this.stepCount++
        let cost = this.hasBackpack ? 5 : 3
        this.energy -= cost
        // reveal cell
        if (!board.cells[this.x][this.y].revealed)
          board.cells[this.x][this.y].revealed = true
        //check for available actions
        if (["pit", "sandpit"].includes(board.cells[this.x][this.y].type)){
            this.inPit = true
            this.energy -= 800
            showCount = 50
            let name = board.cells[this.x][this.y].type === "sandpit" ? "sinking sand!!" : "a pit!!"
            message = "You fell in "+name
        }
      }
      //reveal rockEdge cells
      else if (board.cells[this.x+x][this.y+y].type === "rockEdge"){
        if (!board.cells[this.x+x][this.y+y].revealed)
          board.cells[this.x+x][this.y+y].revealed = true
      }
      //check if next to fires
      let fires = board.objectsToShow.fires
      for (let i=0; i<fires.length; i++){
        if (isNearSquare(this.x, this.y, fires[i].x, fires[i].y)){
          this.isNextToFire = true
          this.fireId = i
          return
        }
      }
      this.isNextToFire = false
      this.fireId = null
    }
  }

  this.dismount = function(){
    if (this.isRidingCanoe && (canoe.landed || canoe.isBeside("dock"))){
      let dirs = canoe.index === 0 ? [3,2,0] :
                   canoe.index === 1 ? [2,3,1] :
                     canoe.index === 2 ? [0,1,2] :
                                           [1,0,3]
      if (!this.dismountDirection(false, dirs[0]) && !this.dismountDirection(false, dirs[1]))
        this.dismountDirection(true, dirs[2])
    }
    else if (!this.isRidingCanoe && isNearSquare(this.x, this.y, canoe.x, canoe.y)){
      active = canoe
      this.isRidingCanoe = true
      canoe.index = canoe.index === 4 ? 0 : 2
    }
  }

  this.dismountDirection = function(force, dir){
    let x = canoe.x
    let y = canoe.y
    switch(dir){
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
    if ((x >= 0 && x < cols && y >= 0 && y < rows) && (["beach", "dock"].includes(board.cells[x][y].type) || force)){
      this.x = x
      this.y = y
      this.index = dir
      this.isRidingCanoe = false
      active = man
      canoe.index = [0,1].includes(canoe.index) ? 4 : 5
      return true
    }
    return false
  }
}