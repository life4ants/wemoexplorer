function keyPressed(){
  if (game.mode === "play" && !game.paused && !world.noKeys && !man.isAnimated && !window.event.shiftKey){//code is also in game.js
    //keyDelay = frameCount
    if (!keyHandler())
      game.action(key)
  }
  else if (["dumpMenu", "build"].includes(popup.type)){
    switch(keyCode){
      case UP_ARROW:
      case LEFT_ARROW:
        popup.changeSelect(-1);  return false
      case DOWN_ARROW:
      case RIGHT_ARROW:
        popup.changeSelect(1);   return false
    }
  }
  switch(keyCode){
    case ENTER:  $('#etr').click();   break;
    case ESCAPE: $('#esc').click();   break;
    case 32:     game.pauseGame();
  }
}

function keyHandler(){
  switch(keyCode){
      case LEFT_ARROW:  active.move(-1, 0); return true;
      case RIGHT_ARROW: active.move(1,0);   return true;
      case UP_ARROW:    active.move(0,-1);  return true;
      case DOWN_ARROW:  active.move(0,1);   return true;
      default:          return false
    }
}

function mousePressed(){
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)
      return
  if (game.mode === "edit" && winMouseX > world.leftOffset && !popup.show)
    editor.mousePressed()
  else if (mouseX > viewport.left && mouseY > viewport.top+topbarHeight){
    if (game.mode === "play" && !popup.show)
      board.clicker()
    else if (game.mode === "build")
      builder.clicker()
  }
}

function mouseDragged(){
  if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height)
    return
  if (game.mode === "edit" && winMouseY > world.topOffset)
    editor.mouseDragged()
}

function mouseReleased(){
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)
    return
  if (game.mode === "edit" && winMouseY > world.topOffset)
    editor.mouseReleased()
}

function windowResized(){
  if (game.mode === "play")
    viewport.update(true)
}
