
function build(type){
  let cell = board.cells[active.x][active.y]
  if (type === "firepit"){
    let fires = board.objectsToShow.fires
    if (["grass", "sand", "stump", "beach", "beachEdge", "grassBeach", "rockMiddle"].includes(cell.type)){
      if (man.energy <= 60)
        return "Oops! You don't have enough energy to build a Firepit!"
      let id = fires.length > 0 ? fires[fires.length-1].id+1 : 0
      cell.type = "firepit"
      cell.id = id
      fires.push({id: id, x: active.x, y: active.y, value: 0})
      man.isNextToFire = true
      man.fireId = id
      man.energy -= 60
      return false
    }
    else
      return "Opps! Firepits cannot be build on the type of square you are on."
  }
  else if (type === "basket"){
    let id = man.backpack.items.findIndex((e) => e.type === "longGrass")
    if (id >= 0 && man.backpack.items[id].quantity >= 6){
      if (man.energy <= 15)
        return "Oops! you do not have enough energy to make a Basket!"
      man.backpack.weight -= 12
      man.backpack.items[id].quantity -= 6
      if (man.backpack.items[id].quantity === 0)
        man.backpack.items.splice(id, 1)
      man.energy -= 15
      man.basket = {quantity: 0}
      popup.options[1].active = false
    }
    else
      return "Oops! You don't have enough long grass to make a Basket!"
  }
}

function chop(){
  let cell = board.cells[man.x][man.y]
  if (["tree", "treeShore"].includes(board.cells[active.x][active.y].type)){
    let logpiles = board.objectsToShow.logpiles
    let id = logpiles.length > 0 ? logpiles[logpiles.length-1].id+1 : 0
    cell.type = "logpile"
    cell.tile = "stump"
    cell.id = id
    logpiles.push({id: id, x: active.x, y: active.y, quantity: 5})
    man.energy -= 20
  }
}

function dump(type){
  let cell = board.cells[active.x][active.y]
  let weight
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
    weight = 15
  }
  else if (type === "rocks"){
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
    weight = 15
  }
  else if (type === "longGrass"){
    weight = 2
  }
  else
    return
  man.backpack.weight -= weight
  let bpid = man.backpack.items.findIndex((e) => e.type === type)
  if (man.backpack.items[bpid].quantity > 1)
    man.backpack.items[bpid].quantity--
  else
    man.backpack.items.splice(bpid, 1)
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
  man.energy += 35
  man.health = man.health < 5000 ? man.health+5 : 5000
  if (man.energy > 5000){
    man.energy -= Math.floor((Math.random()*5+1)*100)
    man.health -= Math.floor((Math.random()*5+1)*10)
    message = "You ate too much!!!"
    showCount = 40
    man.vomit = true
    noKeys = true
  }
  else if (man.energy > 4965){
    alert("You are full. Stop eating!")
  }
}

function feedFire(){
  let id = man.backpack.items.findIndex((i) => i.type === "log")
  if (id >= 0 && man.isNextToFire){
    let fire = board.objectsToShow.fires[man.fireId]
    fire.value = fire.value < 8 ? fire.value+13 : 20
    man.backpack.weight -= 15
    if (man.backpack.items[id].quantity > 1)
      man.backpack.items[id].quantity--
    else
      man.backpack.items.splice(id, 1)
    if (board.cells[man.x][man.y].type === "firepit"){
      showCount = 3
      message = "Get off the fire! You're burning!"
      man.health -= 10
    }
  }
}

function grab(){
  let cell = board.cells[man.x][man.y]
  //grab a log or rock from pile:
  if (man.backpack.weight <= 25 && ["logpile", "rockpile"].includes(cell.type)){
    let piles = board.objectsToShow[cell.type+"s"]
    let index = piles.findIndex((e) => e.id === cell.id)
    piles[index].quantity--
    let name = cell.type === "logpile" ? "log" : cell.type === "rockpile" ? "rocks" : ""
    let weight = ["logpile", "rockpile"].includes(cell.type) ? 15 : 10
    let bpid = man.backpack.items.findIndex((e) => e.type === name)
    if (bpid === -1)
      man.backpack.items.push({type: name, quantity: 1})
    else
      man.backpack.items[bpid].quantity++
    man.backpack.weight += weight
    if (piles[index].quantity === 0){
      piles.splice(index, 1)
      cell.type = cell.tile
      delete cell.id
    }
  }
  //gather a rock:
  else if (man.backpack.weight <= 25 && "rock" === cell.type){
    cell.quantity--
    if (cell.quantity === 0){
      cell.type =  cell.tile.replace(/\d+$/, "")
      delete cell.quantity
    }
    let id = man.backpack.items.findIndex((e) => e.type === "rocks")
    if (id === -1)
      man.backpack.items.push({type: "rocks", quantity: 1})
    else
      man.backpack.items[id].quantity++
    man.backpack.weight += 15
  }
  //gather grass:
  else if (man.backpack.weight <= 38 && "longGrass" === cell.type){
    let quantity = Number(cell.tile.substr(9,1))
    cell.tile = quantity > 1 ? "longGrass"+(quantity-1) : "grass"
    cell.type = quantity > 1 ? cell.type : "grass"
    let id = man.backpack.items.findIndex((e) => e.type === "longGrass")
    if (id === -1)
      man.backpack.items.push({type: "longGrass", quantity: 1})
    else
      man.backpack.items[id].quantity++
    man.backpack.weight += 2
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

