 let timer = {
  startTime: null,

  update(){
    if (frameCount%(world.frameRate/4) === 0){
      this.increment()
      this.updateObjects()
    }
    if (frameCount%720 === 361){ //every 60 secounds starting at 30 secounds
      if (board.level > 0 && !board.gameOver)
        game.saveGame()
      if (board.type === "custom"){
        g = JSON.parse(localStorage["board"+board.name])
        g.playtime++ 
        localStorage.setItem("board"+board.name, JSON.stringify(g))
      }
    }
  },

  increment(){
    let newMins = Math.floor((Date.now() - this.startTime)/250)
    if (newMins - board.wemoMins > 2)
      this.resume()
    else
      board.wemoMins = newMins
    this.setTimeOfDay()
  },

  setTimeOfDay(){
    this.mins = board.wemoMins%1440
    if (world.noNight){
      this.dark = false
      this.timeOfDay = "day"
      return
    }
    this.dark = (this.mins >= 1360 || this.mins < 80)
    this.timeOfDay = this.mins >= 60 && this.mins <= 119 ? "dawn" :
                  this.mins >= 1320 && this.mins <= 1379 ? "dusk" :
                  this.mins >= 1380 || this.mins <= 59 ? "night" :
                      "day"
    if (this.mins === 119)
      tutorial.checkAction("night")
  },

  resume(){
    let newMins = Math.floor((Date.now() - this.startTime)/250)
    this.startTime += (newMins-board.wemoMins-1)*250
    board.wemoMins = Math.floor((Date.now() - this.startTime)/250)
  },

  setTime(smins){
    this.startTime = Date.now() - (smins*250)
    board.wemoMins = smins
    this.setTimeOfDay()
  },

  updateObjects(){ // runs every wemo minute
    for (let i=0; i<board.fires.length; i++){
      if (board.fires[i].value > 0)
        board.fires[i].value-- 
    }
    for (let i=0; i<board.buildings.length; i++){
      board.buildings[i].update()
    }   
    for (let i = 0; i<board.cols; i++){
      for(let j=0; j<board.rows; j++){
        let cell = board.cells[i][j]
        switch(cell.type){
        case "berryTree": try{plants.addApple(cell)} catch(e){console.error(e,i,j)}; break
        case "berryBush": try{plants.addBerry(cell)} catch(e){console.error(e,i,j)}; break
        case "root":
          cell.growtime++
          switch(cell.growtype){
          case "mushroom":
            if (cell.growtime > 1440){
              cell.type = "mushroom"
              delete cell.growtype
              delete cell.growtime
            }
            break
          case "veggies":
          case "longGrass":
            if (cell.growtime >= plants.sproutTime){
              cell.type = cell.growtype
              delete cell.growtype
              cell.growtime = 0
              cell.tile = cell.type+"1"
            }
          }
          break
        case "veggies": plants.addVeggy(cell); break
        case "longGrass": plants.addGrass(cell); break
        }
      }
    }
  }
}

