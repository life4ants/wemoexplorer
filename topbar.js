let topbar = {
  energy: 0,
  health: 0,

  display(){
    let widthFactor = viewport.width > 1200 ? 8 : viewport.width > 1000 ? 12 : viewport.width > 600 ? 18 : 28
    let backpackPos = viewport.left+(3000/widthFactor)+25
    this.showSelf()
    this.energy = helpers.smoothChange(this.energy, man.energy)
    this.health = helpers.smoothChange(this.health, man.health)
    this.showEnergyBar("Energy: ", Math.round(this.energy), 3, widthFactor)
    this.showEnergyBar("Health: ", Math.round(this.health), 30, widthFactor)
    this.showBackpack(backpackPos, viewport.top+3)
    if (tutorial.questIsShown){
      tutorial.displayQuest(backpackPos+150)
    }
    else{
      this.showWorldName(backpackPos+150)
    }
    this.showTimer()
  },

  showSelf(){
    noStroke()
    fill(255)
    rect (viewport.left, viewport.top, viewport.width, topbarHeight)
  },

  showTimer(){
    let midSize = viewport.width > 780
    let mins = board.wemoMins%1440
    let showMins = board.wemoMins%60 < 10 ? "0"+board.wemoMins%60 : board.wemoMins%60
    let showHours = Math.floor(board.wemoMins/60)%12 === 0 ? 12 : Math.floor(board.wemoMins/60)%12
    let suffix = mins < 720 ? " AM" : " PM"
    let top = viewport.top+10
    textAlign(RIGHT, TOP)
    textSize(midSize ? 26 : 18)
    fill(0)
    text(" Day "+ (Math.floor(board.wemoMins/1440)+1) + ", "+showHours+":"+showMins+suffix, viewport.right-40, top)
    image(tiles[timer.timeOfDay], viewport.right-35, top)

    let sWidth = midSize ? 270 : 160
    let sOffset = game.mode === "build" ? mins : mins+(frameCount%(world.frameRate/4))/(world.frameRate/4)
    sOffset = midSize ? sOffset : sOffset+55
    image(tiles.timeOfDay, viewport.right-sWidth, top+33, sWidth, 10, sOffset, 0, sWidth, 10)
    strokeWeight(1)
    stroke(255)
    let tr = midSize ? viewport.right : viewport.right+55
    triangle(tr-140, top+32, tr-130, top+32, tr-135, top+38)
    noFill()
    stroke(0)
    rect(viewport.right-sWidth-1, top+32, sWidth, 11)
  },

  showEnergyBar(title, value, offset, widthFactor){
    let top = viewport.top+offset
    fill(255)
    stroke(80)
    strokeWeight(3)
    rect(viewport.left+10, top, Math.floor(3000/widthFactor)+3, 20)
    let color = value > 2000 ? "green" :
                 value > 1000 ? "#e90" : "red"
    if (frameCount%10 < 5 && value < 500)
      fill(255)
    else
      fill(color)
    noStroke()
    rect(viewport.left+12, top+2, Math.floor(value/widthFactor), 17)
    let f, x
    if (value/widthFactor > 80){
      f = 255, x = Math.floor(value/(widthFactor*2))
      textAlign(CENTER,TOP)
      textSize(14)
    }
    else {
      f = 0, x = Math.floor(3000/widthFactor)-2
      textAlign(RIGHT,TOP)
      textSize(12)
    }
    fill(f)
    text(title+value, viewport.left+12+x, top+3)
  },

  showBackpack(left, top){
    // draw backpack:
    image(tiles.backpack, left, top)
    // draw backpack items:
    if (backpack.weight > 0){
      let items = backpack.getAllItems()
      for (let i = 0; i<items.length; i++){
        let row = i > 1 ? -1 : 22
        let col = i > 1 ? i-2 : i
        image(tiles[items[i].type], col*25+left+2, top+row)
        board.drawBadge(col*25+left+22, top+5+row, items[i].quantity, "#000")
      }
      // draw weight bar:
      fill(255)
      stroke(80)
      strokeWeight(1)
      rect(left+55, top-1, 5, 21)
      fill("#6C3C00") // brown color
      noStroke()
      rect(left+56, top+20-Math.floor(backpack.weight/12.5), 4, Math.floor(backpack.weight/12.5))
    }
    // draw tools:
    for (let i = 0; i < toolbelt.tools.length; i++){
      image(tiles[toolbelt.tools[i]], left+80+(i*26), top-1)
    }
    // draw contaniners:
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
          let tile = items[0].type === "water" ? "claypot_water" : items[0].type
          image(tiles[tile], left+80, top+25)
          board.drawBadge(left+100, top+25, items[0].quantity, "#04253F")
        }
        else
          image(tiles.claypot, left+80, top+25)
      }
    }
  },

  showWorldName(left){
    let s = viewport.width > 780 ? 20 : 15
    fill(0)
    textSize(s)
    textAlign(LEFT,TOP)
    text("World:\n"+board.name, left, viewport.top+s/2)
  }
}
