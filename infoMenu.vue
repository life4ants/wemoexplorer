<template>
	<div class="modal-content">
<!-- Header -->
		<div class="modal-header">
      <h5>{{title}}</h5>
    </div>

<!-- Body -->
    <div v-if="type === 'manual'" class="modal-body" style="background-color: #ffc;">
    	<h6>Movement</h6>
    	<p>Movement is acomplished using the arrow keys. On moblie, tap the translucent buttons on the sides of the screen, or tap on the board.</p>
    	<p>You can click on a campsite to see what items are in it, or on a construction site to see what is needed to complete.</p>
    	<h6>Top Bar</h6>
    	<p>At the top of the screen there is info relating to your player. The green bars show your health and energy levels. Your backback shows what items you have to carry around. Beside the backpack are your tools and containers. You may equip 2 tools and one container at a time. Any more that you have must be stored in campsites.</p>
    	<p>Next is where your quests will appear. Then in the top right we have the clock. This shows what time of the day it is. When night comes you must light a fire and stay by it all night. A popup will warn you when night is close.</p>
    	<h6>Side Bar</h6>
    	<p> <i class="fa fa-sign-out fa-flip-horizontal fa-2x"></i> Click this to exit the game.</p>
    	<p> <i class="fa fa-pause fa-2x"></i> Click this to pause the game, or press the space bar.</p>
    	<p> <i class="fa fa-question-circle fa-2x"></i> Click this to show tutorial steps and quest items.</p>
    	<p> <i class="fa fa-info-circle fa-2x"></i> Click this to show this help page.</p>
    	<h6>Action Keys</h6>
    	<p>These Icons will apear on the side bar when they are available. You can also do all the actions using the keyboard. 
    	<p><span><img src="images/build.png"></span>
      Click this or press B to open the Build menu. In the tutorial only the stone Ax and firepit are available. More items unlock in each level.</p>
      <br>
      <p><span><img src="images/chop.png"></span>
      Click this or press C to chop down a tree. You must have a stone Ax in your toolbelt.</p>
      <br>
      <p><span><img src="images/dump.png"></span>
      Click this or press D to dump things from your packback, or drop tools in a campsite.</p>
      <br>
      <p><span><img src="images/eat.png"></span>
      Click this or press E to eat. You can eat berries and Apples straight from the tree. Veggies can only be eaten from a basket. Mushrooms are eaten from the backpack.</p>
      <br>
      <p><span><img src="images/feedFire.png"></span>
      Click this or press F to feed a fire in a firepit or campsite.</p>
      <br>
      <p><span><img src="images/fling.png"></span>
      Click this or press F to add resorces to a construction site.</p>
      <br>
      <p><span><img src="images/grab.png"></span>
      Click this or press G to grab resorces from the ground, or get tools from a campsite.</p>
      <br>
      <p><span><img src="images/pick.png"></span>
      Click this or press G to pick berries, apples, or veggies.</p>
      <br>
      <p><span><img src="images/jump.png"></span>
      Click this or press J to board or unboard your raft.</p>
      <br>
      <p><span><img src="images/sleepIcon.png"></span>
      Click this or press S to go to sleep.</p>
      <br>
      <p><span><img src="images/wakeUp.png"></span>
      Click this or press S to wake up.</p>
      <br>
      <p>Press K to open the cooking Menu</p>
      <p>Press T to shoot an arrow</p>
      <h6>Food</h6>
      <p><span><img src="images/berryBush.png"></span>
      Berries give you 20 energy and 2 health</p>
      <br>
      <p><span><img src="images/berryTree.png"></span>
      Apples give you 35 energy and 3 health</p>
      <br>
      <p><span><img src="images/veggies4.png"></span>
      Veggies give you 40 energy and 5 health</p>
      <br>
      <p><span><img src="images/mushroom.png"></span>
      Mushrooms give you 20 energy and 1000 health</p>
      <br>
      <p><span><img src="images/veggyStew.png"></span>
      Veggie Stew gives you 300 energy and 800 health</p>
    </div>
    <div v-else-if="type === 'welcome'" class="modal-body">
    	<p v-if="level === 0">This tutorial will teach you how to use the game controls. Read the how to play manual for more information.</p>
    	<p v-else-if="level === 1">Welcome to level one. Now you have freedom to do the quests in any order. Press start to see your first quest.</p>
	    <p v-else-if="level > 1">Press start to see your first quest.</p>
    </div>
    <div v-else-if="type === 'tutorial'" class="modal-body">
    	<p v-if="level === 0">Step {{step+1}}: {{bodyText}}</p>
    	<p v-else>{{bodyText}}</p>
    	<p v-if="completed">COMPLETED</p>
    </div>
 <!-- Footer -->
    <div v-if="'tutorial' === type" class="modal-footer">
    	<button type="button" @click="back">Back</button>
    	<button v-if="showNext" type="button" @click="next">Next</button>
    	<button type="button" id="etr" @click="close">Ok</button>
    </div>
    <div v-else-if="'welcome' === type" class="modal-footer">
      <button type="button" @click="manual">How to Play</button>
      <button type="button" @click="start">Start</button>
    </div>
    <div v-else class="modal-footer">
      <button type="button" id="etr" @click="close">Ok</button>
    </div>
	</div>
</template>
<script>
	module.exports = {
		props: ['type', 'close'],
		data(){
			return {
				step: 0,
				bodyText: "",
				title: "",
				level: 0,
				completed: null
			}
		},
		computed: {
			showNext(){
				return this.level === 0 ? this.step < tutorial.step : 
				this.step < tutorial.questData[this.level].length-1
			}
		},
		mounted(){
			this.level = board.level
			if (this.type === "tutorial"){
				this.step = tutorial.step
				this.updateText()
			}
			else
				this.title = this.type === "manual" ? "How to Play" : "Welcome to Wemo"
		},
		methods: {
			start(){
				tutorial.start()
				popup.type = "tutorial"
				this.updateText()
			},

			manual(){
				popup.setInfo("manual")
			},

			next(){
				this.step++
				this.updateText()
			},

			back(){
				if (this.step > 0){
					this.step--
					this.updateText()
				}
				else
					popup.setInfo("welcome")
			},
			updateText(){
				let data = tutorial.getData(this.level, this.step)
				this.bodyText = data.text
				this.title = data.title
				this.completed = data.completed
			}
		}
	}
</script>