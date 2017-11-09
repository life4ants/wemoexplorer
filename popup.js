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
              <img src="images/firepitIcon.png" height="50" width="50" id="firepit" :class="{selected: selected === 'firepit'}" @click="select">
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
              <p>Your energy got below 0, and you died.</p>
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
      selected: null
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
    select(){
      this.selected = "firepit"
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

