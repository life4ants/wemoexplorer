class Backpack {
  constructor(items){
    this.maxWeight = 40
    this.weight = 0
    this.items = {
      log: {weight: 15, quantity: 0},
      rock: {weight: 15, quantity: 0},
      longGrass: {weight: 2, quantity: 0}
    }
    if (items){
      for (let i = items.length - 1; i >= 0; i--) {
        this.items[items[i].type].quantity = items[i].quantity
        this.weight += this.items[items[i].type].weight*items[i].quantity
      }
    }
  }

  getAllItems(){
    return this.includesItems(["log", "rock", "longGrass"])
  }

  addItem(e){
    if (this.items[e] && this.weight+this.items[e].weight <= this.maxWeight){
      this.items[e].quantity++
      this.weight+=this.items[e].weight
      return true
    }
    return false
  }

  removeItem(e, num){
    if (this.items[e] && this.items[e].quantity >= num){
      this.items[e].quantity -= num
      this.weight -= this.items[e].weight*num
      return true
    }
    return false
  }

  includesItem(s){
    if (this.items[s] && this.items[s].quantity > 0)
      return {quantity: this.items[s].quantity}
    return false
  }

  includesItems(ar){ // returns items in order asked for
    let output = []
    for (let i=0; i < ar.length; i++) {
      if (this.items[ar[i]] && this.items[ar[i]].quantity > 0)
        output.push({type: ar[i], quantity: this.items[ar[i]].quantity})
    }
    return output
  }
}