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

	display(){
		image(tiles["campsite"], this.x*25, this.y*25+topbarHeight)
        
    if (this.isCooking){
      image(tiles.claypot_water, this.x*25+12, (this.y+1)*25+topbarHeight, 10,10)
      board.drawBadge(this.x*25+4, this.y*25+6+topbarHeight, "C", bootstrapColors.info)
    }
    if (this.fireValue > 0){
      let tile = tiles.fire[Math.floor((frameCount%6)/2)]
      image(tile, this.x*25+5, (this.y+1)*25+topbarHeight+5, 25, 15, 0, 0, 25, 15)
      board.drawProgressBar(this.x, this.y+1, this.fireValue, 5)
    }
    board.drawBadge(this.x*25+42, this.y*25+6+topbarHeight, this.tools.length+this.containers.length, "#000")
        
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

	cook(item){
		if (item.name === "claypot"){
			if (this.fireValue >= item.time){
          backpack.removeItem("clay", 2) //already checked for in actions
          this.isCooking = true
          this.cookTime = item.time 
          this.action = () => {
            this.containers.push(new Backpack({type:"claypot"}))
            popup.setAlert("Your Clay Pot is now available to grab from your campsite")
            tutorial.checkAction("claypot")
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
        let rabbit = backpack.includesItems(["rabbitLive", "rabbitDead"])[0]
        if (w === -1 || !basket || !rabbit)
          return "Opps! looks like you don't have the needed ingredients. Make sure you dropped the claypot in your campsite."
        else {
          basket.removeItem("veggies", 8)
          backpack.removeItem(rabbit.type, 1)
          this.isCooking = true
          this.cookTime = item.time
          this.action = () => {
            this.containers[w].items.water.quantity = 0
            this.containers[w].items.rabbitStew.quantity = 8
            popup.setAlert("Your stew is done!")
            tutorial.checkAction("stew")
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