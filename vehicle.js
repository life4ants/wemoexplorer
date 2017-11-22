class Vehicle {
  constructor(obj){
    for (key in obj){
      if (key === "canoe"){
        this.canoe = new Canoe(tiles.canoe, obj[key].startX, obj[key].startY)
        this.canoe.initialize(obj[key])
      }
      else if (key === "raft"){
        console.log("board had a raft")
      }
    }
  }

  save(){
    let objs = ["canoe", "raft"]
    let out = {}
    for (let i = objs.length - 1; i >= 0; i--) {
      if (this[objs[i]])
        out[objs[i]] = this[objs[i]].save()
    }
    return out
  }

  display(){
    let objs = ["canoe", "raft"]
    for (let i = objs.length - 1; i >= 0; i--) {
      if (this[objs[i]]){
        this[objs[i]].display()
      }
    }
  }

  addCanoe(x, y){
    this.canoe = new Canoe(tiles.canoe, x, y)
  }


}