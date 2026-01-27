class Board {
  constructor(a,b,fillType){
    this.buildings = []
    this.rabbits = []
    this.snakes = []
    this.vehicles = []
    this.teleports = []
    this.berryTrees = [] 
    this.berryBushes = []
    this.stars = []
    this.fires = [] 
    this.cells = []
    this.progress = false 
    this.version = 4
    this.wemoMins = 120
    

    if (arguments.length === 1 && typeof a === "object"){//loading a game, whether default, custom or resumed
      for (let key in a){
        this[key] = a[key]
      }
      this.initializeObjects()
    }
    else if (arguments.length === 3){// creating a new game on editor
      this.cols = a
      this.rows = b
      this.type = "custom"
      this.level = 10
      this.playtime = 0

      for (let x = 0; x<this.cols; x++){
        this.cells.push([])
        for (let y = 0; y<this.rows; y++){
          this.cells[x].push({tile: fillType, type: fillType})
        }
      }
      this.startX = this.cols > 8 ? 8 : this.cols-1
      this.startY = this.rows > 8 ? 8 : this.rows-1
    }
  }

  export(){
    let output = {rabbits: [], snakes: [], buildings: []}
    let list = [
      "teleports", "berryTrees", "berryBushes", "stars", "fires", "cells", "progress",
      "version", "wemoMins", "type", "level", "name", "revealCount", "startX", "startY",
      "cols", "rows", "vehicles"
    ]
    for (let i of list){
      output[i] = this[i]
    }
    for (let r of this.rabbits){
      output.rabbits.push(r.export())
    }
    for (let s of this.snakes){
      output.snakes.push(s.export())
    }
    for (let b of this.buildings){
      output.buildings.push(b.export())
    }
    return output
  }

  // saving a game on the builder. Called from editbar.saveBoard
  save(){ 
    let trees = []
    let bushes = []
    this.revealCount = this.cols*this.rows
    for (let i in this.stars){
      this.stars[i].cells = []
    }
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j< this.rows; j++){
        let cell = this.cells[i][j]
        let id = 0
        let mindist = this.rows+this.cols
        for (let a in this.stars){
          let star = this.stars[a]
          let d = dist(i,j,star.x, star.y)
          if (d < mindist){
            mindist = d
            id = a
          }
        }
      
        this.stars[id].cells.push({x:i,y:j})
        
        if (cell.type === "berryTree"){
          cell.id = trees.length
          trees.push({x: i, y: j, berries: []})
        }
        else if (cell.type === "berryBush"){
          cell.id = bushes.length
          bushes.push({x: i, y: j, berries: []})
        }
      }
    }
    this.berryTrees = trees
    this.berryBushes = bushes
    if (this.name){
      popup.setInput("Do you want to save the game as "+this.name+"?", "saveBoard", "yesno")
    }
    else {
      popup.setInput("Enter a new name for this world:", "saveBoard", "input")
    }
  }

  display(){
    let edge = viewport.screenEdges()
    for (let i = edge.left; i < edge.right; i++) {
      for (let j = edge.top; j< edge.bottom; j++){
        let cell = this.cells[i][j]
        try {
          this.showCell(i, j, cell, cell.revealed)
        }
        catch(error){
          console.error(i,j,this.cells[i][j], error)
          noLoop()
        }
      }
    }

    if (game.mode === "edit"){
      image(tiles.playerIcon, this.startX*25, this.startY*25)
      rectMode(CENTER)
      editor.showMouse()
      rectMode(CORNER)
      if (this.teleports){
        stroke(255,0,0)
        strokeWeight(2)
        for (let e of this.teleports){
          line((e.a.x*25)+12, (e.a.y*25)+12, (e.b.x*25)+12, (e.b.y*25)+12)
        }
      }
      return
    }
    world.nearMan = []
    this.showObjects()
    
    if (!game.preview && this.revealCount > 0){
      // show rounded clouds around the man (or raft) if unrevealed:
      for (let i = -1; i <= 1; i++){
        for (let j = -1; j<=1; j++){
          let a = active.x+i
          let b = active.y+j
          if (helpers.withinBounds(a,b) && !this.cells[a][b].revealed){
            this.showCell(a, b, this.cells[a][b], true)
          }
        }
      }
      for (let c of world.nearMan){
        c.obj.display()
      }
      let n = 1
      for (let i = -1; i <= 1; i+=2){
        for (let j = -1; j<=1; j+=2){
          let a = active.x+i
          let b = active.y+j
          if (helpers.withinBounds(a,b) && !this.cells[a][b].revealed){
            image(tiles["clouds"+n], a*25, b*25+topbarHeight)
          }
          n++
        }
      }
    }
  }

  initializeObjects(){
     for (let i = 0; i < this.vehicles.length; i++){
      let raft = new WaterCraft(this.vehicles[i])
      this.vehicles[i] = raft
    }
    for (let i = 0; i < this.buildings.length; i++){
      let camp = new Campsite(this.buildings[i])
      this.buildings[i] = camp
    }
    for (let i = 0; i < this.rabbits.length; i++){ 
      let rabbit = new Rabbit(this.rabbits[i])
      this.rabbits[i] = rabbit
    }
    for (let i = 0; i < this.snakes.length; i++){ 
      let snake = new Snake(this.snakes[i])
      this.snakes[i] = snake
    }
  }

  addAnimals(){
    let list = helpers.getAllTypes(board)
    let rabbitSpots = [ ...(list.grass ?? []), ...(list.longGrass ?? []), ...(list.veggies ?? [])]
    let snakeSpots = [... (list.sand ?? []), ...(list.beach ?? [])]
    for (let i = 0; i < rabbitSpots.length; i+=100){
      this.rabbits.push(new Rabbit(random(rabbitSpots)))
    }

    for (let i = 0; i<snakeSpots.length; i+=100){
      this.snakes.push(new Snake(random(snakeSpots)))
    }
  }

  showObjects(){
    //Rabbits:
    for (let r of this.rabbits){
      r.update()
    }
    for (let v of this.vehicles){
      v.update()
    }
    //Bombs:
    if (this.bombs){
      for (var i = this.bombs.length - 1; i >= 0; i--) {
        this.bombs[i].display()
        if (this.bombs[i].update())
          this.bombs.splice(i, 1)
      }
    }
    if (this.snakes){
      for (let s of this.snakes){
        s.update()
      }
    }
    //Arrows:
    if (this.arrows){
      for (var i = this.arrows.length - 1; i >= 0; i--) {
        this.arrows[i].display()
        if (this.arrows[i].update())
          this.arrows.splice(i, 1)
      }
    }
    //Campsites:
    if (this.buildings){
      for (let b of this.buildings){
        image(tiles["campsite"], b.x*25, b.y*25+topbarHeight)
        
          if (b.isCooking){
            image(tiles.claypot_water, b.x*25+12, (b.y+1)*25+topbarHeight, 10,10)
            this.drawBadge(b.x*25+4, b.y*25+6+topbarHeight, "C", bootstrapColors.info)
          }
          if (b.fireValue > 0){
            let tile = tiles.fire[Math.floor((frameCount%6)/2)]
            image(tile, b.x*25+5, (b.y+1)*25+topbarHeight+5, 25, 15, 0, 0, 25, 15)
            this.drawProgressBar(b.x, b.y+1, b.fireValue, 5)
          }
          this.drawBadge(b.x*25+42, b.y*25+6+topbarHeight, b.getItems().length, "#000")
        
      }
    }
  }

  showCell(x,y, cell, revealed){
    if (!revealed && game.mode !== "edit" && !game.preview){
      // in this case, print clouds and be done. 
      image(tiles["clouds"], x*25, y*25+topbarHeight)
      return
    }
    let offset = game.mode === "edit" ? 0 : topbarHeight
    image(tiles[cell.tile] || tiles["random"], x*25, y*25+offset)
    
    // rock or clay:
    if (["rock", "clay"].includes(cell.type)){
      image(tiles[cell.type+cell.quantity], x*25, y*25+offset)
    }
    // piles:
    else if (cell.type.substr(-4,4) === "pile"){
      if (cell.quantity > 1){
        let tile = cell.type === "longGrasspile" ? "longGrass" : 
          cell.type === "rabbitDeadpile" ? "rabbitDead" :
          cell.type.substr(0, cell.type.length-4)+"s"
        image(tiles[tile], x*25, y*25+offset)
        this.drawBadge(x*25+4, y*25+topbarHeight+8, cell.quantity, "#000")
      }
      else { 
        image(tiles[cell.type.substr(0, cell.type.length-4)], x*25, y*25+offset)
      }
    }
    // see thru:
    else if (seeThru.includes(cell.type)){
      image(tiles[cell.type] || tiles["random"], x*25, y*25+offset)
    }
    // construction sites:
    else if (cell.type === "construction"){
      image(tiles.construction[cell.construction.type], x*25, y*25+offset)
      for (let i = 0; i < cell.construction.needed.length; i++) {
        let item = cell.construction.needed[i]
        let a = i < 2 ? i : i-2
        let b = Math.floor(i/2)
        this.drawBadge(x*25+a*14+4, y*25+offset+(b*14)+4, item.quantity, item.color)
      }
    }
    //updates:
    if (["play", "build"].includes(game.mode)){
      if ("berryBush" === cell.type){
        let tree = this.berryBushes[cell.id]
        noStroke()
        fill(128,0,128)
        ellipseMode(CENTER)
        for (let j = 0; j< tree.berries.length; j++){
          ellipse(tree.x*25+tree.berries[j].x, tree.y*25+tree.berries[j].y+topbarHeight, 4, 4)
        }
      }
      else if ("berryTree" === cell.type){
        let tree = this.berryTrees[cell.id]
        for (let j = 0; j< tree.berries.length; j++){
          image(tiles.apple, tree.x*25+tree.berries[j].x, tree.y*25+tree.berries[j].y+topbarHeight)
        }
      }
      else if ("firepit" === cell.type){
        let fire = this.fires[cell.id]
        let tile = fire.value > 0 ? tiles.fire[Math.floor((frameCount%6)/2)] :
          man.fireId === cell.id ? tiles.firepitOutlined : tiles.firepit
        image(tile, fire.x*25, fire.y*25+topbarHeight)
        if (fire.value > 0)
          this.drawProgressBar(fire.x, fire.y, fire.value, 0)
      }
    }
    if ("root" === cell.type && game.mode === "play"){
      cell.growtime++
      if (cell.growtime > world.growtime)
        timer.sprout(cell)
    }
    //print dead rabbits and arrows:
    if (cell.rabbits)
      image(tiles["rabbitDead"], x*25, y*25+offset)
    if (cell.arrows)
      image(tiles["arrow"], x*25, y*25+offset)
  }

  claimStar(x, y, cell){
    let starid = board.stars.findIndex((e)=> e.id === cell.id)
    let tcells = board.stars[starid].cells
    for (let i in tcells){
      let c = board.cells[tcells[i].x][tcells[i].y]
      if (!c.revealed){
        c.revealed = true
        this.revealCount--
      }
    }
    delete cell.id
    board.stars.splice(starid, 1)
    let r = random(9)
    if (cell.tile === "grass"){
      if (r<4){
        cell.tile = "veggies4"; cell.type = "veggies"
      }
      else if (r<6)
        cell.type = "stick"
      else if (r<8)
        cell.type = "log"
      else
        cell.type = "mushroom"
    }
    else if (cell.tile === "sand"){
      if (r<2){
        cell.type = "palm"
      }
      else if (r<6)
        cell.type = "cactus"
      else if (r<8){
        cell.type = "rock"; cell.quantity = 3;
      }
      else
        cell.type = "stick"
    }
    else
      cell.type = cell.tile.replace(/\d+$/, "")
    board.cells[x][y] = cell
    if (board.revealCount <= 0){
      tutorial.checkAction("stars")
    }
  }

  clicker(){
    if (man.isAnimated)
      return
    let y = Math.floor((mouseY-topbarHeight)/25)
    let x = Math.floor(mouseX/25)
    let cell = this.cells[x][y]
    if (cell.type === "campsite"){
      popup.grabMenu("info", cell.id)
    }
    else if (cell.construction){
      let output = []
      for (let e of cell.construction.needed){
        output.push({src: "images/"+e.type+".png", num: e.quantity})
      }
      popup.setMenu(output, "Items needed to complete:", "info")
    }
    else if (game.isMobile){
      
      let mx = mouseX - active.x*25+12
      let my = mouseY-topbarHeight - active.y*25+12
      let keyCode
      if (mx >= my){
        if (mx+my <= 0) //up
          keyCode = 38
        else
          keyCode = 39 //right
      }
      else {
        if (mx+my <= 0)
          keyCode = 37 //left
        else
          keyCode = 40 //down
      }
      keyHandler(keyCode)
    } 
  }

  showNight(){
    let alpha, time
    if (game.paused) {
      alpha = timer.timeOfDay === "day" ? 230 : 255
      fill(0,0,0,alpha)
      rect(0,0,width,height)
      return
    }

    switch(timer.timeOfDay){
      case "day":
        return
      case "dusk":
        time = timer.mins-1320
        alpha = Math.floor(255-pow((60-time)*.266, 2))
        break
      case "night":
        alpha = 255
        break
      case "dawn":
        time = timer.mins-60
        alpha = Math.round(255-pow((time+1)*.266, 2))
        break
    }
    for (let i = viewport.left+128; i < viewport.right+128; i+=256) {
      for (let j = viewport.top+128; j< viewport.bottom+128; j+=256){
        this.darkOutBlock(i, j, 256, alpha)
      }
    }
  }

  darkOutBlock(x,y, size, alpha){ //all in pixels
    let f = this.checkFireDist(x,y,size)
    if (f.show){
      if (f.close){
        fill(0,0,0, min(100,alpha))
        noStroke()
        rect(x-(size/2),y-(size/2)+topbarHeight,size,size)
      }
      else {
        for (let i = x-size/4; i<=x+size/4; i+=size/2){
          for (let j = y-size/4; j<=y+size/4; j+=size/2){
            if (size <= 4){
              this.dimOutBlock(i, j, 2, alpha)
            }
            else
              this.darkOutBlock(i, j, size/2, alpha)
          }
        }
      }
    }
    else {
      fill(0,0,0,alpha)
      noStroke()
      rect(x-(size/2),y-(size/2)+topbarHeight,size,size)
    }
  }

  dimOutBlock(x,y, size, alpha){ // size <= 2
    let fire = {}
    strokeWeight(1)
    for (let i = x-size/2; i<x+size/2; i++){
      for (let j = y-size/2; j<y+size/2; j++){
        let f = this.checkFireDist(i,j,size)
        if (f.show){
          stroke(0,0,0,min(100,alpha))
        }
        else {
          stroke(0,0,0, alpha)
        }
        point(i, j+topbarHeight)
      }
    }
  }

  checkFireDist(x,y,size){
    let show = false
    let close = false
    for (let f of this.fires){
      if (f.value > 0){
        let fd = dist(x,y,f.x*25+12.5,f.y*25+12.5)
        let offset = (f.value/4)+50
        if (fd-offset < size*0.75) {
          show = true
          if (offset-fd > size*0.75){
            close = true
          }
        }
      }
    }
    for (let camp of this.buildings){
      if (camp.fireValue > 0){
        let fd = dist(x,y,camp.x*25+25,camp.y*25+25)
        let offset = (camp.fireValue/4)+50
        if (fd-offset < size*0.75) {
          show = true
          if (offset-fd > size*0.75){
            close = true
          }
        }
      }
    }
    return {show, close}
  }

  drawBadge(x,y,num,color){
    num = num+""
    noStroke()
    fill(color)
    ellipseMode(CENTER)
    ellipse(x,y,10+(num.length*3),13)
    textAlign(CENTER, CENTER)
    let textColor = color === "#B4D9D9" ? 0 : 255
    fill(textColor)
    textSize(10)
    text(num,x,y)
  }

  drawProgressBar(i,j,fireValue, Xoffset){
    let value = map(fireValue, 0, 240, 0, 20)
    fill(255)
    stroke(80)
    strokeWeight(1)
    rect(i*25+2+Xoffset,j*25+19+topbarHeight, 21, 4)
    let color = value > 12 ? "green" :
                 value > 6 ? "#e90" : "red"
    fill(color)
    noStroke()
    rect(i*25+3+Xoffset, j*25+20+topbarHeight, value, 3)
  }
}
