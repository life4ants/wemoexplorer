
function build(type){
  let cell = board.cells[active.x][active.y]
  // build firepit:
  if (type === "firepit"){
    let fires = board.objectsToShow.fires
    if (man.energy <= 200)
      return "Oops! You don't have enough energy!"
    if (["grass", "sand", "stump", "beach", "beachEdge", "grassBeach", "rockMiddle"].includes(cell.type)){
      let id = fires.length > 0 ? fires[fires.length-1].id+1 : 0
      cell.type = "firepit"
      cell.id = id
      fires.push({id: id, x: active.x, y: active.y, value: 0})
      man.isNextToFire = true
      man.fireId = id
      man.energy -= 200
      return false
    }
    else
      return "Opps! You can't build a Firepit on a "+cell.type+"!"
  }
  // build basket:
  else if (type === "basket"){
    let num = backpack.includesItem("longGrass")
    if (man.energy <= 50)
      return "Oops! you don't have enough energy!"
    if (num >= 6){
      backpack.removeItem("longGrass", 6)
      man.basket = {quantity: 0}
      popup.buildOptions[popup.buildOptions.findIndex((e) => e.id === "basket")].active = false
      return "Congratulations! You can now gather berries. Look for the Basket icon on the top bar."
    }
    else {
      return "Oops! You need "+(6-num)+" more Long Grass!"
    }
  }
  // build stoneAx:
  else if (type === "stoneAx"){
    if (man.energy <= 100)
      return "Oops! you don't have enough energy!"
    let needed = ["longGrass", "rock", "stick"]
    let ar = backpack.includesItems(needed)
    if (ar.length === 3){
      backpack.removeItem("longGrass", 1)
      backpack.removeItem("rock", 1)
      backpack.removeItem("stick", 1)
      man.tools.push("stoneAx")
      popup.buildOptions[popup.buildOptions.findIndex((e) => e.id === "stoneAx")].active = false
      return "Congratulations! You can now chop down trees at a cost of 300 energy. Look for the Stone Ax icon on the top bar."
    }
    else {
      let out = "Opps! You still need "
      for (let j = 0; j < needed.length; j++){
        if (ar.find((e) => e.type === needed[j]) === undefined){
          let name = j === 0 ? "a Long Grass and " : j === 1 ? "a Rock and " : "a Stick and "
          out += name
        }
      }
      return out.slice(0, -5)+"!"
    }
  }
  // build bone Shovel:
  else if (type === "boneShovel"){
    if (man.energy <= 120)
      return "Oops! you don't have enough energy!"
    let needed = ["longGrass", "bone", "stick"]
    let ar = backpack.includesItems(needed)
    if (ar.length === 3){
      backpack.removeItem("longGrass", 1)
      backpack.removeItem("bone", 1)
      backpack.removeItem("stick", 1)
      man.tools.push("boneShovel")
      popup.buildOptions[popup.buildOptions.findIndex((e) => e.id === "boneShovel")].active = false
      return "Congratulations! You can now dig clay at a cost of 200 energy. Look for the Bone Shovel icon on the top bar."
    }
    else {
      let out = "Opps! You still need "
      for (let j = 0; j < needed.length; j++){
        if (ar.find((e) => e.type === needed[j]) === undefined){
          let name = j === 0 ? "a Long Grass and " : j === 1 ? "a Bone and " : "a Stick and "
          out += name
        }
      }
      return out.slice(0, -5)+"!"
    }
  }
  // build raft:
  else if (type === "raft"){
    if (cell.type === "beach" && helpers.isNextToType(active.x, active.y, "water")){
      if (man.energy <= 400)
        return "Oops! you don't have enough energy!"
      else {
        let construction = {
          type: "raft",
          needed: [
            {type: "log", quantity: 8, color: "#582C0F"},
            {type: "longGrass", quantity: 8, color: "#207414"}
          ]
        }
        cell.type = "construction"
        cell.construction = construction
        man.energy -= 400
        popup.buildOptions[popup.buildOptions.findIndex((e) => e.id === "raft")].active = false
        fling()
      }
    }
    else
      return "You must build a raft on a beach square next to a water square"
  }
  // build stepping stones:
  else if (type === "steppingStones"){
    let item = helpers.isNextToTile(active.x, active.y, fordable)
    if (item){
      if (man.energy <= 150)
        return "Oops! you don't have enough energy!"
      else {
        let construction = {
          type: "steppingStones",
          needed: [
            {type: "rock", quantity: 3, color: "#B4D9D9"}
          ]
        }
        board.cells[item.x][item.y].type = "construction"
        board.cells[item.x][item.y].construction = construction
        man.energy -= 150
        fling()
      }
    }
    else
      return "You must be next to a straight piece of river to build stepping stones"
  }
}

