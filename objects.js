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
      if (typeof this[items[i]] !== "function" && !["img", "bombs", "snakes", "rabbits", "buildings"].includes(items[i]))
        output[items[i]] = this[items[i]]
    }
    if (this.rabbits){
      output.rabbits = []
      for (let k in this.rabbits){
        output.rabbits.push(this.rabbits[k].export())
      }
    }
    if (this.snakes){
      output.snakes = []
      for (let k in this.snakes){
        output.snakes.push(this.snakes[k].export())
      }
    }
    if (this.buildings){
      output.buildings = []
      for (let k in this.buildings){
        output.buildings.push(this.buildings[k].export())
      }
    }
    return output
  }
}

let world = {
  topOffset: 0,
  leftOffset: 0,
  noKeys: false,
  frameRate: 12,
  noNight: false,
  growtime: 360,

  resize(cols, rows){
    let offset = game.mode === "play" ? topbarHeight : 0
    resizeCanvas(
      max(cols*25,window.innerWidth), 
      max(rows*25+offset, window.innerHeight))
  }
}
