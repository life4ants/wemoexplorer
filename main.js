let frameTime = Date.now()

let tiles, man, canoe, active
let noKeys, showEnergy, showHealth
let cols, rows, worldWidth, worldHeight
const topbarHeight = 55
let topOffset = 0, leftOffset = 0
let showCount, message, timeOfDay, startTime
let path = []

const dumpable = ["beach", "sand", "grass", "stump", "beachEdge", "grassBeach", "logpile", "dock", "rock", "rockpile"]
const sleepable = ["beach", "sand", "grass", "beachEdge", "grassBeach", "dock", "longGrass", "rockMiddle"]

function initializeVars(){
  showHealth = man.health
  showEnergy = man.energy
  noKeys = false
  showCount = 0
  message = ""
  setTime(board.wemoMins)
  game.paused = false
  resizeWorld(board.cells.length, board.cells[0].length)
}

function resizeWorld(c, r){
  cols = c
  rows = r
  worldWidth = cols * 25
  worldHeight = game.mode === "play" ? rows * 25 + topbarHeight : rows * 25
  resizeCanvas(worldWidth, worldHeight)
}

function preload(){
  tiles = {
    backpack: loadImage("images/carrying.png"),
    basket: loadImage("images/basket.png"),
    basketBerries: loadImage("images/basketBerries.png"),
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
    berries: loadImage("images/berries.png"),
    berryTree: loadImage("images/berryTree.png"),
    clouds: loadImage("images/clouds.png"),
    cross: loadImage("images/cross.png"),
    day: loadImage("images/sun.png"),
    dawn: loadImage("images/dawn.png"),
    dock1: loadImage("images/dock1.png"),
    dock2: loadImage("images/dock2.png"),
    dock3: loadImage("images/dock3.png"),
    dock4: loadImage("images/dock4.png"),
    dock5: loadImage("images/dock5.png"),
    dock6: loadImage("images/dock6.png"),
    dusk: loadImage("images/dusk.png"),
    canoe: [ loadImage("images/canoe0.png"),
              loadImage("images/canoe1.png")
           ],
    construction: {
                    raft: loadImage("images/raftHB.png")
                   },
    firepit: loadImage("images/firepit.png"),
    grass: loadImage("images/grass.png"),
    log: loadImage("images/log.png"),
    logpile: loadImage("images/logs.png"),
    longGrass: loadImage("images/longGrass.png"),
    longGrass1: loadImage("images/longGrass1.png"),
    longGrass2: loadImage("images/longGrass2.png"),
    longGrass3: loadImage("images/longGrass3.png"),
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
    night: loadImage("images/moon.png"),
    palm: loadImage("images/palm.png"),
    pit: loadImage("images/pit.png"),
    players: [ loadImage("images/player10.png"),
               loadImage("images/player11.png")
             ],
    raft: [ loadImage("images/raft0.png"),
            loadImage("images/raft1.png"),
          ],
    random: loadImage("images/random.png"),
    randomPit: loadImage("images/randomPit.png"),
    randomGrass: loadImage("images/randomGrass.png"),
    randomLog: loadImage("images/randomLog.png"),
    randomBerries: loadImage("images/randomBerries.png"),
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
    rock4: loadImage("images/rock4.png"),
    rock: loadImage("images/rocks.png"),
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
    sleeping: loadImage("images/sleeping.png"),
    stoneAx: loadImage("images/stoneAx.png"),
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
    wigwam: loadImage("images/wigwam.png"),
    z: loadImage("images/z's.png")
  }

  fire = [
    loadImage("images/fire1.png"),
    loadImage("images/fire2.png"),
    loadImage("images/fire3.png"),
    loadImage("images/fire4.png")
  ]
}

function setup(){
  let cvs = createCanvas(window.innerWidth, window.innerHeight)
  cvs.parent("board")
  $("#board").css("top", topOffset).css("left", leftOffset)
  frameRate(12)
  strokeJoin(ROUND)
  noLoop()
  game.mode = "welcome"
}

function draw(){
  frameTime = Date.now()
  if (game.started){
    background(255)
    displayBoard()
    if (game.mode === "play") {
      game.checkActive()
      showObjects()
      vehicles.display()
      man.display()
      showNight()
      if (game.autoCenter)
          centerOn(active)
      else
        follow(active)
      showTopbar()
      showMessage()
      if (showCount === 0 && (man.energy <= 0 || man.health <= 0 ))
        popup.gameOver()
    }
  }
  else {
    background('green')
  }
}

