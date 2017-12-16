let builder = {
  size: 1,
  x: 0,
  y: 0,
  type: "",
  allowed: false,

  loop(){
    vehicles.display()
    man.display()
    topbar.display()
    if (this.getPos()){
      this.allowed = this.checkAllowed()
      this.show()
    }
  },

  checkAllowed(){
    if (dist(this.x+(this.size/2), this.y+(this.size/2), man.x+0.5, man.y+0.5) > 4)
      return false
    for (let i = this.x; i<this.x+this.size; i++){
      for (let j = this.y; j<this.y+this.size; j++){
        if (!this.rules(i,j) || (man.x === i && man.y === j) || !board.cells[i][j].revealed)
          return false
      }
    }
    return true
  },

  getPos(){
    if (mouseX > viewport.left && mouseY > viewport.top+topbarHeight){
      let o = (this.size-1)*12.5
      let x = Math.floor((mouseX-o)/25)
      let y = Math.floor((mouseY-topbarHeight-o)/25)
      if (x >= 0 && x+this.size <= board.cols && y >= 0 && y+this.size <= board.rows){
        this.x = x
        this.y = y
        return true
      }
    }
    return false
  },

  show(){
    let w = this.size*25
    let c = this.allowed ? "green" : "red"
    stroke(c)
    strokeWeight(3)
    noFill()
    rect(this.x*25,this.y*25+topbarHeight,w,w)
    if (this.allowed){
      ellipseMode(CORNER)
      ellipse(this.x*25,this.y*25+topbarHeight,w,w)
    }
  },

  clicker(){
    if (this.allowed){
      let msg = build(this.type, {x: this.x, y: this.y})
      if (msg)
        popup.setAlert(msg)
      else
        game.toggleBuildMode()
    }
  },

  rules(x,y){
    let cell = board.cells[x][y]
    switch(this.type){
      case "steppingStones":
        return fordable.includes(cell.tile)
      case "raft":
        return (cell.type === "beach" && helpers.isNextToType(x, y, "water")) || cell.type === "river"
      case "campsite":
        return buildable.includes(cell.type)
      case "firepit":
        return ["grass", "sand", "stump", "beach", "beachEdge", "grassBeach", "rockMiddle"].includes(cell.type)
      default:
        return false
    }
  }
}

