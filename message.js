

function showMessage(){
  if (game.infoShown)
      showInfo()
  if (showCount > 0){
    textAlign(CENTER, CENTER)
    let f = timer.timeOfDay === "night" || game.paused ? 255 : ["dusk", "dawn"].includes(timer.timeOfDay) ? 80 : 20
    fill(f)
    stroke(255)
    textSize(45)
    text(message, (window.innerWidth/2)+abs($("#board").position().left), (window.innerHeight/2)+abs($("#board").position().top))
    showCount--
    if (showCount === 0) {
      man.vomit = false
      noKeys = false
    }
    if (board.cells[man.x][man.y].type === "firepit" && board.objectsToShow.fires[man.fireId].value > 0){
      showCount++
      man.health -= 25
      if (man.energy < 0 || man.health < 0)
        popup.gameOver()
    }
  }
}


function showInfo(){
  let f = timer.timeOfDay === "night" || game.paused ? 255 : ["dusk", "dawn"].includes(timer.timeOfDay) ? 230 : 20
  fill(f)
  textSize(15)
  textAlign(LEFT,BOTTOM)
  let message = "man dist: "+man.stepCount+" cells left to explore: "+board.revealCount+
      " walking cost: "+(Math.round(backpack.walkingCost()*100)/100)+" frame Rate: "+(Math.floor(frameRate()*10)/10)+" mils: "+(Date.now()-frameTime)
  text(message, viewport.left, viewport.bottom)
}
