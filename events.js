function keyPressed(){
  if (game.mode === "play" && !game.paused && !world.noKeys && !man.isAnimated){
    keyHandler(keyCode, key)
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

function keyHandler(keyCode, key){
  switch(keyCode){
    case LEFT_ARROW:  active.move(-1, 0); break;
    case RIGHT_ARROW: active.move(1,0);   break;
    case UP_ARROW:    active.move(0,-1);  break;
    case DOWN_ARROW:  active.move(0,1);   break;
  }
  switch(key){
    case "B": popup.buildMenu();    break;
    case "C": actions.chop();       break;
    case "D":
      if (board.cells[active.x][active.y].type === "campsite"){ popup.dropMenu() }
      else { popup.dumpMenu() }
      break
    case "E": actions.eat();        break;
    case "F": actions.fling();      break;
    case "G":
      if (board.cells[active.x][active.y].type === "campsite"){ popup.grabMenu("grab") }
      else { actions.grab() }
      break
    case "J": man.dismount();       break;
    case "K": popup.cookMenu();     break;
    case "S": man.goToSleep();      break;
    case "T": actions.throw();      break;
    case "X": game.autoCenter = !game.autoCenter; break;
  }
  if (tutorial.active)
    tutorial.keyHandler(keyCode)
}

function mousePressed(){
  if (window._UIevent){
    window._UIevent = false
    return
  }
  if (game.mode === "edit")
    editor.mousePressed()
  else if (game.mode === "welcome" || popup.show || world.noKeys ||
      mouseX < 0 || mouseX > board.cols*25 ||
      mouseY < topbarHeight || mouseY > board.rows*25+topbarHeight)
    return
  // let dir = mouseX < 0 ? "sidebar" : 
  //   mouseX > board.cols*25 ? "too far right" : 
  //   mouseY < topbarHeight ? "topbar" : 
  //   mouseY > board.rows*25+topbarHeight ? "too far down" : 
  //   false 
  // if (dir){
  //   console.log(dir)
  //   return
  // }
  switch(game.mode){
    case "play":
      board.clicker()
      break
    case "build":
      builder.clicker()
      break
  }
  
  if (game.mode === "play" && test.clickInfo){
    let y = Math.floor((mouseY-topbarHeight)/25)
    let x = Math.floor(mouseX/25)
    let cell = board.cells[x][y] || {}
    if (test.clickInfo === "cell")
      console.log(x,y,cell)
    else
      console.log(mouseX, mouseY)
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

function touchStarted(){
  // declared to fix mobile issues
}
