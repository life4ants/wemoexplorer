<template>
	<div class="modal-content">
<!-- Header -->
		<div class="modal-header">
      <h5>{{title}}</h5>
    </div>

<!-- Body -->
    <div v-if="type === 'manual'" class="modal-body">
    	<div class="accordion">
			  <h6 class="acc-header open" id="acc-movement" @click="() => showPanel('movement')">
			    <span>Movement</span>
			    <span class="acc-icon">+</span>
			  </h6>
			  <div class="acc-panel" style="height: 126px;">
			    <p>Movement is accomplished using the arrow keys. On mobile, tap the translucent buttons on the sides of the screen, or tap on the board.</p>
			    <p>You can click on a campsite to see what items are in it, or on a construction site to see what is needed to complete.</p>
			  </div>
			  <h6 class="acc-header" id="acc-sidebar" @click="() => showPanel('sidebar')">
			    <span>Side Bar</span>
			    <span class="acc-icon">+</span>
			  </h6>
			  <div class="acc-panel">
		    	<p> <i class="fa fa-sign-out fa-flip-horizontal fa-2x"></i> Click this to exit the game.</p>
		    	<p> <i class="fa fa-pause fa-2x"></i> Click this to pause the game, or press the space bar.</p>
		    	<p> <i class="fa fa-question-circle fa-2x"></i> Click this to show tutorial steps and quest items.</p>
		    	<p> <i class="fa fa-info-circle fa-2x"></i> Click this to show this help page.</p>
			  </div>
			  <h6 class="acc-header" id="acc-health" @click="() => showPanel('health')">
			    <span>Health and Energy</span>
			    <span class="acc-icon">+</span>
			  </h6>
			  <div class="acc-panel">
			  	<p><img src="images/healthbar.png"></p>
			    <p>The green bars at the top show your health and energy levels.</p>
			    <p>Walking uses a little energy based on how much is in your backpack</p>
			    <p>Chopping trees costs 300 energy per tree. Diging clay costs 200 energy per unit.</p>
			    <p>Building things usually cost energy, which is listed on the build menu.</p>
			    <p>Getting bit by a snake, burning yourself on a fire, and being caught in the dark take away your health. Sleeping will give you health, as well as eating food.</p>
			  </div>
			  <h6 class="acc-header" id="acc-backpack" @click="() => showPanel('backpack')">
			    <span>Backpack</span>
			    <span class="acc-icon">+</span>
			  </h6>
			  <div class="acc-panel">
			  	<p><img src="images/carrying.png"></p>
			    <p>Your backpack shows what items you have to carry around. Beside the backpack your tools and containers will show if you have any. You may equip 2 tools and one container at a time.</p>
			    <p>Next is where your quests will appear. Then in the top right we have the clock. When night comes you must light a fire and stay by it all night. </p>
			  </div>
			  <h6 class="acc-header" id="acc-clock" @click="() => showPanel('clock')">
			    <span>Time</span>
			    <span class="acc-icon">+</span>
			  </h6>
			  <div class="acc-panel">
			  	<p><img src="images/clock.png"></p>
			    <p>In the top right we have the clock. It shows the time of day in the game. When night comes you must light a fire and stay by or you will lose health. Night is two hours long, with an hour of twilight on either side. </p>
			  </div>
			  <h6 class="acc-header" id="acc-actionkeys" @click="() => showPanel('actionkeys')">
			    <span>Action Keys</span>
			    <span class="acc-icon">+</span>
			  </h6>
			  <div class="acc-panel">
		    	<p>These Icons will apear on the side bar when they are available. You can also do all the actions using the keyboard. 
		    	<p><span><img src="images/build.png"></span>
		      Click this or press B to open the Build menu. In the tutorial only the stone Ax and firepit are available. More items unlock in each level.</p>
		      <p><span><img src="images/chop.png"></span>
		      Click this or press C to chop down a tree. You must have a stone Ax in your toolbelt.</p>
		      <p><span><img src="images/dump.png"></span>
		      Click this or press D to dump things from your packback, or drop tools in a campsite.</p>
		      <p><span><img src="images/eat.png"></span>
		      Click this or press E to eat. You can eat berries and Apples straight from the tree. Veggies can only be eaten from a basket. Mushrooms are eaten from the backpack.</p>
		      <p><span><img src="images/feedFire.png"></span>
		      Click this or press F to feed a fire in a firepit or campsite.</p>
		      <p><span><img src="images/fling.png"></span>
		      Click this or press F to add resources to a construction site.</p>
					<p><span><img src="images/grab.png"></span>
					Click this or press G to grab resources from the ground, or get tools from a campsite.</p>
					<p><span><img src="images/pick.png"></span>
					Click this or press G to pick berries, apples, or veggies.</p>
					<p><span><img src="images/jump.png"></span>
					Click this or press J to board or unboard your raft.</p>
					<p><span><img src="images/sleepIcon.png"></span>
					Click this or press S to go to sleep.</p>
					<p><span><img src="images/wakeUp.png"></span>
					Click this or press S to wake up.</p>
					<p><span><img src="images/cook.png"></span>
		      Click this or press K to open the cooking Menu</p>
		      <p>Press T to shoot an arrow</p>
			  </div>
			  <h6 class="acc-header" id="acc-food" @click="() => showPanel('food')">
			    <span>Food</span>
			    <span class="acc-icon">+</span>
			  </h6>
			  <div class="acc-panel">
		      <p><span><img src="images/berryBush.png"></span>
		      Berries give you 20 energy and 2 health. Eat them straight from the tree or from a basket.</p>
					<p><span><img src="images/berryTree.png"></span>
					Apples give you 35 energy and 3 health. Eat them straight from the tree or from a basket.</p>
					<p><span><img src="images/veggies4.png"></span>
					Veggies give you 40 energy and 5 health. They are only eaten from a basket. </p>
					<p><span><img src="images/mushroom.png"></span>
					Mushrooms give you 20 energy and 1000 health. They are eaten from your backpack.</p>
					<p><span><img src="images/veggyStew.png"></span>
		      Veggie Stew gives you 300 energy and 800 health.</p>
			  </div>
			  <h6 class="acc-header" id="acc-resources" @click="() => showPanel('resources')">
			    <span>Resources</span>
			    <span class="acc-icon">+</span>
			  </h6>
			  <div class="acc-panel">
		    	<p><span><img src="images/longGrass1.png"></span>
		      Long grass is used to start fires, and needed to build a lot of things.</p>
					<p><span><img src="images/stick.png"></span>
		      Sticks are needed to build things, and can be burnt on fires. They can be aquired by chopping trees.</p>
		      <p><span><img src="images/log.png"></span>
		      Logs are used for fires and building. They can be aquired by chopping trees.</p>
		       <p><span><img src="images/clay.png"></span><span><img src="images/clay5.png"></span>
		      Clay is used for buildings and clay pots. It can be gathered with a bone shovel.</p>
		      <p><span><img src="images/bone.png"></span>
		      Bone is used to make bone shovels.</p>
		      <p><span><img src="images/rock3.png"></span>
		      Rocks are used to make Stone Axes.</p>
		      <p><span><img src="images/tree.png"></span><span><img src="images/bush2.png"></span><span><img src="images/bush4.png"></span>
		      These trees give logs.</p>
		      <p><span><img src="images/tree-thin.png"></span><span><img src="images/bush1.png"></span><span><img src="images/bush5.png"></span>
		      These trees give sticks.</p>
			  </div>
			</div>
    </div>
    <div v-else-if="type === 'welcome'" class="modal-body">
    	<p v-if="level === 0">This tutorial will teach you how to use the game controls. Read the How To Play manual for more information.</p>
    	<p v-else-if="level === 1">Welcome to level one. Now you have freedom to do the quests in any order. Press start to see your first quest.</p>
    	<p v-else-if="level === 2">Welcome to level two. This level introduces snakes. They spawn from sandpits, and can only move on sand and beach. Stay away from snakes, because they can bit you and cause you to lose health. Press start to see your first quest.</p>
	    <p v-else-if="level > 2">Press start to see your first quest.</p>
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
				this.step = 0
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
			},
			showPanel(id){
				const $header = $(`#acc-${id}`)
			  const $panel = $header.next(".acc-panel");
			  const isOpen = $header.hasClass("open");

			  // Close all panels (accordion behavior)
			  $(".acc-header.open").each(function () {
			    $(this)
			      .removeClass("open")
			      .find(".acc-icon")
			      .text("+")
			      .end()
			      .next(".acc-panel")
			      .css("height", 0);
			  });

			  // Open clicked panel if it was closed
			  if (!isOpen) {
			    $header.addClass("open");
			    $header.find(".acc-icon").text("−");
			    $panel.css("height", $panel[0].scrollHeight + "px");
			  }
			}
		}
	}
</script>

<style>
	.accordion {
	  border-top: 1px solid #ddd;
	}

	.acc-header {
	  background: #f7f7f7;
	  border: none;
	  border-bottom: 1px solid #ddd;
	  padding: 12px 16px;
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  cursor: pointer;
	}

	.acc-header:hover {
	  background: #eee;
	}

	.acc-header .acc-icon {
	  font-size: 18px;
	  font-weight: bold;
	  transition: transform 200ms ease;
	}

	.acc-header.open .acc-icon {
	  transform: rotate(180deg); /* optional flair */
	}

	.acc-panel {
	  overflow: hidden;
	  height: 0;
	  transition: height 300ms ease;
	  background: #ffc;
	  padding: 0 16px;
	}

	.acc-panel p {
	  margin: 10px 0;
	}
</style>