let tiles, man, players, canoe, active, mode
let cols = 80
let rows = 50
let worldWidth = cols * 25
let worldHeight = rows * 25
let topOffset = 100

let path = []

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
    rock1: loadImage("images/rock1.png"),
    rock2: loadImage("images/rock2.png"),
    rock3: loadImage("images/rock3.png"),
    rock4: loadImage("images/rock4.png"),
    rock5: loadImage("images/rock5.png"),
    rock6: loadImage("images/rock6.png"),
    rock7: loadImage("images/rock7.png"),
    rock8: loadImage("images/rock8.png"),
    rock9: loadImage("images/rock9.png"),
    rock10: loadImage("images/rock10.png"),
    rock11: loadImage("images/rock11.png"),
    rock12: loadImage("images/rock12.png"),
    rock13: loadImage("images/rock13.png"),
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
    water: loadImage("images/water.png")
  }

  players = [
    loadImage("images/plaere 2.png"),
    loadImage("images/plaere 8.png"),
    loadImage("images/plaere 9.png"),
    loadImage("images/plaere 10.png"),
    loadImage("images/plaere 11.png"),
    loadImage("images/plaere 12.png"),
    loadImage("images/plaere 13.png")
  ]

  canoes = [
    loadImage("images/canoe1.png"),
    loadImage("images/canoe2.png"),
    loadImage("images/canoe3.png"),
    loadImage("images/canoe4.png")
  ]
}

function setup(){
  let cvs = createCanvas(worldWidth, worldHeight)
  cvs.parent("board")
  // frameRate(15)
  loadBoard()
  man = new Man(players, board.startX, board.startY)
  canoe = new Canoe(canoes, 1, 0)
  active = canoe
  centerOn(active)
}

function draw(){
  background(255)
  displayBoard()
  if (game.mode === "play") {
    active.display()
    follow(active)
  }
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
      let img = tiles[board.cells[i][j].tile]
      // let img = board.cells[i][j].revealed ? tiles[board.cells[i][j].tile] : tiles["clouds"]
      image(img, i*25, j*25)
    }
  }
}

function follow(object) {
  let left = $("#board").position().left
  let top = $("#board").position().top

  if ((object.x*25) + left < 75 && left <= 0) // left
    $("#board").css("left", (left+15)+"px")
  else if ((object.x*25) + left > window.innerWidth - 100. && left >= window.innerWidth - worldWidth) //right
    $("#board").css("left", (left-15)+"px")

  if ((object.y*25) + top < 75 + topOffset && top <= topOffset) //top
    $("#board").css("top", (top+15)+"px")
  else if ((object.y*25) + top > window.innerHeight - 100 && top >= window.innerHeight - worldHeight) //bottom
    $("#board").css("top", (top-15)+"px")

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
