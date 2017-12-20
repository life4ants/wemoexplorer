class Man extends WemoObject {
  constructor(img, x, y){
    super()
    this.x = x
    this.y = y
    this.oldX = 0
    this.oldY = 0
    this.img = img
    this.index = 0
    this.isRiding = false
    this.ridingId = ""
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
    this.canSleep = false
    this.standCount = 0
  }

  display() {
    if (game.mode === "build"){
      strokeWeight(2)
      stroke(128)
      noFill()
      ellipseMode(CENTER)
      ellipse(this.x*25+12.5, this.y*25+topbarHeight+12.5, 200, 200)
      this.drawImage(this.img, this.index, this.x*25, this.y*25+topbarHeight, 25, 25)
      return
    }
    this.update()

    if (this.isRiding){
      let sx = (active.index%3)*25
      let sy = Math.floor(active.index/3)*25
      let h = active.type === "canoe" && [0,1].includes(active.index) ? 19 :
              active.type === "canoe" ? 21 : 25
      image(this.img, active.x*25, active.y*25+topbarHeight, 25, h, sx, sy, 25, h)
    }
    else if (board.cells[this.x][this.y].type === "campsite"){
      let id = board.cells[this.x][this.y].id
      let x = board.buildings[id].x
      let y = board.buildings[id].y
      if (this.isSleeping)
        image(tiles.z, (x+1)*25, y*25+topbarHeight+18)
      else
        this.drawImage(this.img, 10, (x+1)*25, y*25+topbarHeight+18, 25, 25)
    }
    else {
      let offset = backpack.weight > 0 ? 4 : 0
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
        this.drawPitLines(this.x, this.y)

    }
  }

  update(){
    this.standCount++
    if ([5,10].includes(this.standCount/world.frameRate)){
      for (let i=-1; i<=1; i++){
        for (let j = -1; j <= 1; j++){
          let a = this.x+i
          let b = this.y+j

          if (a >= 0 && a < board.cols && b >= 0 && b < board.rows){
            this.revealCell(a,b,false)
          }
        }
      }
    }
    this.canSleep = board.wemoMins%1440 >= 1290 || board.wemoMins%1440 < 150
    if (this.inDark){
      message.following.msg = "You're too far from a fire!"
      message.following.frames = 1
      this.health -= Math.floor((this.health+1500)/499)
    }
    else if (board.cells[this.x][this.y].type === "firepit" && board.fires[this.fireId].value > 0){
      message.following.msg = "Get off the fire! You're burning!"
      message.following.frames = 1
      this.health -=25
    }
    if (this.isSleeping){
       this.health = this.health < 4997 ? this.health+3 : 5000
       this.energy = frameCount%3 === 0 && this.energy < 5000 ? this.energy+1 : this.energy
    }
  }

  move(x, y) {
    this.standCount = 0
    if (this.isClimbingOutOfPit || this.isFallingIntoPit || this.isSleeping)
      return
    if (board.cells[this.x][this.y].type === "campsite" && board.cells[this.x+x][this.y+y].type === "campsite"){
      x *= 2; y*= 2;
    }
    //check for edge case
    if (this.x + x >= 0 && this.x + x < board.cols &&
      this.y + y >= 0 && this.y + y < board.rows){
       //check for forbidden cells
      if (!["water", "rockEdge", "river", "construction"].includes(board.cells[this.x+x][this.y+y].type)){
        if ("firepit" === board.cells[this.x+x][this.y+y].type && board.fires[board.cells[this.x+x][this.y+y].id].value > 0)
          return
        if (this.isInPit){
          this.oldX = this.x
          this.oldY = this.y
          this.energy -= 600-(Math.floor(this.energy/10))
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
            message.following.msg = "You fell in "+name
            message.following.frames = 18
        }
        //move and set image index
        this.x += x
        this.y += y
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
        this.stepCount++
        this.energy -= this.walkingCost()
        this.health -= 1
        this.vomit = false

        this.revealCell(this.x, this.y, true)
      }
      //reveal rockEdge cells
      else if (["river", "rockEdge"].includes(board.cells[this.x+x][this.y+y].type)){
        this.revealCell(this.x+x, this.y+y, true)
        this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
      }
      this.fireCheck()
    }
  }

  fireCheck(){
    let fires = board.fires
    for (let i=0; i<fires.length; i++){
      if (helpers.isNearSquare(this.x, this.y, fires[i].x, fires[i].y)){
        this.isNextToFire = true
        this.fireId = i
        return
      }
    }
    this.isNextToFire = false
    this.fireId = null
  }

  dismount(){
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
    else if (!this.isRiding) {
      let watercraft = vehicles.canMount(this.x, this.y)
      if (watercraft) {
        active = vehicles[watercraft]
        this.isRiding = true
        this.ridingId = watercraft
        vehicles[watercraft].index = vehicles[watercraft].index === 4 ? 0 : 3
      }
    }
  }

  dismountDirection(dir){
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
    if ((x >= 0 && x < board.cols && y >= 0 && y < board.rows) &&
          (!["water", "river", "rockEdge", "firepit"].includes(board.cells[x][y].type))){
      this.x = x
      this.y = y
      this.index = dir === 0 ? 2 : [1,2,3].includes(dir) ? 0 : 4 === dir ? 3 : 1
      this.isRiding = false
      this.ridingId = ""
      active.index = [0,1].includes(active.index) ? 4 : 5
      active = man
      this.revealCell(x,y,true)
      return true
    }
    return false
  }

  goToSleep(){
    if (this.isSleeping)
      this.isSleeping = false
    else if (this.canSleep && sleepable.includes(board.cells[this.x][this.y].type) && !this.isRiding)
      this.isSleeping = !this.isSleeping
    else {
      let message = this.isRiding ? "Sorry, no sleeping in your canoe!" :
                      !this.canSleep ? "Sorry, no sleeping during the day!" :
                        "You can't sleep on a "+board.cells[this.x][this.y].type+"!"
      popup.setAlert(message)
    }
  }

  drawImage(img, index, x, y, w, h){
    let sx = (index%3)*25
    let sy = Math.floor(index/3)*25
    image(img, x, y, w, h, sx, sy, 25, 25)
  }

  revealCell(x,y,fully){
    if (fully && !board.cells[x][y].revealed){
      this.energy--
      board.revealCell(x,y,fully)
    }
    else if (board.cells[x][y].revealed < 2){
      this.energy -= 0.5
      board.revealCell(x,y,false)
    }
  }

  drawPitLines(x,y){
    noFill()
    stroke(255,0,0)
    strokeWeight(1)
    let offset = game.mode === 'edit' ? 0 : topbarHeight
    let basex = x*25+2
    let basey = y*25+2+offset
    for (let i = 0; i < 5; i++){
      let x1 = i < 2 ? 2-i : i == 2 ? 0.57 : 0
      let y1 = i < 2 ? 0 : i == 2 ? 0.57 : i-2
      let x2 = i < 2 ? 3 : i == 2 ? 2.57 : 5-i
      let y2 = i > 2 ? 3: i == 2 ? 2.57 : i+1
      line(Math.round(x1*7)+basex, Math.round(y1*7)+basey, Math.round(x2*7)+basex, Math.round(y2*7)+basey)
    }
    ellipseMode(CENTER)
    ellipse(x*25+12.5, y*25+12.5+offset,22,22)
  }

  walkingCost(){
    return this.basket ? 3+(this.basket.quantity + backpack.weight)/120 : 3+(backpack.weight/120)
  }

}
