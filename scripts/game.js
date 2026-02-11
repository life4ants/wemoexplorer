var game = new Vue({
  el: '#game',
  template: `
    <div>
      <welcome-menu v-if="mode === 'welcome'" 
        :startGame="startGame"
        :player="currentPlayer" 
        :edit="edit" 
        :lastVisit="lastVisit"
        :viewCount="viewCount">
      </welcome-menu>

      <edit-bar v-if="['edit', 'starEdit'].includes(mode)" :exit="exit" :mode="mode">
      </edit-bar>
      
      <play-box v-if="mode === 'play'" ref="playbox"
        :exit="exit"
        :isMobile="isMobile"
        :paused="paused"
        :pauseGame="pauseGame"
        :musicOn="musicOn"
        :setMusic="setMusic"
        :autoCenter="autoCenter">
      </play-box>
      
      <build-sidebar v-if="mode === 'build'"
        :toggleBuildMode="toggleBuildMode" :isMobile="isMobile">
      </build-sidebar>
    </div>
    `,
  components: {
    'welcome-menu': httpVueLoader('modules/welcome.vue'),
    'edit-bar': httpVueLoader('modules/editBar.vue'),
    'play-box': httpVueLoader('modules/play.vue'),
    'build-sidebar': httpVueLoader('modules/buildSidebar.vue')
  },
  data: {
    mode: "loading",
    viewCount: 0,
    started: false,
    paused: false,
    autoCenter: false,
    level: 1,
    currentPlayer: {},
    lastVisit: null,
    musicOn: false
  },
  mounted(){
    document.addEventListener("visibilitychange", () => {
      if (document.hidden){
        sounds.files.music.pause()
        sounds.files.sleep.pause()
      }
      else if (["play", "build"].includes(this.mode) && !this.paused){
        if (man.isSleeping)
          sounds.files.sleep.play()
        if (this.musicOn)
          sounds.files.music.play()
      }
    })
    let resetLevel = false // change this to force people to do the tutorial again
    this.lastVisit = Number(localStorage.wemoUpToDate ?? 1012011)

    if (this.lastVisit === version)
      return
    if (localStorage.length === 0){
      localStorage.setItem("wemoPlayers", JSON.stringify([]))
      localStorage.setItem("wemoUpToDate", version)
      return
    }
    let s = Object.keys(localStorage)
    for (let i = 0; i < s.length; i++){
      if (s[i].substr(0,8) === "wemoGame"){
        delete localStorage[s[i]]
      }
    }
    let players = JSON.parse(localStorage.wemoPlayers || "[]")
    let newPlayers = []
    for (let i=0; i<players.length; i++){
      newPlayers.push({
        name: players[i].name, 
        unlockedLevel: resetLevel ? 0 : players[i].unlockedLevel, 
        games: [], 
        character: players[i].character,
        userId: players[i].userId ?? helpers.randomId(),
        verified: false,
        createdAt: players[i].createdAt ?? new Date().toISOString()
      })
    }
    localStorage.setItem("wemoPlayers", JSON.stringify(newPlayers))
    
    localStorage.setItem("wemoUpToDate", version)
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

    setMusic(){
      if (this.musicOn){
        sounds.files.music.pause()
        this.musicOn = false
      }
      else {
        sounds.files.music.play()
        this.musicOn = true
      }
    },

    exit() {
      if (this.mode === "play"){
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
      sounds.files.music.pause()
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
          b.sessionId = helpers.randomId()
          break
        case "custom":
          b = JSON.parse(localStorage["board"+index])
          b.sessionId = helpers.randomId()
          break
        case "resume":
          b = JSON.parse(localStorage["wemoGame"+index])
      }
      man = new Man(player.character, b.startX, b.startY)
      backpack = new Backpack(b.backpack ?? {type:"backpack"})
      delete b.backpack
      toolbelt = new Toolbelt(b.toolbelt)
      delete b.toolbelt
      if (b.man){
        man.import(b.man)
        delete b.man
      }
      board = new Board(b)
      active = man.isRiding ? board.vehicles[man.ridingId] : man
      world.leftOffset = 52
      topbar.health = man.health
      topbar.energy = man.energy
      timer.setTime(board.wemoMins)
      world.noNight = board.level < 1
      if (man.isSleeping)
        sounds.files.sleep.play()
      if (this.musicOn)
        sounds.files.music.play()
      if (!board.progress && board.level > 1)
        board.addAnimals()
      $(window).scrollTop(0).scrollLeft(0) // unknown if necessary 
      $("#boardWrapper").addClass("full-screen")
      this.currentPlayer = player
      this.mode = "play"
      this.started = true
      this.autoCenter = false
      this.infoShown = false
      msgs.following.frames = 0
      world.resize(board.cols, board.rows)
      viewport.update(true)
      frameRate(world.frameRate)
      loop()
      if (board.type === "default"){
        tutorial.start()
        if (board.progress) {popup.setInfo("tutorial")}
        else {popup.setInfo("welcome")}
      }
      else
        tutorial.active = false
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
        Object.assign({man: man.export(), backpack: backpack.export(), toolbelt: toolbelt.export()}, board.export())
      ))
      this.postGame("inProgress")
    },

    async postGame(status){
      const payload = {
        userId: this.currentPlayer.userId,
        sessionId: board.sessionId,
        isMobile: game.isMobile,
        status: status,
        level: board.level,
        game_name: board.name,
        game_time: board.wemoMins-120
      }

      // Only send user creation data the first time
      if (!this.currentPlayer.verified) {
        payload.name = this.currentPlayer.name
        payload.createdAt = this.currentPlayer.createdAt
      }
      try {
        const response = await fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          // Try to read error message from server
          let errorDetail = '';
          try {
            const errBody = await response.json();
            errorDetail = errBody.error || errBody.message || `status ${response.status}`;
          } catch {
            errorDetail = await response.text().catch(() => `status ${response.status}`);
          }
          throw new Error(`POST failed: ${errorDetail}`);
        }

        if (!this.currentPlayer.verified){
          this.currentPlayer.verified = true;
          let p = JSON.parse(localStorage.wemoPlayers)
          p[this.currentPlayer.index] = this.currentPlayer
          localStorage.setItem("wemoPlayers", JSON.stringify(p))
        }
        console.log("Game session saved" + (!payload.name ? " (user already synced)" : " + user created"));
      } catch (err) {
        console.error("Failed to save session:", err);
      }
    },

    pauseGame(){
      if (this.mode === "play"){
        if (this.paused){
          timer.resume()
          this.paused = false
          if (man.isSleeping)
            sounds.files.sleep.play()
          if (this.musicOn)
            sounds.files.music.play()
          popup.close()
        }
        else {
          popup.type = "gamePaused"
          popup.size = "popup-tiny"
          popup.show = true
          this.paused = true
          sounds.files.sleep.pause()
          sounds.files.music.pause()
          noLoop()
        }
      }
    },

    toggleBuildMode(){
      if (this.mode === "build"){
        this.mode = "play"
        world.leftOffset = 52
      }
      else if (this.mode === "play"){
        this.mode = "build"
        world.leftOffset = 182
      }
      viewport.update(true)
    },

    finishLevel(){
      board.gameOver = true
      let level = this.currentPlayer.unlockedLevel
      if (board.type === "default" && board.level >= level){
        this.currentPlayer.unlockedLevel = board.level+1
        let p = JSON.parse(localStorage.wemoPlayers)
        p[game.currentPlayer.index] = game.currentPlayer
        localStorage.setItem("wemoPlayers", JSON.stringify(p)) 
      }
      sounds.play("win")
      if (board.level < 2)
        popup.queueTutorial = true
      popup.setAlert("ROH RAH RAY! You won!!\nYou finished the level in "+(round(board.wemoMins/60)-2)+" wemo hours.")
      this.postGame("completed")
    }
  }
})
