let tiles, players, man, canoe, active, berryCount, wemoMins, noKeys, centerX, centerY, autoCenter
const topbarHeight = 55
const cols = 80
const rows = 50
const worldWidth = cols * 25
const worldHeight = rows * 25 + topbarHeight
let topOffset = 0, leftOffset = 37
let path, showCount, message, timeOfDay, startTime

function initializeVars(){
  autoCenter = false
  noKeys = false
  berryCount = 0
  path = []
  showCount = 0
  message = ""
  timeOfDay = "day"
  startTime = Date.now()
  wemoMins = 120
}

function preload(){
  tiles = {
    beach1: loadImage("images/beach1.png"),
    beach2: loadImage("images/beach2.png"),
    beach3: loadImage("images/beach3.png"),
    beach4: loadImage("images/beach4.png"),
    beach5: loadImage("images/beach5.png"),
    beach6: loadImage("images/beach6.png"),
    beach7: loadImage("images/beach7.png"),
    beach8: loadImage("images/beach8.png"),
    beach9: loadImage("images/beach9.png"),
    beach10: loadImage("images/beach10.png"),
    beach11: loadImage("images/beach11.png"),
    beach12: loadImage("images/beach12.png"),
    beachEdge1: loadImage("images/beachEdge1.png"),
    beachEdge2: loadImage("images/beachEdge2.png"),
    beachEdge3: loadImage("images/beachEdge3.png"),
    beachEdge4: loadImage("images/beachEdge4.png"),
    berryTree: loadImage("images/berryTree.png"),
    clouds: loadImage("images/clouds.png"),
    dock1: loadImage("images/dock1.png"),
    dock2: loadImage("images/dock2.png"),
    dock3: loadImage("images/dock3.png"),
    fire: loadImage("images/fire1.png"),
    firepit: loadImage("images/firepit.png"),
    grass: loadImage("images/grass.png"),
    grassBeach1: loadImage("images/grassBeach1.png"),
    grassBeach2: loadImage("images/grassBeach2.png"),
    grassBeach3: loadImage("images/grassBeach3.png"),
    grassBeach4: loadImage("images/grassBeach4.png"),
    grassBeach5: loadImage("images/grassBeach5.png"),
    grassBeach6: loadImage("images/grassBeach6.png"),
    grassBeach7: loadImage("images/grassBeach7.png"),
    grassBeach8: loadImage("images/grassBeach8.png"),
    grassBeach9: loadImage("images/grassBeach9.png"),
    grassBeach10: loadImage("images/grassBeach10.png"),
    grassBeach11: loadImage("images/grassBeach11.png"),
    grassBeach12: loadImage("images/grassBeach12.png"),
    palm: loadImage("images/palm.png"),
    pit: loadImage("images/pit.png"),
    random: loadImage("images/random.png"),
    river1: loadImage("images/grassRiver1.png"),
    river2: loadImage("images/grassRiver2.png"),
    river3: loadImage("images/grassRiver3.png"),
    river4: loadImage("images/grassRiver4.png"),
    river5: loadImage("images/grassRiver5.png"),
    river6: loadImage("images/grassRiver6.png"),
    river7: loadImage("images/beachRiver1.png"),
    river8: loadImage("images/beachRiver2.png"),
    river9: loadImage("images/beachRiver3.png"),
    river10: loadImage("images/beachRiver4.png"),
    river11: loadImage("images/beachRiver5.png"),
    river12: loadImage("images/beachRiver6.png"),
    river13: loadImage("images/rockRiver1.png"),
    river14: loadImage("images/rockRiver2.png"),
    river15: loadImage("images/rockRiver3.png"),
    river16: loadImage("images/rockRiver4.png"),
    river17: loadImage("images/rockRiver5.png"),
    river18: loadImage("images/rockRiver6.png"),
    river19: loadImage("images/rockRiver7.png"),
    river20: loadImage("images/rockRiver8.png"),
    river21: loadImage("images/rockRiver9.png"),
    river22: loadImage("images/rockRiver10.png"),
    rock1: loadImage("images/rock1.png"),
    rock2: loadImage("images/rock2.png"),
    rock3: loadImage("images/rock3.png"),
    rock: loadImage("images/rock4.png"),
    rockEdge1: loadImage("images/rockEdge1.png"),
    rockEdge2: loadImage("images/rockEdge2.png"),
    rockEdge3: loadImage("images/rockEdge3.png"),
    rockEdge4: loadImage("images/rockEdge4.png"),
    rockEdge5: loadImage("images/rockEdge5.png"),
    rockEdge6: loadImage("images/rockEdge6.png"),
    rockEdge7: loadImage("images/rockEdge7.png"),
    rockEdge8: loadImage("images/rockEdge8.png"),
    rockEdge9: loadImage("images/rockEdge9.png"),
    rockEdge10: loadImage("images/rockEdge10.png"),
    rockEdge11: loadImage("images/rockEdge11.png"),
    rockEdge12: loadImage("images/rockEdge12.png"),
    rockMiddle: loadImage("images/rockEdge13.png"),
    sand: loadImage("images/sand.png"),
    sandpit: loadImage("images/sandpit.png"),
    stump: loadImage("images/stump.png"),
    tent: loadImage("images/tent.png"),
    tree: loadImage("images/tree.png"),
    treeShore1: loadImage("images/treeShore1.png"),
    treeShore2: loadImage("images/treeShore2.png"),
    treeShore3: loadImage("images/treeShore3.png"),
    treeShore4: loadImage("images/treeShore4.png"),
    treeShore5: loadImage("images/treeShore5.png"),
    treeShore6: loadImage("images/treeShore6.png"),
    treeShore7: loadImage("images/treeShore7.png"),
    treeShore8: loadImage("images/treeShore8.png"),
    treeShore9: loadImage("images/treeShore9.png"),
    treeShore10: loadImage("images/treeShore10.png"),
    treeShore11: loadImage("images/treeShore11.png"),
    treeShore12: loadImage("images/treeShore12.png"),
    water: loadImage("images/water.png"),
    cross: loadImage("images/cross.png"),
    day: loadImage("images/sun.png"),
    night: loadImage("images/moon.png"),
    dawn: loadImage("images/dawn.png"),
    dusk: loadImage("images/dusk.png"),
    logpile: loadImage("images/logs.png"),
    log: loadImage("images/log.png"),
    backpack: loadImage("images/carrying.png"),
    berries: loadImage("images/berries.png")
  }

  player1 = [
    loadImage("images/player0.png"),
    loadImage("images/player1.png"),
    loadImage("images/player2.png"),
    loadImage("images/player3.png"),
    loadImage("images/player4.png"),
    loadImage("images/player5.png"),
    loadImage("images/player6.png"),
    loadImage("images/player7.png"),
    loadImage("images/player8.png")
  ]

  canoe1 = [
    loadImage("images/canoe1_0.png"),
    loadImage("images/canoe1_1.png"),
    loadImage("images/canoe1_2.png"),
    loadImage("images/canoe1_3.png"),
    loadImage("images/canoe0_4.png"),
    loadImage("images/canoe0_5.png")
  ]
}

