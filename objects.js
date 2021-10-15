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
      if (typeof this[items[i]] !== "function" && !["img", "bombs"].includes(items[i]))
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
  }
}

console.log(Date.now() - world.frameTime)
