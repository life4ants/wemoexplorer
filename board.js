class Board extends WemoObject {
  constructor(a,b,fillType){
    super()
    this.buildings = []
    this.rabbits = []
    this.teleports = []
    this.berryBushes = []
    if (arguments.length === 1 && typeof a === "object"){//loading a game, whether default, custom or resumed
      this.import(a)
      this.initializeObjects()
    }
    else if (arguments.length === 3){// creating a new game on editor
      this.cols = a
      this.rows = b
      let output = []
      for (let x = 0; x<this.cols; x++){
        output.push([])
        for (let y = 0; y<this.rows; y++){
          output[x].push({tile: fillType, type: fillType})
        }
      }
      this.cells = output
      this.import({
        berryTrees: [], berryBushes: [], fires: [], progress: false, version: 3, wemoMins: 120, type: "custom", level: 10
      })
      this.startX = this.cols > 8 ? 8 : this.cols-1
      this.startY = this.rows > 8 ? 8 : this.rows-1
    }
  }

  save(){
    let revealCount = 0
    let trees = []
    let bushes = []
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j< this.rows; j++){
        let cell = this.cells[i][j]
        if (j === this.startY && [i,i+1,i-1].includes(this.startX))
          cell.revealed = 2
        else {
          cell.revealed = 0
          revealCount++
        }
        if (cell.type === "berryTree"){
          cell.id = trees.length
          trees.push({x: i, y: j, berries: []})
        }
        if (cell.type === "berryBush"){
          cell.id = bushes.length
          bushes.push({x: i, y: j, berries: []})
        }
      }
    }
    this.revealCount = revealCount
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
      this.showObjects()
    
    if (!game.preview){
      // show cells surround the man if needed:
      let n = 1
      for (let i = -1; i <= 1; i++){
        for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
          let a = man.x+i
          let b = man.y+j
          if (a >= 0 && a < this.cols && b >= 0 && b < this.rows && !this.cells[a][b].revealed){
            this.showCell(a, b, this.cells[a][b], true)
            image(tiles["clouds"+n], a*25, b*25+topbarHeight)
          }
          n++
        }
      }
    }
  }

  fill(){
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j< this.rows; j++){
        this.pickCell(i,j)
      }
    }
  }

  initializeObjects(){
    for (let i = 0; i < this.buildings.length; i++){
      for (let j = 0; j < this.buildings[i].items.length; j++){
        let item = this.buildings[i].items[j]
        if (typeof item === "object"){
          let container = new Backpack(item.type, item.items)
          this.buildings[i].items[j] = container
        }
      }
    }
    for (let i = 0; i < this.rabbits.length; i++){
      let rabbit = new Rabbit({x: this.rabbits[i].x, y: this.rabbits[i].y})
      this.rabbits[i] = rabbit
    }
  }

 addRabbits(){
    let types = helpers.countTypes(board)
    let total = this.rows*this.cols
    let land = total - (types.water || 0 ) - (types.river || 0)
    for (let i = 0; i < land/600; i++){
      let pos = helpers.randomPicker(["grass", "longGrass", "sand", "veggies"])
      if (pos)
        this.rabbits.push(new Rabbit(pos))
    }
  }

  showObjects(){
    //apple Trees:
    for (let i=0; i<this.berryTrees.length; i++){
      let tree = this.berryTrees[i]
      if (viewport.onScreen(tree.x, tree.y) && this.cells[tree.x][tree.y].revealed){
        for (let j = 0; j< tree.berries.length; j++){
          image(tiles.apple, tree.x*25+tree.berries[j].x, tree.y*25+tree.berries[j].y+topbarHeight)
        }
      }
    }
    if (this.berryBushes){
      for (let i=0; i<this.berryBushes.length; i++){
        let tree = this.berryBushes[i]
        if (viewport.onScreen(tree.x, tree.y) && this.cells[tree.x][tree.y].revealed){
          noStroke()
          fill(128,0,128)
          ellipseMode(CENTER)
          for (let j = 0; j< tree.berries.length; j++){
            ellipse(tree.x*25+tree.berries[j].x, tree.y*25+tree.berries[j].y+topbarHeight, 4, 4)
          }
        }
      }
    }
    // Fires:
    for (let i=0; i<this.fires.length; i++){
      let tile = this.fires[i].value > 0 ? tiles.fire[Math.floor((frameCount%6)/2)] :
        man.fireId === i ? tiles.firepitOutlined : tiles.firepit
      image(tile, this.fires[i].x*25, this.fires[i].y*25+topbarHeight)
      if (this.fires[i].value > 0)
        this.drawProgressBar(this.fires[i].x, this.fires[i].y, this.fires[i].value, 0)
    }
    //Rabbits:
    for (let r of this.rabbits){
      r.update()
    }
    //Bombs:
    if (this.bombs){
      for (var i = this.bombs.length - 1; i >= 0; i--) {
        this.bombs[i].display()
        if (this.bombs[i].update())
          this.bombs.splice(i, 1)
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
        image(tiles[b.type], b.x*25, b.y*25+topbarHeight)
        if (b.type === "campsite"){
          if (b.isCooking){
            image(tiles.claypot_water, b.x*25+12, (b.y+1)*25+topbarHeight, 10,10)
            this.drawBadge(b.x*25+4, b.y*25+6+topbarHeight, "C", bootstrapColors.info)
          }
          if (b.fireValue > 0){
            let tile = tiles.fire[Math.floor((frameCount%6)/2)]
            image(tile, b.x*25+5, (b.y+1)*25+topbarHeight+5, 25, 15, 0, 0, 25, 15)
            this.drawProgressBar(b.x, b.y+1, b.fireValue, 5)
          }
          this.drawBadge(b.x*25+42, b.y*25+6+topbarHeight, b.items.length, "#000")
        }
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
    let img = tiles[cell.tile] || tiles["random"]
    // print the tile:
    image(img, x*25, y*25+offset)
    
    // print the type:
    if (["rock", "clay"].includes(cell.type)){
      image(tiles[cell.type+cell.quantity], x*25, y*25+offset)
    }
    else if (cell.type.substr(-4,4) === "pile"){
      let tile = cell.quantity > 1 ? cell.type.substr(0, cell.type.length-4)+"s" : cell.type.substr(0, cell.type.length-4)
      image(tiles[tile], x*25, y*25+offset)
      if (cell.quantity > 1)
        this.drawBadge(x*25+4, y*25+topbarHeight+8, cell.quantity, "#000")
    }
    else if (seeThru.includes(cell.type))
      image(tiles[cell.type], x*25, y*25+offset)
    else if (cell.type === "construction"){
      image(tiles.construction[cell.construction.type], x*25, y*25+offset)
      for (let i = 0; i < cell.construction.needed.length; i++) {
        let item = cell.construction.needed[i]
        let a = i < 2 ? i : i-2
        let b = Math.floor(i/2)
        this.drawBadge(x*25+a*14+4, y*25+offset+(b*14)+4, item.quantity, item.color)
      }
    }
    //print dead rabbits and arrows:
    if (cell.rabbits)
      image(tiles["rabbitDead"], x*25, y*25+offset)
    if (cell.arrows)
      image(tiles["arrow"], x*25, y*25+offset)
      
    if (cell.revealed === 1 && !game.preview)
      image(tiles.cloudsHalf, x*25, y*25+offset)
  }

  pickCell(x,y){
    let cell = this.cells[x][y]
    if (cell.type.substr(0,6) === "random"){
      let roll = Math.random()
      if (cell.type === "randomGrass" && roll < .8){
        let a = Math.floor(Math.random()*3)+1
        cell.type = "longGrass"
        cell.tile = "longGrass"+a
      }
      else if (cell.type === "randomBerries" && roll < .7){
        cell.type = "berryTree"
        cell.tile = "berryTree"
        cell.id = this.berryTrees.length
        this.berryTrees.push({x, y, berries: []})
      }
      else if (["randomLog", "randomStick"].includes(cell.type)){
        if (roll < .5)
          cell.type = cell.type === "randomLog" ? "log" : "stick"
        else
          cell.type = cell.tile.replace(/\d+$/, "")
      }
      else if (cell.type === "randomRock"){
        let a = Math.floor(Math.random()*4)+1
        if (Math.random() < .5){
          cell.type = "rock"
          cell.quantity = a
        }
        else
          cell.type = cell.tile.replace(/\d+$/, "")
      }
      else if (cell.type === "randomTree"){
        if (roll > .6){
          cell.type = "treeThin"
          cell.tile = "treeThin"
        }
        else if (roll > .1){
          cell.type = "tree"
          cell.tile = "tree"
        }
        else {
          cell.type = "grass"
          cell.tile = "grass"
        }
      }
      else {
        cell.type = "grass"
        cell.tile = "grass"
      }
    }
  }

  revealCell(x,y,fully){
    if (fully){
      this.cells[x][y].revealed = 2
      this.revealCount--
    }
    else {
      this.cells[x][y].revealed++
      if (this.cells[x][y].revealed === 1)
        this.revealCount --
    }
    if (this.revealCount === 0){
      if (this.type === "default" && this.level+1 > game.currentPlayer.unlockedLevel){
        game.currentPlayer.unlockedLevel = this.level+1
        let p = JSON.parse(localStorage.wemoPlayers)
        p[game.currentPlayer.index] = game.currentPlayer
        localStorage.setItem("wemoPlayers", JSON.stringify(p)) 
      }
      sounds.play("win")
      setTimeout(popup.setAlert("ROH RAH RAY! You won!!\nYou revealed the whole world in "+(floor(board.wemoMins/15)/4-2)+" wemo hours."), 0)
    }
  }

  clicker(){
    let y = Math.floor((mouseY-topbarHeight)/25)
    let x = Math.floor(mouseX/25)
    let cell = this.cells[x][y]
    if (cell.type === "campsite"){
      popup.grabMenu("info", cell.id)
    }
    // else if(game.isMobile){
    //   let mx = map(winMouseX, world.leftOffset, window.innerWidth, 0, 100)
    //   let my = map(winMouseY, topbarHeight, window.innerHeight, 0, 100)

    //   if (mx > my){
    //     if (mx < 100-my) //up
    //       active.move(0, -1)
    //     else
    //       active.move(1, 0) //right
    //   }
    //   else {
    //     if (mx < 100-my)
    //       active.move(-1, 0) //left
    //     else
    //       active.move(0, 1) //down
    //   }
    // }
    if (mouseButton === RIGHT)
      console.log(x,y,cell)
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

    man.inDark = timer.dark

    fill(0,0,0,alpha)
    noStroke()
    beginShape()
    vertex(0,0)
    vertex(width,0)
    vertex(width,height)
    vertex(0,height)
    let fires = board.fires
    for (let f of fires){
      if (f.value > 0)
        this.cutFireCircle(f.x, f.y, f.value)
    }
    for (let b of this.buildings){
      if (b.fireValue > 0)
        this.cutFireCircle(b.x, b.y+1, b.fireValue)
    }
    endShape(CLOSE)
    for (let f of fires){
      if (f.value > 0)
        this.drawFireCircle(f.x,f.y,f.value,alpha)
    }
    for (let b of this.buildings){
      if (b.fireValue > 0)
        this.drawFireCircle(b.x,b.y+1,b.fireValue,alpha)
    }
    if (man.inDark && man.isSleeping)
      image(tiles.z, man.x*25, man.y*25+topbarHeight)
  }

  cutFireCircle(bx,by,value){
    let size = (value/4)+3.1
    let x = bx*25+12.5
    let y = by*25+12.5+topbarHeight
    let r = size*25/2
    let arm = r*0.54666
    if (timer.dark && man.inDark){
      let d = dist(active.x*25+12.5, active.y*25+topbarHeight+12.5, x, y)
      man.inDark = d > r-10
    }
    beginContour()
    vertex(x,y-r)
    bezierVertex(x-arm,y-r,x-r,y-arm,x-r,y)
    bezierVertex(x-r,y+arm,x-arm,y+r,x,y+r)
    bezierVertex(x+arm,y+r,x+r,y+arm,x+r,y)
    bezierVertex(x+r,y-arm,x+arm,y-r,x,y-r)
    endContour()
  }

  drawFireCircle(x,y,value,alpha){
    let size = (value/4)+3.1
    ellipseMode(CENTER)
    if (alpha < 20){
      fill(0,0,0,Math.floor(alpha/2))
      noStroke()
      ellipse(x*25+12.5,y*25+12.5+topbarHeight,size*25,size*25)
    }
    else {
      noFill()
      strokeWeight(2)
      for (let i = size*25-1; i > 1; i-=3){
        let d = alpha < 40 ? alpha-20 : (alpha-40)/(size*25)*i+20
        stroke(0,0,0,d)
        ellipse(x*25+12.5,y*25+12.5+topbarHeight,i,i)
      }
    }
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

  drawProgressBar(i,j,value, Xoffset){
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
