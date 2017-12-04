function keyPressed(){
  if (game.mode === "play" && game.started && !game.paused && !noKeys){
    playKeys()
  }
  else if (["dumpMenu", "build"].includes(popup.type)){
    switch(keyCode){
      case UP_ARROW:
      case LEFT_ARROW:
        popup.changeSelect(-1)
        return false
      case DOWN_ARROW:
      case RIGHT_ARROW:
        popup.changeSelect(1)
        return false
    }
  }
  switch(keyCode){
    case ENTER:
      $('#etr').click()
      break
    case ESCAPE:
      $('#esc').click()
      break
    case 32:
      game.pauseGame()
  }
}

function playKeys() {
  switch(keyCode){
    case LEFT_ARROW:
      active.move(-1, 0)
      break
    case RIGHT_ARROW:
      active.move(1,0)
      break
    case UP_ARROW:
      active.move(0,-1)
      break
    case DOWN_ARROW:
      active.move(0,1)
      break
    default:
      game.action(key)
  }
  return false
}

function mousePressed(){
  if (mouseX < 0 || mouseX > worldWidth || mouseY < 0 || mouseY > worldHeight)
      return
  if (game.mode === "play" && !popup.show && winMouseX > leftOffset && mouseY > viewport.top+topbarHeight && window.focused){
    let y = Math.floor((mouseY-topbarHeight)/25)
    let x = Math.floor(mouseX/25)
    console.log(x, y)
  }
  else if (game.mode === "edit" && winMouseY > topOffset )
    editor.mousePressed()
}

function mouseDragged(){
  if (mouseX < 0 || mouseX >= worldWidth || mouseY < 0 || mouseY >= worldHeight)
    return
  if (game.mode === "edit" && winMouseY > topOffset)
    editor.mouseDragged()
}

function mouseReleased(){
  if (mouseX < 0 || mouseX > worldWidth || mouseY < 0 || mouseY > worldHeight)
    return
  if (game.mode === "edit" && winMouseY > topOffset)
    editor.mouseReleased()
}
