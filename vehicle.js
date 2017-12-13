class Vehicle {
  constructor(obj){
    for (let key in obj){
      if (key === "canoe"){
        this.canoe = new WaterCraft(tiles.canoe, obj[key].startX, obj[key].startY, "canoe")
        this.canoe.import(obj[key])
      }
      else if (key === "raft"){
        this.raft = new WaterCraft(tiles.raft, obj[key].startX, obj[key].startY, "raft")
        this.raft.import(obj[key])
      }
    }
  }

  save(){
    let objs = ["canoe", "raft"]
    let out = {}
    for (let i = objs.length - 1; i >= 0; i--) {
      if (this[objs[i]])
        out[objs[i]] = this[objs[i]].export()
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

  canMount(x,y){
    if (this.raft && helpers.isNearSquare(x, y, this.raft.x, this.raft.y))
      return "raft"
    if (this.canoe && helpers.isNearSquare(x, y, this.canoe.x, this.canoe.y))
      return "canoe"
    return false
  }
}