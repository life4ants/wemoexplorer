var popup = new Vue({
  el: '#popup',
  template: `
    <div>
      <div class="modal" v-show="show" :id="size">
        <div class="modal-dialog">
          <div class="modal-content" >
            <div v-if="'gamePaused' === type" class="modal-footer">
              <h6>Game Paused</h6>
              <p class="center-grey">press space bar to resume</p>
            </div>
            <div v-else-if="'outOfFocus' === type" class="modal-footer">
              <h6>Out of focus</h6>
              <p class="center-grey">click anywhere to close this</p>
            </div>
            <div v-else class="modal-header">
              <h6>{{title}}</h6>
            </div>
            <div v-if="type === 'build'" class="modal-body build-menu">
              <div class="build-option-container">
                <div v-for="(item, k) in showOptions" :id="item.name" :key="item.name"
                          :class="{'red-border': selected.name === item.name, 'build-option': true}" @click="() => select(k)">
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
            <div v-else-if="'dumpMenu' === type" class="modal-body">
              <p>Use arrow keys or click:</p>
              <div style="display: flex">
                <img v-for="(item, k) in showOptions" :key="item.name" :src="item.src" height="50" width="50"
                          :class="selected.name === item.name ? 'red-border' : 'no-border'" @click="() => select(k)">
              </div>
            </div>
            <div v-else-if="'info' === type" class="modal-body">
              <div style="display: flex">
                <img v-for="item in showOptions" :key="item.name" :src="item.src" height="50" width="50" class="no-border">
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
              <button type="button" class="button-primary" id="etr" @click="action">{{actionTitle}}</button>
            </div>
            <div v-else-if="'info' === type" class="modal-footer">
              <button type="button" id="etr" @click="close">Ok</button>
            </div>
            <div v-else-if="'gameOver' === type" class="modal-footer">
              <button type="button" id="etr" @click="exit">Ok</button>
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
      actionTitle: "",
      type: "",
      selected: null,
      buildOptions: [
        {name: "stoneAx", src: "images/stoneAx.png", title: "Stone Ax",
                  cost: "100 energy, 1 long grass, 1 rock, 1 stick", info: "For chopping down trees so you have logs to burn. Very important.", active: true},
        {name: "firepit", src: "images/firepitIcon.png", title: "Firepit",
                  cost: "15 Wemo minutes, 200 energy", info: "For building fires in. Very important for staying alive every night.", active: true},
        {name: "basket", src: "images/basket.png", title: "Basket",
                  cost: "30 Wemo minutes, 50 energy, 6 long grass", info: "For picking berries and veggies in.", active: true},
        {name: "boneShovel", src: "images/boneShovel.png", title: "Bone Shovel",
                  cost: "120 energy, 1 stick, 1 long grass, 1 bone", info: "For digging up clay and ore.", active: true},
        {name: "claypot", src: "images/claypot.png", title: "Clay Pot",
                  cost: "150 energy, 2 clay", info: "For cooking food and carrying water", active: true},
        {name: "raft", src: "images/raft0.png", title: "Raft",
                  cost: "400 energy, 8 logs, 8 long grass", info: "For exploring water", active: true},
        {name: "steppingStones", src: "images/steppingStonesIcon.png", title: "Stepping Stones",
                  cost: "150 energy, 3 rocks", info: "For crossing rivers", active: true},
        {name: "campsite", src: "images/campsite.png", title: "Campsite",
                  cost: "500 energy, 5 logs, 10 sticks, 5 clay, 10 long grass", info: "A place to store tools, cook meals, and more!", active: true},
        {name: "bomb", src: "images/bomb1.png", title: "Bomb",
                  cost: "300 energy", info: "For clearing away clouds", active: false}

      ],
      showOptions: [],
      selectId: null
    }
  },
  methods: {
    reset(){
      for (var i = this.buildOptions.length - 1; i >= 0; i--) {
        switch (this.buildOptions[i].name) {
          case "raft":
            this.buildOptions[i].active = !vehicles.raft
            break
          case "bomb":
            this.buildOptions[i].active = board.revealCount <= 100
        }
      }
    },

    select(id){
      this.selectId = id
      this.selected = this.showOptions[id]
      if (this.type === "build"){
        $(".build-menu").scrollTop(
          $("#"+this.selected.name).offset().top-$(".build-menu").offset().top+$(".build-menu").scrollTop()-
          $(".build-menu").height()+$("#"+this.selected.name).height()
        );
      }
    },

    changeSelect(dir){
      let id = this.selectId+dir
      id = id >= this.showOptions.length ? 0 : id < 0 ? this.showOptions.length-1 : id
      this.select(id)
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
        this.selected = this.showOptions[0]
        this.selectId = 0
        this.show = true
        setTimeout(() => $(".build-menu").scrollTop(0), 0)
        world.noKeys = true
        noLoop()
      }
    },

    build(){
      if (["steppingStones", "raft", "campsite"].includes(this.selected.name)){
        builder.type = this.selected.name
        builder.size = this.selected.name === "campsite" ? 2 : 1
        game.toggleBuildMode()
        this.close()
      }
      else {
        let message = build(this.selected.name, {x: active.x, y: active.y})
        if (!message)
          this.close()
        else {
          this.title = message
          this.type = "alert"
        }
      }
    },

    dumpMenu(){
      let items = backpack.getAllItems()
      if (items.length === 0)
        return
      if (items.length === 1){
        let msg = dump(items[0].type)
        if (msg)
          this.setAlert(msg)
        return
      }
      let options = [
        {name: "log", src: "images/logs.png"},
        {name: "rock", src: "images/rocks.png"},
        {name: "longGrass", src: "images/longGrass.png"},
        {name: "bone", src: "images/bone.png"},
        {name: "clay", src: "images/clay.png"},
        {name: "stick", src: "images/sticks.png"}
      ]
      let output = []
      for (let i = 0; i < options.length; i++){
        if (items.find((e) => e.type === options[i].name)){
          output.push(options[i])
        }
      }
      this.setMenu(output, "What would you like to Dump?", "Dump")
    },

    dropMenu(){
      let items = toolbelt.getAllItems()
      if (items.length === 0)
        return
      let options = [
        {name: "stoneAx", src: "images/stoneAx.png"},
        {name: "boneShovel", src: "images/boneShovel.png"},
        {name: "claypot", src: "images/claypot.png"},
        {name: "basket", src: "images/basket.png"}
      ]
      let output = []
      for (let i = 0; i < options.length; i++){
        let toolId = items.findIndex((e) => e.name === options[i].name)
        if (toolId !== -1){
          let item = Object.assign(options[i], items[toolId])
          output.push(item)
        }
      }
      this.setMenu(output, "What would you like to drop in your campsite?", "Drop")
    },

    drop(item){
      let camp = board.buildings[board.cells[active.x][active.y].id]
      if (item.type === "container"){
        camp.items.push(toolbelt.containers.splice(item.id, 1)[0])
      }
      else if (item.type === "tool"){
        camp.items.push(toolbelt.tools.splice(item.id, 1)[0])
      }
      this.close()
    },

    grabMenu(){
      let items = board.buildings[board.cells[active.x][active.y].id].items
      if (items.length === 0)
        return
      let options = [
        {name: "stoneAx", src: "images/stoneAx.png", type: "tool"},
        {name: "boneShovel", src: "images/boneShovel.png", type: "tool"},
        {name: "claypot", src: "images/claypot.png", type: "container"},
        {name: "basket", src: "images/basket.png", type: "container"}
      ]
      let output = []
      for (let i = 0; i < options.length; i++){
        let t = items.findIndex((e) => e === options[i].name || e.type === options[i].name)
        if (t !== -1){
          options[i].id = t
          output.push(options[i])
        }
      }
      this.setMenu(output, "What would you like to grab from your campsite?", "Grab")
    },

    grab(x){
      let items = board.buildings[board.cells[active.x][active.y].id].items
      if (x.type === "tool"){
        if (toolbelt.tools.length < toolbelt.maxTools){
          toolbelt.tools.push(items.splice(x.id, 1)[0])
          this.close()
        }
        else
          this.setAlert("Opps! You can only carry two tools at a time!")
      }
      else if (x.type === "container"){
        if (toolbelt.containers.length < toolbelt.maxContainers){
          toolbelt.containers.push(items.splice(x.id, 1)[0])
          this.close()
        }
        else
          this.setAlert("Opps! You can only carry one container at a time!")
      }
    },

    setMenu(items, title, actionTitle){
      this.type = "dumpMenu"
      this.title = title
      this.actionTitle = actionTitle
      this.selected = items[0]
      this.selectId = 0
      this.showOptions = items
      this.size = "popup-tiny"
      this.show = true
      world.noKeys = true
      noLoop()
    },

    setInfo(id){
      let items = board.buildings[id].items
      if (items.length === 0)
        return
      let options = [
        {name: "stoneAx", src: "images/stoneAx.png", type: "tool"},
        {name: "boneShovel", src: "images/boneShovel.png", type: "tool"},
        {name: "claypot", src: "images/claypot.png", type: "container"},
        {name: "basket", src: "images/basket.png", type: "container"}
      ]
      let output = []
      for (let i = 0; i < options.length; i++){
        let t = items.findIndex((e) => e === options[i].name || e.type === options[i].name)
        if (t !== -1){
          output.push(options[i])
        }
      }
      this.showOptions = output
      this.type = "info"
      this.title = "Items in this campsite:"
      this.size = "popup-tiny"
      this.show = true
      world.noKeys = true
      noLoop()
    },

    action(){
      if (this.actionTitle === "Dump"){
        let msg = dump(this.selected.name)
        if (msg)
          this.setAlert(msg)
        else
          this.close()
      }
      else if (this.actionTitle === "Drop")
        this.drop(this.selected)
      else if (this.actionTitle === "Grab")
        this.grab(this.selected)
    },

    gameOver(){
      console.log("gameOver")
      board.gameOver = true
      this.show = true
      this.title = "Game Over!!"
      this.size = "popup-center"
      this.type = "gameOver"
      world.noKeys = true
      noLoop()
    },

    exit(){
      game.exit()
    },

    close(){
      this.show = false
      this.type = ""
      world.noKeys = false
      loop()
    },

    setAlert(content){
      this.show = true
      this.title = content
      this.type = "alert"
      this.size = "popup-center"
      world.noKeys = true
      noLoop()
    },

    outOfFocus(){
      this.show = true
      this.type = "outOfFocus"
      this.size = "popup-tiny"
      noLoop()
    }
  }
})
