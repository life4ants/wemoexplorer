class Board extends WemoObject {
  constructor(a,b){
    super()
    this.buildings = []
    if (arguments.length === 1 && typeof a === "object"){//loading a game, whether default, custom or resumed
      this.import(a)
      if (this.version !== 3)
        this.convertVersion2()
    }
    else if (arguments.length === 2){// creating a new game on editor
      this.cols = a
      this.rows = b
      let output = []
      for (let x = 0; x<this.cols; x++){
        output.push([])
        for (let y = 0; y<this.rows; y++){
          output[x].push({tile: "water", type: "water"})
        }
      }
      this.cells = output
      this.import({
        berryTrees: [], fires: [], startX: 8, startY: 8, progress: false, version: 3, wemoMins: 120, type: "custom", level: 10
      })
    }
  }

  save(){
    let revealCount = 0
    let trees = []
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j< this.rows; j++){
        let cell = this.cells[i][j]
        if (j === this.startY && [i,i+1,i-1].includes(this.startX))
          cell.revealed = true
        else {
          cell.revealed = false
          revealCount++
        }
        if (cell.type === "berryTree"){
          cell.id = trees.length
          trees.push({x: i, y: j, berries: []})
        }
        if (helpers.isNextToType(i,j, ["pit", "sandpit"]))
          cell.byPit = true
        else
          delete cell.byPit
      }
    }
    this.revealCount = revealCount
    this.berryTrees = trees
    let name = prompt("enter name for game")
    if (name !== null){
      this.name = name
      localStorage.setItem("board"+name, JSON.stringify(this))
      alert("Game "+name+" was saved.")
    }
  }

  display(){
    let left, right, top, bottom
    if (game.mode === "edit"){
      top = 0
      left = 0
      bottom = this.rows
      right = this.cols
    }
    else {
      top = floor(viewport.top/25)
      left = floor(viewport.left/25)
      right = min(floor(viewport.right/25)+1, this.cols)
      bottom = min(floor((viewport.bottom-topbarHeight)/25)+1, this.rows)
    }

    for (let i = left; i < right; i++) {
      for (let j = top; j< bottom; j++){
        let cell = this.cells[i][j]
        let offset = game.mode === "edit" ? 0 : topbarHeight
        let img = game.mode === "edit" || cell.revealed ? tiles[cell.tile]: tiles["clouds"]
        try {
          image(img, i*25, j*25+offset)
        }
        catch(error){
          console.error(i,j,this.cells[i][j])
        }
        this.showCell(i, j, cell, offset)
      }
    }
    if (game.mode === "edit")
      image(tiles.players[0], this.startX*25, this.startY*25, 25, 25, 0, 25, 25, 25)
    else
      this.showObjects()
  }

  fill(){
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j< this.rows; j++){
        this.pickCell(i,j)
      }
    }
  }

  showObjects(){
    for (let i=0; i<this.berryTrees.length; i++){
      let tree = this.berryTrees[i]
      if (this.cells[tree.x][tree.y].revealed){
        noStroke()
        fill(128,0,128)
        ellipseMode(CORNER)
        for (let j = 0; j< tree.berries.length; j++){
          ellipse(tree.x*25+tree.berries[j].x, tree.y*25+tree.berries[j].y+topbarHeight, 5, 5)
        }
      }
    }
    for (let i=0; i<this.fires.length; i++){
      let tile = this.fires[i].value > 0 ? tiles.fire[Math.floor((frameCount%6)/2)] : tiles.firepit
      image(tile, this.fires[i].x*25, this.fires[i].y*25+topbarHeight)
      if (this.fires[i].value > 0)
        this.drawProgressBar(this.fires[i].x, this.fires[i].y, this.fires[i].value, 0)
    }
    if (this.bombs){
      for (var i = this.bombs.length - 1; i >= 0; i--) {
        this.bombs[i].display()
        if (this.bombs[i].move())
          this.bombs.splice(i, 1)
      }
    }
    if (this.buildings){
      for (let b of this.buildings){
        image(tiles[b.type], b.x*25, b.y*25+topbarHeight)
        if (b.fireValue > 0){
          let tile = tiles.fire[Math.floor((frameCount%6)/2)]
          image(tile, b.x*25+5, (b.y+1)*25+topbarHeight)
          this.drawProgressBar(b.x, b.y+1, b.fireValue, 5)
        }
      }
    }
  }

  showCell(x,y, cell, offset){
    if (["rock", "clay"].includes(cell.type) && (cell.revealed || game.mode === "edit")){
      image(tiles[cell.type+cell.quantity], x*25, y*25+offset)
    }
    else if (cell.type.substr(-4,4) === "pile"){
      let tile = cell.quantity > 1 ? cell.type.substr(0, cell.type.length-4)+"s" : cell.type.substr(0, cell.type.length-4)
      image(tiles[tile], x*25, y*25+offset)
      if (cell.quantity > 1)
        this.drawBadge(x*25+4, y*25+topbarHeight+8, cell.quantity, "#000")
    }
    else if (seeThru.includes(cell.type) && (cell.revealed || game.mode === "edit"))
      image(tiles[cell.type], x*25, y*25+offset)
    else if (cell.type === "construction" && (cell.revealed || game.mode === "edit")){
      image(tiles.construction[cell.construction.type], x*25, y*25+offset)
      for (let i = 0; i < cell.construction.needed.length; i++) {
        let item = cell.construction.needed[i]
        let a = i < 2 ? i : i-2
        let b = Math.floor(i/2)
        this.drawBadge(x*25+a*14+4, y*25+offset+(b*14)+4, item.quantity, item.color)
      }
    }
    if (cell.byPit && (cell.revealed || game.mode === 'edit'))
      this.drawRing(x,y)
  }

  pickCell(x,y){
    let cell = this.cells[x][y]
    if (cell.type.substr(0,6) === "random"){
      let roll = Math.random()
      if (cell.type === "randomPit" && roll < .5){
        cell.type = "pit"
        cell.tile = "pit"
        for (let k = -1; k <=1; k++){
          for (let l = -1; l<=1; l++){
            if (abs(l+k) === 1)
              this.cells[x+k][y+l].byPit = true
          }
        }
      }
      else if (cell.type === "randomGrass" && roll < .8){
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

  revealCell(x,y){
    this.cells[x][y].revealed = true
    this.revealCount--
    if (this.revealCount === 100){
      popup.setAlert("Only 100 more squares to reaveal!\nBombs are now available on the build menu to clear the rest of the world")
      popup.buildOptions[popup.buildOptions.findIndex((e) => e.id === "bomb")].active = true
    }
    else if (this.revealCount === 0)
      setTimeout(popup.setAlert("ROH RAH RAY! You won!!\nYou revealed the whole world in "+(floor(board.wemoMins/15)/4)+" wemo hours."), 2000)
  }

  showNight(){
    let alpha, time
    let mins = this.wemoMins%1440
    if (game.paused) {
      alpha = timer.timeOfDay === "day" ? 230 : 255
      fill(0,0,0,alpha)
      rect(0,0,world.width,world.height)
      return
    }

    switch(timer.timeOfDay){
      case "day":
        return
      case "dusk":
        time = mins-1320
        alpha = Math.floor(255-pow((60-time)*.266, 2))
        break
      case "night":
        alpha = 255
        break
      case "dawn":
        time = mins-60
        alpha = Math.round(255-pow((time+1)*.266, 2))
        break
    }

    let dark = (mins >= 1360 || mins < 80)
    man.inDark = dark

    fill(0,0,0,alpha)
    noStroke()
    beginShape()
    vertex(0,0)
    vertex(world.width,0)
    vertex(world.width,world.height)
    vertex(0,world.height)
    let fires = board.fires
    for (let f of fires){
      if (f.value > 0)
        this.cutFireCircle(f.x, f.y, f.value, dark)
    }
    for (let b of this.buildings){
      if (b.fireValue > 0)
        this.cutFireCircle(b.x, b.y+1, b.fireValue, dark)
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

  cutFireCircle(bx,by,value,dark){
    let size = (value/4)+3.1
    let x = bx*25+12.5
    let y = by*25+12.5+topbarHeight
    let r = size*25/2
    let arm = r*0.54666
    if (dark && man.inDark){
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

  drawRing(x,y){
    noFill()
    stroke(255,0,0)
    strokeWeight(3)
    let offset = game.mode === 'edit' ? 0 : topbarHeight
    ellipseMode(CENTER)
    ellipse(x*25+12.5, y*25+offset+12.5,23,23)
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

  convertVersion2(){
    this.cols = this.cells.length
    this.rows = this.cells[0].length
    this.berryTrees = this.objectsToShow.berryTrees
    this.fires = this.objectsToShow.fires
    this.type = "custom"
    this.level = 10
    delete this.objectsToShow
    this.version = 3
  }
}
