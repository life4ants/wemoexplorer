function keyPressed(){
  if (game.mode === "play"){
    playKeys()
  }
  else
    console.log("not playing")
}

function playKeys() {
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

  switch(key){
    case "X":
      centerOn(active)
      break
    case "J":
      man.dismount()
      break
    case "1":
      move(-1, 1)
      break
    case "2":
      move(0,2)
      break
    case "3":
      move(1,1)
      break
    case "4":
      move(-2,0)
      break
    case "6":
      move(2,0)
      break
    case "7":
      move(-1,-1)
      break
    case "8":
      move(0,-2)
      break
    case "9":
      move(1,-1)
      break
  }

  return false
}

function clickHandler(){
  let x = Math.floor(mouseX/25)
  let y = Math.floor(mouseY/25)
  let id = x+"_"+y
  if (game.mode === "edit" && mouseButton === LEFT){
    if (game.auto)
      path = [id]
    else
      changeTile(x,y, game.currentTile, game.currentType)
  }
  else if (game.mode === "edit" && mouseButton === RIGHT){
    let cell = board.cells[x][y]
    floodFill(x, y, cell.tile, cell.type, game.currentTile, game.currentType)
  }
  return false
}
function mouseDragged(){
  if (winMouseY > topOffset && game.mode === "edit"){
    let x = Math.floor(mouseX/25)
    let y = Math.floor(mouseY/25)
    let id = x+"_"+y
    if (game.auto){
      if (!path.includes(id)){
        changeTile(x,y, "cross", "cross")
        path.push(id)
      }
    }
    else {
      changeTile(x,y, game.currentTile, game.currentType)
    }
  }
}

function mouseReleaseHandler(){
  if (game.auto){
    let tiles = magic()
    if (tiles){
      for (let i = 0; i < path.length; i++){
        let ar = path[i].split("_")
        let x = Number(ar[0])
        let y = Number(ar[1])

        changeTile(x,y, game.currentTile+tiles[i], game.currentTile)
      }
    }
  }
  path = []
}

function changeTile(x,y, tile, type){
  board.cells[x][y] = {tile, type, revealed: false}
}

function floodFill(x,y, type1, tile1, type2, tile2){
  board.cells[x][y] = {tile: tile2, type: type2, revealed: false}

  for (let i = x-1; i <= x+1; i++){
    for (let j = y-1; j <= y+1; j++){
      if (i >= 0 && i < cols && j >= 0 && j < rows && board.cells[i][j].tile === tile1)
        floodFill(i,j, type1, tile1, type2, tile2)
    }
  }
}

function move(x, y){
  if (active === canoe){
    canoe.move(x,y)
  }
  else
    man.move(x,y)
}

function magic(){
  if (path.length < 2)
    return false
  let ar = []
  for (let i = 0; i < path.length; i++){
    let id = path[i].split("_")
    ar.push([Number(id[0]), Number(id[1])])
  }
  let tileNum = []
  for (let i=0; i<ar.length; i++){
    let x = ar[i][0], y = ar[i][1]
    if (i === 0){
      tileNum[i] = ar[i+1][0] < x && ar[i+1][1] <= y ? 7 :
                     ar[i+1][1] < y ? 10 :
                       ar[i+1][0] > x ? 2 : 4
    }
    else if (i === ar.length-1){
      tileNum[i] = ar[i-1][0] < x && ar[i-1][1] <= y ? 2 :
                     ar[i-1][1] < y ? 4 :
                       ar[i-1][0] > x ? 7 : 10
    }
    else if (ar[i+1][0] < x && ar[i+1][1] <= y) { //next is left
      tileNum[i] = ar[i-1][1] < y ? 6 :  //last is top
                     ar[i-1][0] > x ? 7 : //last is right
                       11 // last is below
    }
    else if (ar[i+1][1] < y) { //next is top
      tileNum[i] = ar[i-1][0] > x ? 9 : //last is right
                     ar[i-1][1] > y ? 10 : // last is below
                       12 // last is left
    }
    else if (ar[i+1][0] > x) { //next is right
      tileNum[i] = ar[i-1][1] < y ? 5 :  //last is top
                     ar[i-1][0] < x ? 2 : //last is left
                       1 // last is below
    }
    else { //next is below
      tileNum[i] = ar[i-1][1] < y ? 4 :  //last is top
                     ar[i-1][0] > x ? 8 : //last is right
                       3 // last is left
    }
  }
  return tileNum
}

