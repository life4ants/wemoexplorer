 let timer = {
  startTime: null,
  savCyc: 0,

  update(){
    if (frameCount%3 === 0)
      this.increment()
    if (frameCount%20 === 0)
      this.updateFires()
    if (frameCount % 75 === 0)
      this.growBerries()
    if (frameCount % 180 === 0 && man.health < 5000)
      man.health++
    if (frameCount%239 === 0){
      this.savCyc++
      if (Date.now()-frameTime < 18 || this.savCyc > 2){
        game.saveGame()
        if (this.savCyc > 2)
          console.log("extra save", Date.now()-frameTime)
        else
          console.log("game saved")
        this.savCyc = 0
      }
    }
  },

  increment(){
    let newMins = Math.floor((Date.now() - this.startTime)/250)
    if (newMins - board.wemoMins > 5)
      this.resume()
    else
      board.wemoMins = newMins

    let mins = board.wemoMins%1440
    this.timeOfDay = mins >= 60 && mins <= 119 ? "dawn" :
                  mins >= 1320 && mins <= 1379 ? "dusk" :
                    mins >= 1380 || mins <= 59 ? "night" :
                      "day"

    if (mins >= 1260 && mins <= 1290){
      message = "Night is Coming!!"
      showCount = 8
    }
  },

  resume(){
    let newMins = Math.floor((Date.now() - this.startTime)/250)
    this.startTime += (newMins-board.wemoMins-1)*250
    board.wemoMins = Math.floor((Date.now() - this.startTime)/250)
  },

  setTime(smins){
    this.startTime = Date.now() - (smins*250)
    board.wemoMins = smins
    let mins = smins%1440
    this.timeOfDay = mins >= 60 && mins <= 119 ? "dawn" : mins >= 1320 && mins <= 1379 ? "dusk" :
            mins >= 1380 || mins <= 59 ? "night" : "day"
  },

  updateFires(){
    let fires = board.objectsToShow.fires
    let x = Math.round(frameCount%40/20)
    for (let i=x; i<fires.length; i+=2){
      if (fires[i].value > 0){
        fires[i].value--
      }
    }
  },

  growBerries(){
    let trees = board.objectsToShow.berryTrees
    let x = Math.round(frameCount%300/75)
    for (let i=x; i<trees.length; i+=4){
      this.addBerry(trees[i])
    }
  },

  addBerry(berryTree){
    if (berryTree.berries.length >= 5)
      return
    let p = Math.floor(Math.random()*5)
    for (let i=0; i<berryTree.berries.length; i++){
      if (p === berryTree.berries[i].id){
        p = Math.floor(Math.random()*5)
        i = -1
      }
    }
    let x = p === 3 ? 3 : p === 1 ? 9 : p === 0 ? 2 : 18
    let y = p === 2 ? 3 : p === 1 ? 0 : p === 0 ? 3 : 14
    berryTree.berries.push({id: p, x, y})
  }
}

