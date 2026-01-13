var game = new Vue({
  el: '#game',
  template: `
    <div>
      <welcome-menu v-if="mode === 'welcome'" 
        :startGame="startGame"
        :player="currentPlayer" 
        :edit="edit" 
        :updateMessage="updateMessage"
        :viewCount="viewCount">
      </welcome-menu>
      <edit-bar v-else-if="mode === 'edit'" :exit="exit" :preview="previewGame"></edit-bar>
      <play-box v-else-if="mode === 'play'" ref="playbox"
        :exit="exit"
        :isMobile="isMobile"
        :paused="paused"
        :pauseGame="pauseGame"
        :autoCenter="autoCenter">
      </play-box>
      <build-sidebar v-else-if="mode === 'build'"
        :toggleBuildMode="toggleBuildMode">
      </build-sidebar>
      <div v-else></div>
    </div>
    `,
  components: {
    'welcome-menu': httpVueLoader('welcome.vue'),
    'edit-bar': editBar,
    'play-box': httpVueLoader('play.vue'),
    'build-sidebar': httpVueLoader('build.vue')
  },
  data: {
    
    mode: "loading",
    viewCount: 0,
    started: false,
    paused: false,
    autoCenter: false,
    level: 1,
    currentPlayer: {},
    preview: false,
    updateMessage: false
  },
  mounted(){
    if (!localStorage.wemoUpToDate || localStorage.wemoUpToDate !== "April2023"){
      let s = Object.keys(localStorage)
      for (let i = 0; i < s.length; i++){
        if (s[i].substr(0,8) === "wemoGame"){
          delete localStorage[s[i]]
        }
      }
      let players = JSON.parse(localStorage.wemoPlayers || "[]")
      let newPlayers = []
      for (let i=0; i<players.length; i++){
        newPlayers.push({name: players[i].name, unlockedLevel: 1, games: [], character: 0})
      }
      localStorage.setItem("wemoPlayers", JSON.stringify(newPlayers))
      localStorage.setItem("wemoUpToDate", "April2023")
      this.updateMessage = true
    }
  },
  computed:{
    isMobile(){
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
    }
  },
  methods: {
    checkActive(){
      if (this.$refs.playbox)
        this.$refs.playbox.checkActions()
    },

    exit() {
      if (this.mode === "play"){
        this.preview = false
        if (board.gameOver){
          let index = this.currentPlayer.games.findIndex((e) => e.name === board.name)
          if (index !== -1){
            let gameId = this.currentPlayer.games[index].id
            localStorage.removeItem("wemoGame"+gameId)
            this.currentPlayer.games.splice(index,1)
            let p = JSON.parse(localStorage.wemoPlayers)
            p[this.currentPlayer.index] = this.currentPlayer
            localStorage.setItem("wemoPlayers", JSON.stringify(p))
          }
        }
        else if (board.level > 0)
          this.saveGame()
      }
      this.mode = "welcome"
      $("#boardWrapper").removeClass("full-screen")
      noLoop()
      this.started = false
      this.paused = false
      sounds.files['sleep'].pause()
      popup.show = false
      world.topOffset = 0
      $(window).scrollTop(0).scrollLeft(0)
      redraw()
      editor.undoList = []
      $("#defaultCanvas0").css("cursor", "default")
    },

    edit(player){
      world.leftOffset = 120
      $("#board").css("top", world.topOffset+"px").css("left", world.leftOffset+"px")
      $("#defaultCanvas0").css("cursor", "none")
      let cols = min(floor(window.innerWidth/25), 40)
      let rows = min(floor(window.innerHeight/25), 25)
      editor.newWorld(cols, rows, "random")
      this.currentPlayer = player
      this.mode = "edit"
      this.started = true
      frameRate(60)
      loop()
    },

    startGame(type, player, index){
      let b
      switch(type){
        case "default":
          b = JSON.parse(JSON.stringify(gameBoards[index]))
          console.log("starting game "+index)
          break
        case "resume":
          b = JSON.parse(localStorage["wemoGame"+index])
          break
        case "custom":
          b = JSON.parse(localStorage["board"+index])
          b.name = index
          b.level = board.level || 10
          b.type = "custom"
          if (b.version <4)
            b.playtime = 0 //Backwards compatible
          break
        case "preview":
          b = board
      }
      man = new Man(player.character, b.startX, b.startY)
      backpack = new Backpack("backpack", b.backpack)
      delete b.backpack
      toolbelt = new Toolbelt(b.toolbelt)
      delete b.toolbelt
      if (b.man){
        man.import(b.man)
        delete b.man
      }
      if (man.isSleeping)
        sounds.files['sleep'].play()
      vehicles = new Vehicle(b.vehicles)
      delete b.vehicles
      active = man.ridingId ? vehicles[man.ridingId] : man
      board = new Board(b)
      world.leftOffset = 52
      topbar.health = man.health
      topbar.energy = man.energy
      world.noKeys = false
      timer.setTime(board.wemoMins)
      if (board.level === 0){
        tutorial.start()
      }
      else
        tutorial.active = false
      world.noNight = board.level < 2
      if (!board.progress && board.level > 1){
        board.addRabbits()
      }
      $(window).scrollTop(0).scrollLeft(0) // unknown if necessary 
      $("#boardWrapper").addClass("full-screen")
      this.currentPlayer = player
      this.mode = "play"
      this.started = true
      this.autoCenter = false
      this.infoShown = false
      world.resize(board.cols, board.rows)
      viewport.update(true)
      frameRate(world.frameRate)
      loop()
    },

    saveGame(){
      let index1 = this.currentPlayer.games.findIndex((e) => e.name === board.name)
      let gameId = 0
      if (index1 === -1){
        let games = Object.keys(localStorage)
        for (let i = 0; i < games.length; i++){
          if (games[i].substr(0, 8) === "wemoGame"){
            let n = Number(games[i].substring(8, games[i].length))+1
            gameId = n > gameId ? n : gameId
          }
        }
        this.currentPlayer.games.push({level: board.level, id: gameId, name: board.name, type: board.type})
        let p = JSON.parse(localStorage.wemoPlayers)
        p[this.currentPlayer.index] = this.currentPlayer
        localStorage.setItem("wemoPlayers", JSON.stringify(p))
      }
      else
        gameId = this.currentPlayer.games[index1].id

      board.progress = true
      localStorage.setItem("wemoGame"+gameId, JSON.stringify(
        Object.assign({man: man.export(), vehicles: vehicles.save(),
                        backpack: backpack.items,
                        toolbelt: toolbelt.getAllItems(),
                      }, board.export())
      ))
    },

    pauseGame(){
      if (this.mode === "play"){
        if (this.paused){
          timer.resume()
          this.paused = false
          if (man.isSleeping)
            sounds.files['sleep'].play()
          popup.close()
        }
        else {
          popup.type = "gamePaused"
          popup.size = "popup-tiny"
          popup.show = true
          this.paused = true
          sounds.files['sleep'].pause()
          noLoop()
        }
      }
    },

    previewGame(){
      if(board.name){
        this.preview = true
        this.exit()
        this.startGame("preview", this.currentPlayer)
      }
      else
        popup.setAlert("Please load a game to preview!")
    },

    toggleBuildMode(){
      if (this.mode === "build"){
        this.mode = "play"
        world.leftOffset = 52
      }
      else if (this.mode === "play"){
        this.mode = "build"
        world.leftOffset = 152
      }
      viewport.update(true)
    },

    finishLevel(){
      this.currentPlayer.unlockedLevel = board.level+1
      let p = JSON.parse(localStorage.wemoPlayers)
      p[game.currentPlayer.index] = game.currentPlayer
      localStorage.setItem("wemoPlayers", JSON.stringify(p)) 
      if (board.level > 0){
        sounds.play("win")
        setTimeout(popup.setAlert("ROH RAH RAY! You won!!\nYou revealed the whole world in "+(floor(board.wemoMins/15)/4-2)+" wemo hours."), 0)
      }
    }
  }
})
