let tutorial = {
	active: false,
	step: 0,
	xbound: 9,
	ybound: 9,
	pos: {x:100, y: 80},
	testImg: false,
	req: {up: true, down: true, right: true, left: true, count: 4},
	pcText: [
		"Welcome to Wemo Explorer! Use the arrow keys to move around.\n",
		"Good Job! Now go into the clouds and find a star.",
		"Finding stars uncovers the clouds. Find all the stars to uncover the whole world",
		"Veggies,\nBerries,\nand Apples\ncan all be eaten. Stand on the food and press E to eat",
		"Find some rocks\nand press G to grab them.",
		"Keep grabbing rocks until your packback is full",
		"Now try dumping the rocks by pressing D. Experiment with grabbing and dumping sticks, rocks, and long grass. (Empty backpack to continue)",
		"Press B to see the build menu. Try building a firepit.",
		"Now try building a stone ax. You will need a stick,        a rock,        and one long grass.",
		"Chop down a tree by standing on top of it and pressing C.",
		"Now you have a log pile or stick pile, depending on which kind of tree you chopped. Grab a log.",
		"Stand next to the firepit and press F to start a fire.",
		"Congratulations, you should be able to survive a night now. Level one is unlocked. Exit is the top button on the left."
	],
	mobileText: [
		"Welcome to Wemo Explorer! This game works best with a keyboard, but can be played on touchscreen. Tap the buttons on the edge of the screen to move, or tap anywhere on the board.",
		"Good Job! Now go into the clouds and find a star.",
		"Finding stars uncovers the clouds. Find all the stars to uncover the whole world",
		"Veggies,\nBerries,\nand Apples\ncan all be eaten. Stand on the food and press the       button on the sidebar to eat",
		"Find some rocks\nand press         to grab them.",
		"Keep grabbing rocks until your packback is full",
		"Now try dumping the rocks by pressing        Experiment with grabbing and dumping sticks, rocks, and long grass. (Empty backpack to continue)",
		"Press         to see the build menu. Try building a firepit.",
		"Now try building a stone ax. You will need a stick,        a rock,        and one long grass.",
		"Chop down a tree by standing on top of it and pressing",
		"Now you have a log pile or stick pile, depending on which kind of tree you chopped. Grab a log.",
		"Stand next to the firepit and press        to start a fire.",
		"Congratulations, you should be able to survive a night now. Level one is unlocked. Exit is the top button on the left.",
	],
	questIsShown: false,

	start(){
		this.active = true
		this.step = 0
		this.pcText[0] = "Welcome to Wemo Explorer! Use the arrow keys to move around.\n"
		this.mobileText[0] = "Welcome to Wemo Explorer! This game works best with a keyboard, but can be played on touchscreen. Tap the buttons on the edge of the screen to move, or tap anywhere on the board."
		this.req = {up: true, down: true, right: true, left: true, count: 4}
		this.revealCount = board.revealCount
		this.xbound = 9
		this.ybound = 9
	},

	keyHandler(keyCode){
		switch (this.step){
		case 0:
			let t = ""
			if (keyCode === UP_ARROW && this.req.up){
				t += " UP"; this.req.up = false; this.req.count--
			}
			else if (keyCode === DOWN_ARROW && this .req.down){
				t += " DOWN"; this.req.down = false; this.req.count--
			}
			else if (keyCode === LEFT_ARROW && this.req.left){
				t += " LEFT"; this.req.left = false; this.req.count--
			}
			else if (keyCode === RIGHT_ARROW && this.req.right){
				t += " RIGHT"; this.req.right = false; this.req.count--
			}
			if (game.isMobile)
				this.mobileText[0] +=t
			else
				this.pcText[0] +=t
			if (this.req.count <= 0){
				this.step++
				this.xbound = 15
				this.ybound = 15
			}
			break
		case 1:
			if (this.revealCount > board.revealCount){
				this.step++
				this.xbound = board.cols
				this.ybound = board.rows
			}
			break
		case 2:
			if (board.revealCount <= 0)
				this.step++
			break
		case 4:
			if (backpack.includesItem("rock"))
				this.step++
			break
		case 5:
			if (backpack.weight > 210)
				this.step++
			break
		case 6:
			if (backpack.weight === 0)
				this.step++
			break
		case 10:
			if (backpack.includesItem("log"))
				this.step++
		}
		
	},

	displayQuest(left){
		let top = viewport.top+2
		fill(bootstrapColors.success)
    noStroke()
		rect(left,top,300,50, 15)
    fill(0)
    textSize(15)
    textAlign(LEFT,TOP)
    text(this.text, left+4, top+4)
	},
	display(){
		let top = viewport.top+topbarHeight+20
		noStroke()
		textAlign(LEFT,TOP)
		fill(0)
		textSize(15)
		let t = game.isMobile ? this.mobileText : this.pcText
		text(t[this.step], 20, top, 200,200)
		if (this.step === 3){
			image(tiles["veggies4"], 80, 67, 22,22)
			image(tiles["berryBush"], 78, 85)
			image(tiles["berryTree"], 100, 106, 22,22)
			if (game.isMobile)
				image(tiles["eat"], 175, 145, 25,25)
		}
		else if (this.step === 4){
			image(tiles["rock4"], 140, 65)
			if (game.isMobile)
				image(tiles["grab"], 90, 90, 22,22)
		}
		else if (this.step === 6 && game.isMobile){
			image(tiles["dump"], 100, 92, 22,22)
		}
		else if (this.step === 7 && game.isMobile){
			image(tiles["build"], 65, 68, 22,22)
		}
		else if (this.step === 8){
			image(tiles["stick"], 160, 90, 22,22)
			image(tiles["rock1"], 58, 110, 22,22)
			image(tiles["longGrass1"], 68, 128, 22,22)
		}
		else if (this.step === 9 && game.isMobile){
			image(tiles["chop"], 80, 110, 22,22)
		}
		else if (this.step === 11 && game.isMobile){
			image(tiles["feedFire"], 62, 90, 22,22)
		}
		if (this.testImg){
			image(tiles["eat"], this.pos.x, this.pos.y, 22,22)
		}
	}
}