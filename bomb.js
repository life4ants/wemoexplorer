class Bomb {
  constructor(x,y,dir){
    this.pos = createVector(x,y)
    let dx, dy
    let speed = 15
    switch(dir){
      case 0: dx = 1, dy = 0;  break;
      case 1: dx = -1, dy = 0; break;
      case 2: dx = 0, dy = -1; break;
      case 3: dx = 0, dy = 1;
    }
    this.vel = createVector(dx*speed, dy*speed)
    this.acc = createVector(-dx*0.1, -dy*0.1)
    this.phase = "fly"
    this.frame = 0
  }

  move(){
    let x = floor((this.pos.x+3)/25)
    let y = floor((this.pos.y+3-topbarHeight)/25)
    if (this.phase === "fly"){
      if (!helpers.withinBounds(x,y) || this.vel.mag() < 0.1)
        return true
      if (!board.cells[x][y].revealed){
        board.revealCell(x,y,true)
        this.pos = createVector(x*25-3, y*25+topbarHeight-3)
        this.phase = "explode"
      }
      else {
        this.pos.add(this.vel)
        this.vel.add(this.acc)
      }
    }
    else {
      this.frame++
      if (this.frame > 14)
        return true
    }
    return false
  }

  display(){
    if (this.phase === "fly"){
      fill(0)
      ellipseMode(CENTER)
      ellipse(this.pos.x+16, this.pos.y+16, 10,10)
    }
    else
      this.drawExplosion()
  }

  delete(){
    delete this
  }

  drawExplosion(){
    let sx = (this.frame%4)*32
    let sy = Math.floor(this.frame/4)*32
    image(tiles.explosion, this.pos.x, this.pos.y, 32, 32, sx, sy, 32, 32)
  }
}