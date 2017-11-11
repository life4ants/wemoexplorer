let popup = new Vue({
  el: '#popup',
  template: `
    <div>
      <div :class="{modal: true, fade: true, in: show}" :style="{ display: show ? 'block' : 'none' }" :id="size">
        <div class="modal-dialog">
          <div class="modal-content" >
            <div class="modal-header">
              <h4 class="modal-title">
                {{title}}
              </h4>
            </div>
            <div v-if="type === 'build'" class="modal-body">
              <div class="build-option-container">
                <div v-for="item in options" v-if="item.active" :id="item.id" :key="item.id"
                          :class="{'build-option': true, 'red-border': selected === item.id}" @click="() => select(item.id)">
                  <h5>{{item.title}}</h5>
                  <img :src="item.src" height="50" width="50" >
                  <p>cost: {{item.cost}}</p>
                  <p>{{item.info}}</p>
                </div>
              </div>
            </div>
            <div v-else-if="type === 'welcome'" class="modal-body">
              <div class="button-tiles">
                <span @click="startGame">Default Board</span>
                <hr>
                <span @click="loadBoard">Custom Board</span>
                <hr>
                <span @click="edit">Edit</span>
                <hr>
                <span @click="listGames">List Games</span>
              </div>
            </div>
            <div v-else-if="type === 'gameOver'" class="modal-body">
              <p>Your energy and/or health got below 0, and you died.</p>
            </div>
            <div v-else-if="type === 'dumpMenu'" class="modal-body">
              <p>Use arrow keys or click:</p>
              <div style="display: flex">
                <img v-for="item in dumpOptions" :key="item.id" :src="item.src" height="50" width="50"
                          :class="{'red-border': selected === item.id}" @click="() => select(item.id)">
              </div>
            </div>

            <div v-if="'build' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" :class="{disabled: selected === null}" id="etr" @click="build">Build</button>
            </div>
            <div v-else-if="type === 'alert'" class="modal-footer">
              <button type="button" id="etr" @click="close">Ok</button>
            </div>
            <div v-else-if="type === 'gameOver'" class="modal-footer">
              <button type="button" id="etr" @click="exit">Ok</button>
            </div>
            <div v-else-if="'dumpMenu' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="dump">Dump</button>
            </div>
          </div>
        </div>
      </div>
      <div :class="{'modal-backdrop': show, in: show}"></div>
    </div>
    `,
  data(){
    return {
      show: false,
      size: "popup-small",
      title: "Welcome to Wemo",
      type: "welcome",
      selected: null,
      options: [
        {id: "firepit", src: "images/firepitIcon.png", title: "Firepit",
                  cost: "60 energy", info: "firepits are for fires", active: true},
        {id: "basket", src: "images/basket.png", title: "Basket",
                  cost: "15 energy, 6 long grass", info: "for picking berries in", active: true}
      ],
      dumpOptions: [
      ],
      selectId: null
    }
  },
  methods: {
    startGame(){
      game.startGame()
      this.close()
    },
    loadBoard(){
      game.loadBoard()
      this.close()
    },
    edit(){
      game.edit()
      this.close()
    },
    buildMenu(){
      if (active === man){
         this.title = "Build Menu"
        this.type = "build"
        this.size = "popup-center"
        this.selected = null
        this.show = true
        noKeys = true
        noLoop()
      }
    },

    dumpMenu(){
      if (man.backpack.items.length === 0)
        return
      if (man.backpack.items.length === 1){
        dump(man.backpack.items[0].type)
      }
      else {
        this.title = "What would you like to Dump?"
        this.type = "dumpMenu"
        let options = [
          {id: "log", src: "images/logs.png"},
          {id: "rocks", src: "images/rocks.png"},
          {id: "longGrass", src: "images/longGrass.png"}
        ]
        let output = []
        for (let i = 0; i < options.length; i++){
          if (man.backpack.items.findIndex((e) => e.type === options[i].id) >= 0){
            output.push(options[i])
          }
        }
        this.selected = output[0].id
        this.selectId = 0
        this.dumpOptions = output
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
      this.selectId = id >= this.dumpOptions.length ? 0 : id < 0 ? this.dumpOptions.length-1 : id
      this.selected = this.dumpOptions[this.selectId].id
    },

    welcomeMenu(){
      this.show = true
      this.size = "popup-small"
      this.title = "Welcome to Wemo"
      this.type = "welcome"
    },

    close(){
      this.show = false
      noKeys = false
      loop()
    },

    build(){
      if (this.selected !== null){
        let error = build(this.selected)
        if (!error)
          this.close()
        else {
          this.type = "alert"
          this.title = error
        }
      }
    },

    listGames(){
      let saved = Object.keys(localStorage)
      let games = []
      for (let i = 0; i < saved.length; i++){
        if (saved[i].substr(0, 5) === "board")
          games.push(saved[i].substring(5, saved[i].length))
      }
      alert(games)
    },
    select(id){
      this.selected = id
    },
    gameOver(){
      this.show = true
      this.title = "Game Over!!"
      this.size = "popup-center"
      this.type = "gameOver"
      noKeys = true
      noLoop()
    },
    exit(){
      this.close()
      game.exit()
    }
  }
})

