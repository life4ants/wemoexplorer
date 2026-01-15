class Man extends WemoObject {
  constructor(characterId, x, y){
    super()
    this.x = x
    this.y = y
    this.oldX = 0
    this.oldY = 0
    this.index = 3 //direction facing: 0 - right, 1 - left, 2 - up, 3 - down
    this.energy = 3000
    this.health = 3000
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
    let cell = board.cells[this.x][this.y]
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
      this.health -= Math.floor((this.health+500)/200)
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
    this.canSleep = (timer.dark && !this.inDark || 
        this.isNextToFire && board.fires[this.fireId].value > 0 ||
        cell.type === "campsite")
    if (this.isSleeping && !this.canSleep)
      this.goToSleep()

    if (board.cells[this.x][this.y].type === "firepit" && board.fires[this.fireId].value > 0){
      msgs.following.msg = "Get off the fire! You're burning!"
      msgs.following.frames = 1
      this.health -=25
    }
    if (this.isSleeping){
       this.health = min(this.health+2, 3000)
       this.energy = frameCount%5 === 0 && this.energy < 5000 ? this.energy+1 : this.energy
    }
    this.display()
  }

  display() {
    let offset = backpack.weight > 0 ? 4 : 0
    let index = this.vomit ? 8 : this.isSleeping ? 9 : this.index+offset
    let dx = this.x*25
    let dy = this.y*25+topbarHeight

    if (board.revealCount > 0){
      // trangle revealed in direction of travel:
      // for (let i= -2; i<3; i++){
      //   for (let j= -2; j<3; j++){
      //     if (this.index === 2 && i >= j && i+j <=0 ||
      //       this.index === 0 && i >= j && i+j >=0 ||
      //       this.index === 1 && j >= i && i+j <=0 ||
      //       this.index === 3 && j >= i && i+j >=0){
      //       if (helpers.withinBounds(this.x+i, this.y+j)){
      //         board.showCell(this.x+i, this.y+j, board.cells[this.x+i][this.y+j], 2)
      //       }
      //     }
      //   }
      // }
    }

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
      else if (["building", "chopping"].includes(this.animation.type)){
        let id = floor(map(frameCount%(world.frameRate/3), 0, world.frameRate/3, 0, 3))
        let sx = (id%3)*35
        let sy = floor(id/3)*25
        image(this.img[1], dx, dy, 35, 25, sx, sy, 35, 25)
        if (this.animation.type === "chopping" && frameCount%6 === 0)
          sounds.play("chop")
        if (this.animation.frame >= this.animation.end){
          this.isAnimated = false
          if (typeof this.animation.action === "function")
            this.animation.action()
        }
      }
      this.animation.frame++
      return
    }
    this.drawImage(this.img[0], index, dx, dy, 25, 25)
  }

  move(x, y) {
    if (this.isSleeping)
      return
    if (helpers.canWalk(this.x+x, this.y+y)){
      this.standCount = 0
      let cell = board.cells[this.x][this.y]
      let newCell = board.cells[this.x+x][this.y+y]
      if (cell.type === "campsite" && newCell.type === "campsite"){
        x *= 2; y*= 2;
      }
       //check for forbidden cells
      if (!["water", "rockEdge", "river", "construction"].includes(newCell.type)){
        if ("firepit" === newCell.type && board.fires[newCell.id].value > 0)
          return
        //move and set image index
        this.x += x
        this.y += y
        this.stepCount++
        let c = this.walkingCost()
        this.energy -= c
        this.health -= c/5
        this.vomit = false

        // this.revealCell(this.x, this.y, true)
        // for (let i = -1; i <= 1; i++){
        //  for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
        //     if (helpers.withinBounds(this.x+x, this.y+y)){
        //       this.revealCell(this.x+i,this.y+j,false)
        //     }
        //   }
        // }
        sounds.play("walk")
        if (newCell.type === "pit" && newCell.pair){
          this.x = newCell.pair.x
          this.y = newCell.pair.y
         // this.revealCell(this.x, this.y, true)
        }
      }
      //reveal rockEdge cells
      // else if (["river", "rockEdge"].includes(newCell.type))
      //   this.revealCell(this.x+x, this.y+y, true)
      this.index = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
      this.fireCheck()
      if (newCell.type === "star"){
        board.claimStar(this.x, this.y, newCell)
      }
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
    if (helpers.withinBounds(x,y) &&
          (!["water", "river", "rockEdge", "firepit"].includes(board.cells[x][y].type))){
      this.x = x
      this.y = y
      this.index = dir === 0 ? 2 : [1,2,3].includes(dir) ? 0 : 4 === dir ? 3 : 1
      this.isRiding = false
      this.ridingId = ""
      active.index = [0,1].includes(active.index) ? 4 : 5
      active = man
      //this.revealCell(x,y,true)
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
      let message = this.isRiding ? "Sorry, no sleeping on your raft!" :
                      !this.canSleep ? "You can only sleep near a fire or in a campsite." :
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
    if (!board.cells[x][y].revealed){
      board.revealCell(x,y,fully)
    }
  }

  walkingCost(){
    return (backpack.weight+toolbelt.getWeight())/75+2.5
  }

}
