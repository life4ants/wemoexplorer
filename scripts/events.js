import { board, man, active, backpack, world } from './state.js'
import { topbarHeight } from './config.js'
import { game } from './game.js'
import { popup } from './popup.js'
import { actions } from './actions.js'
import { editor, starEditor } from './editor.js'
import { builder } from './builder.js'
import { tutorial } from './tutorial.js'
import { viewport } from './viewport.js'

export function keyPressed(){
  if (game.mode === "play" && !game.paused && !popup.show && !man.isAnimated){
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

export function keyHandler(keyCode, key){
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
    case "M":
      if (backpack.removeItem("mushroom", 1)){
        actions.eatAction("mushrooms")
      }
      break
    case "J": man.dismount();       break;
    case "K": popup.cookMenu();     break;
    case "S": man.goToSleep();      break;
    case "T": actions.throw();      break;
    case "X": game.autoCenter = !game.autoCenter; break;
  }
  if (tutorial.active && board.level === 0)
    tutorial.keyHandler(keyCode)
}

export function mousePressed(){
  if (window._UIevent){
    window._UIevent = false
    return
  }
  let offset = ["edit", "starEdit"].includes(game.mode) ? 0 : topbarHeight
  if (game.mode === "welcome" || popup.show ||
      winMouseX < world.leftOffset || mouseX > board.cols*25 ||
      mouseY < offset || mouseY > board.rows*25+offset){return}
  switch(game.mode){
    case "play": board.clicker(); break
    case "build": builder.clicker(); break
    case "edit": editor.mousePressed(); break
    case "starEdit": starEditor.mousePressed(); break
  }

  if (typeof window.test !== "undefined" && game.mode === "play" && window.test.clickInfo){
    let y = Math.floor((mouseY-topbarHeight)/25)
    let x = Math.floor(mouseX/25)
    let cell = board.cells[x][y] || {}
    if (window.test.clickInfo === "cell")
      console.log(x,y,cell)
    else
      console.log(mouseX, mouseY)
  }
}

export function mouseDragged(){
  if (mouseX < 0 || mouseX >= width || mouseY < 0 || mouseY >= height || popup.show)
    return
  if (game.mode === "edit" && winMouseY > world.topOffset)
    editor.mouseDragged()
  if (game.mode === "starEdit" && winMouseY > world.topOffset)
    starEditor.mousePressed()
}

export function mouseReleased(){
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height)
    return
  if (game.mode === "edit" && winMouseY > world.topOffset)
    editor.mouseReleased()
}

export function windowResized(){
  if (game.mode === "play")
    viewport.update(true)
}

export function touchStarted(e){
  window._UIevent = true
}
