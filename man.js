class Man {
  constructor(characterId, x, y){
    this.x = x
    this.y = y
    this.oldX = x
    this.oldY = y
    this.characterId = characterId
    this.index = 3 //direction facing: 0 - right, 1 - left, 2 - up, 3 - down
    this.energy = 3000
    this.health = 3000
    this.stepCount = 0
    this.isRiding = false
    this.ridingId = null
    this.isNextToFire = false
    this.fireId = null
    this.isSleeping = false
    this.canSleep = false
    this.isAnimated = false
    this.animation = {frame: 0, type: "", end: 0, action: null}
  }

  import(obj) {
    for (let key in obj){
      this[key] = obj[key]
    }
  }

  export(){
    let list = [
    "x", "y", "characterId", "energy", "health", "stepCount", "isRiding", 
    "ridingId", "isNextToFire", "fireId", "isSleeping", "canSleep", "oldX", "oldY"]
    let output = {}
    for (let key of list){
      output[key] = this[key]
    }
    return output
  }

  update(){
    let cell = board.cells[this.x][this.y]
    if (game.mode === "build"){
      strokeWeight(2)
      stroke(128)
      noFill()
      ellipseMode(CENTER)
      ellipse(this.x*25+12.5, this.y*25+topbarHeight+12.5, 200, 200)
      this.drawImage(this.index, this.x*25, this.y*25+topbarHeight)
      return
    }
    if (timer.dark){
     this.darkCheck()
    }
    if (this.isRiding){
      let sx = (active.index%3)*25
      let sy = Math.floor(active.index/3)*25
      let h = active.type === "canoe" && [0,1].includes(active.index) ? 19 :
              active.type === "canoe" ? 21 : 25
      let img = tiles.players[this.characterId]
      image(img, active.x*25, active.y*25+topbarHeight, 25, h, sx, sy, 25, h)
      return
    }

    this.canSleep = !this.isRiding && (this.isNextToFire && board.fires[this.fireId].value > 0 ||
        cell.type === "campsite")
    if (this.isSleeping && !this.canSleep)
      this.goToSleep()

    if (cell.type === "firepit" && board.fires[cell.id].value > 0){
      msgs.following.msg = "Get off the fire! You're burning!"
      msgs.following.frames = 1
      this.health -=25
    }
    if (this.isSleeping){
       this.health = min(this.health+1, 3000)
       this.energy = frameCount%10 === 0 && this.energy < 3000 ? this.energy+1 : this.energy
    }
    this.display()
  }

  display() {
    let offset = backpack.weight > 0 ? 4 : 0
    let index = this.isSleeping ? 9 : this.index+offset
    let dx = this.x*25
    let dy = this.y*25+topbarHeight

    if (board.cells[this.x][this.y].type === "campsite"){
      let id = board.cells[this.x][this.y].id
      dx = (board.buildings[id].x+1)*25
      dy = board.buildings[id].y*25+topbarHeight+18
      index = 10
      if (this.isSleeping){
        image(tiles.z, dx, dy)
        return
      }
    }
    if (this.isAnimated){
      if ("vomit" === this.animation.type){
        this.drawImage(8, dx, dy)
      }
      else if (["building", "chopping"].includes(this.animation.type)){
        let id = floor(map(frameCount%(world.frameRate/3), 0, world.frameRate/3, 0, 3))
        let sx = (id%3)*35
        let sy = floor(id/3)*25
        let img = tiles.playersAnimated[this.characterId]
        image(img, dx, dy, 35, 25, sx, sy, 35, 25)
        if (this.animation.type === "chopping" && this.animation.frame % 6 === 1)
          sounds.play("chop")
      }
      this.animation.frame++
      if (this.animation.frame >= this.animation.end){
        this.isAnimated = false
        if (typeof this.animation.action === "function")
          this.animation.action()
      }
    }
    else
      this.drawImage(index, dx, dy)
  }

  move(x, y) {
    if (this.isSleeping)
      return
    if (helpers.canWalk(this.x+x, this.y+y)){
      let cell = board.cells[this.x][this.y]
      let newCell = board.cells[this.x+x][this.y+y]
      if (["rockEdge", "river", "construction"].includes(newCell.type) ||
        ("firepit" === newCell.type && board.fires[newCell.id].value > 0)  || 
          (newCell.type === "star" && newCell.tile === "water")){return}
      if (["water", "boulder"].includes(cell.type)){
        if (this.x+x !== this.oldX || this.y+y !== this.oldY)
          return
      }
      if (cell.type === "campsite" && newCell.type === "campsite"){
        x *= 2; y*= 2;
      }
      
      //move and set image index
      this.oldX = this.x
      this.oldY = this.y
      this.x += x
      this.y += y
      this.stepCount++
      let c = this.walkingCost()
      this.energy -= c
      this.health -= c/5

      sounds.play("walk")
      if (newCell.type === "pit" && newCell.pair){
        this.x = newCell.pair.x
        this.y = newCell.pair.y
      }
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

  darkCheck(){
    for (let f of board.fires){
      let d = dist(this.x, this.y, f.x, f.y) // tile distance
      let l = f.value > 0 ? (f.value/4)+45 : 0// pixels
      if ((d*25) < l){
        return // not in the dark
      }
    }
    for (let c of board.buildings){
      let d = dist(this.x, this.y, c.x, c.y)
      let l = c.fireValue > 0 ? (c.fireValue/4)+45 : 0
      if ((d*25) < l){
        return
      }
    }

    msgs.following.msg = "You're too far from a fire!"
    msgs.following.frames = 1
    if (!this.isAnimated)
      this.health -= Math.floor((this.health+500)/200)
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
      let raftId = this.canMount(this.x, this.y)
      if (raftId !== null) {
        active = board.vehicles[raftId]
        this.isRiding = true
        this.ridingId = raftId
        active.index = active.index === 4 ? 0 : 3
        this.isNextToFire = false
        this.fireId = null
      }
    }
  }

  canMount(){
    for (let i = 0; i < board.vehicles.length; i++){
      if (helpers.isNearSquare(this.x,this.y,board.vehicles[i].x,board.vehicles[i].y))
        return i
    }
    return null
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
      active.index = [0,1].includes(active.index) ? 4 : 5
      active = man
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
    else if (this.canSleep && sleepable.includes(board.cells[this.x][this.y].type)){
      this.isSleeping = true
      sounds.files['sleep'].play()
    }
    else {
      let message = !this.canSleep ? "You can only sleep near a fire or in a campsite." :
                        "You can't sleep on a "+board.cells[this.x][this.y].type+"!"
      popup.setAlert(message)
    }
  }

  drawImage(index, x, y){
    let sx = (index%3)*25
    let sy = Math.floor(index/3)*25
    image(tiles.players[this.characterId], x, y, 25, 25, sx, sy, 25, 25)
  }

  walkingCost(){
    return (backpack.weight+toolbelt.getWeight())/75+2.5
  }

}
