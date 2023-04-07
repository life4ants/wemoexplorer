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
    this.ring = {x: 2, y:1, n: 0, cells: []}
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
        for (let c of this.ring.cells)
          this.drawExplosion(c.x, c.y)
      }
    }
    else if (this.type === "arrow"){
      // -12 and -1 offsets, set at construction
      image(tiles["arrowInFlight"], this.pos.x-12, this.pos.y-1, 25, 25, this.dir*25, 0, 25, 25)
    }
  }

  drawExplosion(x,y){
    let sx = (this.frame%4)*32
    let sy = Math.floor(this.frame/4)*32
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
      if (this.frame === 0)
        this.blowRing(8)
      else if (this.frame === 7)
        this.blowRing(24)
      this.frame++
      return this.frame > 14
    }
  }

  updateBomb(x,y){
    if (!helpers.withinBounds(x,y) || this.vel.mag() < 0.1)
        return true
    if (!board.cells[x][y].revealed){
      board.revealCell(x,y,true)
      this.pos = {x,y} 
      this.phase = "explode"
      this.ring.cells = [{x,y}]
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

  blowRing(stop){
    while (this.ring.n < stop){
      let x = this.pos.x+this.ring.x-2
      let y = this.pos.y+this.ring.y-2
      if (x >= 0 && x < board.cols && y >= 0 && y < board.rows){
        if (!board.cells[x][y].revealed){
          board.revealCell(x, y, true)
          this.ring.cells.push({x,y})
        }
      }
      this.advanceRing()
      this.ring.n++
    }
  }

  advanceRing(){
    if (this.ring.y==4 && this.ring.x>0)
      this.ring.x--
    else if (this.ring.x==1 && this.ring.y>0)
      this.ring.y--
    else if (this.ring.y==0 && this.ring.x<4)
      this.ring.x++
    else if (this.ring.x==4 && this.ring.y<4)
      this.ring.y++
    else if (this.ring.x==0 && this.ring.y>0)
      this.ring.y--
    else if (this.ring.y==1 && this.ring.x<3)
      this.ring.x++
    else if (this.ring.x==3 && this.ring.y<3)
      this.ring.y++
    else if (this.ring.y==3 && this.ring.x>1)
      this.ring.x--
  }
}