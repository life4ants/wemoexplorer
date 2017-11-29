
function build(type){
  let cell = board.cells[active.x][active.y]
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
  else if (type === "basket"){
    let longGrass = backpack.includesItem("longGrass")
    if (man.energy <= 50)
      return "Oops! you don't have enough energy!"
    if (longGrass && longGrass.quantity >= 6){
      backpack.removeItem("longGrass", 6)
      man.basket = {quantity: 0}
      popup.buildOptions[popup.buildOptions.findIndex((e) => e.id === "basket")].active = false
      return "Congratulations! You can now gather berries. Look for the Basket icon on the top bar."
    }
    else {
      let num = longGrass ? longGrass.quantity : 0
      return "Oops! You need "+(6-num)+" more Long Grass!"
    }
  }
  else if (type === "stoneAx"){
    if (man.energy <= 100)
      return "Oops! you don't have enough energy!"
    let needed = ["longGrass", "rock", "log"]
    let ar = backpack.includesItems(needed)
    if (ar.length === 3){
      backpack.removeItem("longGrass", 1)
      backpack.removeItem("log", 1)
      backpack.removeItem("rock", 1)
      man.tools.push("stoneAx")
      popup.buildOptions[popup.buildOptions.findIndex((e) => e.id === "stoneAx")].active = false
      return "Congratulations! You can now chop down trees! Look for the Stone Ax icon on the top bar."
    }
    else {
      let out = "Opps! You still need "
      for (let j = 0; j < needed.length; j++){
        if (ar.find((e) => e.type === needed[j]) === undefined){
          let name = j === 0 ? "a Long Grass and " : j === 1 ? "a Rock and " : "a Log and "
          out += name
        }
      }
      return out.slice(0, -5)+"!"
    }
  }
  else if (type === "raft"){
    if (cell.type === "beach"){
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
        let items = backpack.includesItems(["log", "longGrass"])
        if (items.length === 2){
          //take the logs
          construction.needed[0].quantity -= items[0].quantity
          backpack.removeItem("log", items[0].quantity)
          //take the longGrass
          let num = items[1].quantity >= 8 ? 8 : items[1].quantity
          construction.needed[1].quantity -= num
          backpack.removeItem("longGrass", num)
        }
        else if (items.length === 1){
          let id = construction.needed.findIndex((e) => e.type === items[0].type)
          let num = items[0].quantity >= 8 ? 8 : items[0].quantity
          construction.needed[id].quantity -= num
          backpack.removeItem(items[0].type, num)
        }
        if (construction.needed[1].quantity === 0)
          construction.needed.pop()
        cell.type = "construction"
        cell.construction = construction
        man.energy -= 400
      }
    }
    else
      return "You must build a raft on the beach"
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
  if (type === "log"){
    let logpiles = board.objectsToShow.logpiles
    if (cell.type === "logpile"){
      let index = logpiles.findIndex((e) => e.id === cell.id)
      logpiles[index].quantity++
    }
    else if (["sand", "grass", "stump", "stump", "beach", "beachEdge", "grassBeach", "rockMiddle"].includes(cell.type)){
      let id = logpiles.length > 0 ? logpiles[logpiles.length-1].id+1 : 0
      cell.type = "logpile"
      cell.id = id
      logpiles.push({id: id, x: active.x, y: active.y, quantity: 1})
    }
    else
      return
    backpack.removeItem("log", 1)
  }
  else if (type === "rock"){
    let rockpiles = board.objectsToShow.rockpiles
    if ("rockpile" === cell.type){
      let index = rockpiles.findIndex((e) => e.id === cell.id)
      rockpiles[index].quantity++
    }
    else if (["sand", "grass", "stump", "stump", "beach", "beachEdge", "grassBeach", "rockMiddle"].includes(cell.type)){
      let id = rockpiles.length > 0 ? rockpiles[rockpiles.length-1].id+1 : 0
      cell.type = "rockpile"
      cell.id = id
      rockpiles.push({id: id, x: active.x, y: active.y, quantity: 1})
    }
    else
      return
    backpack.removeItem("rock", 1)
  }
  else if (type === "longGrass"){
    backpack.removeItem("longGrass", 1)
  }
}

function eat(){
  let cell = board.cells[man.x][man.y]
  let tree = board.objectsToShow.berryTrees[cell.id]
  if (cell.type === "berryTree" && tree.berries.length > 0){
    let p = Math.floor(Math.random()*tree.berries.length)
    tree.berries.splice(p, 1)
  }
  else if (man.basket && man.basket.quantity > 0){
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
    let items = backpack.includesItems(["log", "longGrass"])
    if (items.length > 0){
      let fire = board.objectsToShow.fires[man.fireId]
      fire.value = items[0].type === "log" ? Math.min(fire.value+13, 20) : Math.min(fire.value+2, 20)
      backpack.removeItem(items[0].type, 1)
      if (board.cells[man.x][man.y].type === "firepit"){
        showCount = 3
        message = "Get off the fire! You're burning!"
        man.health -= 10
      }
    }
  }
  else {
    let cell = nearbyType(active.x, active.y, "construction")
    if (cell && cell.construction.type === "raft"){
      for (let i = cell.construction.needed.length - 1; i >= 0; i--) {
        let item = backpack.includesItem(cell.construction.needed[i].type)
        if (item){
          backpack.removeItem(cell.construction.needed[i].type, 1)
          cell.construction.needed[i].quantity--
          if (cell.construction.needed[i].quantity === 0){
            cell.construction.needed.splice(i, 1)
            if (cell.construction.needed.length === 0){
              vehicles.addRaft(cell.x, cell.y)
              cell = board.cells[cell.x][cell.y]
              cell.type = cell.tile.replace(/\d+$/, "")
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
  //gather a log:
  else if ("log" === cell.type){
    if (backpack.addItem("log"))
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
}

