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
  frameTime: Date.now(),
  topOffset: 0,
  leftOffset: 0,
  noKeys: false,
  frameRate: 12,

  resize(cols, rows){
    resizeCanvas(cols*25, game.mode === "play" ? rows*25+topbarHeight : rows*25)
  },

  interval(num){
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
