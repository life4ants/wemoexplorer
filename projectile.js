class Projectile {
  constructor(type, x,y,dir){
    this.pos = createVector(x,y)
    let dx, dy
    switch(dir){
      case 0: dx = 1, dy = 0;  break;
      case 1: dx = -1, dy = 0; break;
      case 2: dx = 0, dy = -1; break;
      case 3: dx = 0, dy = 1;
    }
    this.vel = createVector(dx*15, dy*15)
    this.acc = createVector(-dx*0.11, -dy*0.11)
    this.phase = "fly"
    this.frame = 0
    this.ring = []
    this.type = type
    this.dir = dir
  }

  move(){
    this.pos.add(this.vel)
    this.vel.add(this.acc)
  }

  display(){
    if (this.type === "bomb"){
      if (this.phase === "fly"){
        fill(0)
        ellipseMode(CENTER)
        ellipse(this.pos.x+10, this.pos.y+10, 10,10)
      }
      else {// phase is "explode"
        for (var i = this.ring.length - 1; i >= 0; i--) {
          this.drawExplosion(this.ring[i].x, this.ring[i].y, this.ring[i].frame)
          this.ring[i].frame++
          if (this.ring[i].frame > 14)
            this.ring.splice(i, 1)
        }
      }
    }
    else if (this.type === "arrow"){
      // -12 and -1 offsets, set at construction
      image(tiles["arrowInFlight"], this.pos.x-12, this.pos.y-1, 25, 25, this.dir*25, 0, 25, 25)
    }
  }

  drawExplosion(x,y,frame){
    let sx = (frame%4)*32
    let sy = Math.floor(frame/4)*32
    image(tiles.explosion, x*25-3, y*25+topbarHeight-3, 32, 32, sx, sy, 32, 32)// offset by -3 to line up 32x32 explosion
  }


  update(){//returns true if flight is over, false otherwise
    let x = floor((this.pos.x)/25)
    let y = floor((this.pos.y-topbarHeight)/25)
    if (this.phase === "fly"){
      switch (this.type){
        case "bomb": return this.updateBomb(x,y)
        case "arrow": return this.updateArrow(x,y)
      }
    }
    else if (this.phase === "explode"){
      if ([4,8,12].includes(this.frame))
        this.blowRing((this.frame/4)-1)
      this.frame++
      return this.ring.length === 0
    }
  }

  updateBomb(x,y){
    if (!helpers.withinBounds(x,y) || this.vel.mag() < 0.1)
        return true
    if (!board.cells[x][y].revealed){
      board.revealCell(x,y,true)
      this.pos = {x,y} 
      this.phase = "explode"
      this.ring.push({x,y, frame: 0})
      return false
    }
    this.move()
    return false
  }

  updateArrow(x,y){ //return true if flight is over, false otherwise
    if (!helpers.withinBounds(x,y))
      return true
    let cell = board.cells[x][y]
    for (let i = board.rabbits.length - 1; i >= 0; i--) {
      let r = board.rabbits[i]
      if (r.x === x && r.y === y){
        board.rabbits.splice(i, 1)
        cell.rabbits = cell.rabbits ? cell.rabbits + 1 : 1
        cell.arrows = cell.arrows ? cell.arrows + 1 : 1
        return true
      }
    }
    if (this.vel.mag() < 0.1){
      cell.arrows = cell.arrows ? cell.arrows + 1 : 1
      return true
    } 
    this.move()
    return false 
  }

  blowRing(r){
    for (let i = 0; i < helpers.ringList[r].length; i++){
      let x = this.pos.x+helpers.ringList[r][i].x
      let y = this.pos.y+helpers.ringList[r][i].y
      if (helpers.withinBounds(x,y)){
        if (!board.cells[x][y].revealed){
          board.revealCell(x, y, true)
          this.ring.push({x,y, frame: 0})
        }
      }
    }
  }
}