function setup(){
  let cvs = createCanvas(worldWidth, worldHeight)
  cvs.parent("board")
  cvs.mousePressed(clickHandler)
  cvs.mouseReleased(mouseReleaseHandler)
  $("#board").css("top", topOffset).css("left", leftOffset)
  frameRate(12)
  strokeJoin(ROUND)
  noLoop()
}

function draw(){
  if (game.started){
    background(255)
    displayBoard()
    if (game.mode === "play") {
      game.checkActive()
      showObjects()
      canoe.display()
      man.display()
      showNight()
      showMessage()
      centerScreen()
      showTopbar()
      if (man.energy < 0 && showCount === 0)
        popup.gameOver()
    }
  }
  else {
    background('green')
    popup.welcomeMenu()
  }
}

function showMessage(){
  if (showCount > 0){
    textAlign(CENTER, CENTER)
    let f = timeOfDay === "night" || game.paused ? 255 : ["dusk", "dawn"].includes(timeOfDay) ? 80 : 20
    fill(f)
    stroke(255)
    textSize(45)
    text(message, (window.innerWidth/2)+abs($("#board").position().left), (window.innerHeight/2)+abs($("#board").position().top))
    showCount--
    if (showCount === 0) {
      man.vomit = false
      noKeys = false
    }
    if (board.cells[man.x][man.y].type === "firepit" && board.objectsToShow.fires[man.fireId].value > 0){
      showCount++
      man.energy -= 25
      if (man.energy < 0 || man.health < 0)
        popup.gameOver()
    }
  }
}

