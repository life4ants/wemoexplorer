var popup = new Vue({
  el: '#popup',
  template: `
    <div>
      <div class="modal" v-show="show" :id="size">
        <div class="modal-dialog">
          <div class="modal-content" >
            <div class="modal-header" v-if="type !== 'gamePaused'">
              <h6>{{title}}</h6>
            </div>
            <div v-if="type === 'build'" class="modal-body build-menu">
              <div class="build-option-container">
                <div v-for="(item, k) in showOptions" :id="item.id" :key="item.id"
                          :class="{'red-border': selected === item.id, 'build-option': true}" @click="() => select(k)">
                  <h5>{{item.title}}</h5>
                  <img :src="item.src" height="50" width="50" >
                  <p>cost: {{item.cost}}</p>
                  <p>{{item.info}}</p>
                </div>
              </div>
            </div>
            <div v-else-if="type === 'gameOver'" class="modal-body">
              <p>Your energy and/or health reached 0, and you died.</p>
            </div>
            <div v-else-if="type === 'dumpMenu'" class="modal-body">
              <p>Use arrow keys or click:</p>
              <div style="display: flex">
                <img v-for="(item, k) in showOptions" :key="item.id" :src="item.src" height="50" width="50"
                          :class="selected === item.id ? 'red-border' : 'no-border'" @click="() => select(k)">
              </div>
            </div>

            <div      v-if="'build' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="build">Build</button>
            </div>
            <div v-else-if="'alert' === type" class="modal-footer">
              <button type="button" id="etr" @click="close">Ok</button>
            </div>
            <div v-else-if="'dumpMenu' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="dump">Dump</button>
            </div>
            <div v-else-if="'gameOver' === type" class="modal-footer">
              <button type="button" id="etr" @click="exit">Ok</button>
            </div>
            <div v-else-if="'gamePaused' === type" class="modal-footer">
              <h6>Game Paused</h6>
              <p class="center-grey">press space bar to resume</p>
            </div>
          </div>
        </div>
      </div>
      <div :class="{'modal-backdrop': show && type !== 'gamePaused'}"></div>
    </div>
    `,
  data(){
    return {
      show: false,
      size: "popup-center",
      title: "",
      type: "",
      selected: null,
      buildOptions: [
        {id: "stoneAx", src: "images/stoneAx.png", title: "Stone Ax",
                  cost: "100 energy, 1 long grass, 1 rock, 1 log", info: "For chopping down trees so you have logs to burn. Very important.", active: true},
        {id: "firepit", src: "images/firepitIcon.png", title: "Firepit",
                  cost: "200 energy", info: "For building fires in. Very important for staying alive every night.", active: true},
        {id: "basket", src: "images/basket.png", title: "Basket",
                  cost: "50 energy, 6 long grass", info: "For picking berries in", active: true},
        {id: "raft", src: "images/raft0.png", title: "Raft",
                  cost: "400 energy, 8 logs, 8 long grass", info: "For exploring water", active: true},
        {id: "boneShovel", src: "images/boneShovel.png", title: "Bone Shovel",
                  cost: "120 energy, 1 log, 1 long grass, 1 bone", info: "For digging up clay and ore", active: true}

      ],
      showOptions: [],
      selectId: null
    }
  },
  methods: {
    reset(){
      for (var i = this.buildOptions.length - 1; i >= 0; i--) {
        switch (this.buildOptions[i].id) {
          case "basket":
            this.buildOptions[i].active = !man.basket
            break
          case "stoneAx":
            this.buildOptions[i].active = !man.tools.includes("stoneAx")
        }
      }
    },

    buildMenu(){
      if (active === man){
        let ar = []
        for (let i = 0; i<this.buildOptions.length; i++){
          if (this.buildOptions[i].active)
            ar.push(this.buildOptions[i])
        }
        this.showOptions = ar
        this.title = "Build Menu"
        this.type = "build"
        this.size = "popup-center"
        this.selected = this.showOptions[0].id
        this.selectId = 0
        this.show = true
        noKeys = true
        noLoop()
      }
    },

    build(){
      let message = build(this.selected)
      if (!message)
        this.close()
      else {
        this.title = message
        this.type = "alert"
      }
    },

    select(id){
      this.selectId = id
      this.selected = this.showOptions[id].id
      if (this.type === "build"){
        $(".build-menu").scrollTop(
          $("#"+this.selected).offset().top-$(".build-menu").offset().top+$(".build-menu").scrollTop()-
          $(".build-menu").height()+$("#"+this.selected).height()
        );
      }
    },

    dumpMenu(){
      let items = backpack.getAllItems()
      if (items.length === 0)
        return
      if (items.length === 1){
        dump(items[0].type)
      }
      else {
        this.title = "What would you like to Dump?"
        this.type = "dumpMenu"
        let options = [
          {id: "log", src: "images/logs.png"},
          {id: "rock", src: "images/rocks.png"},
          {id: "longGrass", src: "images/longGrass.png"},
          {id: "bone", src: "images/bone.png"},
          {id: "clay", src: "images/clay.png"}
        ]
        let output = []
        for (let i = 0; i < options.length; i++){
          if (items.find((e) => e.type === options[i].id)){
            output.push(options[i])
          }
        }
        this.selected = output[0].id
        this.selectId = 0
        this.showOptions = output
        this.show = true
        noKeys = true
      }
    },

    dump(){
      this.close()
      dump(this.selected)
    },

    changeSelect(dir){
      let id = this.selectId+dir
      id = id >= this.showOptions.length ? 0 : id < 0 ? this.showOptions.length-1 : id
      this.select(id)
    },

    gameOver(){
      console.log("gameOver")
      board.gameOver = true
      this.show = true
      this.title = "Game Over!!"
      this.size = "popup-center"
      this.type = "gameOver"
      noKeys = true
      noLoop()
    },

    exit(){
      game.exit()
    },

    close(){
      this.show = false
      noKeys = false
      loop()
    },

    setAlert(content){
      this.show = true
      this.title = content
      this.type = "alert"
      this.size = "popup-center"
      noKeys = true
      noLoop()
    }
  }
})
