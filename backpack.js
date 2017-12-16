class Backpack {
  constructor(items){
    this.maxWeight = 40
    this.weight = 0
    this.items = {
      log: {weight: 15, quantity: 0},
      stick: {weight: 6, quantity: 0},
      rock: {weight: 15, quantity: 0},
      longGrass: {weight: 2, quantity: 0},
      bone: {weight: 4, quantity: 0},
      clay: {weight: 10, quantity: 0},
      bomb: {weight: 10, quantity: 0}
    }
    if (items){
      for (let i = items.length - 1; i >= 0; i--) {
        this.items[items[i].type].quantity = items[i].quantity
        this.weight += this.items[items[i].type].weight*items[i].quantity
      }
    }
  }

  getAllItems(){
    return this.includesItems(["stick", "log", "rock", "longGrass", "bone", "clay", "bomb"])
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

  includesItem(s){ // returns the quantity of asked for item, or false if doesn't exsist
    if (this.items[s])
      return this.items[s].quantity
    return false
  }

  includesItems(ar){ // returns an object for each item that has quantity more than 0, in order asked for
    let output = []
    for (let i=0; i < ar.length; i++) {
      if (this.items[ar[i]] && this.items[ar[i]].quantity > 0)
        output.push({type: ar[i], quantity: this.items[ar[i]].quantity})
    }
    return output
  }

  walkingCost(){
    return man.basket ? 2.5+(man.basket.quantity/10 + this.weight)/8 : 2.5+(this.weight/8)
  }
}