function startGame(){
  man = new Man(tiles.players[game.currentPlayer.character], board.startX, board.startY)
  backpack = new Backpack(board.backpack)
  delete board.backpack
  if (board.man){
    man.initialize(board.man)
    delete board.man
  }
  vehicles = new Vehicle(board.vehicles)
  delete board.vehicles
  active = man.ridingId ? vehicles[man.ridingId] : man
  initializeVars()
  if (!board.progress) {
    fillBoard()
  }
  popup.reset()
  centerOn(active)
  loop()
  $(window).scrollTop(0).scrollLeft(0)
  $("body").addClass("full-screen")
}

function fillBoard(){
  for (let i = 0; i < cols; i++){
    for (let j = 0; j< rows; j++){
      let cell = board.cells[i][j]
      if (["randomPit", "randomGrass", "randomBerries", "randomLog"].includes(cell.type)){
        let roll = Math.random()
        if (cell.type === "randomPit" && roll < .5){
          cell.type = "pit"
          cell.tile = "pit"
          for (let k = -1; k <=1; k++){
            for (let l = -1; l<=1; l++){
              if (abs(l+k) === 1)
                board.cells[i+k][j+l].byPit = true
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
          cell.id = board.objectsToShow.berryTrees.length
          board.objectsToShow.berryTrees.push({x: i, y: j, berries: []})
        }
        else if (cell.type === "randomLog"){
          if (Math.random() < .5)
            cell.type = "log"
          else
            cell.type = cell.tile.replace(/\d+$/, "")
        }
        else {
          cell.type = "grass"
          cell.tile = "grass"
        }
      }
    }
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
      man.health -= 25
      if (man.energy < 0 || man.health < 0)
        popup.gameOver()
    }
  }
}

function displayBoard() {
  let left, right, top, bottom
  if (window.innerHeight-topOffset > worldHeight || game.mode === "edit"){
    top = 0
    bottom = rows
  }
  else {
    top = Math.floor(abs($("#board").position().top-topOffset)/25)
    bottom = top + Math.floor(window.innerHeight/25)+1
    bottom = bottom > rows ? rows : bottom
  }
  if (window.innerWidth-leftOffset > worldWidth || game.mode === "edit"){
    left = 0
    right = cols
  }
  else {
    left = Math.floor(abs($("#board").position().left-leftOffset)/25)
    right = left + Math.floor(window.innerWidth/25)+1
    right = right > cols ? cols : right
  }

  for (let i = left; i < right; i++) {
    for (let j = top; j< bottom; j++){
      let cell = board.cells[i][j]
      let offset = game.mode === "play" ? topbarHeight : 0
      let img = game.mode === "edit" || cell.revealed ? tiles[cell.tile]: tiles["clouds"]
      image(img, i*25, j*25+offset)
      if (cell.type === "rock" && (cell.revealed || game.mode === "edit")){
        image(tiles["rock"+cell.quantity], i*25, j*25+offset)
      }
      else if (["log", "randomLog", "raftHB"].includes(cell.type) && (cell.revealed || game.mode === "edit"))
        image(tiles[cell.type], i*25, j*25+offset)
      else if (cell.type === "construction" && (cell.revealed || game.mode === "edit")){
        image(tiles.construction[cell.construction.type], i*25, j*25+offset)
        for (let a = 0; a < cell.construction.needed.length; a++) {
          let item = cell.construction.needed[a]
          let x = a < 2 ? a : a-2
          let y = Math.floor(a/2)
          drawBadge(i*25+x*14+4, j*25+offset+(y*14)+4, item.quantity, item.color)
        }
      }
      if (cell.byPit && (cell.revealed || game.mode === 'edit'))
        drawRing(i,j)
    }
  }
  if (game.mode === "edit")
    image(tiles.players[0], board.startX*25, board.startY*25, 25, 25, 0, 25, 25, 25)
}

function smoothChange(curX, toX){
  let diff = toX-curX
  return diff >= 90 ? curX+Math.floor(diff/6)-5 : diff <= -90 ? curX+Math.floor(diff/6)+5 :
             diff >= 10 ? curX+10 : diff <= -10 ? curX-10 : toX
}

function follow(object) {
  let left = $("#board").position().left
  let top = $("#board").position().top
  let newLeft = left
  let newTop = top

  if (window.innerWidth < worldWidth){
    if ((object.x*25) + left < 100 + leftOffset) // left
      newLeft = left+10 > leftOffset ? leftOffset : left+10
    else if ((object.x*25) + left > window.innerWidth - 125) //right
      newLeft = left-10 < window.innerWidth - worldWidth ? window.innerWidth - worldWidth : left-10
  }
  if (window.innerHeight < worldHeight){
    if (object.y*25+topbarHeight - (topbarHeight - top) < 100) //top
      newTop = top+10 > topOffset ? topOffset : top+10
    else if ((object.y*25+topbarHeight) + top > window.innerHeight - 125) //bottom
      newTop = top-10 < window.innerHeight - worldHeight ? window.innerHeight - worldHeight : top-10
  }

  if (newTop !== top || newLeft !== left)
    $("#board").css("top", newTop).css("left", newLeft)
}

function centerOn(object) {
  // center in the x direction:
  let currentX = $("#board").position().left
  let left = Math.floor((window.innerWidth+leftOffset)/2)
  let centerX = left-object.x*25+13 // the left value to set #board in order to center the man in the viewport
  let maxLeft = leftOffset
  let minLeft = window.innerWidth - worldWidth
  centerX = worldWidth < window.innerWidth-leftOffset ? Math.floor((window.innerWidth-leftOffset-worldWidth)/2)+leftOffset :
              centerX > minLeft && centerX < maxLeft ? smoothChange(currentX, centerX) :
                centerX <= minLeft ? minLeft : centerX >= maxLeft ? maxLeft : currentX
  // center in the y direction:
  let currentY = $("#board").position().top
  let top = Math.floor((window.innerHeight+topOffset)/2)
  let centerY = top-object.y*25+13-topbarHeight
  let maxTop = topOffset
  let minTop = window.innerHeight - worldHeight
  centerY = worldHeight < window.innerHeight ? Math.floor((window.innerHeight - worldHeight)/2) :
              centerY > minTop && centerY < maxTop ? smoothChange(currentY, centerY) :
              centerY <= minTop ? minTop : centerY >= maxTop ? maxTop : currentY
  if (centerY !== currentY || centerX !== currentX)
    $("#board").css("top", centerY).css("left", centerX)
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

function nearbyType(x,y, type){ //returns the cell data if found, otherwise false
  for (let i = x-1; i <= x+1; i++){
    for (let j = y-1; j <= y+1; j++){
      if (i >= 0 && i < cols && j >= 0 && j < rows){
        if (board.cells[i][j].type === type)
          return Object.assign({x: i, y: j}, board.cells[i][j])
      }
    }
  }
  return false
}

function showObjects(){
  for (let x in board.objectsToShow){
    let items = board.objectsToShow[x]
    for (let i=0; i<items.length; i++){
      if (x === "logpiles"){
        let tile = items[i].quantity > 1 ? tiles.logpile : tiles.log
        image(tile, items[i].x*25, items[i].y*25+topbarHeight)
        drawBadge(items[i].x*25+20, items[i].y*25+topbarHeight+5, items[i].quantity, "#000")
      }
      else if (x === "rockpiles"){
        image(tiles.rock, items[i].x*25, items[i].y*25+topbarHeight)
        drawBadge(items[i].x*25+20, items[i].y*25+topbarHeight+5, items[i].quantity, "#000")
      }
      else if (x === "fires"){
        let tile = items[i].value > 0 ? fire[Math.floor((frameCount%6)/2)] : tiles.firepit
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

function drawBadge(x,y,num,color){
  num = num+""
  noStroke()
  fill(color)
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
  strokeWeight(3)
  let offset = game.mode === 'play' ? topbarHeight : 0
  ellipseMode(CENTER)
  ellipse(x*25+12.5, y*25+offset+12.5,23,23)
}

function drawPitLines(x,y){
  noFill()
  stroke(255,0,0)
  strokeWeight(1)
  let offset = game.mode === 'play' ? topbarHeight : 0
  let basex = x*25+2
  let basey = y*25+2+offset
  for (let i = 0; i < 5; i++){
    let x1 = i < 2 ? 2-i : i == 2 ? 0.57 : 0
    let y1 = i < 2 ? 0 : i == 2 ? 0.57 : i-2
    let x2 = i < 2 ? 3 : i == 2 ? 2.57 : 5-i
    let y2 = i > 2 ? 3: i == 2 ? 2.57 : i+1
    line(Math.round(x1*7)+basex, Math.round(y1*7)+basey, Math.round(x2*7)+basex, Math.round(y2*7)+basey)
  }
  ellipseMode(CENTER)
  ellipse(x*25+12.5, y*25+12.5+offset,22,22)
}
