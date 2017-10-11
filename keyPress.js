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
    case "C":
     active = canoe
     break
    case "X":
      centerOn(active)
      break
    case "M":
      active = man
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

function mousePressed(){
  if (winMouseY > topOffset && game.mode === "edit"){
    let id = Math.floor(mouseX/25) + "_" + Math.floor(mouseY/25)
    path = [id]
  }
}
function mouseDragged(){
  if (winMouseY > topOffset && game.mode === "edit"){
    let id = Math.floor(mouseX/25) + "_" + Math.floor(mouseY/25)
    if (!path.includes(id))
      path.push(id)
  }
}

function mouseReleased(){
  if (game.auto){
    console.log("start")
  }
  else {
    for (let i = 0; i < path.length; i++){
      let id = path[i].split("_")
      let x = Number(id[0])
      let y = Number(id[1])
      board.cells[x][y] = {tile: game.currentTile, type: game.currentType, revealed: false}
    }
    path = []
  }
}
function move(x, y){
  if (active === canoe){
    canoe.move(x,y)
  }
  else
    man.move(x,y)
}