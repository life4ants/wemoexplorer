class Snake {
	constructor(cellPos){
    this.cellPos = cellPos // object with x and y
    this.pos = createVector(cellPos.x*25+12.5,cellPos.y*25+12.5) // pixel positions to center of snake
    this.dir = createVector(1,0)
    this.bitecooldown = 0
    this.isMoving = false
    this.moveCount = 0
    this.restTime = 0
    this.type = "snake"
  }

  export(){
  	return this.cellPos
  }

  getDist(){
  	return dist(active.x, active.y, this.cellPos.x, this.cellPos.y)
  }

  update(){
	  let cell = board.cells[this.cellPos.x][this.cellPos.y]
	  let manDist = dist(active.x, active.y, this.cellPos.x, this.cellPos.y)
	  if (cell.revealed){
	  	this.display()
	  }
	  else if (manDist < 2)
	  	world.nearMan.push({x: this.cellPos.x, y: this.cellPos.y, obj: this})
    if (this.isMoving){
    	this.pos.add(this.dir)
    	this.moveCount--
	    this.cellPos = {x: floor(this.pos.x/25), y:floor(this.pos.y/25)}
	  	if (this.moveCount <= 0){
	  		this.isMoving = false
	  		this.restTime = 10
	  	}
    }
    else {
    	this.restTime--
	    if (this.restTime <= 0)
	    	this.move(manDist)
	  }
	  if (this.cellPos.x === active.x && this.cellPos.y === active.y && this.bitecooldown <= 0){
	  	msgs.following.msg = "You got bit by a snake!"
      msgs.following.frames = 24
      man.health -=1000
	  	this.bitecooldown = 48
	  }
	  this.bitecooldown--
  }

  display(){
  	push()
    translate(this.pos.x, this.pos.y+topbarHeight)
  	angleMode(DEGREES)
  	rotate(this.dir.heading()-120)
    image(tiles.snake, -12.5,-12.5, 25, 25)
    pop()
  }

  move(manDist){
		let toMan = p5.Vector.sub(createVector(active.x, active.y), 
			createVector(this.cellPos.x, this.cellPos.y))
  	let list = []
  	for (let i=-2; i<=2; i++){
  		for (let j=-2; j<=2; j++){
  			if(manDist < 4){
  				if ( Math.sign(i) !== Math.sign(toMan.x)) continue
			    if ( Math.sign(j) !== Math.sign(toMan.y)) continue
  			}
  			let x = this.cellPos.x+i
  			let y = this.cellPos.y+j
  			if (helpers.withinBounds(x,y) && 
  				["sand", "beach", "beachEdge"].includes(board.cells[x][y].type)){
  				list.push({i,j})
  			}
  		}
  	}
  	let dir = list.length ? random(list) : {i:0,j:0}
  	this.dir.set(dir.i,dir.j)
  	
  	this.isMoving = true
  	this.moveCount = 25
  }
}