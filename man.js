class Man extends WemoObject {
  constructor(characterId, x, y){
    super()
    this.x = x
    this.y = y
    this.oldX = 0
    this.oldY = 0
    this.index = 0
    this.energy = 5000
    this.health = 5000
    this.stepCount = 0
    this.standCount = 0
    this.img = [tiles.players[characterId], tiles.playersAnimated[characterId]]
    this.isRiding = false
    this.ridingId = ""
    this.isNextToFire = false
    this.fireId = null
    this.vomit = false
    this.inDark = false
    this.isSleeping = false
    this.canSleep = false
    this.isAnimated = false
    this.animation = {frame: 0, type: "", end: 0, action: null}
  }

  update(){
    if (game.mode === "build"){
      strokeWeight(2)
      stroke(128)
      noFill()
      ellipseMode(CENTER)
      ellipse(this.x*25+12.5, this.y*25+topbarHeight+12.5, 200, 200)
      this.drawImage(this.img[0], this.index, this.x*25, this.y*25+topbarHeight, 25, 25)
      return
    }

    if (this.inDark){
      msgs.following.msg = "You're too far from a fire!"
      msgs.following.frames = 1
      this.health -= Math.floor((this.health+1500)/499)
    }
    if (this.isRiding){
      let sx = (active.index%3)*25
      let sy = Math.floor(active.index/3)*25
      let h = active.type === "canoe" && [0,1].includes(active.index) ? 19 :
              active.type === "canoe" ? 21 : 25
      image(this.img[0], active.x*25, active.y*25+topbarHeight, 25, h, sx, sy, 25, h)
      return
    }
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
    if (board.cells[this.x][this.y].type === "firepit" && board.fires[this.fireId].value > 0){
      msgs.following.msg = "Get off the fire! You're burning!"
      msgs.following.frames = 1
      this.health -=25
    }
    if (this.isSleeping){
       this.health = this.health < 4997 ? this.health+3 : 5000
       this.energy = frameCount%3 === 0 && this.energy < 5000 ? this.energy+1 : this.energy
    }
    this.display()
  }

  display() {
    let offset = backpack.weight > 0 ? 4 : 0
    let index = this.vomit ? 8 : this.isSleeping ? 9 : this.index+offset
    let dx = this.x*25
    let dy = this.y*25+topbarHeight

    if (board.cells[this.x][this.y].type === "campsite"){
      let id = board.cells[this.x][this.y].id
      dx = (board.buildings[id].x+1)*25
      dy = board.buildings[id].y*25+topbarHeight+18
      index = this.vomit ? 8 : 10
      if (this.isSleeping){
        image(tiles.z, dx, dy)
        return
      }
    }
    if (this.isAnimated){
      if (["shrinking", "growing"].includes(this.animation.type)){
        let length = this.animation.type === "growing" ? 30-Math.round(this.energy/200) : 5
        let size = this.animation.type === "growing" ?  map(this.animation.frame, 0, length, 10, 25) :
              map(this.animation.frame, 0, length, 25, 10)
        let pos = map(this.animation.frame, 0, length, 0, 25)
        let x = (this.x-this.oldX)*pos
        let y = (this.y-this.oldY)*pos
        imageMode(CENTER)
        this.drawImage(this.img[0], this.index+offset, this.oldX*25+12.5+x, this.oldY*25+topbarHeight+12.5+y, size, size)
        imageMode(CORNER)
        if (this.animation.frame >= length)
          this.isAnimated = false
      }
      else if ("building" === this.animation.type){
        let id = floor(map(frameCount%(world.frameRate/3), 0, world.frameRate/3, 0, 3))
        let sx = (id%3)*35
        let sy = floor(id/3)*25
        image(this.img[1], dx, dy, 35, 25, sx, sy, 35, 25)
        if (this.animation.frame >= this.animation.end){
          this.isAnimated = false
          if (typeof this.animation.action === "function")
            this.animation.action()
        }
      }
      this.animation.frame++
      return
    }
    else if (["pit", "sandpit"].includes(board.cells[this.x][this.y].type)){
      imageMode(CENTER)
      this.drawImage(this.img[0], this.index+offset, this.x*25+12.5, this.y*25+topbarHeight+12.5, 10, 10)
      imageMode(CORNER)
      return
    }

    this.drawImage(this.img[0], index, dx, dy, 25, 25)
    if (board.cells[this.x][this.y].byPit)
      this.drawPitLines(this.x, this.y)
  }

  move(x, y) {
    this.standCount = 0
    if (this.isSleeping)
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
        if (["pit", "sandpit"].includes(board.cells[this.x+x][this.y+y].type)){
            this.health -= 800
            let name = board.cells[this.x+x][this.y+y].type === "sandpit" ? "sinking sand!!" : "a pit!!"
            msgs.following.msg = "You fell in "+name
            msgs.following.frames = 18
            sounds.play("pit")
            if (!["pit", "sandpit"].includes(board.cells[this.x][this.y].type)){
              this.oldX = this.x
              this.oldY = this.y
              this.animation.frame = 0
              this.animation.type = "shrinking"
              this.isAnimated = true
            }
        }
        else if (["pit", "sandpit"].includes(board.cells[this.x][this.y].type)){
          this.oldX = this.x
          this.oldY = this.y
          this.energy -= 600-(Math.floor(this.energy/10))
          this.animation.frame = 0
          this.isAnimated = true
          this.animation.type = "growing"
        }
        //move and set image index
        this.x += x
        this.y += y
        this.stepCount++
        this.energy -= this.walkingCost()
        this.health -= 1
        this.vomit = false

        this.revealCell(this.x, this.y, true)
        sounds.play("walk")
      }
      //reveal rockEdge cells
      else if (["river", "rockEdge"].includes(board.cells[this.x+x][this.y+y].type))
        this.revealCell(this.x+x, this.y+y, true)
      this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
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
      this.fireCheck()
      return true
    }
    return false
  }

  goToSleep(){
    if (this.isSleeping){
      this.isSleeping = false
      sounds.files['sleep'].pause()
    }
    else if (this.canSleep && sleepable.includes(board.cells[this.x][this.y].type) && !this.isRiding){
      this.isSleeping = true
      sounds.files['sleep'].play()
    }
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
    return (backpack.weight+toolbelt.getWeight())/75+2.5
  }

}