function startGame(){
  man = new Man(player1, board.startX, board.startY)
  canoe = new Canoe(canoe1, board.startX, board.startY)
  active = canoe
  centerOn(active)
  initializeVars()
  loop()
  $("#board").css("top", centerY+"px").css("left", centerX+"px")
}

function displayBoard() {
  let left = Math.floor(abs($("#board").position().left-leftOffset)/25)
  let right = left + Math.floor(window.innerWidth/25)+1
  right = right > cols ? cols : right
  let top = Math.floor(abs($("#board").position().top-topOffset)/25)
  let bottom = top + Math.floor(window.innerHeight/25)+1
  bottom = bottom > rows ? rows : bottom

  if (game.mode === "edit"){
    left = 0
    right = cols
    top = 0
    bottom = rows
  }

  for (let i = left; i < right; i++) {
    for (let j = top; j< bottom; j++){
      let cell = board.cells[i][j]
      let img = game.mode === "edit" ? tiles[cell.tile]:
                  cell.revealed ? tiles[cell.tile] : tiles["clouds"]
      let offset = game.mode === "play" ? topbarHeight : 0
      image(img, i*25, j*25+offset)
      if (cell.byPit && (cell.revealed || game.mode === 'edit'))
        drawRing(i,j)
    }
  }
  if (game.mode === "edit")
    image(canoe1[4], (board.startX-1)*25, board.startY*25)
}

function centerScreen(){
  let pos = flyTo($("#board").position().left, $("#board").position().top, centerX, centerY)
  $("#board").css("top", pos.y+"px").css("left", pos.x+"px")
}

function flyTo(curX, curY, toX, toY){
  let leftDiff = toX-curX
  let topDiff = toY-curY
  let left = leftDiff <= -5 ? curX+Math.floor(leftDiff/5)-4 : leftDiff >= 5 ? curX+Math.floor(leftDiff/5)+4 : toX
  let top = topDiff <= -5 ? curY+Math.floor(topDiff/5)-4 : topDiff >= 5 ? curY+Math.floor(topDiff/5)+4 : toY
  return {x: left, y: top}
}

function follow(object) {
  let left = centerX
  let top = centerY

  if ((object.x*25) + left < 75 + leftOffset) // left
    left = left+25 > leftOffset ? leftOffset : left+25
  else if ((object.x*25) + left > window.innerWidth - 100) //right
    left = left-25 < window.innerWidth - worldWidth ? window.innerWidth - worldWidth : left-25

  if ((object.y*25+topbarHeight) + top < 75 + topOffset) //top
    top = top+25 > topOffset ? topOffset : top+25
  else if ((object.y*25+topbarHeight) + top > window.innerHeight - 100) //bottom
    top = top-25 < window.innerHeight - worldHeight ? window.innerHeight - worldHeight : top-25

  centerX = left
  centerY = top
}

