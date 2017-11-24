function Man(img, x, y) {
  this.x = x
  this.y = y
  this.oldX = 0
  this.oldY = 0
  this.img = img
  this.index = 0
  this.isRiding = false
  this.ridingId = ""
  this.backpack = {
    weight: 0,
    items: []
  }
  this.basket = false
  this.tools = []
  this.isNextToFire = false
  this.fireId = null
  this.stepCount = 0
  this.energy = 5000
  this.health = 5000
  this.isInPit = false
  this.isClimbingOutOfPit = false
  this.isFallingIntoPit = false
  this.vomit = false
  this.inDark = false
  this.isSleeping = false

  this.initialize = function(obj) {
    for (let key in obj){
      this[key] = obj[key]
    }
  }

  this.save = function(){
    let output = {}
    let items = Object.keys(this)
    for (let i = 0; i < items.length; i++){
      if (typeof this[items[i]] !== "function" && items[i] !== "img")
        output[items[i]] = this[items[i]]
    }
    return output
  }

  this.display = function() {
    if (this.inDark){
      message = "You're too far from a fire!"
      showCount = 1
      this.health -= Math.floor((this.health+1500)/499)
    }
    if (this.isRiding){
      let sx = (active.index%3)*25
      let sy = Math.floor(active.index/3)*25
      let h = active.type === "canoe" && [0,1].includes(active.index) ? 19 :
              active.type === "canoe" ? 21 : 25
      image(this.img, active.x*25, active.y*25+topbarHeight, 25, h, sx, sy, 25, h)
    }
    else {
      let offset = this.backpack.weight > 0 ? 4 : 0
      if (this.isInPit){
        imageMode(CENTER)
        this.drawImage(this.img, this.index+offset, this.x*25+12.5, this.y*25+topbarHeight+12.5, 10, 10)
        imageMode(CORNER)
      }
      else if (this.isClimbingOutOfPit || this.isFallingIntoPit){
        let num = 30-Math.round(this.energy/200)
        let size = this.isClimbingOutOfPit ? (num-showCount)*(15/num)+10 : showCount*3+10
        let speed = this.isClimbingOutOfPit ? (num-showCount)*25/num : Math.floor((5-showCount)*5)
        let x = (this.x-this.oldX)*speed
        let y = (this.y-this.oldY)*speed
        imageMode(CENTER)
        this.drawImage(this.img, this.index+offset, this.oldX*25+12.5+x, this.oldY*25+topbarHeight+12.5+y, size, size)
        imageMode(CORNER)
        if (showCount === 0){
          this.isInPit = this.isFallingIntoPit ? true : false
          this.isFallingIntoPit = false
          this.isClimbingOutOfPit = false
          showCount = 30
        }
      }
      else {
        let id = this.vomit ? 8 : this.isSleeping ? 9 : this.index+offset
        this.drawImage(this.img, id, this.x*25, this.y*25+topbarHeight, 25, 25)
      }
      if (board.cells[this.x][this.y].byPit)
        drawPitLines(this.x, this.y)
      if (this.isSleeping){
        this.health = this.health < 4997 ? this.health+3 : 5000
        this.energy = frameCount%3 === 0 && this.energy < 5000 ? this.energy+1 : this.energy
      }
    }
  }

  this.move = function(x, y) {
    if (this.isClimbingOutOfPit || this.isFallingIntoPit || this.isSleeping)
      return
    //check for edge case
    if (this.x + x >= 0 && this.x + x < cols &&
      this.y + y >= 0 && this.y + y < rows){
       //check for forbidden cells
      if (!["water", "rockEdge", "river"].includes(board.cells[this.x+x][this.y+y].type)){
        if ("firepit" === board.cells[this.x+x][this.y+y].type && board.objectsToShow.fires[this.fireId].value > 0)
          return
        if (this.isInPit){
          this.oldX = this.x
          this.oldY = this.y
          this.energy -= 600-(Math.floor(this.energy/10))
          message = ""
          showCount = 30-Math.round(this.energy/200)
          this.isClimbingOutOfPit = true
          this.isInPit = false
        }
        if (["pit", "sandpit"].includes(board.cells[this.x+x][this.y+y].type)){
            this.isFallingIntoPit = true
            this.oldX = this.x
            this.oldY = this.y
            this.health -= 800
            showCount = 5
            let name = board.cells[this.x+x][this.y+y].type === "sandpit" ? "sinking sand!!" : "a pit!!"
            message = "You fell in "+name
        }
        //move and set image index
        this.x += x
        this.y += y
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
        this.stepCount++
        let cost = 3+Math.round(this.backpack.weight/8)
        if (this.basket)
          cost = 3+Math.round((this.basket.quantity/10 + this.backpack.weight)/8)
        this.energy -= cost
        this.health -= 1

        // reveal cell
        if (!board.cells[this.x][this.y].revealed){
          board.cells[this.x][this.y].revealed = true
          this.energy--
          board.revealCount--
        }
      }
      //reveal rockEdge cells
      else if (["river", "rockEdge"].includes(board.cells[this.x+x][this.y+y].type)){
        if (!board.cells[this.x+x][this.y+y].revealed){
          board.cells[this.x+x][this.y+y].revealed = true
          this.energy--
          board.revealCount--
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
    }
  }

  this.dismount = function(){
    if (this.isRiding && (active.landed || active.isBeside("dock") || board.cells[active.x][active.y].type === "river")){
      let dirs = active.index === 0 ? [4,0,2,3,1,5,7,6] :
                   active.index === 1 ? [0,4,6,7,5,3,1,2] :
                     active.index === 2 ? [2,6,0,1,7,3,5,4] :
                                           [6,2,4,5,3,7,1,0]
      for (let i = 0; i < dirs.length; i++){
        if (this.dismountDirection(dirs[i]))
          break
      }
    }
    else if (!this.isRiding && isNearSquare(this.x, this.y, vehicles.canoe.x, vehicles.canoe.y)){
      active = vehicles.canoe
      this.isRiding = true
      this.ridingId = "canoe"
      vehicles.canoe.index = vehicles.canoe.index === 4 ? 0 : 3
    }
    else if (!this.isRiding && isNearSquare(this.x, this.y, vehicles.raft.x, vehicles.raft.y)){
      active = vehicles.raft
      this.isRiding = true
      this.ridingId = "raft"
      vehicles.raft.index = vehicles.raft.index === 4 ? 0 : 3
    }
  }

  this.dismountDirection = function(dir){
    let x = active.x
    let y = active.y
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
      this.isRiding = false
      active.index = [0,1].includes(active.index) ? 4 : 5
      active = man
      return true
    }
    return false
  }

  this.sleep = function(){
    if (this.isSleeping)
      this.isSleeping = false
    else if ("day" !== timeOfDay && sleepable.includes(board.cells[this.x][this.y].type) && !this.isRiding)
      this.isSleeping = !this.isSleeping
    else {
      let message = this.isRiding ? "Sorry, no sleeping in your canoe!" :
                      timeOfDay === "day" ? "Sorry, no sleeping during the day!" :
                        "You can't sleep on a "+board.cells[this.x][this.y].type+"!"
      popup.setAlert(message)
    }
  }

  this.drawImage = function(img, index, x, y, w, h){
    let sx = (index%3)*25
    let sy = Math.floor(index/3)*25
    image(img, x, y, w, h, sx, sy, 25, 25)
  }
}
