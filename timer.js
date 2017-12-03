let saveC = 0

let viewport = {
  top: topOffset,
  left: leftOffset,
  bottom: window.innerHeight-topOffset,
  right: window.innerWidth-leftOffset
}

function showTopbar(){
  let boardLeft = $("#board").position().left-leftOffset
  let boardTop = $("#board").position().top-topOffset
  viewport.left = boardLeft < 0 ? abs(boardLeft) : 0
  viewport.top = boardTop < 0 ? abs(boardTop) : 0
  viewport.right = window.innerWidth < worldWidth+leftOffset ? viewport.left+window.innerWidth-leftOffset : viewport.left+worldWidth
  viewport.bottom = window.innerHeight < worldHeight ? viewport.top+window.innerHeight-topOffset : viewport.top+worldHeight
  let width = window.innerWidth-leftOffset
  noStroke()
  fill(255)
  rect (viewport.left, viewport.top, width, topbarHeight)
  if (frameCount%3 === 0){
    updateTimer()
  }
  if (frameCount%20 === 0){
    updateFires()
  }
  if (frameCount % 75 === 0){
    growBerries()
  }
  if (frameCount % 180 === 0 && man.health < 5000)
    man.health++
  showBackpack()
  showEnergy = smoothChange(showEnergy, man.energy)
  showHealth = smoothChange(showHealth, man.health)
  showEnergyBar("Energy: ", Math.round(showEnergy), 3)
  showEnergyBar("Health: ", Math.round(showHealth), 30)
  showTimer()
  if (game.infoShown)
    showInfo()
  if (frameCount%239 === 0){
    saveC++
    if (Date.now()-frameTime < 18 || saveC > 2){
      game.saveGame()
      if (saveC > 2)
        console.log("extra save", Date.now()-frameTime)
      else
        console.log("game saved")
      saveC = 0
    }
  }
}

function showTimer(){
  let showMins = board.wemoMins%60 < 10 ? "0"+board.wemoMins%60 : board.wemoMins%60
  let showHours = Math.floor(board.wemoMins/60)%12 === 0 ? 12 : Math.floor(board.wemoMins/60)%12
  let suffix = board.wemoMins%1440 < 720 ? " AM" : " PM"
  let top = viewport.top+20

  textAlign(RIGHT, TOP)
  textSize(26)
  fill(0)
  text(" Day "+ (Math.floor(board.wemoMins/1440)+1) + ", "+showHours+":"+showMins+suffix, viewport.right-40, top)
  image(tiles[timeOfDay], viewport.right-35, top)
}

function showEnergyBar(title, value, offset){
  let top = viewport.top+offset
  let widthFactor = window.innerWidth > 1000 ? 10 : 16
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
}

