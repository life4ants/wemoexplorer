<template>
	<div>
		<div v-if="isMobile">
	    <div class="rightButton" @pointerdown="disableCanvas" 
        @click="() => moveAction(39)"></div>
	    <div class="leftButton" @pointerdown="disableCanvas" 
        @click="() => moveAction(37)"></div>
	    <div class="upButton" @pointerdown="disableCanvas" 
        @click="() => moveAction(38)"></div>
	    <div class="downButton" @pointerdown="disableCanvas" 
        @click="() => moveAction(40)"></div>
	  </div> 
	  <div class="sidebar">
	    <div class="sidebar-content">
	      <i class="fa fa-sign-out fa-flip-horizontal fa-3x" aria-hidden="true" @click="exit" title="Exit Game"></i>
	      <i :class="{fa: true, 'fa-3x': true, 'fa-play': paused, 'fa-pause': !paused}"
	                    aria-hidden="true" @click="pauseGame" :title="paused ? 'Resume Game (Space)' : 'Pause Game (Space)'"></i>
	      <div class="icon">
          <span class="icontext">Center Screen (X)</span>
          <img src="images/centerScreen.png" height="40" width="40"
  	              :class="{icon: true, selected: autoCenter}" @click="() => action('X')">
        </div>
	      <div v-for="icon in icons" v-show="icon.active" class="icon">
          <span class="icontext">{{icon.title}}</span>
          <img  :key="icon.id" :src="icon.src"
  	              height="40" width="40"  @click="() => action(icon.code)">
        </div>
	      <i class="fa fa-info-circle fa-3x" aria-hidden="true" @click="showInfo" title="Show Info"></i>
	    </div>
	  </div>
	</div>
</template>

<script>
module.exports = {
	props: [
		'isMobile', 'exit', 'paused', 'pauseGame', 'autoCenter'
	],
	data(){
		return {
			icons: [
	      {code: "B", active: false, id: "build", src: "images/build.png", title: "Build (B)"},
	      {code: "D", active: false, id: "dump", src: "images/dump.png", title: "Dump (D)"},
	      {code: "G", active: false, id: "grab", src: "images/grab.png", title: "Grab/Gather (G)"},
	      {code: "F", active: false, id: "feedFire", src: "images/feedFire.png", title: "Feed Fire (F)"},
	      {code: "E", active: false, id: "eat", src: "images/eat.png", title: "Eat (E)"},
	      {code: "J", active: false, id: "jump", src: "images/jump.png", title: "Jump in or out of Canoe (J)"},
	      {code: "C", active: false, id: "chop", src: "images/chop.png", title: "Chop down Tree (C)"},
	      {code: "G", active: false, id: "pick", src: "images/pick.png", title: "Gather Berries (G)"},
	      {code: "F", active: false, id: "fling", src: "images/fling.png", title: "Fling (F)"},
	      {code: "S", active: false, id: "sleep", src: "images/sleepIcon.png", title: "Go to Sleep (S)"},
	      {code: "S", active: false, id: "wake", src: "images/wakeUp.png", title: "Wake up (S)"}
	    ],
		}
	},
  methods: {
    disableCanvas(){
      window._UIevent = true
    },

  	showInfo(){
  		msgs.infoShown = !msgs.infoShown
  	},

    action(key){
      keyHandler(0, key)
    },

  	moveAction(keyCode){//responds to mobile buttons for moving
      if (!world.noKeys && !this.paused && !man.isAnimated){
        keyHandler(keyCode)
      }
    },
  	checkActions(){
  		if (man.isSleeping || this.paused || man.isAnimated){
        for (let i = 0; i<this.icons.length; i++){
          this.icons[i].active = false
        }
        this.icons[10].active = man.isSleeping
      }
      else {
        let cell = board.cells[man.x][man.y]
        //build:
        this.icons[0].active = active === man
        //dump:
        this.icons[1].active = (backpack.weight > 0 && (dumpable.includes(cell.type) || grabable.includes(cell.type))) ||
              (cell.type === "campsite" && toolbelt.getAllItems().length > 0)
        //grab:
        this.icons[2].active = (backpack.weight < backpack.maxWeight && grabable.includes(cell.type)) || cell.type === "campsite"
        //feed fire:
        this.icons[3].active = backpack.includesItems(["log", "stick", "longGrass"]).length > 0 &&
              (man.isNextToFire || cell.type === "campsite")
        //eat:
        let basket = toolbelt.getContainer("basket")
        this.icons[4].active = ("berryTree" === cell.type && board.berryTrees[cell.id].berries.length > 0) ||
            ("berryBush" === cell.type && board.berryBushes[cell.id].berries.length > 0) ||
            "veggies" === cell.type || (basket && basket.includesItems(["berries", "veggies"]).length > 0 )
        //jump:
        this.icons[5].active = (man.isRiding && (active.landed || active.isBeside("dock") ||
              "river" === board.cells[active.x][active.y].type)) ||  (!man.isRiding && vehicles.canMount(man.x, man.y))
        //chop:
        this.icons[6].active = ["tree", "treeShore", "treeThin"].includes(cell.type) && 
        			toolbelt.tools.findIndex((e) => e === "stoneAx" || e === "steelAx") !== -1
        //pick:
        this.icons[7].active = (toolbelt.getContainer("basket") && ("berryTree" === cell.type &&
              board.berryTrees[cell.id].berries.length > 0) || "veggies" === cell.type)
        //fling:
        this.icons[8].active = !!helpers.nearbyType(active.x, active.y, "construction")
        //sleep:
        this.icons[9].active = (man.canSleep && !man.isSleeping && !man.isRiding)
        //wake up:
        this.icons[10].active = man.isSleeping
      }
  	}
	}
}
</script>

<style>
.sidebar.selected {
  height: 36px;
  width: 36px;
  border: solid 2px red;
  margin: 4px 0;
}

.icon {
  position: relative;
  display: inline-block;
}

.icon .icontext {
  visibility: hidden;
  width: 100px;
  font-size: 12px;
  background-color: #555;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 105%;
  opacity: 0;
  transition: opacity 0.3s;
}

.icon:hover .icontext {
  visibility: visible;
  opacity: 1;
}
</style>