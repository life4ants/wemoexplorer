let tiles, players, man, canoe, active, berryCount
const topbarHeight = 40
const cols = 80
const rows = 50
const worldWidth = cols * 25
const worldHeight = rows * 25 + topbarHeight
let topOffset = 0
let path, showCount, message, paused, timeOfDay, startTime

function initializeVars(){
  berryCount = 0
  path = []
  showCount = 0
  message = ""
  paused = false
  timeOfDay = "day"
  startTime = Date.now()
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
    river1: loadImage("images/river1.png"),
    river2: loadImage("images/river2.png"),
    river3: loadImage("images/river3.png"),
    river4: loadImage("images/river4.png"),
    river5: loadImage("images/river5.png"),
    river6: loadImage("images/river6.png"),
    rock: loadImage("images/rock.png"),
    rockEdge1: loadImage("images/rock1.png"),
    rockEdge2: loadImage("images/rock2.png"),
    rockEdge3: loadImage("images/rock3.png"),
    rockEdge4: loadImage("images/rock4.png"),
    rockEdge5: loadImage("images/rock5.png"),
    rockEdge6: loadImage("images/rock6.png"),
    rockEdge7: loadImage("images/rock7.png"),
    rockEdge8: loadImage("images/rock8.png"),
    rockEdge9: loadImage("images/rock9.png"),
    rockEdge10: loadImage("images/rock10.png"),
    rockEdge11: loadImage("images/rock11.png"),
    rockEdge12: loadImage("images/rock12.png"),
    rockMiddle: loadImage("images/rock13.png"),
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
    logpile: loadImage("images/logs.png")
  }

  player1 = [
    loadImage("images/player0.png"),
    loadImage("images/player1.png"),
    loadImage("images/player2.png"),
    loadImage("images/player3.png"),
    loadImage("images/player4.png"),
    loadImage("images/player5.png"),
    loadImage("images/player6.png"),
    loadImage("images/player7.png")
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
  frameRate(12)
  noLoop()
  $("#board").css("top", topOffset)
}

function draw(){
  if (game.started){
    background(255)
    displayBoard()
    if (game.mode === "play") {
      follow(active)
      checkActive()
      showObjects()
      canoe.display()
      man.display()
      showMessage()
      showNight()
      showTopbar()
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
    let f = timeOfDay === "night" ? 255 : 10
    fill(f)
    textSize(45)
    text(message, (window.innerWidth/2)+abs($("#board").position().left), (window.innerHeight/2)+abs($("#board").position().top))
    showCount--
    if (showCount === 0)
      paused = false
  }
}

function checkActive(){
  if (!man.hasBackpack && ["tree", "treeShore"].includes(board.cells[man.x][man.y].type)){
    game.availableActions = "tree"
  }
  else if (man.hasBackpack && "logpile" === board.cells[man.x][man.y].type){
    game.availableActions = "log"
  }
  else if (man.hasBackpack && man.isNextToFire){
    game.availableActions = "lightFire"
  }
  else if (man.hasBackpack && ["sand", "grass", "stump"].includes(board.cells[man.x][man.y].type)){
    game.availableActions = "log"
  }
  else if (!man.hasBackpack && "logpile" === board.cells[man.x][man.y].type){
    game.availableActions = "logpile"
  }
  else if (!man.isRidingCanoe && isNextTo(man.x, man.y, canoe.x, canoe.y)){
    game.availableActions = "mount"
  }
  else if (man.isRidingCanoe && (canoe.landed || canoe.isBeside("dock"))){
    game.availableActions = "dismount"
  }
  else if ("berryTree" === board.cells[man.x][man.y].type){
    game.availableActions = "berryTree"
  }
  else
    game.availableActions = "default"
}

function startGame(){
  man = new Man(player1, board.startX, board.startY)
  canoe = new Canoe(canoe1, board.startX, board.startY)
  active = canoe
  centerOn(active)
  initializeVars()
  loop()
}

function displayBoard() {
  let left = Math.floor(abs($("#board").position().left)/25)
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
      let img = game.mode === "edit" ? tiles[board.cells[i][j].tile]:
                  board.cells[i][j].revealed ? tiles[board.cells[i][j].tile] : tiles["clouds"]
      let offset = game.mode === "play" ? topbarHeight : 0
      image(img, i*25, j*25+offset)
    }
  }
  if (game.mode === "edit")
    image(canoe1[4], (board.startX-1)*25, board.startY*25)
}

function follow(object) {
  let left = $("#board").position().left
  let top = $("#board").position().top

  if ((object.x*25) + left < 75 && left < 0) // left
    $("#board").css("left", (left+16)+"px")
  else if ((object.x*25) + left > window.innerWidth - 100 && left > window.innerWidth - worldWidth) //right
    $("#board").css("left", (left-16)+"px")

  if ((object.y*25+topbarHeight) + top < 75 + topOffset && top < topOffset) //top
    $("#board").css("top", (top+16)+"px")
  else if ((object.y*25+topbarHeight) + top > window.innerHeight - 100 && top > window.innerHeight - worldHeight) //bottom
    $("#board").css("top", (top-16)+"px")

  if (left < window.innerWidth - worldWidth || top < window.innerHeight - worldHeight)
    centerOn(object)
}

function centerOn(object) {
  let x = Math.floor(window.innerWidth/2)
  let y = Math.floor(window.innerHeight/2)

  let left = x-object.x*25
  left = left > 0 ? 0 : left
  left = left < window.innerWidth - worldWidth ? window.innerWidth - worldWidth : left

  let top = y-object.y*25+topbarHeight
  top = top > topOffset ? topOffset : top
  top = top < window.innerHeight - worldHeight ? window.innerHeight - worldHeight : top

  $("#board").css("left", left +"px")
  $("#board").css("top", top +"px")

}

$("#board").contextmenu(function(e) {
    e.preventDefault();
    e.stopPropagation();
});

function isNextTo(x1, y1, x2, y2){
  for (let x = x1-1; x <= x1+1; x++){
    for (let y = y1-1; y <= y1+1; y++){
      if (x === x2 && y === y2)
        return true
    }
  }
  return false
}

function isNearType(x,y, type){
  for (let i = x-1; i <= x+1; i++){
    for (let j = y-1; j <= y+1; j++){
      if (i >= 0 && i < cols && j >= 0 && j < rows){
        if (board.cells[i][j].type === type)
          return true
      }
    }
  }
  return false
}

function showObjects(){
  for (x in board.objectsToShow){
    let items = board.objectsToShow[x]
    for (let i=0; i<items.length; i++){
      if (x === "logpiles"){
        image(tiles.logpile, items[i].x*25, items[i].y*25+topbarHeight)
        drawBadge(items[i].x, items[i].y, items[i].quantity)
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

function drawBadge(i,j,num){
  num = num+""
  let x = i*25+20
  let y = j*25+topbarHeight+5
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
  rect(i*25+2,j*25+15+topbarHeight, 20, 7)
  let color = value > 12 ? "green" :
               value > 6 ? "#e90" : "red"
  fill(color)
  noStroke()
  rect(i*25+3, j*25+16+topbarHeight, value, 6)
}
