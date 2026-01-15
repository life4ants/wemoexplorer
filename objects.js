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
  topOffset: 0,
  leftOffset: 0,
  noKeys: false,
  frameRate: 12,
  noNight: false,
  growtime: 420,

  resize(cols, rows){
    let offset = game.mode === "play" ? topbarHeight : 0
    resizeCanvas(
      max(cols*25,window.innerWidth), 
      max(rows*25+offset, window.innerHeight))
  }
}
