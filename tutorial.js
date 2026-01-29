let tutorial = {
	active: false,
	step: 0,
	xbound: 9,
	ybound: 9,
	level: 0,
	req: {up: true, down: true, right: true, left: true, count: 4},
	questData: [
	[
			{
				title: "Learn to Walk", 
				text: "Use the arrow keys to move around. Walk all four directions to continue.",
				mobileText: "This game works best with a keyboard, but can be played on touchscreen. Tap the buttons on the edge of the screen to move. Walk all four directions to continue."
			},
			{
				title: "Find a star",
				text: "Go into the clouds and find a star. Your walking area is limited to make it easier."
			},
			{
				title: "Find all the stars",
				text: "Finding stars uncovers the clouds. Find all the stars to uncover the whole world."
			},
			{
				title: "Find some food",
				text: "Berries and Apples can be eaten from the tree. Stand on the food and press E to eat.",
				mobileText: "Berries and Apples can be eaten from the tree. Stand on the food and press the eat button on the sidebar to eat."
			},
			{
				title: "Grab some rocks",
				text: "Find some rocks and press G to grab them.",
				mobileText: "Find some rocks and press the Grab button to grab them."
			},
			{
				title: "Fill your Backpack",
				text: "The rock appears in your backpack. Keep grabbing rocks or other stuff until your packback is full."
			},
			{
				title: "Empty your Backpack",
				text: "Now try dumping the rocks by pressing D. Experiment with grabbing and dumping sticks, rocks, and long grass. (Empty backpack to continue)",
				mobileText: "Now try dumping the rocks by pressing the dump truck (Dump button). Experiment with grabbing and dumping sticks, rocks, and long grass. (Empty backpack to continue)"
			},
			{
				title: "Build a firepit",
				text: "Press B to see the build menu. Try building a firepit.",
				mobileText: "Press the hammer (Build button) to see the build menu. Try building a firepit."
			},
			{
				title: "Build a Stone Ax",
				text: "Now try building a stone ax. You will need a stick, a rock, and one long grass."
			},
			{
				title: "Chop down a tree",
				text: "Chop down a tree by standing on top of it and pressing C.",
				mobileText: "Chop down a tree by standing on top of it and pressing the Chop button."
			},
			{
				title: "Grab a log",
				text: "Now you have a log pile or stick pile, depending on which kind of tree you chopped. Grab a log."
			},
			{
				title: "Grab long grass",
				text: "Grab some long grass to start the fire with."
			},
			{
				title: "Feed the fire",
				text: "Stand next to the firepit and press F to start a fire. Press again to add the log to the fire.",
				mobileText: "Stand next to the firepit and press the Feed Fire button to start a fire. Press again to add the log to the fire.",
			},
			{
				title: "All Done!",
				text: "Congratulations, you should be able to survive a night now. Level one is unlocked. Exit is the top button on the left.",
			}
		],
		[
			{
				title: "Build stone Ax",
				text: "Build a stone Ax. You will need one stick, one rock, and one long grass."
			},
			{
				title: "Chop down a tree",
				text: "Chop a tree for logs."
			},
			{
				title: "Explore the world",
				text: "Find all the stars to uncover the world."
			},
			{
				title: "Build a basket",
				text: "Build a basket. You will need 6 long grass."
			},
			{
				title: "Pick Fruit",
				text: "Pick berries or apples by pressing G while on a berry bush or apple tree.",
				mobileText: "Pick berries or apples by pressing the pick button while on a berry bush or apple tree."
			},
			{
				title: "Survive a Night",
				text: "When night comes, build a fire and sleep next to it."
			},
			{
				title: "All Done!",
				text: "Congratulations, you unlocked level 2!"
			}
		],
		[
			{
				title: "Build a raft",
				text: "Build a raft along the beach. You will need logs and long grass."
			},
			{
				title: "Pick Veggies",
				text: "Build a basket and pick veggies in it."
			},
			{
				title: "Explore the world",
				text: "Find all the stars to uncover the world."
			},
			{
				title: "All Done!",
				text: "Congratulations, you unlocked level 3!"
			}
		],
		[
			{
				title: "Build Stepping Stones",
				text: "Build stepping stones across the river."
			},
			{
				title: "Build a Shovel",
				text: "Build a Bone Shovel with a bone, stick, and long grass"
			},
			{
				title: "Explore the world",
				text: "Find all the stars to uncover the world."
			},
			{
				title: "Build a campsite",
				text: "Find a clear spot for a campsite. You will need clay, long grass, sticks, and logs."
			},
			{
				title: "All Done!",
				text: "Congratulations, you unlocked level 4!"
			}
		]
	],

	start(){
		this.active = true
		this.step = 0
		this.level = board.level
		for (let q of this.questData[this.level]){
			q.completed = false
		}
		if (board.progress){
			if (toolbelt.tools.findIndex((e) => e === "stoneAx" || e === "steelAx") !== -1)
				this.checkAction("stoneAx")
			if (toolbelt.getContainer("basket"))
				this.checkAction("basket")
			if (board.revealCount <= 0)
				this.checkAction("stars")
			if (board.wemoMins > 1560)
				this.checkAction("night")
			if (board.vehicles.length > 0)
				this.checkAction("raft")
		}
		this.revealCount = board.revealCount
		if (this.level === 0){
			this.req = {up: true, down: true, right: true, left: true, count: 4}
			this.xbound = 9
			this.ybound = 9
		}
	},

	keyHandler(keyCode){ //only called for level 0
		switch (this.step){
		case 0:
			if (keyCode === UP_ARROW && this.req.up){
				this.req.up = false; this.req.count--
			}
			else if (keyCode === DOWN_ARROW && this .req.down){
				this.req.down = false; this.req.count--
			}
			else if (keyCode === LEFT_ARROW && this.req.left){
				this.req.left = false; this.req.count--
			}
			else if (keyCode === RIGHT_ARROW && this.req.right){
				this.req.right = false; this.req.count--
			}
			if (this.req.count <= 0){
				this.xbound = 12
				this.ybound = 12
				this.next()
			}
			break
		case 1:
			if (this.revealCount > board.revealCount){
				this.xbound = board.cols
				this.ybound = board.rows
				this.next()
			}
			break
		case 4: if (backpack.includesItem("rock")){this.next()} return
		case 5: if (backpack.weight > 210){this.next()} return
		case 6: if (backpack.weight === 0){this.next()} return
		case 10: if (backpack.includesItem("log")){this.next()} return
		case 11: if (backpack.includesItem("longGrass")){this.next()} return
		}
	},

	checkAction(type){
		switch (type){
		case "stars":
			if (this.level === 0 && this.step === 2) {this.next()}
			else if (this.level <4) {this.complete(2)}
			return
		case "eat": if (this.level === 0 && this.step === 3){this.next()} return
		case "firepit": if (this.level === 0 && this.step === 7){this.next()} return
		case "stoneAx": 
			if (this.level === 0 && this.step === 8) {this.next()} 
			else if (this.level === 1){this.complete(0)}
			return
		case "chop": 
			if (this.level === 0 && this.step === 9) {this.next()}
			else if (this.level === 1) {this.complete(1)}
		  return
		case "fire": 
			if (this.level === 0 && this.step === 12){
	      this.next()
	      game.finishLevel()
	    }
	    return
	  case "basket":
	  	if (this.level === 1) {this.complete(3)}
	  	return
		case "berries":
		case "apples":
			if (this.level === 1) {this.complete(4)}
			return
		case "night":
			if (this.level === 1) {this.complete(5)}
			return
		case "raft":
			if (this.level === 2) {this.complete(0)}
			return
		case "veggies":
			if (this.level === 2) {this.complete(1)}
			return
		case "steppingStones":
			if (this.level === 3) {this.complete(0)}
			return
		case "boneShovel":
			if (this.level === 3) {this.complete(1)}
			return
		case "campsite":
			if (this.level === 3) {this.complete(3)}
			return
		}
	},

	next(){
		this.questData[this.level][this.step].completed = true
		this.step++
		popup.setInfo("tutorial")
	},

	complete(step){
		let lastStep = this.questData[this.level].length-1
		if (this.step === lastStep)
			return
		this.questData[this.level][step].completed = true
		while (this.questData[this.level][this.step].completed)
			this.step++
		if (this.step === lastStep)
			game.finishLevel()
	},

	displayQuest(left){
		let top = viewport.top+2
		fill(bootstrapColors.success)
    noStroke()
		rect(left,top,200,50, 5)
    fill(0)
    textSize(15)
    textAlign(LEFT,TOP)
    let t = `Step ${this.step+1}: ${this.questData[this.level][this.step].title}`
    text(t, left+4, top+4, 195, 45)
	},
	
	getData(level, step){
		let mobileText = this.questData[level][step].mobileText
		let text = this.questData[level][step].text
		return {text: game.isMobile && mobileText ? mobileText : text,
			title: this.questData[level][step].title,
			completed: this.questData[level][step].completed
		}
	}
}

