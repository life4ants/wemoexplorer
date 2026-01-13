let test = {
  clickInfo: false,
  
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
  },

  equip(){
    this.add("stoneAx")
    this.add("bow")
    this.add("claypot")
  },

  worldCheck(){
    return board.cells.length === board.cols && board.cells[0].length === board.rows
  }
}