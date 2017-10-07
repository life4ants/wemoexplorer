let tiles

function preload(){
  tiles = {
    water: loadImage("images/water.png"),
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
    beach5: loadImage("images/beach5.png"),
    dock1: loadImage("images/dock1.png"),
    dock3: loadImage("images/dock3.png"),
    palm: loadImage("images/palm.png"),
    rocks: loadImage("images/rocks.png"),
    trees: loadImage("images/trees.png"),
    grass: loadImage("images/grass.png"),
    house: loadImage("images/house.png"),
    pit: loadImage("images/pit.png"),
    random: loadImage("images/random.png"),
    man: loadImage("images/man.png"),
    clouds: loadImage("images/clouds.png")
  }
  let manX, manY
}

function setup(){
  createCanvas(1500, 1125)
  loadBoard()
  manX = board.startX
  manY = board.startY
}

function draw(){
  image(tiles.man, manX*25, manY*25)
}

// function createBoard() {
//   let output = []
//   for (let i=1; i<26; i++){
//     output.push([])
//     for (let j=1; j<41; j++){
//       let type = (i-1 < Math.random()*4 || j-1 < Math.random()*4 || j > Math.random()*5+35 || i > Math.random()*5+20) ?
//         "water" :
//           (i%8 + j%8 > Math.random()*5 && i%8 + j%8 < Math.random()*14) ?
//             "trees" :
//               (j - 10 - i%10 < 0 && j - 10 - i%5 > 2) ?
//                 "rocks" :
//                   (j < 18 && j > 15 && i%9 === 1) ?
//                     "house" :
//                       "grass"

//       output[i].push(type)
//     }
//   }
// }

function loadBoard(){
  for (let i = 0; i < 60; i++) {
    for (let j = 0; j<45; j++){
      image(tiles[board.cells[i][j].type], i*25, j*25)
    }
  }
}

function keyPressed(){
  if (keyCode === LEFT_ARROW){
    if (manX > 0 && board.cells[manX-1][manY].type !== "water")
      manX--
  }
  else if (keyCode === RIGHT_ARROW){
    if (manX < 45 && board.cells[manX+1][manY].type !== "water")
      manX++
  }
  else if (keyCode === UP_ARROW){

  }
  else if (keyCode === DOWN_ARROW){

  }
    return false
}

