import { board, man, backpack, toolbelt } from './state.js'
import { game } from './game.js'
import { popup } from './popup.js'
import { viewport } from './viewport.js'
import { bootstrapColors } from './message.js'

export let tutorial = {
	active: false,
	step: 0,
	xbound: 9,
	ybound: 9,
	level: 0,
	completed: [],
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
				title: "Build a raft",
				text: "Build a raft along the beach. You will need logs and long grass."
			},
			{ 
				title: "Explore the World",
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
				title: "Build a Stone Ax",
				text: "This is always needed in order to chop trees and get logs and sticks to build other things with."
			},
			{
				title: "Build Stepping Stones",
				text: "Build stepping stones across the river."
			},
			{
				title: "Build a raft",
				text: "Build a raft along the beach. You will need logs and long grass."
			},
			{
				title: "Explore the World",
				text: "Find all the stars to uncover the world."
			},
			{
				title: "Eat a Mushroom",
				text: "Mushrooms give you 1000 health to counter snake bites. You grab them to your backpack. You can eat them by pressing M, or by pressing E if there is nothing else to eat."
			},
			{
				title: "Build a Bone Shovel",
				text: "Build a Bone Shovel. You will need a bone, a stick, and one long grass."
			},
			{
				title: "Find Clay",
				text: "Find clay and dig it up by pressing G."
			},
			{
				title: "Build a Campsite",
				text: "Find a clear spot for a campsite. You will need logs, sticks, clay and long grass."
			},
			{
				title: "All Done!",
				text: "Congratulations, you unlocked level 3!"
			}
		],
		[
			{
				title: "Build a Stone Ax",
				text: "Build a Stone Ax. This is always the first step."
			},
			{
				title: "Build a Shovel",
				text: "Build a Bone Shovel with a bone, stick, and long grass"
			},
			{
				title: "Build a Basket",
				text: "Build a basket. You will need 6 long grass."
			},
			{
				title: "Explore the World",
				text: "Find all the stars to uncover the world."
			},
			{
				title: "Build a Campsite",
				text: "Find a clear spot for a campsite. You will need clay, long grass, sticks, and logs."
			},
			{
				title: "Build a Clay Pot",
				text: "Build a clay pot. You will need to take clay to your campsite and feed the fire there."
			},
			{
				title: "Fill the Clay Pot with Water.",
				text: "Drop your basket in the campsite by pressing D, then get your claypot by pressing G. Go to a river and get water by pressing G. You will need 4 units to cook stew."
			},
			{
				title: "Gather Veggies",
				text: "Drop the clay pot back in your campsite, then get the basket and gather at least 8 veggies."
			},
			{
				title: "Build a Bow",
				text: "Build a bow. You will need a stick and 2 long grass, but first you will have to drop your shovel in the campsite."
			},
			{
				title: "Build Arrows",
				text: "Build a bow. You will need 2 sticks, 2 rocks and 4 long grass, and your Ax."
			},
			{
				title: "Shoot a Rabbit",
				text: "Face a rabbit with arrows in your packback and a bow in your toolbelt, then press T to shoot the arrow."
			},
			{
				title: "Cook Stew",
				text: "Go to your campsite and light a fire. Press K to get the cooking menu, then follow the instructions there."
			},
			{
				title: "All Done!",
				text: "Congratulations, you unlocked level 4!"
			}
		],
		[
			{
				title: "Explore the World",
				text: "Find all the stars to uncover the world."
			},
			{
				title: "Find the Flag",
				text: "Find the yellow flag to finish this level"
			},
			{
				title: "All Done!",
				text: "Congratulations, you unlocked level 5!"
			}
		]
	],

	start(){
		this.active = true
		this.step = 0
		this.level = min(board.level, 4)
		this.revealCount = board.revealCount
		if (this.level === 0){
			this.req = {up: true, down: true, right: true, left: true, count: 4}
			this.xbound = 9
			this.ybound = 9
		}
		if (board.questList){
			for (let i = 0; i < board.questList.length; i++){
				this.questData[this.level][i].completed = board.questList[i]
			}
			while (this.questData[this.level][this.step].completed)
			this.step++
		}
		else {
			for (let i = 0; i < this.questData[this.level].length; i++){
				this.questData[this.level][i].completed = false
			}
		}
	},

	export(){
		let output = []
		for (let i = 0; i < this.questData[this.level].length; i++){
			output.push(this.questData[this.level][i].completed)
		}
		return output
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
		case 8: if (toolbelt.tools.findIndex((e) => e === "stoneAx") !== -1){this.next()} return
		case 10: if (backpack.includesItem("log")){this.next()} return
		case 11: if (backpack.includesItem("longGrass")){this.next()} return
		}
	},

	checkAction(type){
		switch (type){
		case "stars":
			switch(this.level){
			case 0: if (this.step === 2) {this.next()}
				break
			case 1: this.complete(2); break
			case 2:
			case 3: this.complete(3); break
			case 4: this.complete(0)
			}
			return
		case "eat": if (this.level === 0 && this.step === 3){this.next()} return
		case "firepit": if (this.level === 0 && this.step === 7){this.next()} return
		case "stoneAx": 
			if (this.level === 0 && this.step === 8) {this.next()} 
			else if (this.level < 4){this.complete(0)}
			return
		case "chop": 
			if (this.level === 0 && this.step === 9) {this.next()}
		  return
		case "fire": 
			if (this.level === 0 && this.step === 12){
	      this.next()
	      game.finishLevel()
	    }
	    return
	  case "basket":
	  	if (this.level === 1) {this.complete(3)}
	  	else if (this.level === 3) {this.complete(2)}
	  	return
		case "fruit":
			if (this.level === 1) {this.complete(4)}
			return
		case "night":
			if (this.level === 1) {this.complete(5)}
			return
		case "raft":
			if (this.level === 2) {this.complete(2)}
			else if (this.level === 1) {this.complete(1)}
			return
		case "steppingStones":
			if (this.level === 2) {this.complete(1)}
			return
		case "boneShovel":
			if (this.level === 3) {this.complete(1)}
			else if (this.level === 2) {this.complete(5)}
			return
		case "campsite":
			if (this.level === 3) {this.complete(4)}
			else if (this.level === 2) {this.complete(7)}
			return
		case "mushroom":
			if (this.level === 2) {this.complete(4)}
			return
		case "clay":
			if (this.level === 2) {this.complete(6)}
			return
		case "claypot":
			if (this.level === 3) {this.complete(5)}
			return
		case "water":
			if (this.level === 3) {this.complete(6)}
			return
		case "veggies":
			if (this.level === 3) {this.complete(7)}
			return
		case "bow":
			if (this.level === 3) {this.complete(8)}
			return
		case "arrows":
			if (this.level === 3) {this.complete(9)}
			return
		case "shoot":
			if (this.level === 3) {this.complete(10)}
			return
		case "stew":
			if (this.level === 3) {this.complete(11)}
			return
		case "flag":
			if (this.level === 4){this.complete(1)}
		}
	},

	next(){
		this.questData[this.level][this.step].completed = true
		this.step++
		if (popup.show){
			popup.queueTutorial = true
			console.log("queueing tutorial")
		}
		else
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

