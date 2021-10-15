 let timer = {
  startTime: null,

  update(){
    if (frameCount%(world.frameRate/4) === 0)
      this.increment()
    if (frameCount%20 === 0)
      this.updateFires()
    if (frameCount % 75 === 0)
      this.growBerries()
    if (frameCount % 180 === 0 && man.health < 5000)
      man.health++
    if (frameCount%317 === 0)
      this.growVeggies()
    if (frameCount%437 === 0){
      game.saveGame()
      console.log("game saved")
    }
  },

  increment(){
    let newMins = Math.floor((Date.now() - this.startTime)/250)
    if (newMins - board.wemoMins > 5)
      this.resume()
    else
      board.wemoMins = newMins

    this.setTimeOfDay()
  },

  setTimeOfDay(){
    this.mins = board.wemoMins%1440
    this.dark = (this.mins >= 1360 || this.mins < 80)
    this.timeOfDay = this.mins >= 60 && this.mins <= 119 ? "dawn" :
                  this.mins >= 1320 && this.mins <= 1379 ? "dusk" :
                  this.mins >= 1380 || this.mins <= 59 ? "night" :
                      "day"
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

  updateFires(){
    let x = Math.round(frameCount%40/20)//gives either 0 or 1
    for (let i=x; i<board.fires.length; i+=2){
      if (board.fires[i].value > 0)
        board.fires[i].value--
    }
    if (x === 0){
      for (let i=x; i<board.buildings.length; i++){
        if (board.buildings[i].type === "campsite" && board.buildings[i].fireValue > 0){
          board.buildings[i].fireValue--
          if (board.buildings[i].isCooking){//REFACTOR this into a building object
            board.buildings[i].cookTime--
            if (board.buildings[i].cookTime === 0){
              board.buildings[i].isCooking = false
              if (typeof board.buildings[i].action === "function")
                board.buildings[i].action()
            }
          }
        }
      }
    }
  },

  growVeggies(){
    for (let i = 0; i<board.cols; i++){
      for(let j=0; j<board.rows; j++){
        if (board.cells[i][j].type === "veggies"){
          let cell = board.cells[i][j]
          let q = Number(cell.tile.substr(7,1))
          cell.tile = q < 4 ? "veggies"+(q+1): cell.tile 
        }
      }
    }
  },

  growBerries(){
    let trees = board.berryTrees
    let bushes = board.berryBushes || []
    let x = Math.round(frameCount%300/75)
    for (let i=x; i<trees.length; i+=4){
      this.addApple(trees[i])
    }
    for (let i=x; i<bushes.length; i+=4){
      this.addBerry(bushes[i])
    }
  },

  addApple(tree){
    if (tree.berries.length >= 5)
      return
    let p = Math.floor(Math.random()*5)
    for (let i=0; i<tree.berries.length; i++){
      if (p === tree.berries[i].id){
        p = Math.floor(Math.random()*5)
        i = -1
      }
    }
    let x = p === 3 ? 3 : p === 1 ? 9 : p === 0 ? 2 : 18
    let y = p === 2 ? 3 : p === 1 ? 0 : p === 0 ? 3 : 14
    tree.berries.push({id: p, x, y})
  },

  addBerry(bush){
    if (bush.berries.length >= 9)
      return
    let a = [[16,8],[3,13],[7,14],[15,15],[21,15],[4,20],[7,20],[16,20],[22,22]]
    let p = Math.floor(Math.random()*9)
    for (let i=0; i<bush.berries.length; i++){
      if (p === bush.berries[i].id){
        p = Math.floor(Math.random()*9)
        i = -1
      }
    }
    bush.berries.push({id: p, x: a[p][0], y: a[p][1]})
  }
}

