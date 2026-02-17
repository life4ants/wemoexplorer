import { board, man, active } from './state.js'
import { topbarHeight } from './config.js'
import { game } from './game.js'
import { viewport } from './viewport.js'
import { helpers } from './helpers.js'
import { timer } from './timer.js'
import { WaterCraft } from './waterCraft.js'
import { Campsite } from './campsite.js'
import { Backpack } from './backpack.js'
import { Toolbelt } from './toolbelt.js'

export let test = {
  clickInfo: "cell",
  counts: {
    blocks: {},
    points: 0
  },
  
  lookup(id,y){
    if (id === "active")
      return board.cells[active.x][active.y]
    if (id === "man")
      return board.cells[man.x][man.y]
    if (id === "mouse"){
      let offset = game.mode === "edit" ? 0 : topbarHeight
      return board.cells[floor(mouseX/25)][floor((mouseY-offset)/25)]
    }
    else
      return board.cells[id][y]
  },

  skip(hours){
    board.wemoMins += (hours*60)
    timer.resume()
  },

  build(){
    let o = helpers.nearbyType(active.x, active.y, "construction")
    if (o){
      let cell = board.cells[o.x][o.y]
      let item = cell.construction
      if (item.type === "raft"){
        board.vehicles.push(new WaterCraft({x:o.x, y:o.y, landed: true, type: "raft"}))
        cell.type = cell.tile.replace(/\d+$/, "")
      }
      else if (item.type === "steppingStones"){
        cell.type = "steppingStones"
      }
      else if (item.type === "campsite"){
        let id = board.buildings.length
        board.buildings.push(new Campsite({x: o.x, y: o.y}))
        for (let i = o.x; i <= o.x+1; i++){
          for (let j = o.y; j <= o.y+1; j++){
            board.cells[i][j].type = "campsite"
            board.cells[i][j].id = id
          }
        }
      }
      delete cell.construction
    }
  },

  add(item){
    if (["claypot", "basket"].includes(item))
      return toolbelt.addItem("container",new Backpack({type:item}))
    if (["stoneAx", "boneShovel", "bow"].includes(item))
      return toolbelt.addItem("tool", item)
    return false
  },

  equip(){
    this.add("stoneAx")
    this.add("bow")
    this.add("claypot")
  },

  worldCheck(){
    return board.cells.length === board.cols && board.cells[0].length === board.rows
  },

  testBackpack(){
    let pack = new Backpack({type: "backpack"})
    let basket = new Backpack({type: "basket"})
    let pot = new Backpack({type: "claypot"})
    pack.addItem("bone", 1)
    pack.addItem("arrow", 1)
    pack.addItem("longGrass", 1)
    pack.addItem("rock", 1)
    basket.addItem("berries", 20)
    pot.addItem("water", 4)
    return [new Backpack(pack.export()), new Backpack(basket.export()), new Backpack(pot.export())]
  },

  testToolBelt(){
    let basket = new Backpack({type: "basket"})
    basket.addItem("berries", 20)
    basket.addItem("veggies", 15)
    let belt =  new Toolbelt()
    belt.addItem("tool", "stoneAx")
    belt.addItem("tool", "boneShovel")
    belt.addItem("container", basket)
    return new Toolbelt(belt.export())
  },

  testCampsite(){
    let camp = new Campsite({x:34, y:45})
    let basket = new Backpack({type: "basket"})
    basket.addItem("berries", 20)
    basket.addItem("veggies", 15)
    camp.addItem("container", basket)
    camp.addItem("tool", "stoneAx")
    camp.addItem("container", new Backpack({type: "claypot"}))
    return new Campsite(camp.export())
  },

  testDark(alpha){
    this.counts = {blocks: {}, points: 0}
    for (let i = viewport.left+128; i < viewport.right; i+=256) {
      for (let j = viewport.top+128; j< viewport.bottom; j+=256){
        board.darkOutBlock(i, j, 256, alpha)
      }
    }
    return this.counts
  },

  

}