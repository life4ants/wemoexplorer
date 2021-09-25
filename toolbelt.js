class Toolbelt {
  constructor(items){
    this.tools = []
    this.containers = []
    this.maxTools = 2
    this.maxContainers = 1
    if (items){
      for (let item of items){
        if (item.type === "tool")
          this.tools.push(item.name)
        else if (item.type === "container")
          this.containers.push(new Backpack(item.name, item.items))
      }
    }
  }

  getAllItems(){
    let output = []
    for (let i = 0; i < this.tools.length; i++){
      output.push({type: "tool", name: this.tools[i], id: i, src: "images/"+this.tools[i]+".png"})
    }
    for (let i = 0; i < this.containers.length; i++){
      output.push({ id: i, 
        type: "container", 
        name: this.containers[i].type,
        items: this.containers[i].items, 
        src: this.containers[i].getPhoto(),
        num: this.containers[i].getQuantity()
        })
    }
    return output
  }

  getContainer(name){
    for (let i = 0; i < this.containers.length; i++){
      if (this.containers[i].type === name)
        return this.containers[i]
    }
    return false
  }

  addItem(type, object){
    if (type === "tool" && this.tools.length < this.maxTools){
      this.tools.push(object)
      return true
    }
    if (type === "container" && this.containers.length < this.maxContainers){
      this.containers.push(object)
      return true
    }
    return false
  }

  getWeight(){
    let weight = 0
    for (let i = 0; i < this.tools.length; i++){
      switch (this.tools[i]){
        case "stoneAx": weight += 10;     break;
        case "boneShovel": weight += 15;  break;
        case "bow":     weight += 8;     break;
      }
    }
    for (let i = 0; i < this.containers.length; i++){
      weight += this.containers[i].weight
    }
    return weight
  }
}
