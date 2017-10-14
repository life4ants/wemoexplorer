let tiles, players, man, canoe, active, mask
let cols = 80
let rows = 50
let worldWidth = cols * 25
let worldHeight = rows * 25
let topOffset = 30
let path = []
let showCount = 0
let message = ""
let paused = false
let timeOfDay = "day"
let nightTimer = 0

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
    clouds: loadImage("images/clouds.png"),
    dock1: loadImage("images/dock1.png"),
    dock2: loadImage("images/dock2.png"),
    dock3: loadImage("images/dock3.png"),
    fire: loadImage("images/fire.png"),
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
    cross: loadImage("images/cross.png")
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

  mask = [
    loadImage("images/mask6.png"),
    loadImage("images/mask0.png"),
    loadImage("images/mask1.png"),
    loadImage("images/mask2.png"),
    loadImage("images/mask3.png"),
    loadImage("images/mask4.png"),
    loadImage("images/mask5.png")

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
  // startGame()
}

function draw(){
  if (game.started){
    background(255)
    displayBoard()
    if (game.mode === "play") {
      canoe.display()
      man.display()
      follow(active)
      showMessage()
      checkActive()
      if (timeOfDay === "dusk"){
        let alpha = nightTimer > 240 ? 240 : nightTimer
        fill(0,0,0,alpha)
        rect(0,0,2000,1625)
        nightTimer++
      }
      else if (timeOfDay === "night"){
        fill(0,0,0,240)
        rect(0,0,2000,1625)
        nightTimer++
      }
      else if (timeOfDay === "dawn"){
        let alpha = nightTimer > 240 ? 0 : 240 - nightTimer
        fill(0,0,0,alpha)
        rect(0,0,2000,1625)
        nightTimer++
      }
    }
  }
  else {
    background(255)
    fill(0)
    textSize(45)
    textAlign(CENTER, CENTER)
    text("Welcome to Wemo", window.innerWidth/2, window.innerHeight/2)
  }
}

function showMessage(){
  if (showCount > 0){
    text(message, window.innerWidth/2+abs($("#board").position().left), window.innerHeight/2+abs($("#board").position().top))
    showCount--
    if (showCount === 0)
      paused = false
  }
}

function checkActive(){
  // check for mounting canoe
  if (["tree", "treeShore"].includes(board.cells[man.x][man.y].type) && !man.hasBackpack){
    game.availableActions = "tree"
  }
  else if (!man.isRidingCanoe && isNextTo(man.x, man.y, canoe.x, canoe.y)){
    game.availableActions = man.hasBackpack ? "logs" : "mount"
  }
  else if (man.isRidingCanoe && canoe.landed)
    game.availableActions = "dismount"
  else
    game.availableActions = "default"
}

function startGame(){
  man = new Man(player1, board.startX, board.startY)
  canoe = new Canoe(canoe1, board.startX, board.startY)
  active = canoe
  centerOn(active)
  loop()
}

function loadBoard(){
  if (localStorage.board1){
    board = JSON.parse(localStorage.board1)
  }
  else
    generateBoard()
}

function displayBoard() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j<rows; j++){
      let img = game.mode === "edit" ? tiles[board.cells[i][j].tile]:
                  board.cells[i][j].revealed ? tiles[board.cells[i][j].tile] : tiles["clouds"]
      image(img, i*25, j*25)
    }
  }
}

function follow(object) {
  let left = $("#board").position().left
  let top = $("#board").position().top

  if ((object.x*25) + left < 75 && left < 0) // left
    $("#board").css("left", (left+16)+"px")
  else if ((object.x*25) + left > window.innerWidth - 100. && left > window.innerWidth - worldWidth) //right
    $("#board").css("left", (left-16)+"px")

  if ((object.y*25) + top < 75 + topOffset && top < topOffset) //top
    $("#board").css("top", (top+16)+"px")
  else if ((object.y*25) + top > window.innerHeight - 100 && top > window.innerHeight - worldHeight) //bottom
    $("#board").css("top", (top-16)+"px")

}

function centerOn(object) {
  let x = Math.floor(window.innerWidth/2)
  let y = Math.floor(window.innerHeight/2)

  let left = x-object.x*25
  left = left > 0 ? 0 : left
  left = left < window.innerWidth - worldWidth ? window.innerWidth - worldWidth : left

  let top = y-object.y*25
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