let popup = new Vue({
  el: '#popup',
  template: `
    <div>
      <div class="modal" v-show="show" :id="size">
        <div class="modal-dialog">
          <div class="modal-content" >
            <div class="modal-header">
              <h4 class="modal-title">
                {{title}}
              </h4>
            </div>
            <div v-if="type === 'build'" class="modal-body">
              <div class="build-option-container">
                <div v-for="item in showOptions" :id="item.id" :key="item.id"
                          :class="{'build-option': true, 'red-border': selected === item.id}" @click="() => select(item.id)">
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
                <img v-for="item in showOptions" :key="item.id" :src="item.src" height="50" width="50"
                          :class="selected === item.id ? 'red-border' : 'no-border'" @click="() => select(item.id)">
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
      title: "",
      type: "",
      selected: null,
      buildOptions: [
        {id: "firepit", src: "images/firepitIcon.png", title: "Firepit",
                  cost: "60 energy", info: "firepits are for fires", active: true},
        {id: "basket", src: "images/basket.png", title: "Basket",
                  cost: "15 energy, 6 long grass", info: "for picking berries in", active: true}
      ],
      showOptions: [],
      selectId: null
    }
  },
  methods: {
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

    select(id){
      this.selected = id
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
      this.selectId = id >= this.showOptions.length ? 0 : id < 0 ? this.showOptions.length-1 : id
      this.selected = this.showOptions[this.selectId].id
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
      let index = currentPlayer.games.findIndex((e) => e.level === board.level)
      if (index !== -1){
        let gameId = currentPlayer.games[index].id
        localStorage.removeItem("wemoGame"+gameId)
        currentPlayer.games.splice(index,1)
        let p = JSON.parse(localStorage.wemoPlayers)
        p[currentPlayer.index] = currentPlayer
        localStorage.setItem("wemoPlayers", JSON.stringify(p))
        board.progress = false
      }
      game.exit()
      this.close()
    },

    close(){
      this.show = false
      noKeys = false
      loop()
    }
  }
})
