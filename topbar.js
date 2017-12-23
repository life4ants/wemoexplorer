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
    let mins = board.wemoMins%1440
    let showMins = board.wemoMins%60 < 10 ? "0"+board.wemoMins%60 : board.wemoMins%60
    let showHours = Math.floor(board.wemoMins/60)%12 === 0 ? 12 : Math.floor(board.wemoMins/60)%12
    let suffix = mins < 720 ? " AM" : " PM"
    let top = viewport.top+10

    textAlign(RIGHT, TOP)
    textSize(26)
    fill(0)
    text(" Day "+ (Math.floor(board.wemoMins/1440)+1) + ", "+showHours+":"+showMins+suffix, viewport.right-40, top)
    image(tiles[timer.timeOfDay], viewport.right-35, top)
    let sliderPos = game.mode === "build" ? mins : mins+(frameCount%3)/3
    image(tiles.timeOfDay, viewport.right-270, top+33, 270, 10, sliderPos, 0, 270, 10)
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
    if (frameCount%10 < 5 && value < 1000)
      fill(255)
    else
      fill(color)
    noStroke()
    rect(viewport.left+12, top+2, Math.floor(value/widthFactor), 17)
    let f, x
    if (value/widthFactor > 100){
      f = 255, x = Math.floor(value/(widthFactor*2))
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
      rect(left+56, top+20-Math.floor(backpack.weight/12.5), 4, Math.floor(backpack.weight/12.5))
    }
    for (let i = 0; i < toolbelt.tools.length; i++){
      image(tiles[toolbelt.tools[i]], left+80+(i*26), top-1)
    }
    for (let i = 0; i < toolbelt.containers.length; i++){
      if (toolbelt.containers[i].type === "basket"){
        image(tiles.basket, left+80, top+25)
        let items = toolbelt.containers[i].getAllItems()
        for (let i = 0; i < items.length; i++){
          image(tiles[items[i].type], left+82+(i*13), top+25)
          let col = items[i].type === "veggies" ? "#0B2D0C" : "#3A0E12"
          board.drawBadge(left+82+(i*24), top+25, items[i].quantity, col)
        }
      }
      else if (toolbelt.containers[i].type === "claypot"){
        let items = toolbelt.containers[i].getAllItems()
        if (items.length > 0){
          let tile = items[0].type === "water" ? "claypot_water" : "claypot_stew"
          image(tiles[tile], left+80, top+25)
          board.drawBadge(left+100, top+25, items[0].quantity, "#3649A1")
        }
        else
          image(tiles.claypot, left+80, top+25)
      }
    }
  }
}
