let topbar = {
  energy: 0,
  health: 0,

  display(){
    this.showSelf()
    this.energy = helpers.smoothChange(this.energy, man.energy)
    this.health = helpers.smoothChange(this.health, man.health)
    this.showEnergyBar("Energy: ", Math.round(this.energy), 3)
    this.showEnergyBar("Health: ", Math.round(this.health), 30)
    this.showBackpack()
    this.showTimer()
  },

  showSelf(){
    noStroke()
    fill(255)
    rect (viewport.left, viewport.top, viewport.width, topbarHeight)
  },

  showTimer(){
    let showMins = board.wemoMins%60 < 10 ? "0"+board.wemoMins%60 : board.wemoMins%60
    let showHours = Math.floor(board.wemoMins/60)%12 === 0 ? 12 : Math.floor(board.wemoMins/60)%12
    let suffix = board.wemoMins%1440 < 720 ? " AM" : " PM"
    let top = viewport.top+10

    textAlign(RIGHT, TOP)
    textSize(26)
    fill(0)
    text(" Day "+ (Math.floor(board.wemoMins/1440)+1) + ", "+showHours+":"+showMins+suffix, viewport.right-40, top)
    image(tiles[timer.timeOfDay], viewport.right-35, top)
    image(tiles.timeOfDay, viewport.right-270, top+33, 270, 10, board.wemoMins%1440+((frameCount%3)/3), 0, 270, 10)
    strokeWeight(1)
    stroke(255)
    triangle(viewport.right-140, top+32, viewport.right-130, top+32, viewport.right-135, top+38)
    noFill()
    stroke(0)
    rect(viewport.right-271, top+32,270,11)
  },

  showEnergyBar(title, value, offset){
    let top = viewport.top+offset
    let widthFactor = viewport.width > 1000 ? 10 : 16
    fill(255)
    stroke(80)
    strokeWeight(3)
    rect(viewport.left+10, top, Math.floor(5000/widthFactor)+3, 20)
    let color = value > 3333 ? "green" :
                 value > 1666 ? "#e90" : "red"
    fill(color)
    noStroke()
    rect(viewport.left+12, top+2, Math.floor(value/widthFactor), 17)
    let f, x
    if (value/widthFactor > 100){
      f = 250, x = Math.floor(value/(widthFactor*2))
      textAlign(CENTER,TOP)
    }
    else {
      f = 0, x = Math.floor(value/widthFactor)+2
      textAlign(LEFT,TOP)
    }
    fill(f)
    textSize(14)
    text(title+value, viewport.left+12+x, top+2)
  },

  showBackpack(){
    let left = viewport.width > 1000 ? viewport.left+530 : viewport.left+340
    let top = viewport.top+3
    image(tiles.backpack, left, top)
    if (backpack.weight > 0){
      let items = backpack.getAllItems()
      for (let i = 0; i<items.length; i++){
        let row = i > 1 ? 22 : -1
        let col = i > 1 ? i-2 : i
        image(tiles[items[i].type], col*25+left+2, top+row)
        board.drawBadge(col*25+left+22, top+5+row, items[i].quantity, "#000")
      }
      fill(255)
      stroke(80)
      strokeWeight(1)
      rect(left+55, top-1, 5, 21)
      fill("#6C3C00")
      noStroke()
      rect(left+56, top+20-Math.floor(backpack.weight/2), 4, Math.floor(backpack.weight/2))
    }
    if (man.basket){
      if (man.basket.quantity > 0){
        image(tiles.basketBerries, left+80, top+25)
        board.drawBadge(left+110, top+25, man.basket.quantity, "#000")
      }
      else
        image(tiles.basket, left+80, top+25)
    }
    if (man.tools.length > 0){
      for (let i = 0; i < man.tools.length; i++){
        image(tiles[man.tools[i]], left+80+(i*26), top-1)
      }
    }
  }
}