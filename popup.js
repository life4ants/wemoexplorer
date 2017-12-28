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
            <div v-else-if="['build', 'cook'].includes(type)" class="modal-header">
              <h4>{{title}}</h4>
            </div>
            <div v-else class="modal-header">
              <h6>{{title}}</h6>
            </div>

            <div v-if="type === 'build'" class="modal-body">
              <div class="build-preview">
                <img :src="selected.src" height="50" width="50">
                <h5>{{selected.title}}</h5>
                <p>{{selected.dist}}</p>
                <p><b>Time it takes to build:</b> {{selected.time}} Wemo Minutes</p>
                <p><b>Energy Needed:</b> {{selected.energy}}</p>
                <p><b>Resources Needed:</b> {{selected.resources}}</p>
                <p><b>Instructions:</b> {{selected.inst}}</p>
              </div>
              <div class="build-menu">
                <div class="build-option-container">
                  <div v-for="(item, k) in showOptions" :id="item.name" :key="item.name" @click="() => select(k)"
                            :class="{'build-option-selected': selected.name === item.name, 'build-option': true}">
                    <img :src="item.src" height="35" width="35" >
                    <h6>{{item.title}}</h6>
                    <p>{{item.dist}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="type === 'cook'" class="modal-body">
              <p>In order to cook anything, you must have a campsite and a clay pot.</p>
              <div class="build-preview">
                <img :src="selected.src" height="50" width="50">
                <h5>{{selected.title}}</h5>
                <p>{{selected.dist}}</p>
                <p>Makes {{selected.servings}} servings</p>
                <p><b>Time it takes to cook:</b> {{selected.time}} Wemo Minutes</p>
                <p><b>Each Serving gives you:</b> {{selected.benefits}}</p>
                <p><b>Ingredients Needed:</b> {{selected.resources}}</p>
                <p><b>Instructions:</b> {{selected.inst}}</p>
              </div>
              <div class="build-menu">
                <div class="build-option-container">
                  <div v-for="(item, k) in showOptions" :id="item.name" :key="item.name" @click="() => select(k)"
                            :class="{'build-option-selected': selected.name === item.name, 'build-option': true}">
                    <img :src="item.src" height="35" width="35" >
                    <h6>{{item.title}}</h6>
                    <p>{{item.dist}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="type === 'gameOver'" class="modal-body">
              <p>Your energy and/or health reached 0, and you died.</p>
            </div>

            <div v-else-if="'dumpMenu' === type" class="modal-body">
              <p>Use arrow keys or click:</p>
              <div class="flex">
                <div v-for="(item, k) in showOptions" :key="item.id" style="position: relative">
                  <img :src="item.src" height="35" width="35" @click="() => select(k)"
                    :class="selectId === k ? 'red-border' : 'no-border'">
                  <div v-if="item.num" class="img-badge">{{item.num}}</div>
                </div>
              </div>
            </div>

            <div v-else-if="'info' === type" class="modal-body">
              <div class="flex">
                <div v-for="item in showOptions" :key="item.id" style="position: relative">
                  <img :src="item.src" height="35" width="35" class="no-border">
                  <div v-if="item.num" class="img-badge">{{item.num}}</div>
                </div>
              </div>
            </div>

            <div      v-if="'build' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="build">Build</button>
            </div>

            <div v-else-if="'cook' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="cook">Cook</button>
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
        {name: "stoneAx", src: "images/stoneAx.png", title: "Stone Ax", active: true,
            time: 15, energy: 100,
            resources: "1 long grass, 1 rock, 1 stick",
            dist: "For chopping down trees.",
            inst: "Gather the needed resources in your backpack, then click build."},
        {name: "firepit", src: "images/firepitIcon.png", title: "Firepit", active: true,
            time: 15, energy: 200,
            resources: "none",
            dist: "For building fires in.",
            inst: "Go to the spot where you want to build a firepit, then click build." },
        {name: "basket", src: "images/basket.png", title: "Basket", active: true,
            time: 30, energy: 50,
            resources: "6 long grass",
            dist: "For gathering berries and veggies in.",
            inst: "Gather 6 long grass in your backpack, then click build."},
        {name: "boneShovel", src: "images/boneShovel.png", title: "Bone Shovel", active: true,
            time: 20, energy: 120,
            resources: "1 stick, 1 long grass, 1 bone",
            dist: "For digging up clay and ore.",
            inst: "Gather the needed resources in your backpack, then click build."},
        {name: "claypot", src: "images/claypot.png", title: "Clay Pot", active: true,
            time: 60, energy: 150,
            resources: "2 clay",
            dist: "For cooking food and carrying water",
            inst: "Gather the clay in your backpack, go to a campsite, feed the fire enough to last on hour, then click build."},
        {name: "raft", src: "images/raft0.png", title: "Raft", active: true,
            time: 0, energy: 400,
            resources: "8 logs, 8 long grass",
            dist: "For exploring water",
            inst: "Click build to select a location."},
        {name: "steppingStones", src: "images/steppingStonesIcon.png", title: "Stepping Stones", active: true,
            time: 0, energy: 150,
            resources: "3 rocks",
            dist: "For crossing rivers",
            inst: "Click build to select a location."},
        {name: "campsite", src: "images/campsite.png", title: "Campsite", active: true,
            time: 0, energy: 500,
            resources: "5 logs, 10 sticks, 5 clay, 10 long grass",
            dist: "A place to store tools, cook meals, and more!",
            inst: "Click build to select a location."},
        {name: "bomb", src: "images/bomb1.png", title: "Bomb", active: false,
            time: 5, energy: 300,
            resources: "none",
            dist: "For clearing away clouds",
            inst: "Click build, then select how many bombs you want added to your backpack."}

      ],
      cookOptions: [
        {name: "veggyStew", src: "images/veggyStew.png", title: "Veggy Stew", active: true,
            time: 40, benefits: "800 health, 400 energy", servings: 4,
            resources: "4 units water, 4 veggies",
            dist: "Nutritious Vegetable Stew",
            inst: `Gather the water in a Clay Pot and the veggies in a Basket.
              Put both containers in your campsite, then click cook.` }
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
          $("#"+this.selected.name).offset().top-$(".build-menu").offset().top+$(".build-menu").scrollTop()-25
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
      if (man.energy <= this.selected.energy){
        this.title = "Opps! You don't have enough energy!"
        this.type = "alert"
        return
      }
      if (["steppingStones", "raft", "campsite"].includes(this.selected.name)){
        builder.item = this.selected
        builder.size = this.selected.name === "campsite" ? 2 : 1
        game.toggleBuildMode()
        this.close()
      }
      else {
        let message = actions.build(this.selected, {x: active.x, y: active.y})
        if (!message)
          this.close()
        else {
          this.title = message
          this.type = "alert"
        }
      }
    },

    cookMenu(){
      if (active === man){
        let ar = []
        for (let i = 0; i<this.cookOptions.length; i++){
          if (this.cookOptions[i].active)
            ar.push(this.cookOptions[i])
        }
        this.showOptions = ar
        this.title = "Cook Book"
        this.type = "cook"
        this.size = "popup-center"
        this.selected = this.showOptions[0]
        this.selectId = 0
        this.show = true
        setTimeout(() => $(".build-menu").scrollTop(0), 0)
        world.noKeys = true
        noLoop()
      }
    },

    cook(){
      let msg = actions.cook(this.selected)
      if (msg)
        this.setAlert(msg)
      else
        this.close()
    },

    dumpMenu(){
      let items = backpack.getAllItems()
      if (items.length === 0)
        return
      if (items.length === 1){
        let msg = actions.dump(items[0].type)
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

    grabMenu(type, cellId){
      let id = type === "info" ? cellId : board.cells[active.x][active.y].id
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
      for (let i = 0; i < items.length; i++){
        let t = options.findIndex((e) => e.name === items[i] || e.name === items[i].type)
        if (t !== -1){
          let o = typeof items[i] === "object" ? {id: i, num: items[i].getQuantity()} : {id: i}
          let x = Object.assign(o, options[t])
          output.push(x)
        }
      }
      if (type === "grab" && !board.buildings[id].isCooking)
        this.setMenu(output, "What would you like to grab from your campsite?", "Grab")
      else if (type === "info")
        this.setMenu(output, "Items in this campsite:", "info")
      else
        this.setAlert("Sorry, you can't grab anything from your campsite while you are cooking.")
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
      this.showOptions = items
      this.title = title
      this.size = "popup-tiny"
      if (actionTitle === "info")
        this.type = "info"
      else {
        this.type = "dumpMenu"
        this.actionTitle = actionTitle
        this.selected = items[0]
        this.selectId = 0
      }
      this.show = true
      world.noKeys = true
      noLoop()
    },

    action(){
      if (this.actionTitle === "Dump"){
        let msg = actions.dump(this.selected.name)
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
