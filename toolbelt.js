class ToolBelt {
  constructor(tools, c){
    this.tools = tools || []
    this.containers = c || []
    this.maxTools = 2
    this.maxConts = 1
  }

  getAllItems(){
    return concat(this.tools, this.containers)
  }

  addItem(type, object){
    if (type === "tool" && this.tools.length < this.maxTools){
      this.tools.push(object)
      return true
    }
    if (type === "container" && this.conts.length < this.maxConts){
      this.containers.push(object)
      return true
    }
    return false
  }

  // removeItem(e, num){
  //   if (this.items[e] && this.items[e].quantity >= num){
  //     this.items[e].quantity -= num
  //     this.weight -= this.items[e].weight*num
  //     return true
  //   }
  //   return false
  // }

  // includesItem(s){ // returns the quantity of asked for item, or false if doesn't exist
  //   if (this.items[s])
  //     return this.items[s].quantity
  //   return false
  // }

  // includesItems(ar){ // returns an object for each item that has quantity more than 0, in order asked for
  //   let output = []
  //   for (let i=0; i < ar.length; i++) {
  //     if (this.items[ar[i]] && this.items[ar[i]].quantity > 0)
  //       output.push({type: ar[i], quantity: this.items[ar[i]].quantity})
  //   }
  //   return output
  // }
}