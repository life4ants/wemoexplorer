class Campsite { 
	constructor(obj){
		this.tools = obj.tools ?? []
		this.containers = []
		if (obj.containers){
			for (let thing of obj.containers){
				this.containers.push(new Backpack(thing))
			}
		}
		this.fireValue = 0
		this.isCooking = false
		this.cookTime = 0
		this.action = null
		this.x = obj.x
		this.y = obj.y
	}

	export(){
		let output = {x: this.x, y: this.y, tools: this.tools, containers: []}
		for (let item of this.containers){
			output.containers.push(item.export())
		}
		return output
	}

	addItem(type, object){
		if (type === "tool"){
			this.tools.push(object)
		}
		else if (type === "container"){
			this.containers.push(object)
		}
	}

	takeItem(type, id){
		return this[type+"s"].splice(id,1)[0]
	}

	getItems(){
		return concat(this.tools, this.containers)
	}

	cook(item){
		if (item.name === "claypot"){
			if (this.fireValue >= 60){
          backpack.removeItem("clay", 2) //already checked for in actions
          this.isCooking = true
          this.cookTime = 60 
          this.action = () => {
            this.containers.push(new Backpack({type:"claypot"}))
            popup.setAlert("Your Clay Pot is now available to grab from your campsite")
          }
          return false
        }
      else
      	return "Oops! Your fire is not big enough!"
		}
		else if (item.name === "rabbitStew"){
			if (this.fireValue >= item.time){
        let w = this.containers.findIndex((e) => e.type === "claypot" && e.items.water.quantity === 4)
        let basket = toolbelt.getContainer("basket")
        if (!basket){
	        let v = this.containers.findIndex((e) => e.type === "basket" && e.items.veggies.quantity >= 8)
        	if (v !== -1){
        		basket = this.containers[v]
        	}
        }
        if (w === -1 || !basket || backpack.includesItem("rabbitDead") < 1)
          return "Opps! looks like you don't have the needed ingredients. Make sure you dropped the claypot in your campsite."
        else {
          basket.removeItem("veggies", 8)
          backpack.removeItem("rabbitDead", 1)
          this.isCooking = true
          this.cookTime = item.time
          this.action = () => {
            this.containers[w].items.water.quantity = 0
            this.containers[w].items.rabbitStew.quantity = 8
            backpack.removeItem("rabbitDead", 1)
            popup.setAlert("Your stew is done!")
          }
        }
        return false
      }
      else
        return "Your fire isn't big enough!"
    }
	}

	update(){
		if (this.fireValue > 0){
			this.fireValue--
			if (this.isCooking){
				this.cookTime--
				if (this.cookTime === 0){
					this.isCooking = false
					this.action()
				}
			}
		}
	}
}