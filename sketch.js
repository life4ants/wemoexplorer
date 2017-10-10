let tiles, man, players, canoe
let mode = "canoe"

function preload(){
  tiles = {
    water: loadImage("pics/water 2A.png"),
    shore1: loadImage("images/shore1.png"),
    shore2: loadImage("images/shore2.png"),
    shore3: loadImage("images/shore3.png"),
    shore4: loadImage("images/shore4.png"),
    shore5: loadImage("images/shore5.png"),
    shore6: loadImage("images/shore6.png"),
    shore7: loadImage("images/shore7.png"),
    shore8: loadImage("images/shore8.png"),
    shore9: loadImage("images/shore9.png"),
    shore10: loadImage("images/shore10.png"),
    shore11: loadImage("images/shore11.png"),
    shore12: loadImage("images/shore12.png"),
    beach1: loadImage("images/beach1.png"),
    beach2: loadImage("images/beach2.png"),
    beach3: loadImage("images/beach3.png"),
    beach4: loadImage("images/beach4.png"),
    beach5: loadImage("pics/sand2.png"),
    dock1: loadImage("images/dock1.png"),
    dock3: loadImage("images/dock3.png"),
    palm: loadImage("pics/pomtre.png"),
    rocks: loadImage("images/rocks.png"),
    trees: loadImage("pics/tree 1.png"),
    grass: loadImage("pics/grass 4.png"),
    house: loadImage("pics/tent 5.png"),
    pit: loadImage("images/pit.png"),
    random: loadImage("images/random.png"),
    man: loadImage("pics/plaere 10.png"),
    clouds: loadImage("pics/cloud 1.png")
  }

  players = [
    loadImage("pics/plaere 1.png"),
    loadImage("pics/plaere 2.png"),
    loadImage("pics/plaere 3.png"),
    loadImage("pics/plaere 4.png"),
    loadImage("pics/plaere 5.png"),
    loadImage("pics/plaere 6.png"),
    loadImage("pics/plaere 7.png"),
    loadImage("pics/plaere 8.png"),
    loadImage("pics/plaere 9.png"),
    loadImage("pics/plaere 10.png"),
    loadImage("pics/plaere 11.png"),
    loadImage("pics/plaere 12.png"),
    loadImage("pics/plaere 13.png"),
    loadImage("pics/plaere 14.png"),
    loadImage("pics/plaere 15.png")
  ]

  canoes = [
    loadImage("images/canoe1.png"),
    loadImage("images/canoe2.png"),
    loadImage("images/canoe3.png"),
    loadImage("images/canoe4.png")
  ]
}

function setup(){
  let cvs = createCanvas(1500, 1125)
  cvs.parent("board")
  man = new Man(players, board.startX, board.startY)
  canoe = new Canoe(canoes, 1, 0)
  centerOn(canoe)
}

function draw(){
  background(255)
  loadBoard()
  canoe.display()
  follow(canoe)
}

function loadBoard(){
  for (let i = 0; i < 60; i++) {
    for (let j = 0; j<45; j++){
      let img = tiles[board.cells[i][j].type]
      // let img = board.cells[i][j].revealed ? tiles[board.cells[i][j].type] : tiles["clouds"]
      image(img, i*25, j*25)
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW){
    move(-1, 0)
  }
  else if (keyCode === RIGHT_ARROW){
    move(1,0)
  }
  else if (keyCode === UP_ARROW){
    move(0,-1)
  }
  else if (keyCode === DOWN_ARROW){
    move(0,1)
  }
  else if (keyCode === 188) {
    man.change(-1)
  }
  else if (keyCode === 190) {
    man.change(1)
  }

  return false
}

function move(x, y){
  if (mode === "canoe"){
    moveCanoe(x,y)
  }
  else
    moveMan(x,y)
}

function moveMan(x, y){
  if (man.x + x >= 0 && man.x + x < 60 &&
      man.y + y >= 0 && man.y + y < 45){
    if (board.cells[man.x+x][man.y+y].type !== "water"){
      man.move(x,y)
    }
  }
}

function moveCanoe(x, y){
  if (canoe.x + x >= 0 && canoe.x + x < 60 &&
      canoe.y + y >= 0 && canoe.y + y < 45){
    if (board.cells[canoe.x+x][canoe.y+y].type === "water"){
      canoe.move(x,y)
    }
  }
}

function follow(object) {
  if ((object.x*25) + $("#board").position().left < 75) // left
    $("#board").css("left", ($("#board").position().left+12)+"px")

  if ((object.x*25) + $("#board").position().left > window.innerWidth - 100) //right
    $("#board").css("left", ($("#board").position().left-12)+"px")

  if ((object.y*25) + $("#board").position().top < 75)
    $("#board").css("top", ($("#board").position().top+12)+"px") //top

  if ((object.y*25) + $("#board").position().top > window.innerHeight - 100) //bottom
    $("#board").css("top", ($("#board").position().top-12)+"px")

}

function centerOn(object) {
  let x = Math.floor(window.innerWidth/2)
  let y = Math.floor(window.innerHeight/2)

  let left = x-object.x*25
  left = left > 0 ? 0 : left
  left = left < window.innerWidth - 1500 ? window.innerWidth - 1500 : left

  let top = y-object.y*25
  top = top > 0 ? 0 : top
  top = top < window.innerHeight - 1125 ? window.innerHeight - 1125 : top

  $("#board").css("left", left +"px")
  $("#board").css("top", top +"px")

}