function chop(){
  let cell = board.cells[man.x][man.y]
  if (["tree", "treeShore"].includes(board.cells[active.x][active.y].type)){
    let t = man.tools.findIndex((e) => e === "stoneAx" || e === "steelAx")
    if (t === -1){
      popup.setAlert("It looks like you don't have any tools for chopping down trees. Look for an ax on the Build Menu.")
    }
    else {
      let logpiles = board.objectsToShow.logpiles
      let id = logpiles.length > 0 ? logpiles[logpiles.length-1].id+1 : 0
      cell.type = "logpile"
      cell.tile = "stump"
      cell.id = id
      logpiles.push({id: id, x: active.x, y: active.y, quantity: 5})
      man.energy = man.tools[t] === "stoneAx" ? man.energy-300 : man.energy-150
    }
  }
}

function dump(type){
  let cell = board.cells[active.x][active.y]
  // long Grass:
  if (type === "longGrass"){
    backpack.removeItem("longGrass", 1)
  }
  // clay:
  else if (type === "clay"){
    if (cell.type === "stump"){
      popup.setAlert("Sorry, you can't put clay on a stump.")
      return
    }
    else if (cell.type === "clay" && cell.quantity < 5){
      cell.quantity++
      backpack.removeItem("clay", 1)
    }
    else if (dumpable.includes(cell.type)){
      cell.type = "clay"
      cell.quantity = 1
      backpack.removeItem("clay", 1)
    }
  }
  else if (dumpable.includes(cell.type)){
    // log:
    if (type === "log"){
      let logpiles = board.objectsToShow.logpiles
      if (cell.type === "logpile"){
        let index = logpiles.findIndex((e) => e.id === cell.id)
        logpiles[index].quantity++
      }
      else {
        let id = logpiles.length > 0 ? logpiles[logpiles.length-1].id+1 : 0
        cell.type = "logpile"
        cell.id = id
        logpiles.push({id: id, x: active.x, y: active.y, quantity: 1})
      }
      backpack.removeItem("log", 1)
    }
    // rock:
    else if (type === "rock"){
      let rockpiles = board.objectsToShow.rockpiles
      if ("rockpile" === cell.type){
        let index = rockpiles.findIndex((e) => e.id === cell.id)
        rockpiles[index].quantity++
      }
      else {
        let id = rockpiles.length > 0 ? rockpiles[rockpiles.length-1].id+1 : 0
        cell.type = "rockpile"
        cell.id = id
        rockpiles.push({id: id, x: active.x, y: active.y, quantity: 1})
      }
      backpack.removeItem("rock", 1)
    }
    // bone:
    else if (type === "bone"){
      if (cell.type === "stump"){
        popup.setAlert("Sorry, you can't put a bone on a stump.")
        return
      }
      backpack.removeItem("bone", 1)
      cell.type = "bone"
    }
  }
  else
    popup.setAlert("You can't dump "+type+" on a "+cell.type+"!")
}

function eat(){
  let cell = board.cells[man.x][man.y]
  let tree = board.objectsToShow.berryTrees[cell.id]
  if (cell.type === "berryTree" && tree.berries.length > 0){
    let p = Math.floor(Math.random()*tree.berries.length)
    tree.berries.splice(p, 1)
  }
  else if (man.basket && man.basket.quantity > 0 && cell.type !== "berryTree"){
     man.basket.quantity--
  }
  else
    return
  if (man.energy > 5000){
    man.energy -= Math.floor((Math.random()*5+1)*100)
    man.health -= Math.floor((Math.random()*5+1)*10)
    message = "You ate too much!!!"
    showCount = 40
    man.vomit = true
    noKeys = true
  }
  else if (man.energy > 4965){
    man.energy += 35
    man.health = man.health < 5000 ? man.health+10 : 5000
    popup.setAlert("You are full. Stop eating!")
  }
  else {
    man.energy += 35
    man.health = man.health < 4995 ? man.health+5 : 5000
  }
}

