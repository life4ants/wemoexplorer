class Man extends WemoObject {
  constructor(characterId, x, y){
    super()
    this.x = x
    this.y = y
    this.newX = 0
    this.newY = 0
    this.delay = 0
    this.index = 0
    this.hunger = 0
    this.tiredness = 0
    this.injury = 0
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
      if (!this.isNextToFire || !cell.type === "campsite"){
        msgs.following.msg = "You're too far from a fire!"
        msgs.following.frames = 1
      }
      if (!this.isSleeping)
        this.tiredness +=0.7
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
    this.canSleep = (this.isNextToFire && board.fires[this.fireId].value > 0) 
        || (cell.type === "campsite" && board.buildings[cell.id].fireValue > 0)

    if (cell.type === "firepit" && board.fires[this.fireId].value > 0){
      msgs.following.msg = "Get off the fire! You're burning!"
      msgs.following.frames = 1
      this.injury +=200
    }
    if (this.isSleeping){
       if (this.tiredness > 1) this.tiredness -= 0.8
       if (this.injury > 0) this.injury -= 1
       if (!this.canSleep)  this.goToSleep()
    }
    //adjust tiredness
    if (this.tiredness > 1) this.tiredness -= 0.4
    if (frameCount % 24 === 0)
      this.hunger += floor(this.tiredness/4)+1
    let a = [0,0,1,2,3,4,5,6,8,10,12]
    if (this.tiredness < 100)
      this.delay = a[floor(this.tiredness/12)+1]
    else
      this.delay = 14
    this.display(cell)
  }

  display(cell) {
    let offset = backpack.weight > 0 ? 4 : 0
    let index = this.vomit ? 8 : this.isSleeping ? 9 : this.index+offset
    let dx = this.x*25
    let dy = this.y*25+topbarHeight

    if (cell.type === "campsite"){
      let id = cell.id
      dx = (board.buildings[id].x+1)*25
      dy = board.buildings[id].y*25+topbarHeight+18
      index = this.vomit ? 8 : 10
      if (this.isSleeping){
        image(tiles.z, dx, dy)
        return
      }
    }
    if (this.isAnimated){
      if (["moving"].includes(this.animation.type)){
        
        let pos = map(this.animation.frame, 0, this.animation.length, 0, 25)
        let x = (this.newX-this.x)*pos
        let y = (this.newY-this.y)*pos
        this.drawImage(this.img[0], index, this.x*25+x, this.y*25+topbarHeight+y, 25, 25)
        pos > 12 && this.revealCell(this.newX, this.newY, true)
        
        if (this.animation.frame >= this.animation.length){
          this.isAnimated = false
          this.x = this.newX
          this.y = this.newY
        }
      }
      if (["building", "chopping"].includes(this.animation.type)){
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
    this.standCount = 0
    let cell = board.cells[this.x][this.y]
    let newCell = board.cells[this.x+x][this.y+y]
    if (this.isSleeping)
      return
    if (cell.type === "campsite" && newCell.type === "campsite"){
      x *= 2; y*= 2;
    }
    //check for edge case
    if (this.x + x >= 0 && this.x + x < board.cols &&
      this.y + y >= 0 && this.y + y < board.rows){
       //check for forbidden cells
      if (!["water", "rockEdge", "river", "construction"].includes(newCell.type)){
        if ("firepit" === newCell.type && board.fires[newCell.id].value > 0)
          return
        if (this.delay === 0){
          this.x +=x
          this.y +=y
          this.revealCell(this.x, this.y, true)
        }
        else {
          this.newX = this.x+x
          this.newY = this.y+y
          this.isAnimated = true
          this.animation.type = "moving"
          this.animation.length = this.delay
          this.animation.frame = 0
        }

        this.stepCount++
        this.tiredness += this.walkingCost()
        this.vomit = false
        sounds.play("walk")
      }
      //reveal rockEdge cells
      else if (["river", "rockEdge"].includes(newCell.type))
        this.revealCell(this.x+x, this.y+y, true)
      //change index
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
    let type = board.cells[this.x][this.y].type
    if (this.isSleeping){
      this.isSleeping = false
      sounds.files['sleep'].pause()
    }
    else if (this.canSleep && sleepable.includes(type) && !this.isRiding){
      this.isSleeping = true
      sounds.files['sleep'].play()
    }
    else {
      let message = this.isRiding ? "Sorry, no sleeping in your canoe!" :
                      !this.canSleep ? "You can only sleep next to a fire" :
                        "You can't sleep on a "+type+"!"
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
      board.revealCell(x,y,fully)
    }
    else if (board.cells[x][y].revealed < 2){
      board.revealCell(x,y,false)
    }
  }

  walkingCost(){
    return (backpack.weight+toolbelt.getWeight())/100+2
  }

}
