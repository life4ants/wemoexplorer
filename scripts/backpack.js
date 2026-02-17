import { popup } from './popup.js'

export class Backpack {
  constructor(obj){
    this.weight = 0
    this.type = obj.type
    if (this.type === "backpack"){
      this.maxWeight = 250
      this.maxNum = 4
      this.items = {
        log: {weight: 80, quantity: 0},
        stick: {weight: 45, quantity: 0},
        arrow: {weight: 10, quantity: 0},
        bomb: {weight: 50, quantity: 0},
        bone: {weight: 20, quantity: 0},
        clay: {weight: 60, quantity: 0},
        rock: {weight: 40, quantity: 0},
        longGrass: {weight: 15, quantity: 0},
        mushroom: {weight: 20, quantity: 0},
        rabbitLive: {weight: 50, quantity: 0},
        rabbitDead: {weight: 50, quantity: 0}
      }
    }
    else if (this.type === "basket"){
      this.maxWeight = 50
      this.maxNum = 2
      this.items = {
        berries: {weight: 1, quantity: 0},
        apples: {weight: 2, quantity: 0},
        veggies: {weight: 2, quantity: 0}
      }
    }
    else if (this.type === "claypot"){
      this.maxNum = 1
      this.maxWeight = 64
      this.items = {
        water: {weight: 16, quantity: 0},
        rabbitStew: {weight: 8, quantity: 0}
      }
    }
    if (obj.items){
      for (let key in obj.items) {
        this.items[key].quantity = obj.items[key]
        this.weight += this.items[key].weight*obj.items[key]
      }
    }
  }

  export(){
    let output = {}
    for (let key in this.items) {
      if (this.items[key].quantity > 0)
        output[key] = this.items[key].quantity
    }
    return {type: this.type, items: output}
  }

  getAllItems(list){
    let ar = this.type === "backpack" ? [
        "arrow", "bomb", "bone", "clay",
        "log", "longGrass", "mushroom", "rock",
        "rabbitDead", "rabbitLive", "stick", "boulder" ] :
      this.type === "basket" ? ["berries", "apples", "veggies"] :
      this.type === "claypot" ? ["water", "rabbitStew"] : []
    return this.includesItems(ar, list)
  }

  getQuantity(){ //counting total items in a basket or claypot
    let q = 0
    for (let k in this.items){
      q += this.items[k].quantity
    }
    return q
  }

  getPhoto(){
    if (this.type === "basket")
      return "images/basket.png"
    if (this.type === "claypot"){
      if (this.items.rabbitStew.quantity > 0)
        return "images/veggyStew.png"
      if (this.items.water.quantity > 0)
        return "images/stewpot.png"
      return "images/claypot.png"
    }
    return false
  }

  addItem(e, num = 1){
    let list = this.getAllItems(true)
    if (!list.includes(e) && list.length === this.maxNum){
      popup.setAlert(`Sorry you can only have ${this.maxNum} types of items in your ${this.type}!`)
      return false
    }
    if (this.items[e] && this.itemFits(e,num)){
      this.items[e].quantity+=num
      this.weight+=this.items[e].weight*num
      return true
    }
    return false
  }

  itemFits(e, num){
    return (this.weight+(this.items[e].weight*num) <= this.maxWeight)
  }

  removeItem(e, num){
    if (this.items[e] && this.items[e].quantity >= num){
      this.items[e].quantity -= num
      this.weight -= this.items[e].weight*num
      return true
    }
    return false
  }

  includesItem(s){ // returns the quantity of asked for item, or false if doesn't exist
    if (this.items[s])
      return this.items[s].quantity
    return false
  }

  includesItems(ar, list){ // returns an object for each item that has quantity more than 0, in order asked for
    let output = []
    for (let i=0; i < ar.length; i++) {
      if (this.items[ar[i]] && this.items[ar[i]].quantity > 0)
        if (list)
          output.push(ar[i])
        else
          output.push({type: ar[i], quantity: this.items[ar[i]].quantity})
    }
    return output
  }
}