function centerOn(object) {
  let x = Math.floor(window.innerWidth/2)
  let y = Math.floor(window.innerHeight/2)
  let left = x-object.x*25+13
  left = left > leftOffset ? leftOffset : left
  left = left < window.innerWidth - worldWidth ? window.innerWidth - worldWidth : left

  let top = y-object.y*25+13-topbarHeight
  top = top > topOffset ? topOffset : top
  top = top < window.innerHeight - worldHeight ? window.innerHeight - worldHeight : top

  centerX = left
  centerY = top
}

$("#board").contextmenu(function(e) {
    e.preventDefault();
    e.stopPropagation();
});

function isNextToSquare(x1, y1, x2, y2){ //no diagonals
  for (let i = -1; i <= 1; i++){
    for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
      let a = x1+i, b = y1+j;
      if (a === x2 && b === y2)
        return true
    }
  }
  return false
}

function isNextToType(x, y, type){ //accepts a string or array as type
  for (let i = -1; i <= 1; i++){
    for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
      let a = x+i, b = y+j;
      if (a >= 0 && a < cols && b >= 0 && b < rows){
        if (type.includes(board.cells[a][b].type))
          return true
      }
    }
  }
  return false
}

function isNearSquare(x1, y1, x2, y2){ //with diagonals
  for (let x = x1-1; x <= x1+1; x++){
    for (let y = y1-1; y <= y1+1; y++){
      if (x === x2 && y === y2)
        return true
    }
  }
  return false
}

// function isNearType(x,y, type){ //with diagonals
//   for (let i = x-1; i <= x+1; i++){
//     for (let j = y-1; j <= y+1; j++){
//       if (i >= 0 && i < cols && j >= 0 && j < rows){
//         if (board.cells[i][j].type === type)
//           return true
//       }
//     }
//   }
//   return false
// }

function showObjects(){
  for (x in board.objectsToShow){
    let items = board.objectsToShow[x]
    for (let i=0; i<items.length; i++){
      if (x === "logpiles"){
        let tile = items[i].quantity > 1 ? tiles.logpile : tiles.log
        image(tile, items[i].x*25, items[i].y*25+topbarHeight)
        drawBadge(items[i].x*25+20, items[i].y*25+topbarHeight+5, items[i].quantity)
      }
      else if (x === "fires"){
        let tile = items[i].value > 0 ? tiles.fire : tiles.firepit
        image(tile, items[i].x*25, items[i].y*25+topbarHeight)
        if (items[i].value > 0)
          progressBar(items[i].x, items[i].y, items[i].value)
      }
      else if (x === "berryTrees" && board.cells[items[i].x][items[i].y].revealed){
        let berries = items[i].berries
        noStroke()
        fill(128,0,128)
        ellipseMode(CORNER)
        for (let j = 0; j< berries.length; j++){
          ellipse(items[i].x*25+berries[j].x, items[i].y*25+berries[j].y+topbarHeight, 5, 5)
        }
      }
    }
  }
}

function drawBadge(x,y,num){
  num = num+""
  noStroke()
  fill(0)
  ellipseMode(CENTER)
  ellipse(x,y,10+(num.length*3),13)
  textAlign(CENTER, CENTER)
  fill(255)
  textSize(10)
  text(num,x,y)
}

function progressBar(i,j,value){
  fill(255)
  stroke(80)
  strokeWeight(1)
  rect(i*25+2,j*25+19+topbarHeight, 21, 4)
  let color = value > 12 ? "green" :
               value > 6 ? "#e90" : "red"
  fill(color)
  noStroke()
  rect(i*25+3, j*25+20+topbarHeight, value, 3)
}

function drawRing(x,y){
  noFill()
  stroke(255,0,0)
  strokeWeight(5)
  let offset = game.mode === 'play' ? topbarHeight : 0
  ellipseMode(CENTER)
  ellipse(x*25+12.5, y*25+offset+12.5,20,20)
  strokeWeight(1)
}