function Man(imgs, x, y) {
  this.x = x
  this.y = y
  this.oldX = 0
  this.oldY = 0
  this.imgs = imgs
  this.index = 0
  this.isRidingCanoe = true
  this.backpack = {
    weight: 0,
    items: []
  }
  this.isNextToFire = false
  this.fireId = null
  this.stepCount = 0
  this.energy = 5000
  this.health = 5000
  this.isInPit = false
  this.isClimbingOutOfPit = false
  this.isFallingIntoPit
  this.vomit = false

  this.display = function() {
    if (!this.isRidingCanoe){
      let offset = this.backpack.weight > 0 ? 4 : 0
      if (this.isInPit){
        imageMode(CENTER)
        image(this.imgs[this.index+offset], this.x*25+12.5, this.y*25+topbarHeight+12.5, 10, 10)
        imageMode(CORNER)
      }
      else if (this.isClimbingOutOfPit || this.isFallingIntoPit){
        let num = 30-Math.round(this.energy/200)
        let size = this.isClimbingOutOfPit ? (num-showCount)*(15/num)+10 : showCount*3+10
        let speed = this.isClimbingOutOfPit ? (num-showCount)*25/num : Math.floor((5-showCount)*5)
        let x = (this.x-this.oldX)*speed
        let y = (this.y-this.oldY)*speed
        imageMode(CENTER)
        image(this.imgs[this.index+offset], this.oldX*25+12.5+x, this.oldY*25+topbarHeight+12.5+y, size, size)
        imageMode(CORNER)
        if (showCount === 0){
          this.isInPit = this.isFallingIntoPit ? true : false
          this.isFallingIntoPit = false
          this.isClimbingOutOfPit = false
          showCount = 30
        }
      }
      else {
        let id = this.vomit ? 8 : this.index+offset
        image(this.imgs[id], this.x*25, this.y*25+topbarHeight)
      }
    }
  }

  this.move = function(x, y) {
    if (this.isClimbingOutOfPit || this.isFallingIntoPit)
      return
    //check for edge case
    if (this.x + x >= 0 && this.x + x < cols &&
      this.y + y >= 0 && this.y + y < rows){
       //check for forbidden cells
      if (!["water", "rockEdge", "firepit", "river"].includes(board.cells[this.x+x][this.y+y].type)){
        if (this.isInPit){
          this.oldX = this.x
          this.oldY = this.y
          this.health -= 800
          message = ""
          showCount = 30-Math.round(this.energy/200)
          this.isClimbingOutOfPit = true
          this.isInPit = false
        }
        if (["pit", "sandpit"].includes(board.cells[this.x+x][this.y+y].type)){
            this.isFallingIntoPit = true
            this.oldX = this.x
            this.oldY = this.y
            showCount = 5
            let name = board.cells[this.x+x][this.y+y].type === "sandpit" ? "sinking sand!!" : "a pit!!"
            message = "You fell in "+name
        }
        //move and set image index
        this.x += x
        this.y += y
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
        this.stepCount++
        let cost = 3+Math.round(this.backpack.weight/5)
        this.energy -= cost

        // reveal cell
        if (!board.cells[this.x][this.y].revealed){
          board.cells[this.x][this.y].revealed = true
          this.energy--
        }
      }
      //reveal rockEdge cells
      else if (["river", "rockEdge"].includes(board.cells[this.x+x][this.y+y].type)){
        if (!board.cells[this.x+x][this.y+y].revealed){
          board.cells[this.x+x][this.y+y].revealed = true
          this.energy--
        }
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
      if (autoCenter)
        centerOn(this)
      else
        follow(this)
    }
  }

  this.dismount = function(){
    if (this.isRidingCanoe && (canoe.landed || canoe.isBeside("dock") || board.cells[canoe.x][canoe.y].type === "river")){
      let dirs = canoe.index === 0 ? [4,0,2,3,1,5,7,6] :
                   canoe.index === 1 ? [0,4,6,7,5,3,1,2] :
                     canoe.index === 2 ? [2,6,0,1,7,3,5,4] :
                                           [6,2,4,5,3,7,1,0]
      for (let i = 0; i < dirs.length; i++){
        if (this.dismountDirection(dirs[i]))
          break
      }
    }
    else if (!this.isRidingCanoe && isNearSquare(this.x, this.y, canoe.x, canoe.y)){
      active = canoe
      this.isRidingCanoe = true
      canoe.index = canoe.index === 4 ? 0 : 3
    }
    if (autoCenter)
      centerOn(this)
    else
      follow(this)
  }

  this.dismountDirection = function(dir){
    let x = canoe.x
    let y = canoe.y
    switch(dir){
      case 0: y--;      break;
      case 1: x++; y--; break;
      case 2: x++;      break;
      case 3: y++; x++; break;
      case 4: y++;      break;
      case 5: y++; x--; break;
      case 6: x--;      break;
      case 7: x--; y--;
    }
    if ((x >= 0 && x < cols && y >= 0 && y < rows) && (!["water", "river", "rockEdge", "firepit"].includes(board.cells[x][y].type))){
      this.x = x
      this.y = y
      this.index = dir === 0 ? 2 : [1,2,3].includes(dir) ? 0 : 4 === dir ? 3 : 1
      this.isRidingCanoe = false
      active = man
      canoe.index = [0,1].includes(canoe.index) ? 4 : 5
      return true
    }
    return false
  }
}
