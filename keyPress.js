function keyPressed(){
  if (game.mode === "play" && !paused && game.started){
    playKeys()
  }
}

function playKeys() {
  switch(keyCode){
    case LEFT_ARROW:
      move(-1, 0)
      break
    case RIGHT_ARROW:
      move(1,0)
      break
    case UP_ARROW:
      move(0,-1)
      break
    case DOWN_ARROW:
      move(0,1)
      break
    case ENTER:
      if (popup.show)
        $('#etr').click()
      break
  }

  switch(key){
    case "B":
      popup.buildMenu()
      break
    case "D":
      dumpLog()
      break
    case "E":
      eatBerry()
      break
    case "F":
      feedFire()
      break
    case "G":
      grabLog()
      break
    case "X":
      centerOn(active)
      break
    case "J":
      man.dismount()
      break
  }

  return false
}

function grabLog(){
  if (!man.hasBackpack && "logpile" === board.cells[man.x][man.y].type){
    let cell = board.cells[active.x][active.y]
    let logpiles = board.objectsToShow.logpiles
    let index = logpiles.findIndex((e) => e.id === cell.id)
    logpiles[index].quantity--
    man.hasBackpack = true
    if (logpiles[index].quantity === 0){
      logpiles.splice(index, 1)
      cell.type = cell.tile
      delete cell.id
    }
  }
  else if (!man.hasBackpack && ["tree", "treeShore"].includes(board.cells[active.x][active.y].type)){
    board.cells[active.x][active.y] = {tile: "stump", type: "stump", revealed: true}
    man.hasBackpack = true
    game.availableActions = "default"
  }
}

function dumpLog(){
  if (man.hasBackpack){
    let cell = board.cells[active.x][active.y]
    let logpiles = board.objectsToShow.logpiles
    if (cell.type === "logpile"){
      let index = logpiles.findIndex((e) => e.id === cell.id)
      logpiles[index].quantity++
    }
    else if (["sand", "grass", "stump"].includes(cell.type)){
      let id = logpiles.length > 0 ? logpiles[logpiles.length-1].id+1 : 0
      cell.type = "logpile"
      cell.id = id
      logpiles.push({id: id, x: active.x, y: active.y, quantity: 1})
    }
    else
      return
    man.hasBackpack = false
  }
}

function feedFire(){
  if (man.hasBackpack && man.isNextToFire){
    let fire = board.objectsToShow.fires[man.fireId]
    fire.value = fire.value < 8 ? fire.value+13 : 20
    man.hasBackpack = false
  }
}

function eatBerry(){
  let cell = board.cells[man.x][man.y]
  if (cell.type === "berryTree"){
    let tree = board.objectsToShow.berryTrees[cell.id]
    if (tree.berries.length > 0){
      let p = Math.floor(Math.random()*tree.berries.length)
      tree.berries.splice(p, 1)
      man.health += 50
      berryCount++
    }
  }
}

function build(type){
  let cell = board.cells[active.x][active.y]
  if (type === "firepit"){
    let fires = board.objectsToShow.fires
    if (["grass", "sand", "stump", "beach"].includes(cell.type)){
      let id = fires.length > 0 ? fires[fires.length-1].id+1 : 0
      cell.type = "firepit"
      cell.id = id
      fires.push({id: id, x: active.x, y: active.y, value: 0})
      return false
    }
    else
      return "Opps! Firepits can only be built on grass, beach, sand, or stumps"
  }
}

function clickHandler(){
  let x = Math.floor(mouseX/25)
  let y = Math.floor(mouseY/25)
  let id = x+"_"+y
  if (game.mode === "edit" && mouseButton === LEFT){
    if (game.auto){
      path = [id]
      changeTile(x,y, "cross", "cross")
    }
    else if (game.currentType === "canoe"){
      board.startX = x
      board.startY = y
    }
    else
      changeTile(x,y, game.currentTile, game.currentType)
  }
  else if (game.mode === "edit" && mouseButton === RIGHT && !game.auto){
    if (confirm("are you sure you want to flood fill?")){
      let cell = board.cells[x][y]
      floodFill(x, y, cell.tile, cell.type, game.currentTile, game.currentType)
    }
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
    else if (game.currentType !== "canoe"){
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