function showBackpack(){
  let left = window.innerWidth > 1000 ? viewport.left+530 : viewport.left+340
  let top = viewport.top+3
  image(tiles.backpack, left, top)
  if (backpack.weight > 0){
    let items = backpack.getAllItems()
    for (let i = 0; i<items.length; i++){
      let row = i > 1 ? 22 : -1
      let col = i > 1 ? i-2 : i
      image(tiles[items[i].type], col*25+left+2, top+row)
      drawBadge(col*25+left+22, top+5+row, items[i].quantity, "#000")
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
      drawBadge(left+110, top+25, man.basket.quantity, "#000")
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

function showInfo(){
  let f = timeOfDay === "night" || game.paused ? 255 : ["dusk", "dawn"].includes(timeOfDay) ? 230 : 20
  fill(f)
  textSize(15)
  textAlign(LEFT,BOTTOM)
  let cost = 2.5+(backpack.weight/8)
  if (man.basket)
    cost = 2.5+(man.basket.quantity/10 + backpack.weight)/8
  let message = "man dist: "+man.stepCount+" cells left to explore: "+board.revealCount+" walking cost: "+(Math.round(cost*100)/100)
  text(message, viewport.left, viewport.bottom)
}

function setTime(smins){
  startTime = Date.now() - (smins*250)
  board.wemoMins = smins
  let mins = smins%1440
  timeOfDay = mins >= 60 && mins <= 119 ? "dawn" :
                mins >= 1320 && mins <= 1379 ? "dusk" :
                  mins >= 1380 || mins <= 59 ? "night" :
                    "day"

}

function updateTimer(){
  let newMins = Math.floor((Date.now() - startTime)/250)
  if (newMins - board.wemoMins > 5)
    resumeTimer()
  else
    board.wemoMins = newMins

  let mins = board.wemoMins%1440
  timeOfDay = mins >= 60 && mins <= 119 ? "dawn" :
                mins >= 1320 && mins <= 1379 ? "dusk" :
                  mins >= 1380 || mins <= 59 ? "night" :
                    "day"

  if (mins >= 1260 && mins <= 1290){
    message = "Night is Coming!!"
    showCount = 8
  }
}

function resumeTimer(){
  let newMins = Math.floor((Date.now() - startTime)/250)
  startTime += (newMins-board.wemoMins-1)*250
  board.wemoMins = Math.floor((Date.now() - startTime)/250)
}

function showNight(){
  let alpha, time
  if (game.paused) {
    alpha = timeOfDay === "day" ? 230 : 255
    fill(0,0,0,alpha)
    rect(0,0,worldWidth,worldHeight)
    return
  }

  switch(timeOfDay){
    case "day":
      return
    case "dusk":
      time = board.wemoMins%1440-1320
      alpha = Math.floor(255-pow((60-time)*.266, 2))
      break
    case "night":
      alpha = 255
      break
    case "dawn":
      time = board.wemoMins%1440-60
      alpha = Math.round(255-pow((time+1)*.266, 2))
      break
  }

  let dark = (board.wemoMins%1440 >= 1360 || board.wemoMins%1440 < 80)
  man.inDark = dark

  fill(0,0,0,alpha)
  noStroke()
  beginShape()
  vertex(0,0)
  vertex(worldWidth,0)
  vertex(worldWidth,worldHeight)
  vertex(0,worldHeight)
  let fires = board.objectsToShow.fires
  for (let i=0; i<fires.length; i++){
    if (fires[i].value > 0){
      let size = (fires[i].value/4)+3.1
      let x = fires[i].x*25+12.5
      let y = fires[i].y*25+12.5+topbarHeight
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
  }
  endShape(CLOSE)
  for (let i =0; i<fires.length; i++){
    if (fires[i].value > 0){
      let size = (fires[i].value/4)+3.1
      drawFireCircle(fires[i].x,fires[i].y,size,alpha)
    }
  }
  if (man.inDark && man.isSleeping)
    image(tiles.z, man.x*25, man.y*25+topbarHeight)
}

function drawFireCircle(x,y,size,alpha){
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

function updateFires(){
  let fires = board.objectsToShow.fires
  let x = Math.round(frameCount%40/20)
  for (let i=x; i<fires.length; i+=2){
    if (fires[i].value > 0){
      fires[i].value--
    }
  }
}

function growBerries(){
  let trees = board.objectsToShow.berryTrees
  let x = Math.round(frameCount%300/75)
  for (let i=x; i<trees.length; i+=4){
    addBerry(trees[i])
  }
}

function addBerry(berryTree){
  if (berryTree.berries.length >= 5)
    return
  let p = Math.floor(Math.random()*5)
  for (let i=0; i<berryTree.berries.length; i++){
    if (p === berryTree.berries[i].id){
      p = Math.floor(Math.random()*5)
      i = -1
    }
  }
  let x = p === 3 ? 3 : p === 1 ? 9 : p === 0 ? 2 : 18
  let y = p === 2 ? 3 : p === 1 ? 0 : p === 0 ? 3 : 14
  berryTree.berries.push({id: p, x, y})
}