function fling(){
  if (man.isNextToFire){
    let items = backpack.includesItems(["log", "stick", "longGrass"])
    if (items.length > 0){
      let fire = board.objectsToShow.fires[man.fireId]
      fire.value = items[0].type === "log" ? Math.min(fire.value+13, 20) :
                     items[0].type === "stick" ? Math.min(fire.value+5, 20) : Math.min(fire.value+2, 20)
      backpack.removeItem(items[0].type, 1)
      if (board.cells[man.x][man.y].type === "firepit"){
        showCount = 3
        message = "Get off the fire! You're burning!"
        man.health -= 10
      }
    }
  }
  else {
    let cell = helpers.nearbyType(active.x, active.y, "construction")
    if (cell){
      let item = cell.construction
      for (let i = item.needed.length - 1; i >= 0; i--) {
        let num = backpack.includesItem(item.needed[i].type)
        if (num){
          num = min(item.needed[i].quantity, num)
          backpack.removeItem(item.needed[i].type, num)
          item.needed[i].quantity -= num
          if (item.needed[i].quantity === 0){
            item.needed.splice(i, 1)
            if (item.needed.length === 0){
              if (item.type === "raft"){
                vehicles.addRaft(cell.x, cell.y)
                cell = board.cells[cell.x][cell.y]
                cell.type = cell.tile.replace(/\d+$/, "")
              }
              else if (item.type === "steppingStones"){
                cell = board.cells[cell.x][cell.y]
                cell.type = "steppingStones"
              }
              delete cell.construction
            }
          }
          break
        }
      }
    }
  }
}

function grab(){
  let cell = board.cells[man.x][man.y]
  //grab a log or rock from pile:
  if (backpack.weight <= 25 && ["logpile", "rockpile"].includes(cell.type)){
    let piles = board.objectsToShow[cell.type+"s"]
    let index = piles.findIndex((e) => e.id === cell.id)
    piles[index].quantity--
    backpack.addItem(cell.type.slice(0, -4))
    if (piles[index].quantity === 0){
      piles.splice(index, 1)
      cell.type = cell.tile
      delete cell.id
    }
  }
  //gather a log, bone or stick:
  else if (["log", "bone", "stick"].includes(cell.type)){
    if (backpack.addItem(cell.type))
      cell.type = cell.tile.replace(/\d+$/, "")
  }
  //gather a rock:
  else if ("rock" === cell.type){
    if (backpack.addItem("rock")){
      cell.quantity--
      if (cell.quantity === 0){
        cell.type =  cell.tile.replace(/\d+$/, "")
        delete cell.quantity
      }
    }
  }
  //gather grass:
  else if ("longGrass" === cell.type){
    if (backpack.addItem("longGrass")){
      let quantity = Number(cell.tile.substr(9,1))
      cell.tile = quantity > 1 ? "longGrass"+(quantity-1) : "grass"
      cell.type = quantity > 1 ? cell.type : "grass"
    }
  }
  //pick berries:
  else if (man.basket && man.basket.quantity < 50 && "berryTree" === cell.type &&
              board.objectsToShow.berryTrees[cell.id].berries.length > 0){
    let tree = board.objectsToShow.berryTrees[cell.id]
    let p = Math.floor(Math.random()*tree.berries.length)
    tree.berries.splice(p, 1)
    man.basket.quantity++
  }
  //dig clay:
  else if (cell.type === "clay"){
    let id = man.tools.findIndex((e) => e === "boneShovel" || e === "steelShovel")
    if (id === -1){
      popup.setAlert("It looks like you don't have any tools for digging clay. Look for a Shovel on the Build Menu")
      return
    }
    else if (backpack.addItem("clay")){
      cell.quantity--
      if (cell.quantity === 0){
        cell.type =  cell.tile.replace(/\d+$/, "")
        delete cell.quantity
      }
      man.energy = man.tools[id] === "boneShovel" ? man.energy-200 : man.energy-100
    }
  }
}

