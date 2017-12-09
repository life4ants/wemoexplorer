let frameTime = Date.now()

let tiles, man, canoe, active
let noKeys
let cols, rows, worldWidth, worldHeight
const topbarHeight = 55
let topOffset = 0, leftOffset = 0
let showCount, message

const dumpable = ["beach", "sand", "grass", "stump", "beachEdge", "grassBeach", "logpile", "dock", "rockpile"]
const sleepable = ["beach", "sand", "grass", "beachEdge", "grassBeach", "dock", "longGrass", "rockMiddle"]
const fordable = ["river5","river6","river7","river8","river9","river10","river11","river12","river17","river18"]
const seeThru = ["log", "randomLog", "bone", "steppingStones", "randomRock", "randomStick", "stick"]

function initializeVars(){
  topbar.health = man.health
  topbar.energy = man.energy
  noKeys = false
  showCount = 0
  message = ""
  timer.setTime(board.wemoMins)
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

function windowResized(){
  if (game.mode === "play")
    viewport.update(true)
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
    bone: loadImage("images/bone.png"),
    boneShovel: loadImage("images/boneShovel.png"),
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
    clay: loadImage("images/clay.png"),
    clay1: loadImage("images/clay1.png"),
    clay2: loadImage("images/clay2.png"),
    clay3: loadImage("images/clay3.png"),
    clay4: loadImage("images/clay4.png"),
    clay5: loadImage("images/clay5.png"),
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
    randomBerries: loadImage("images/randomBerries.png"),
    randomGrass: loadImage("images/randomGrass.png"),
    randomLog: loadImage("images/randomLog.png"),
    randomPit: loadImage("images/randomPit.png"),
    randomRock: loadImage("images/randomRock.png"),
    randomStick: loadImage("images/randomStick.png"),
    randomTree: loadImage("images/randomTree.png"),
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
    steppingStones: loadImage("images/steppingStones.png"),
    stick: loadImage("images/stick.png"),
    stoneAx: loadImage("images/stoneAx.png"),
    stump: loadImage("images/stump.png"),
    tent: loadImage("images/tent.png"),
    timeOfDay: loadImage("images/timeOfDay.png"),
    tree: loadImage("images/tree.png"),
    treeThin: loadImage("images/tree-thin.png"),
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

  tiles.construction.steppingStones = tiles.steppingStones

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
  console.log("loaded in", Date.now()-frameTime)
}

function draw(){
  if (frameCount === 1)
    console.log("loaded in", Date.now()-frameTime)
  frameTime = Date.now()
  background('green')
  if (game.started){
    displayBoard()
    if (game.mode === "play")
      playLoop()
    else if (game.mode === "build")
      buildLoop()
  }
}

function playLoop(){
  timer.update()
  game.checkActive()
  // move board:
  viewport.update(false)
  //display:
  showObjects()
  vehicles.display()
  man.display()
  showNight()
  topbar.display()
  showMessage()
  if (showCount === 0 && (man.energy <= 0 || man.health <= 0 ))
    popup.gameOver()
}

function buildLoop(){
  showObjects()
  vehicles.display()
  man.display()
  topbar.display()
  showMouse(popup.size)
}

function showMouse(size){
  let o = size*12.5
  let x = Math.floor((mouseX-o)/25)
  let y = Math.floor((mouseY-topbarHeight-o)/25)
  let w = (size+1)*25
  stroke(255,0,0)
  strokeWeight(2)
  noFill()
  rect(x*25,y*25+topbarHeight,w,w)
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
  viewport.update(true)
  loop()
  $(window).scrollTop(0).scrollLeft(0)
  $("body").addClass("full-screen")
}

function fillBoard(){
  for (let i = 0; i < cols; i++){
    for (let j = 0; j< rows; j++){
      let cell = board.cells[i][j]
      if (["randomPit", "randomGrass", "randomBerries", "randomLog", "randomTree", "randomRock", "randomStick"].includes(cell.type)){
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
          if (roll < .5)
            cell.type = "log"
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
        else if (cell.type === "randomStick"){
          if (Math.random() < .5)
            cell.type = "stick"
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
      let offset = game.mode === "edit" ? 0 : topbarHeight
      let img = game.mode === "edit" || cell.revealed ? tiles[cell.tile]: tiles["clouds"]
      try {
        image(img, i*25, j*25+offset)
      }
      catch(error){
        console.error(i,j,board.cells[i][j])
      }
      if (["rock", "clay"].includes(cell.type) && (cell.revealed || game.mode === "edit")){
        image(tiles[cell.type+cell.quantity], i*25, j*25+offset)
      }
      else if (seeThru.includes(cell.type) && (cell.revealed || game.mode === "edit"))
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

$("#board").contextmenu(function(e) {
    e.preventDefault();
    e.stopPropagation();
});

// window.onblur = function(){
//   console.log("blur")
//   if (game.mode === "play")
//     popup.outOfFocus()
// }

// window.onfocus = function(){
//   console.log("focus")
//   if (popup.type === "outOfFocus"){
//     if (game.paused)
//       popup.type = "gamePaused"
//     else
//       popup.close()
//   }
// }

function showNight(){
  let alpha, time
  if (game.paused) {
    alpha = timer.timeOfDay === "day" ? 230 : 255
    fill(0,0,0,alpha)
    rect(0,0,worldWidth,worldHeight)
    return
  }

  switch(timer.timeOfDay){
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
  let textColor = color === "#000" ? 255 : 0
  fill(textColor)
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
