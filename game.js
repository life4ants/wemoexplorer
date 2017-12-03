let game = new Vue({
  el: '#topBar',
  template: `
    <div>
      <welcome-menu v-if="mode === 'welcome'" :startGame="startGame"
        :player="currentPlayer" :edit="edit" :upToDate="upToDate"></welcome-menu>
      <div :class="{topBar: mode === 'edit', sideBar: mode === 'play'}">
        <div v-if="mode === 'edit'" class="flex">
          <div class="tileBox">
            <img v-for="pic in tiles1" :key="pic.id" :src="pic.src"
            height="25" width="25" class="tile" :class="{selected: currentTile === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
          </div>
          <div class="tileBox">
            <img v-for="pic in tiles2" :key="pic.id" :src="pic.src"
            height="25" width="25" class="tile" :class="{selected: currentTile === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
          </div>
          <div class="tileBox-short">
            <img v-for="pic in tiles3" :key="pic.id" :src="pic.src"
            height="25" width="25" class="tile" :class="{selected: currentTile === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
          </div>
          <img v-for="pic in tiles4" :key="pic.id" :src="pic.src"
            height="25" width="25" class="tile" :class="{selected: currentTile === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
          <button type='button' @click='exit'>exit</button>
          <button type="button" @click="saveBoard" title="save the current board">Save</button>
          <button type="button" @click="generateBoard" title="generate new board">New</button>
          <button type="button" @click="editBoard" title="load a saved board">Load</button>
          <button type="button" @click="grassAndTreeFill" title="fill board with trees and grass">Grass&Trees</button>
          <button type="button" @click="previewBoard">Preview (save first)</button>
        </div>
        <div v-else-if="mode === 'play'" class="sideBar-content">
          <i class="fa fa-sign-out fa-flip-horizontal fa-2x" aria-hidden="true" @click="exit" title="Exit Game"></i>
          <i :class="{fa: true, 'fa-2x': true, 'fa-play': paused, 'fa-pause': !paused}"
                        aria-hidden="true" @click="pauseGame" :title="paused ? 'Resume Game (Space)' : 'Pause Game (Space)'"></i>
          <img src="images/centerScreen.png" title="Center Screen (X)" height="30" width="30"
                  :class="{icon: true, selected: autoCenter}" @click="() => action('X')">
          <img v-for="icon in icons" v-show="icon.active" :key="icon.id" :src="icon.src" :title="icon.title"
                  height="30" width="30" :class="{icon: true, selected: icon.selected}" @click="() => action(icon.code)">
          <i class="fa fa-info-circle fa-2x" aria-hidden="true" @click="() => infoShown = !infoShown" title="Show Info"></i>
        </div>
      </div>
    </div>
    `,
  components: {
    'welcome-menu': welcome
  },
  data: {
    tiles1: [
      { id: "beach1", src: "images/beach1.png", type: "beach"},
      { id: "beach2", src: "images/beach2.png", type: "beach"},
      { id: "beach3", src: "images/beach3.png", type: "beach"},
      { id: "beach4", src: "images/beach4.png", type: "beach"},
      { id: "beach5", src: "images/beach5.png", type: "beach"},
      { id: "beach6", src: "images/beach6.png", type: "beach"},
      { id: "beach7", src: "images/beach7.png", type: "beach"},
      { id: "beach8", src: "images/beach8.png", type: "beach"},
      { id: "beach9", src: "images/beach9.png", type: "beach"},
      { id: "beach10", src: "images/beach10.png", type: "beach"},
      { id: "beach11", src: "images/beach11.png", type: "beach"},
      { id: "beach12", src: "images/beach12.png", type: "beach"},
      { id: "rockEdge1", src: "images/rockEdge1.png", type: "rockEdge"},
      { id: "rockEdge2", src: "images/rockEdge2.png", type: "rockEdge"},
      { id: "rockEdge3", src: "images/rockEdge3.png", type: "rockEdge"},
      { id: "rockEdge4", src: "images/rockEdge4.png", type: "rockEdge"},
      { id: "rockEdge5", src: "images/rockEdge5.png", type: "rockEdge"},
      { id: "rockEdge6", src: "images/rockEdge6.png", type: "rockEdge"},
      { id: "rockEdge7", src: "images/rockEdge7.png", type: "rockEdge"},
      { id: "rockEdge8", src: "images/rockEdge8.png", type: "rockEdge"},
      { id: "rockEdge9", src: "images/rockEdge9.png", type: "rockEdge"},
      { id: "rockEdge10", src: "images/rockEdge10.png", type: "rockEdge"},
      { id: "rockEdge11", src: "images/rockEdge11.png", type: "rockEdge"},
      { id: "rockEdge12", src: "images/rockEdge12.png", type: "rockEdge"}
    ],
    tiles2: [
      { id: "river1", src: "images/grassRiver1.png", type: "river"},
      { id: "river2", src: "images/grassRiver2.png", type: "river"},
      { id: "river3", src: "images/grassRiver3.png", type: "river"},
      { id: "river4", src: "images/grassRiver4.png", type: "river"},
      { id: "river6", src: "images/grassRiver6.png", type: "river"},
      { id: "river5", src: "images/grassRiver5.png", type: "river"},
      { id: "river7", src: "images/beachRiver1.png", type: "river"},
      { id: "river8", src: "images/beachRiver2.png", type: "river"},
      { id: "river9", src: "images/beachRiver3.png", type: "river"},
      { id: "river10", src: "images/beachRiver4.png", type: "river"},
      { id: "river11", src: "images/beachRiver5.png", type: "river"},
      { id: "sandpit", src: "images/sandpit.png", type: "sandpit"},
      { id: "river13", src: "images/rockRiver1.png", type: "river"},
      { id: "river14", src: "images/rockRiver2.png", type: "river"},
      { id: "river15", src: "images/rockRiver3.png", type: "river"},
      { id: "river16", src: "images/rockRiver4.png", type: "river"},
      { id: "river17", src: "images/rockRiver5.png", type: "river"},
      { id: "river18", src: "images/rockRiver6.png", type: "river"},
      { id: "river19", src: "images/rockRiver7.png", type: "river"},
      { id: "river20", src: "images/rockRiver8.png", type: "river"},
      { id: "river21", src: "images/rockRiver9.png", type: "river"},
      { id: "river22", src: "images/rockRiver10.png", type: "river"},
      { id: "river12", src: "images/beachRiver6.png", type: "river"},
      { id: "pit", src: "images/pit.png", type: "pit"}
    ],
    tiles3: [
      { id: "dock1", src: "images/dock1.png", type: "dock"},
      { id: "dock3", src: "images/dock3.png", type: "dock"},
      { id: "dock4", src: "images/dock4.png", type: "dock"},
      { id: "beachEdge2", src: "images/beachEdge2.png", type: "beachEdge"},
      { id: "beachEdge3", src: "images/beachEdge3.png", type: "beachEdge"},
      { id: "sand", src: "images/sand.png", type: "sand"},
      { id: "grass", src: "images/grass.png", type: "grass"},
      { id: "longGrass3", src: "images/longGrass3.png", type: "longGrass"},
      { id: "dock6", src: "images/dock6.png", type: "dock"},
      { id: "dock2", src: "images/dock2.png", type: "dock"},
      { id: "dock5", src: "images/dock5.png", type: "dock"},
      { id: "beachEdge1", src: "images/beachEdge1.png", type: "beachEdge"},
      { id: "beachEdge4", src: "images/beachEdge4.png", type: "beachEdge"},
      { id: "rockMiddle", src: "images/rockEdge13.png", type: "rockMiddle"},
      { id: "tree", src: "images/tree.png", type: "tree"},
      { id: "berryTree", src: "images/berryTree.png", type: "berryTree"}
    ],
    tiles4: [
      { id: "log", src: "images/log.png", type: "log"},
      { id: "rock", src: "images/rock4.png", type: "rock"},
      { id: "clay", src: "images/clay5.png", type: "clay"},
      { id: "bone", src: "images/bone.png", type: "bone"},
      { id: "palm", src: "images/palm.png", type: "palm"},
      { id: "random", src: "images/random.png", type: "random"},
      { id: "randomPit", src: "images/randomPit.png", type: "randomPit"},
      { id: "randomGrass", src: "images/randomGrass.png", type: "randomGrass"},
      { id: "randomLog", src: "images/randomLog.png", type: "randomLog"},
      { id: "randomBerries", src: "images/randomBerries.png", type: "randomBerries"},
      { id: "water", src: "images/water.png", type: "water"},
      {id: "beach", src: "images/beachX.png", type: "auto"},
      {id: "treeShore", src: "images/treeShoreX.png", type: "auto"},
      {id: "grassBeach", src: "images/grassBeachX.png", type: "auto"},
      {id: "rockEdge", src: "images/rockX.png", type: "auto"},
      {id: "start", src: "images/player10icon.png", type: "start"}
    ],
    icons: [
      {code: "B", active: false, selected: false, id: "build", src: "images/build.png", title: "Build (B)"},
      {code: "D", active: false, selected: false, id: "dump", src: "images/dump.png", title: "Dump (D)"},
      {code: "G", active: false, selected: false, id: "grab", src: "images/grab.png", title: "Grab/Gather (G)"},
      {code: "F", active: false, selected: false, id: "feedFire", src: "images/feedFire.png", title: "Feed Fire (F)"},
      {code: "E", active: false, selected: false, id: "eat", src: "images/eat.png", title: "Eat (E)"},
      {code: "J", active: false, selected: false, id: "jump", src: "images/jump.png", title: "Jump in or out of Canoe (J)"},
      {code: "C", active: false, selected: false, id: "chop", src: "images/chop.png", title: "Chop down Tree (C)"},
      {code: "G", active: false, selected: false, id: "pick", src: "images/pick.png", title: "Gather Berries (G)"},
      {code: "S", active: false, selected: false, id: "sleep", src: "images/sleepIcon.png", title: "Go to Sleep (S)"},
      {code: "S", active: false, selected: false, id: "wake", src: "images/wakeUp.png", title: "Wake up (S)"}
    ],
    mode: "loading",
    upToDate: true,
    currentTile: "water",
    currentType: "water",
    auto: false,
    started: false,
    paused: false,
    autoCenter: false,
    infoShown: false,
    level: 1,
    currentPlayer: {}
  },
  mounted(){
    if (!localStorage.wemoUpToDate || localStorage.wemoUpToDate !== "10amNov282017"){
      let s = Object.keys(localStorage)
      for (let i = 0; i < s.length; i++){
        if (s[i].substr(0,8) === "wemoGame" || s[i] === "wemoPlayers"){
          delete localStorage[s[i]]
          this.upToDate = false
        }
        else if (!localStorage.wemoUpToDate && s[i].substr(0, 5) === "board"){
          let _board = JSON.parse(localStorage[s[i]])
          _board.name = s[i].substring(5, s[i].length)
          _board.level = 10
          _board.type = "custom"
          delete _board.id
          localStorage.setItem(s[i], JSON.stringify(_board))
        }
      }
      localStorage.setItem("wemoUpToDate", "10amNov282017")
    }
  },
  methods: {
    action(key){
      if (man.isSleeping){
        if (key === "S")
          man.sleep()
      }
      else {
        switch(key){
          case "B": popup.buildMenu();    break;
          case "C": chop();               break;
          case "D": popup.dumpMenu();     break;
          case "E": eat();                break;
          case "F": fling();              break;
          case "G": grab();               break;
          case "X": this.autoCenter = !this.autoCenter; break;
          case "J": man.dismount();       break;
          case "S": man.sleep();          break;
        }
      }
    },
    checkActive(){
      if (man.isSleeping){
        for (let i = 0; i<this.icons.length; i++){
          this.icons[i].active = false
        }
        this.icons[9].active = true
      }
      else {
        let cell = board.cells[man.x][man.y]
        //build:
        this.icons[0].active = active === man
        //dump:
        this.icons[1].active = backpack.weight > 0 && (dumpable.includes(cell.type) || cell.type === "clay")
        //grab:
        this.icons[2].active = backpack.weight < backpack.maxWeight && ["longGrass", "rock", "logpile", "rockpile", "log"].includes(cell.type)
        //feed fire:
        this.icons[3].active = backpack.getAllItems().find((i) => i.type === "log") && man.isNextToFire
        //eat:
        this.icons[4].active = (("berryTree" === cell.type &&
                board.objectsToShow.berryTrees[cell.id].berries.length > 0)) ||
                (man.basket && man.basket.quantity > 0)
        //jump:
        this.icons[5].active = (!man.isRiding && vehicles.canMount(man.x, man.y)) ||
               (man.isRiding && (active.landed || active.isBeside("dock") || "river" === board.cells[active.x][active.y].type))
        //chop:
        this.icons[6].active = ["tree", "treeShore"].includes(cell.type)
        //pick:
        this.icons[7].active = (man.basket && "berryTree" === cell.type &&
              board.objectsToShow.berryTrees[cell.id].berries.length > 0)
        //sleep:
        this.icons[8].active = ("day" !== timeOfDay && !man.isSleeping && !man.isRiding)
        //wake up:
        this.icons[9].active = man.isSleeping
      }
    },

    exit() {
      if (this.mode === "play" && !board.gameOver){
        this.saveGame()
      }
      else if (board.gameOver){
        let index = this.currentPlayer.games.findIndex((e) => e.level === board.level)
        if (index !== -1){
          let gameId = this.currentPlayer.games[index].id
          localStorage.removeItem("wemoGame"+gameId)
          this.currentPlayer.games.splice(index,1)
          let p = JSON.parse(localStorage.wemoPlayers)
          p[this.currentPlayer.index] = this.currentPlayer
          localStorage.setItem("wemoPlayers", JSON.stringify(p))
        }
      }
      this.mode = "welcome"
      $("body").removeClass("full-screen")
      noLoop()
      this.started = false
      popup.show = false
      topOffset = 0
      $("#board").css("top", topOffset+"px").css("left", leftOffset)
      $(window).scrollTop(0).scrollLeft(0)
      redraw()
    },
    edit(player){
      this.currentPlayer = player
      this.mode = "edit"
      topOffset = 100
      $("#board").css("top", topOffset+"px").css("left", "0px")
      let wcols = Math.floor(window.innerWidth/25)
      let wrows = Math.floor(window.innerHeight/25)
      resizeWorld(wcols, wrows)
      generateBoard(wcols,wrows)
      this.started = true
      loop()
    },
    setCurrent(id, type){
      this.currentTile = id
      this.currentType = type
      this.auto = type === "auto" ? true : false
    },
    generateBoard(){
      let wcols = Math.floor(window.innerWidth/25)
      let wrows = Math.floor(window.innerHeight/25)
      let p = prompt("How big would you like your world to be?\nSize of screen is "+wcols+" by "+wrows+". Max suggested size is 80 by 50.\n"+
        "Please enter width and height separated by a coma:")
      if (p === null)
        return
      p = p.split(",")
      let cols = Number(p[0])
      let rows = Number(p[1])
      if (cols != cols || rows != rows)
        alert("Please enter 2 numbers separated by a coma (\",\")")
      else {
        generateBoard(cols,rows)
        resizeWorld(cols, rows)
      }
    },

    previewBoard(){
      fillBoard()
    },

    saveBoard(){
      board.objectsToShow = {logpiles: [], fires: [], berryTrees: [], rockpiles: []}
      let revealCount = 0
      for (let i = 0; i < cols; i++){
        for (let j = 0; j< rows; j++){
          let cell = board.cells[i][j]
          if (j === board.startY && [i,i+1,i-1].includes(board.startX))
            cell.revealed = true
          else {
            cell.revealed = false
            revealCount++
          }
          if (cell.type === "berryTree"){
            cell.id = board.objectsToShow.berryTrees.length
            board.objectsToShow.berryTrees.push({x: i, y: j, berries: []})
          }
          if (helpers.isNextToType(i,j, ["pit", "sandpit"]))
            cell.byPit = true
          else
            delete cell.byPit
        }
      }
      board.revealCount = revealCount
      board.version = 2
      board.wemoMins = 120
      board.progress = false
      let name = prompt("enter name for game")
      if (name !== null){
        board.name = name
        localStorage.setItem("board"+name, JSON.stringify(board))
        alert("Game "+name+" was saved.")
      }
    },

    editBoard(){
      let id = prompt("enter id of game to load")
      if (id === null)
        return
      board = JSON.parse(localStorage["board"+id])
      resizeWorld(board.cells.length, board.cells[0].length)
    },

    grassAndTreeFill(){
      for (let i=0; i<cols; i++){
        for (let j =0; j<rows; j++){
          let type = (i%8 + j%8 > Math.random()*5 && i%8 + j%8 < Math.random()*14) ?
                "tree" : "grass"
          if (board.cells[i][j].type === "random")
            board.cells[i][j] = {tile: type, type, revealed: false}
        }
      }
    },

    startGame(type, player, index){
      if (type === "default"){
        board = JSON.parse(JSON.stringify(gameBoards[index-1]))
      }
      else if (type === "resume"){
        board = JSON.parse(localStorage["wemoGame"+index])
      }
      else if (type === "custom"){
        board = JSON.parse(localStorage["board"+index])
        board.name = index
        board.level = board.level || 10
        board.type = "custom"
      }
      this.currentPlayer = player
      this.mode = "play"
      this.started = true
      this.autoCenter = false
      this.infoShown = false
      leftOffset = 37
      startGame()
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
        Object.assign({man: man.save(), vehicles: vehicles.save(), backpack: backpack.getAllItems()}, board)
      ))
    },

    pauseGame(){
      if (this.paused){
        resumeTimer()
        this.paused = false
        popup.close()
      }
      else {
        popup.type = "gamePaused"
        popup.size = "popup-tiny"
        popup.show = true
        this.paused = true
        noLoop()
      }
    }
  }
})