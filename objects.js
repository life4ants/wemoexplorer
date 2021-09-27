class WemoObject {
  import(obj) {
    for (let key in obj){
      this[key] = obj[key]
    }
  }

  export(){
    let output = {}
    let items = Object.keys(this)
    for (let i = 0; i < items.length; i++){
      if (typeof this[items[i]] !== "function" && !["img", "bombs", "arrows"].includes(items[i]))
        output[items[i]] = this[items[i]]
    }
    return output
  }
}

let world = {
  frameTime: startTime,
  topOffset: 0,
  leftOffset: 0,
  noKeys: false,
  frameRate: 12,

  resize(cols, rows){
    resizeCanvas(cols*25, game.mode === "play" ? rows*25+topbarHeight : rows*25)
  },

  interval(num){//not used
    return frameCount % (this.frameRate/4*num)
  },

  checkFrameRate(){
    let diff = this.frameRate-frameRate()
    if (diff > 4){
      this.frameRate = diff > 8 ? this.frameRate-8 : this.frameRate-4
      frameRate(this.frameRate)
      console.log("dropped frame rate to", this.frameRate)
    }
    else
      console.log(diff, "off of", this.frameRate)
  }

}

let cheat = {
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
        vehicles.addRaft(cell.x, cell.y)
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
        for (var k = options.build.length - 1; k >= 0; k--) {
          if (["bow", "arrows", "claypot"].includes(options.build[k].name)){
            options.build[k].active = true
          }
        }
      }
      delete cell.construction
    }
  },

  add(item){
    if (["claypot", "basket"].includes(item))
      return toolbelt.addItem("container",new Backpack(item))
    if (["stoneAx", "boneShovel", "bow"].includes(item))
      return toolbelt.addItem("tool", item)
    return false
  }
}

console.log(Date.now() - world.frameTime)
