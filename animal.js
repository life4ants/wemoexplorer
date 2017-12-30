class Animal {
  constructor(type, img, pos){
    this.img = img
    this.type = type
    if (pos){
      this.x = pos.x
      this.y = pos.y
    }
    else {
      let spot = helpers.randomPicker(["grass","longGrass","sand"])
      this.x = spot.x
      this.y = spot.y
    }
    this.dir = 0
    this.ateLast = board.wemoMins
  }

  display(){
    let sx = (this.dir%4)*25
    image(this.img, this.x*25, this.y*25+topbarHeight, 25, 25, sx, 0, 25, 25)
  }

  update(){
    let manDist = dist(man.x,man.y, this.x, this.y)
    let min = world.frameRate/4
    if (frameCount % (min*3) === 0 || (frameCount%min === 0 && manDist < 3))
      this.move(manDist)
    let cell = board.cells[this.x][this.y]
    if (cell.revealed === 2)
      this.display()
    if (cell.type === "veggies" && board.wemoMins-this.ateLast > 45){
      this.ateLast = board.wemoMins
      let quantity = Number(cell.tile.substr(7,1))
      cell.tile = quantity > 1 ? "veggies"+(quantity-1) : "grass"
      cell.type = quantity > 1 ? cell.type : "grass"
    }
  }

  move(manDist){
    let pdirs = [
      [1,0],//right
      [-1,0],//left
      [0,-1],//up
      [0,1]//down
    ]
    let wdirs = helpers.walkableDirs(this.x, this.y)
    if (wdirs.length === 0){
      console.log("rabbit had nowhere to go")
      return
    }
    if (manDist > 7){ // try a random direction
      if (wdirs.length === 1)
        this.setPos(pdirs[wdirs[0]][0], pdirs[wdirs[0]][1])
      else {
        let a = pdirs[random(helpers.removeDir(this.dir,wdirs))]
        this.setPos(a[0],a[1])
      }
    }
    else if (manDist > 2){// flee the man
      let mx = man.x, my = man.y, tx = this.x, ty = this.y
      let index =
        ((mx < tx && my === ty) || (mx < tx && abs(my-ty) <= abs(mx-tx))) ? [0,2,3] : //right, up, down
        ((mx > tx && my === ty) || (mx > tx && abs(my-ty) <= abs(mx-tx))) ? [1,3,2] : //left, down, up
        ((mx === tx && my > ty) || (my > ty && abs(my-ty) >= abs(mx-tx))) ? [2,0,1] :   //up, right, left
        ((mx === tx && my < ty) || (my < ty && abs(my-ty) >= abs(mx-tx))) ? [3,1,0] : -1    //down, left, right
      if (index === -1){
        console.log(mx,my,tx,ty)
        return
      }
      for (let i = 0; i < 3; i++){
        let x = pdirs[index[i]][0]
        let y = pdirs[index[i]][1]
        if (helpers.withinBounds(this.x+x,this.y+y) && !nonWalkable.includes(board.cells[this.x+x][this.y+y].type)){
          this.setPos(x,y)
          break
        }
      }
    }
    else { // go where ever you can
      let a = pdirs[random(wdirs)]
      this.setPos(a[0],a[1])
    }

  }

  setPos(x,y){
    this.x += x
    this.y += y
    this.dir = x > 0 ? 0 : x < 0 ? 1 : y < 0 ? 2 : 3
  }

}
