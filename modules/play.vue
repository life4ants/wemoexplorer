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
	  <div class="sidebar unselctable">
	    <div class="sidebar-content">
	      <i class="fa fa-sign-out fa-flip-horizontal fa-3x" @click="exit" title="Exit Game"></i>
	      <i :class="{fa: true, 'fa-3x': true, 'fa-play': paused, 'fa-pause': !paused}"
	                     @click="pauseGame" :title="paused ? 'Resume Game (Space)' : 'Pause Game (Space)'"></i>
	      <div class="icon">
          <span class="icontext">Center Screen (X)</span>
          <img src="images/centerScreen.png" height="40" width="40"
  	              :class="{icon: true, 'x-selected': autoCenter}" @click="() => action('X')">
        </div>
	      <div v-for="icon in icons" v-show="icon.active" class="icon">
          <span class="icontext">{{icon.title}}</span>
          <img  :key="icon.id" :src="icon.src"
  	              height="40" width="40"  @click="() => action(icon.code)">
        </div>
        <div class="bottom">
          <div class="musicIcon" v-if="musicOn" style="left: 4px">
            <div class="absolute" @click="setMusic" >
              <i class="fa fa-music fa-lg"></i>
            </div>
            <input class="vertical-slider" type="range" 
                id="volumeSlider" v-model.number="volume"
                min="0" max="0.6" step="0.01" @keydown="blockArrows">
          </div>
          <div class="musicIcon" v-else style="right: 4px">
            <span class="fa-stack fa-lg" @click="setMusic">
              <i class="fa fa-music fa-stack-1x"></i>
              <i class="fa fa-ban fa-stack-2x"></i>
            </span>
          </div>
  	      <i class="fa fa-question-circle fa-3x" @click="showQuest" title="Show Quest"></i>
          <i class="fa fa-info-circle fa-3x" @click="showInfo" title="Show Info"></i>
        </div>
	    </div>
	  </div>
	</div>
</template>

<script>
module.exports = {
	props: [
		'isMobile', 'exit', 'paused', 'pauseGame', 'autoCenter', 'musicOn', 'setMusic'
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
        {code: "S", active: false, id: "wake", src: "images/wakeUp.png", title: "Wake up (S)"},
	      {code: "K", active: false, id: "cook", src: "images/cook.png", title: "Cook (K)"}
	    ],
      volume: 0.4
		}
	},
  watch:{
    volume(){
      sounds.files.music.volume = this.volume
    }
  },
  methods: {
    disableCanvas(){
      window._UIevent = true
    },

    blockArrows(e) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        console.log(e.key)
        e.preventDefault();
      }
    },

  	showInfo(){
  		popup.setInfo("manual")
  	},

    showQuest(){
      if (tutorial.active)
        popup.setInfo("tutorial")
      else
        popup.setAlert("No quests are available for this world!")
    },

    action(key){
      keyHandler(0, key)
    },

  	moveAction(keyCode){//responds to mobile buttons for moving
      if (!popup.show && !this.paused && !man.isAnimated){
        keyHandler(keyCode)
      }
    },
  	checkActions(){
  		if (man.isSleeping || this.paused || man.isAnimated || popup.show){
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
        this.icons[4].active = ("berryTree" === cell.type && cell.apples.length > 0) ||
            ("berryBush" === cell.type && cell.berries.length > 0) ||
             (basket && basket.includesItems(["berries", "veggies", "apples"]).length > 0 )
        //jump:
        this.icons[5].active = (man.isRiding && (active.landed || active.isBeside("dock") ||
              "river" === board.cells[active.x][active.y].type)) ||  (!man.isRiding && man.canMount() !== null)
        //chop:
        this.icons[6].active = ["tree", "treeShore", "treeThin"].includes(cell.type) && 
        			toolbelt.tools.findIndex((e) => e === "stoneAx" || e === "steelAx") !== -1
        //pick:
        this.icons[7].active = toolbelt.getContainer("basket") && (
          ("berryTree" === cell.type && cell.apples.length > 0) || 
          ("berryBush" === cell.type && cell.berries.length > 0)
          || "veggies" === cell.type)
        //fling:
        this.icons[8].active = backpack.weight > 0 && helpers.nearbyType(active.x, active.y, "construction")
        //sleep:
        this.icons[9].active = (man.canSleep && !man.isSleeping)
        //wake up:
        this.icons[10].active = man.isSleeping
        // Cook:
        this.icons[11].active = board.buildings.length > 0
      }
  	}
	}
}
</script>

<style>
.x-selected {
  height: 36px;
  width: 36px;
  border: solid 2px red;
  margin: 4px 0;
}

.musicIcon {
  position: relative;
  width: 45px;
  height: 45px;
  font-size: 1.26em;
}

.absolute {
  position: absolute;
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

.bottom {
  position: absolute;
  bottom: 0;
}

.vertical-slider {
  position: absolute;
  -webkit-appearance: none;
  appearance: none;
  width: 60px;          /* becomes height after rotation */
  height: 10px;
  transform: rotate(-90deg);
}

/* Track */
.vertical-slider::-webkit-slider-runnable-track {
  height: 6px;
  background: #222;
  border-radius: 6px;
}

.vertical-slider::-moz-range-track {
  height: 6px;
  background: #222;
  border-radius: 6px;
}

/* Thumb */
.vertical-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: #00d;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -6px;
}

.vertical-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #444;
  border-radius: 50%;
  cursor: pointer;
}

</style>