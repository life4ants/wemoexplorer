let actions = {
  addConstructionSite(item, cell){
    //build a campsite:
    if (item.name === "campsite"){
      let construction = {
        type: "campsite",
        needed: [
          {type: "log", quantity: 5, color: "#582C0F"},
          {type: "longGrass", quantity: 10, color: "#207414"},
          {type: "stick", quantity: 10, color: "#B66500"},
          {type: "clay", quantity: 5, color: "#804000"}
        ]
      }
      cell.type = "construction"
      cell.construction = construction
    }
    // build raft:
    else if (item.name === "raft"){
      let construction = {
        type: "raft",
        needed: [
          {type: "log", quantity: 8, color: "#582C0F"},
          {type: "longGrass", quantity: 8, color: "#207414"}
        ]
      }
      cell.type = "construction"
      cell.construction = construction
    }
    // build stepping stones:
    else if (item.name === "steppingStones"){
      let construction = {
        type: "steppingStones",
        needed: [
          {type: "rock", quantity: 3, color: "#B4D9D9"}
        ]
      }
      cell.type = "construction"
      cell.construction = construction
    }
    else
      return
    man.energy -= item.energy
    popup.setAlert("A construction site has been started. To finish building your "+item.title+
      ", gather the needed resources, go near the construction site, and press F.")
  },

  build(item, pos, quantity){
    let cell = board.cells[pos.x][pos.y]
    // build firepit:
    if (item.name === "firepit"){
      if (["grass", "sand", "stump", "beach", "beachEdge", "grassBeach", "rockMiddle"].includes(cell.type)){
        man.isAnimated = true
        man.animation = {frame: 0, type: "building", end: world.frameRate*item.time/3, action: () => {
          let fires = board.fires
          let id = fires.length > 0 ? fires[fires.length-1].id+1 : 0
          fires.push({id: id, x: pos.x, y: pos.y, value: 0})
          cell.type = "firepit"
          cell.id = id
          man.fireCheck()
        }}
      }
      else
        return "Sorry, you can't build a firepit on a "+cell.type+" square!"
    }
    // build basket:
    else if (item.name === "basket"){
      let num = backpack.includesItem("longGrass")
      if (num >= 6){
        if (toolbelt.containers.length < toolbelt.maxContainers){
          man.isAnimated = true
          man.animation = {frame: 0, type: "building", end: world.frameRate*item.time/3, action: () => {
            toolbelt.addItem("container", new Backpack("basket"))
            backpack.removeItem("longGrass", 6)
            popup.setAlert("Congratulations! You can now gather berries. Look for the Basket icon on the top bar.")
          }}
        }
        else
          return "Opps! You can only carry one container at a time. Put your claypot in your campsite before building a basket."
      }
      else {
        return "Oops! You need "+(6-num)+" more Long Grass!"
      }
    }
    // build claypot:
    else if (item.name === "claypot"){
      let num = backpack.includesItem("clay")
      if (num >= 2){
        if (cell.type === "campsite" && board.buildings[cell.id].fireValue >= 5){
          backpack.removeItem("clay", 2)
          board.buildings[cell.id].isCooking = true
          board.buildings[cell.id].cookTime = 5 //4-5 periods of 13.33 wemo mins
          board.buildings[cell.id].action = function (){
            board.buildings[cell.id].items.push(new Backpack("claypot"))
            popup.setAlert("Your Clay Pot is now available to grab from your campsite")
          }
        }
        else
          return "Opps! Your fire isn't big enough or you aren't in a campsite."
      }
      else {
        return "Oops! You need "+(2-num)+" more Clay!"
      }
    }
    // build stoneAx or boneShovel:
    else if (["stoneAx", "boneShovel"].includes(item.name)){
      let msg = "Congratulations! You can now " +
          (item.name === "stoneAx" ? "chop down trees at a cost of 300" : "dig clay at a cost of 200") +
          " energy. Look for the " + item.title + " icon on the top bar."
      let needed = ["stick", "longGrass", (item.name === "stoneAx" ? "rock" : "bone")]
      let ar = backpack.includesItems(needed)
      if (ar.length === 3){
        if (toolbelt.tools.length < toolbelt.maxTools){
          man.isAnimated = true
          man.animation = {frame: 0, type: "building", end: world.frameRate*item.time/3, action: () => {
            toolbelt.addItem("tool", item.name)
            for (type of needed){
              backpack.removeItem(type, 1)
            }
            popup.setAlert(msg)
          }}
        }
        else
          return "Opps! You can only carry two tools at a time. Put one of your tools in a campsite before building a "+item.title+"."
      }
      else {
        let out = "Opps! You still need "
        for (let j = 0; j < needed.length; j++){
          if (ar.find((e) => e.type === needed[j]) === undefined){
            let name = j === 0 ? "a Stick and " : j === 1 ? "a Long Grass and " : item.name === "stoneAx" ? "a Rock and " : "a Bone and "
            out += name
          }
        }
        return out.slice(0, -5)+"!"
      }
    }
    // build a bow:
    else if (["bow"].includes(item.name)){
      let msg = "Your bow is done being built, and has been added to your toolbelt."
      let needed = ["stick", "longGrass"]
      let ar = backpack.includesItems(needed)
      if (ar.length === 2 && ar[1].quantity >= 2){
        if (toolbelt.tools.length < toolbelt.maxTools){
          man.isAnimated = true
          man.animation = {frame: 0, type: "building", end: world.frameRate*item.time/3, action: () => {
            toolbelt.addItem("tool", "bow")
            backpack.removeItem("stick", 1)
            backpack.removeItem("longGrass", 2)
            popup.setAlert(msg)
          }}
        }
        else
          return "Opps! You can only carry two tools at a time. Put one of your tools in a campsite before building a Bow."
      }
      else {
        let r
        switch (ar.length){
          case 0: r = "a stick and 2 long grass!"; break;
          case 1:
            r = ar[0].type === "longGrass" ? "a stick!" : "some long grass!"
            break
          default:
            r = "another long grass!"
        }
        return "Opps! You still need "+r
      }
    }
    // make some arrows:
    else if ("arrows" === item.name){
      let msg = "Your arrows are now in your backpack"
      let needed = ["stick", "longGrass", "rock"]
      let ar = backpack.includesItems(needed)
      if (ar.length === 3 && ar[0].quantity >= 2 && ar[1].quantity >= 4 && ar[2].quantity >= 2){
        man.isAnimated = true
        man.animation = {frame: 0, type: "building", end: world.frameRate*item.time/3, action: () => {
          backpack.removeItem("stick", 2)
          backpack.removeItem("longGrass", 4)
          backpack.removeItem("rock", 2)
          backpack.addItem("arrow", 5)
          popup.setAlert(msg)
        }}
      }
      else
        return "Opps! You don't have all the needed resources!"
    }
    // buy a bomb:
    else if (item.name === "bomb"){
      if (backpack.itemFits("bomb", quantity) && man.energy > item.energy*quantity){
        man.energy -= item.energy*(quantity-1)
        man.isAnimated = true
        man.animation = {frame: 0, type: "building", end: world.frameRate*item.time/3, action: () => {
          backpack.addItem("bomb", quantity)
          popup.setAlert("The "+ ((quantity > 1) ? "bombs have" : "bomb has" ) +" been added to your backpack. Press T to throw a bomb in the direction you are pointed.")
        }}
      }
      else
        return "Sorry, there is not enough room in your backpack for "+quantity+" bombs."
    }

    else // error catch
      return "Sorry, not available yet!"

    man.energy -= item.energy
    return false //no message to send
  },

  cook(item){
    if (board.cells[man.x][man.y].type === "campsite"){
      let camp = board.buildings[board.cells[man.x][man.y].id]
      if (camp.fireValue >= floor(item.time/13.333)){
        if (item.name === "rabbitStew"){
          let w = camp.items.findIndex((e) => e.type === "claypot" && e.items.water.quantity === 4)
          let v = camp.items.findIndex((e) => e.type === "basket" && e.items.veggies.quantity >= 8)
          if (w === -1 || v === -1 || backpack.includesItem("rabbitDead") < 1)
            return "Opps! looks like you don't have the needed ingredients. Make sure you dropped the claypot and basket in your campsite."
          else {
            camp.items[v].removeItem("veggies", 8)
            camp.isCooking = true
            camp.cookTime = 3
            camp.action = function(){
              camp.items[w].items.water.quantity = 0
              camp.items[w].items.rabbitStew.quantity = 8
              backpack.removeItem("rabbitDead", 1)
              popup.setAlert("Your stew is done!")
            }
          }
        }
      }
      else
        return "Your fire isn't big enough!"
    }
    else
      return "Opps! You have to be in a campsite to cook"
  },

  chop(){
    let cell = board.cells[active.x][active.y]
    if (["tree", "treeShore", "treeThin"].includes(cell.type)){
      let t = toolbelt.tools.findIndex((e) => e === "stoneAx" || e === "steelAx")
      if (t === -1){
        popup.setAlert("It looks like you don't have any tools for chopping down trees. Look for an ax on the Build Menu.")
      }
      else {
        man.isAnimated = true
        man.animation = {frame: 0, type: "chopping", end: world.frameRate*15/3, action: () => {
          cell.type = cell.type === "treeThin" ? "stickpile" : "logpile"
          cell.tile = "stump"
          cell.quantity = 5
          man.energy = toolbelt.tools[t] === "stoneAx" ? man.energy-300 : man.energy-150
        }}
      }
    }
  },

  dump(type){
    const _dumpable = ["beach", "sand", "grass", "beachEdge", "grassBeach", "dock", "rockMiddle"]
    let cell = board.cells[active.x][active.y]
    // long Grass:
    if (type === "longGrass"){
      backpack.removeItem("longGrass", 1)
      return false
    }
    // log, stick, bone or clay:
    else if (["log", "stick", "bone", "clay", "arrow"].includes(type)){
      if (cell.type === type+"pile")
        cell.quantity++
      else if (cell.type === type){
        if (type === "clay")
          return "Sorry, you can't start a clay pile on a hill of clay."
        cell.type = type+"pile"
        cell.quantity = 2
      }
      else if (_dumpable.includes(cell.type) || ( ["log", "stick"].includes(type) && cell.type === "stump")){
        cell.type = type+"pile"
        cell.quantity = 1
      }
      else
        return "Sorry, you can't dump a "+type+" on a "+cell.type+" square!"
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
        return "Sorry, you can't dump rock on a "+cell.type+" square!"
      backpack.removeItem("rock", 1)
    }
    // rabbit:
    else if (type === "rabbitDead"){
      cell.rabbits = cell.rabbits +1 || 1
      backpack.removeItem("rabbitDead", 1)
    }
    return false
  },

  eat(){
    let cell = board.cells[man.x][man.y]
    let tree = board.berryTrees[cell.id]
    let bush = board.berryBushes[cell.id]
    let kind = ""
    if (cell.type === "berryTree" && tree.berries.length > 0){
      let p = Math.floor(Math.random()*tree.berries.length)
      tree.berries.splice(p, 1)
      kind = "apples"
    }
    else if (cell.type === "berryBush" && bush.berries.length > 0){
      let p = Math.floor(Math.random()*bush.berries.length)
      bush.berries.splice(p, 1)
      kind = "berries"
    }
    else if (cell.type === "veggies"){
      let quantity = Number(cell.tile.substr(7,1))
      cell.tile = quantity > 1 ? "veggies"+(quantity-1) : "grass"
      cell.type = quantity > 1 ? cell.type : "grass"
      kind = "veggies"
    }
    else {
      let basket = toolbelt.getContainer("basket")
      let claypot = toolbelt.getContainer("claypot")
      if (basket){
        let items = basket.includesItems(["berries", "veggies", "apples"])
        if (items.length > 0){
          basket.removeItem(items[0].type, 1)
          kind = items[0].type
        }
      }
      if (claypot && claypot.includesItem("rabbitStew")){
        claypot.removeItem("rabbitStew", 1)
        kind = "rabbitStew"
      }
    }
    if (kind === "") return

    if (man.energy > 5000){
      man.energy -= Math.floor((Math.random()*5+1)*100)
      man.health -= Math.floor((Math.random()*5+1)*10)
      msgs.following.msg = "You ate too much!!!"
      msgs.following.frames = 30
      man.vomit = true
      sounds.play("vomit")
      return
    }
    sounds.play("eat")
    let e,h
    switch (kind){
      case "berries": e = 20, h = 2;       break;
      case "apples": e = 35, h = 3;        break;
      case "veggies": e = 40, h = 5;       break;
      case "rabbitStew": e = 200, h = 500;  break;
      default: e = 0, h = 0;
    }
    man.health = min(man.health+h, 5000)
    man.energy = min(man.energy+e, 5025)
    if (man.energy > 5000)
      popup.setAlert("You are full. Stop eating!")
  },

  fling(){
    let o = helpers.nearbyType(active.x, active.y, "construction")
    if (o){
      let cell = board.cells[o.x][o.y]
      let item = cell.construction
      for (let i = item.needed.length - 1; i >= 0; i--) {
        if (backpack.includesItem(item.needed[i].type)){
          backpack.removeItem(item.needed[i].type, 1)
          item.needed[i].quantity --
          if (item.needed[i].quantity === 0){
            item.needed.splice(i, 1)
            if (item.needed.length === 0){
              if (item.type === "raft"){
                vehicles.addRaft(o.x, o.y)
                cell.type = cell.tile.replace(/\d+$/, "")
              }
              else if (item.type === "steppingStones"){
                cell.type = "steppingStones"
              }
              else if (item.type === "campsite"){
                let site = {type: "campsite", x: o.x, y: o.y, items: [], fireValue: 0}
                let id = board.buildings.length
                board.buildings.push(site)
                for (let i = o.x; i <= o.x+1; i++){
                  for (let j = o.y; j <= o.y+1; j++){
                    board.cells[i][j].type = "campsite"
                    board.cells[i][j].id = id
                  }
                }
              }
              delete cell.construction
            }
          }
          break
        }
      }
    }
    let cell = board.cells[man.x][man.y]
    if (man.isNextToFire || cell.type === "campsite"){
      let items = backpack.includesItems(["log", "stick", "longGrass", "rabbitLive"])
      if (items.length > 0){
        let fireValue = cell.type === "campsite" ? board.buildings[cell.id].fireValue : board.fires[man.fireId].value
        fireValue = items[0].type === "log" ? Math.min(fireValue+13, 20) :
                      items[0].type === "stick" ? Math.min(fireValue+6, 20) : 
                        items[0].type === "longGrass" ? Math.min(fireValue+2, 20) : Math.min(fireValue+8,20)
        if (cell.type === "campsite")
          board.buildings[cell.id].fireValue = fireValue
        else
          board.fires[man.fireId].value = fireValue
        backpack.removeItem(items[0].type, 1)
      }
    }
  },

  grab(){
    let cell = board.cells[man.x][man.y]
    //grab dead rabbit:
    if (cell.rabbits){
      if(backpack.addItem("rabbitDead"), 1){
        cell.rabbits -= 1
        if (cell.rabbits === 0)
          delete cell.rabbits
      }
    }
    //grab arrow:
    else if (cell.arrows){
      if(backpack.addItem("arrow"), 1){
        cell.arrows -= 1
        if (cell.arrows === 0)
          delete cell.arrows
      }
    }
    //grab a something from a pile:
    else if (cell.type.substr(-4,4) === "pile"){
      let item = cell.type.substr(0, cell.type.length-4)
      if (backpack.addItem(item)){
        cell.quantity--
        if (cell.quantity === 0){
          cell.type = cell.tile.replace(/\d+$/, "")
          delete cell.quantity
        }
      }
      else
        return
    }
    //gather a log, bone or stick:
    else if (["log", "bone", "stick", "arrow"].includes(cell.type)){
      if (backpack.addItem(cell.type))
        cell.type = cell.tile.replace(/\d+$/, "")
      else
        return
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
      else
        return
    }
    //gather grass:
    else if ("longGrass" === cell.type){
      if (backpack.addItem("longGrass")){
        let quantity = Number(cell.tile.substr(9,1))
        cell.tile = quantity > 1 ? "longGrass"+(quantity-1) : "grass"
        cell.type = quantity > 1 ? cell.type : "grass"
      }
      else
        return
    }
    //pick berries:
    else if ("berryTree" === cell.type && board.berryTrees[cell.id].berries.length > 0){
      let basket = toolbelt.getContainer("basket")
      if (basket && basket.addItem("berries")){
        let tree = board.berryTrees[cell.id]
        let p = Math.floor(Math.random()*tree.berries.length)
        tree.berries.splice(p, 1)
      }
      else
        return
    }
    //gather veggies:
    else if ("veggies" === cell.type){
      let basket = toolbelt.getContainer("basket")
      if (basket){
        if (basket.addItem("veggies")){ 
          let quantity = Number(cell.tile.substr(7,1))
          cell.tile = quantity > 1 ? "veggies"+(quantity-1) : "grass"
          cell.type = quantity > 1 ? cell.type : "grass"
        }
        else
          return
      }
      else {
        popup.setAlert("You can't gather veggies without a basket!")
        return
      }
    }
    //dig clay:
    else if (cell.type === "clay"){
      let id = toolbelt.tools.findIndex((e) => e === "boneShovel" || e === "steelShovel")
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
        man.energy = toolbelt.tools[id] === "boneShovel" ? man.energy-200 : man.energy-100
        sounds.play("dig")
        return
      }
      else
        return
    }
    //gather water:
    else if (helpers.isNextToType(active.x,active.y, "river")){
      let pot = toolbelt.getContainer("claypot")
      if (pot){
        pot.addItem("water")
        sounds.play("water")
        return
      }
    }
    else
      return
  },

  throw(){
    let x = man.x*25
    let y = man.y*25+topbarHeight

    if (backpack.removeItem("bomb", 1)){
      board.bombs = board.bombs || []
      board.bombs.push(new Projectile("bomb", x+3,y+3,man.index))// offset by 3 to move bomb coordinates towards center of cell
    }
    else if (backpack.removeItem("arrow", 1)){
      let id = toolbelt.tools.findIndex((e) => e === "bow")
      if (id >= 0){
        board.arrows = board.arrows || []
        board.arrows.push(new Projectile("arrow", x+12,y+1,man.index))
      }
    }
  }
}
