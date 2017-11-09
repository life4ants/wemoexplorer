
function showTopbar(){
  let left = abs($("#board").position().left)
  let top = abs($("#board").position().top-topOffset)
  let width = window.innerWidth
  noStroke()
  fill(255)
  rect (left, top, width, 40)
  if (frameCount%3 === 0){
    updateTimer()
  }
  if (frameCount%20 === 0){
    updateFires()
  }
  if (frameCount % 75 === 0){
    growBerries()
  }
  showBackpack()
  showEnergyBar()
  showTimer()
}

function showTimer(){
  let showMins = wemoMins%60 < 10 ? "0"+wemoMins%60 : wemoMins%60
  let showHours = Math.floor(wemoMins/60)%12 === 0 ? 12 : Math.floor(wemoMins/60)%12
  let suffix = wemoMins%1440 < 720 ? " AM" : " PM"
  let right = abs($("#board").position().left)+window.innerWidth
  let top = abs($("#board").position().top-topOffset)+5

  textAlign(RIGHT, TOP)
  textSize(26)
  fill(0)
  text(" Day "+ (Math.floor(wemoMins/1440)+1) + ", "+showHours+":"+showMins+suffix, right-40, top)
  image(tiles[timeOfDay], right-35, top)
}

function showEnergyBar(){
  let left = abs($("#board").position().left)
  let top = abs($("#board").position().top-topOffset)
  fill(255)
  stroke(80)
  strokeWeight(4)
  rect(left+10, top+7, 504, 26)
  let color = man.energy > 3333 ? "green" :
               man.energy > 1666 ? "#e90" : "red"
  fill(color)
  noStroke()
  rect(left+12, top+9, Math.floor(man.energy/10), 22)
}

function showBackpack(){
  let left = abs($("#board").position().left)
  let top = abs($("#board").position().top-topOffset)
  image(tiles.backpack, left+530, top)
  if (man.backpack.weight > 0){
    let items = man.backpack.items
    for (let i = 0; i<items.length; i++){
      image(tiles[items[i].type], i*25+left+535, top+14)
      if (items[i].type !== "log")
        drawBadge(i*25+left+555, top+19, items[i].quantity)
    }
  }
}

function updateTimer(){
  let newMins = Math.floor((Date.now() - startTime)/250)+120//shift time 2 hours from 0
  if (newMins - wemoMins > 10)
    resumeTimer()
  else
    wemoMins = newMins

  let mins = wemoMins%1440
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
  let newMins = Math.floor((Date.now() - startTime)/250)+120
  startTime += (newMins-wemoMins-1)*250
  wemoMins = Math.floor((Date.now() - startTime)/250)+120
}

function showNight(){
  let alpha, time
  switch(timeOfDay){
    case "day":
      if (!game.paused)
        return
      alpha = 220
      break
    case "dusk":
      time = wemoMins%1440-1320
      alpha = Math.floor(255-pow((60-time)*.266, 2))
      break
    case "night":
      alpha = 255
      break
    case "dawn":
      time = wemoMins%1440-60
      alpha = Math.round(255-pow((time+1)*.266, 2))
      break
  }
  fill(0,0,0,alpha)
  noStroke()
  beginShape()
  vertex(0,0)
  vertex(worldWidth,0)
  vertex(worldWidth,worldHeight)
  vertex(0,worldHeight)
  let fires = board.objectsToShow.fires
  for (let i =0; i<fires.length; i++){
    if (fires[i].value > 0){
      let size = (fires[i].value/3)+2
      let x = fires[i].x*25+12.5
      let y = fires[i].y*25+12.5+topbarHeight
      let r = size*25/2
      let arm = r*0.54666
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
      let size = (fires[i].value/3)+2
      drawFireCircle(fires[i].x,fires[i].y,size,alpha)
    }
  }
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
  for (let i =x; i<fires.length; i+=2){
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