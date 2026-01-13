class Board extends WemoObject {
  constructor(a,b,fillType){
    super()
    this.buildings = []
    this.rabbits = []
    this.teleports = []
    this.berryBushes = []
    this.stars = []
    if (arguments.length === 1 && typeof a === "object"){//loading a game, whether default, custom or resumed
      this.import(a)
      this.initializeObjects()
    }
    else if (arguments.length === 3){// creating a new game on editor
      this.cols = a
      this.rows = b
      this.cells = []
      for (let x = 0; x<this.cols; x++){
        this.cells.push([])
        for (let y = 0; y<this.rows; y++){
          this.cells[x].push({tile: fillType, type: fillType})
        }
      }
      this.import({
        berryTrees: [], fires: [], progress: false, version: 4, wemoMins: 120, type: "custom", level: 10, playtime: 0
      })
      this.startX = this.cols > 8 ? 8 : this.cols-1
      this.startY = this.rows > 8 ? 8 : this.rows-1
    }
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
        try {
          this.stars[id].cells.push({x:i,y:j})
        } catch (e){
          console.error(id, e)
        }
        
        if (this.name === "tut" && i<10 && j<10){
          cell.revealed = 2
          this.revealCount--
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
    
    if (!game.preview && this.revealCount > 0){
      // show rounded clouds around the man (or raft) if unrevealed:
      let n = 1
      for (let i = -1; i <= 1; i++){
        for (let j = -1; j<=1; j++){
          let a = active.x+i
          let b = active.y+j
          if (a >= 0 && a < this.cols && b >= 0 && b < this.rows && !this.cells[a][b].revealed){
            this.showCell(a, b, this.cells[a][b], true)
            if (i !== 0 && j !== 0)
              image(tiles["clouds"+n], a*25, b*25+topbarHeight)
          }
          n = i !== 0 && j !== 0? n+1 : n
        }
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
    // print the tile:
    image(tiles[cell.tile] || tiles["random"], x*25, y*25+offset)
    
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
    else if (seeThru.includes(cell.type)){
      image(tiles[cell.type] || tiles["random"], x*25, y*25+offset)
    }
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
      
    if (revealed === 1 && !game.preview)
      image(tiles.cloudsHalf, x*25, y*25+offset)
  }

  claimStar(x, y, cell){
    let starid = board.stars.findIndex((e)=> e.id === cell.id)
    let tcells = board.stars[starid].cells
    for (let i in tcells){
      let c = board.cells[tcells[i].x][tcells[i].y]
      if (!c.revealed)
        this.revealCell(tcells[i].x, tcells[i].y, c, 2)
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
      else if (r<7)
        cell.type = "log"
      else
        cell.type = "mushroom"
    }
    else if (cell.tile === "sand"){
      if (r<2){
        cell.tile = "palm"; cell.type = "palm"
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
    if (board.revealCount <= 0 && board.level > 0){
      game.finishLevel()
    }
  }

  revealCell(x,y,fully){
    if (fully){
      this.cells[x][y].revealed = 2
      this.revealCount--
    }
    else {
      this.cells[x][y].revealed++
      if (this.cells[x][y].revealed === 2)
        this.revealCount --
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
    else if(game.isMobile){
      
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
