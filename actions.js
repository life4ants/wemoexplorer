
function build(type, pos){
  let cell = board.cells[pos.x][pos.y]
  // build firepit:
  if (type === "firepit"){
    let fires = board.fires
    if (man.energy <= 200)
      return "Oops! You don't have enough energy!"
    let id = fires.length > 0 ? fires[fires.length-1].id+1 : 0
    cell.type = "firepit"
    cell.id = id
    fires.push({id: id, x: pos.x, y: pos.y, value: 0})
    man.fireCheck()
    man.energy -= 200
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
    }
  }
  // build stepping stones:
  else if (type === "steppingStones"){
    if (man.energy <= 150)
      return "Oops! you don't have enough energy!"
    else {
      let construction = {
        type: "steppingStones",
        needed: [
          {type: "rock", quantity: 3, color: "#B4D9D9"}
        ]
      }
      cell.type = "construction"
      cell.construction = construction
      man.energy -= 150
    }
  }
  return false
}

function chop(){
  let cell = board.cells[active.x][active.y]
  if (["tree", "treeShore", "treeThin"].includes(cell.type)){
    let t = man.tools.findIndex((e) => e === "stoneAx" || e === "steelAx")
    if (t === -1){
      popup.setAlert("It looks like you don't have any tools for chopping down trees. Look for an ax on the Build Menu.")
    }
    else {
      cell.type = cell.type === "treeThin" ? "stickpile" : "logpile"
      cell.tile = "stump"
      cell.quantity = 5
      man.energy = man.tools[t] === "stoneAx" ? man.energy-300 : man.energy-150
    }
  }
}

function dump(type){
  const _dumpable = ["beach", "sand", "grass", "beachEdge", "grassBeach", "dock"]
  let cell = board.cells[active.x][active.y]
  // long Grass:
  if (type === "longGrass"){
    backpack.removeItem("longGrass", 1)
    return false
  }
  // clay:
  else if (type === "clay"){
    if (cell.type === "clay"){
      if (cell.quantity < 5){
        cell.quantity++
        backpack.removeItem("clay", 1)
      }
    }
    else if (_dumpable.includes(cell.type)){
      cell.type = "clay"
      cell.quantity = 1
      backpack.removeItem("clay", 1)
    }
    else
      return "Sorry, you can't dump clay on a "+cell.type+"!"
  }
  // log:
  else if (["log", "stick"].includes(type)){
    if (cell.type === type+"pile")
      cell.quantity++
    else if (cell.type === type){
      cell.type = type+"pile"
      cell.quantity = 2
    }
    else if (_dumpable.includes(cell.type) || cell.type === "stump")
      cell.type = type
    else
      return "Sorry, you can't dump "+type+"s on a "+cell.type+"!"
    backpack.removeItem(type, 1)
  }
  // rock:
  else if (type === "rock"){
    if (cell.type === "rockpile")
      cell.quantity++
    else if (cell.type === "rock"){
      cell.type = "rockpile"
      cell.quantity++
    }
    else if (_dumpable.includes(cell.type)){
      cell.type = "rock"
      cell.quantity = 1
    }
    else
      return "Sorry, you can't dump rock on a "+cell.type+"!"
    backpack.removeItem("rock", 1)
  }
  // bone:
  else if (type === "bone"){
    if (cell.type === "bonepile")
      cell.quantity++
    else if (cell.type === "bone"){
      cell.type = "bonepile"
      cell.quantity = 2
    }
    else if (_dumpable.includes(cell.type))
      cell.type = "bone"
    else
      return "Sorry, you can't dump bone on a "+cell.type+"!"
    backpack.removeItem("bone", 1)
  }
  return false
}

function eat(){
  let cell = board.cells[man.x][man.y]
  let tree = board.berryTrees[cell.id]
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
    message.following.msg = "You ate too much!!!"
    message.following.frames = 30
    man.vomit = true
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
      let fire = board.fires[man.fireId]
      fire.value = items[0].type === "log" ? Math.min(fire.value+13, 20) :
                     items[0].type === "stick" ? Math.min(fire.value+5, 20) : Math.min(fire.value+2, 20)
      backpack.removeItem(items[0].type, 1)
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
  //grab a something from a pile:
  if (cell.type.substr(-4,4) === "pile"){
    let item = cell.type.substr(0, cell.type.length-4)
    if (backpack.addItem(item)){
      cell.quantity--
      if (cell.quantity === 0){
        cell.type = cell.tile.replace(/\d+$/, "")
        delete cell.quantity
      }
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
              board.berryTrees[cell.id].berries.length > 0){
    let tree = board.berryTrees[cell.id]
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

