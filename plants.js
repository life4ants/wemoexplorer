let plants = {
	berryTime: 100,
	appleTime: 120,
  veggieTime: 150,
	grassTime: 150,
	mushroomTime: 1440,
	sproutTime: 180,
	applePositions: [[2,3],[9,0],[18,3],[3,14],[18,14]],
	berryPositions: [[16,8],[3,13],[7,14],[15,15],[21,15],[4,20],[7,20],[16,20],[22,22]],

	addApple(cell){
    if (cell.apples.length >= 5)
      return
	  cell.growtime++
    if (cell.growtime >= this.appleTime){
	  	let a = [0,1,2,3,4]
	  	let r = a.filter(x => !cell.apples.includes(x))
	  	cell.apples.push(random(r))
	  	cell.growtime = 0
	  }
  },

  addBerry(cell){
    if (cell.berries.length >= 9)
      return
    cell.growtime++
    if (cell.growtime >= this.berryTime){
	    let a = [0,1,2,3,4,5,6,7,8]
	  	let r = a.filter(x => !cell.berries.includes(x))
	  	cell.berries.push(random(r))
    	cell.growtime = 0
    }
  },

  addVeggy(cell){
    let q = Number(cell.tile.substr(7,1))
    if (q >= 4)
    	return
    cell.growtime++
    if (cell.growtime >= this.veggieTime){
	    cell.tile = "veggies"+(q+1)
    	cell.growtime = 0
    }
  },

  addGrass(cell){
    let q = Number(cell.tile.substr(9,1))
    if (q >= 3)
    	return
    cell.growtime++
    if (cell.growtime >= this.grassTime){
	    cell.tile = "longGrass"+(q+1)
    	cell.growtime = 0
    }
  },

  display(x, y, cell){
		if ("berryBush" === cell.type){
      noStroke()
      fill(128,0,128)
      ellipseMode(CENTER)
      for (let j = 0; j< cell.berries.length; j++){
      	let berry = this.berryPositions[cell.berries[j]]
        ellipse(x*25+berry[0], y*25+berry[1]+topbarHeight, 4, 4)
      }
    }
    else if ("berryTree" === cell.type){
      for (let j = 0; j< cell.apples.length; j++){
      	let apple = this.applePositions[cell.apples[j]]
        image(tiles.apple, x*25+apple[0], y*25+apple[1]+topbarHeight)
      }
    }
  }
}