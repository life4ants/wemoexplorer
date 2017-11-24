class Vehicle {
  constructor(obj){
    for (key in obj){
      if (key === "canoe"){
        this.canoe = new WaterCraft(tiles.canoe, obj[key].startX, obj[key].startY, "canoe")
        this.canoe.initialize(obj[key])
      }
      else if (key === "raft"){
        this.raft = new WaterCraft(tiles.raft, obj[key].startX, obj[key].startY, "raft")
        this.raft.initialize(obj[key])
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
    this.canoe = new WaterCraft(tiles.canoe, x, y, "canoe")
  }

  addRaft(x, y){
    this.raft = new WaterCraft(tiles.raft, x, y, "raft")
  }
}