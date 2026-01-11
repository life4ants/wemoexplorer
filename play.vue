<template>
	<div>
		<div v-if="isMobile">
	    <div class="rightButton" @click="() => moveAction(0)"></div>
	    <div class="leftButton" @click="() => moveAction(1)"></div>
	    <div class="upButton" @click="() => moveAction(2)"></div>
	    <div class="downButton" @click="() => moveAction(3)"></div>
	  </div> 
	  <div class="sidebar">
	    <div class="sidebar-content">
	      <i class="fa fa-sign-out fa-flip-horizontal fa-3x" aria-hidden="true" @click="exit" title="Exit Game"></i>
	      <i :class="{fa: true, 'fa-3x': true, 'fa-play': paused, 'fa-pause': !paused}"
	                    aria-hidden="true" @click="pauseGame" :title="paused ? 'Resume Game (Space)' : 'Pause Game (Space)'"></i>
	      <img src="images/centerScreen.png" title="Center Screen (X)" height="40" width="40"
	              :class="{icon: true, selected: autoCenter}" @click="() => action('X')">
	      <img v-for="icon in icons" v-show="icon.active" :key="icon.id" :src="icon.src" :title="icon.title"
	              height="40" width="40" class="icon" @click="() => action(icon.code)">
	      <i class="fa fa-info-circle fa-3x" aria-hidden="true" @click="showInfo" title="Show Info"></i>
	    </div>
	  </div>
	</div>
</template>

<script>
module.exports = {
	props: [
		'exit', 'paused', 'pauseGame', 'action', 'autoCenter'
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
  computed: {
    isMobile(){
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
    }
  },
  methods: {
  	showInfo(){
  		msgs.infoShown = !msgs.infoShown
  	},
  	moveAction(dir){//responds to mobile buttons for moving
      if (!world.noKeys && !this.paused && !man.isAnimated){
        switch(dir){
          case 0: active.move(1,0);  break;
          case 1: active.move(-1,0); break;
          case 2: active.move(0,-1); break;
          case 3: active.move(0, 1); break;
        }
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
        this.icons[4].active = (("berryTree" === cell.type && board.berryTrees[cell.id].berries.length > 0)) ||
              (basket && basket.includesItems(["berries", "veggies"]).length > 0 )
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
.selected {
  height: 36px;
  width: 36px;
  border: solid 2px red;
  margin: 4px 0;
}
</style>