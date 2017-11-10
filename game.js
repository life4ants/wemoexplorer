let game = new Vue({
  el: '#topBar',
  template: `
    <div :class="{topBar: mode === 'edit', sideBar: mode === 'play'}" :style="{display: mode === 'welcome' ? 'none' : 'block'}">
      <div v-if="mode === 'edit'" class="flex">
        <button type='button' @click='exit'>exit</button>
        <div class="tileBox" v-if="mode === 'edit'">
          <img v-for="pic in tiles1" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: currentTile === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
        </div>
        <div class="tileBox" v-if="mode === 'edit'">
          <img v-for="pic in tiles2" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: currentTile === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
        </div>
        <img v-if="mode === 'edit'" v-for="pic in tiles3" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: currentTile === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
        <button type="button" @click="saveBoard" title="save the current board">Save</button>
        <button type="button" @click="generateBoard" title="generate new board">New</button>
        <button type="button" @click="loadBoard" title="load a saved board">Load</button>
        <button type="button" @click="fillBoard" title="fill board with trees and grass">Fill</button>
      </div>
      <div v-else-if="mode === 'play'" class="sideBar-content">
        <i class="fa fa-sign-out fa-flip-horizontal fa-2x" aria-hidden="true" @click="exit" title="Exit Game"></i>
        <i :class="{fa: true, 'fa-2x': true, 'fa-play': paused, 'fa-pause': !paused}"
                      aria-hidden="true" @click="pauseGame" :title="paused ? 'Resume Game (Space)' : 'Pause Game (Space)'"></i>
        <img v-for="icon in icons" :key="icon.id" :src="icon.src" :title="icon.title"
          height="30" width="30" :class="{icon: true, selected: icon.selected}" :style="{display: icon.active ? 'block' : 'none' }" @click="() => action(icon.code)">
      </div>
    </div>
    `,
  data: {
    mode: "welcome",
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
      { id: "beachEdge1", src: "images/beachEdge1.png", type: "beachEdge"},
      { id: "sand", src: "images/sand.png", type: "sand"},
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
      { id: "rockEdge12", src: "images/rockEdge12.png", type: "rockEdge"},
      { id: "beachEdge2", src: "images/beachEdge2.png", type: "beachEdge"},
      { id: "rockMiddle", src: "images/rockEdge13.png", type: "rockMiddle"}
    ],
    tiles2: [
      { id: "grass", src: "images/grass.png", type: "grass"},
      { id: "beachEdge3", src: "images/beachEdge3.png", type: "beachEdge"},
      { id: "grassBeach1", src: "images/grassBeach1.png", type: "grassBeach"},
      { id: "grassBeach2", src: "images/grassBeach2.png", type: "grassBeach"},
      { id: "grassBeach3", src: "images/grassBeach3.png", type: "grassBeach"},
      { id: "grassBeach4", src: "images/grassBeach4.png", type: "grassBeach"},
      { id: "grassBeach5", src: "images/grassBeach5.png", type: "grassBeach"},
      { id: "grassBeach6", src: "images/grassBeach6.png", type: "grassBeach"},
      { id: "grassBeach7", src: "images/grassBeach7.png", type: "grassBeach"},
      { id: "grassBeach8", src: "images/grassBeach8.png", type: "grassBeach"},
      { id: "grassBeach9", src: "images/grassBeach9.png", type: "grassBeach"},
      { id: "grassBeach10", src: "images/grassBeach10.png", type: "grassBeach"},
      { id: "grassBeach11", src: "images/grassBeach11.png", type: "grassBeach"},
      { id: "grassBeach12", src: "images/grassBeach12.png", type: "grassBeach"},
      { id: "tree", src: "images/tree.png", type: "tree"},
      { id: "beachEdge4", src: "images/beachEdge4.png", type: "beachEdge"},
      { id: "treeShore1", src: "images/treeShore1.png", type: "treeShore"},
      { id: "treeShore2", src: "images/treeShore2.png", type: "treeShore"},
      { id: "treeShore3", src: "images/treeShore3.png", type: "treeShore"},
      { id: "treeShore4", src: "images/treeShore4.png", type: "treeShore"},
      { id: "treeShore5", src: "images/treeShore5.png", type: "treeShore"},
      { id: "treeShore6", src: "images/treeShore6.png", type: "treeShore"},
      { id: "treeShore7", src: "images/treeShore7.png", type: "treeShore"},
      { id: "treeShore8", src: "images/treeShore8.png", type: "treeShore"},
      { id: "treeShore9", src: "images/treeShore9.png", type: "treeShore"},
      { id: "treeShore10", src: "images/treeShore10.png", type: "treeShore"},
      { id: "treeShore11", src: "images/treeShore11.png", type: "treeShore"},
      { id: "treeShore12", src: "images/treeShore12.png", type: "treeShore"}

    ],
    tiles3: [
      { id: "sandpit", src: "images/sandpit.png", type: "sandpit"},
      { id: "stump", src: "images/stump.png", type: "stump"},
      { id: "berryTree", src: "images/berryTree.png", type: "berryTree"},
      { id: "rock", src: "images/rock4.png", type: "rock"},
      { id: "dock1", src: "images/dock1.png", type: "dock"},
      { id: "dock2", src: "images/dock2.png", type: "dock"},
      { id: "dock3", src: "images/dock3.png", type: "dock"},
      { id: "palm", src: "images/palm.png", type: "palm"},
      { id: "pit", src: "images/pit.png", type: "pit"},
      { id: "random", src: "images/random.png", type: "random"},
      { id: "river1", src: "images/grassRiver1.png", type: "river"},
      { id: "river2", src: "images/grassRiver2.png", type: "river"},
      { id: "river3", src: "images/grassRiver3.png", type: "river"},
      { id: "river4", src: "images/grassRiver4.png", type: "river"},
      { id: "river5", src: "images/grassRiver5.png", type: "river"},
      { id: "river6", src: "images/grassRiver6.png", type: "river"},
      { id: "river7", src: "images/beachRiver1.png", type: "river"},
      { id: "river8", src: "images/beachRiver2.png", type: "river"},
      { id: "river9", src: "images/beachRiver3.png", type: "river"},
      { id: "river10", src: "images/beachRiver4.png", type: "river"},
      { id: "river11", src: "images/beachRiver5.png", type: "river"},
      { id: "river12", src: "images/beachRiver6.png", type: "river"},
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
      { id: "water", src: "images/water.png", type: "water"},
      {id: "beach", src: "images/beachX.png", type: "auto"},
      {id: "treeShore", src: "images/treeShoreX.png", type: "auto"},
      {id: "grassBeach", src: "images/grassBeachX.png", type: "auto"},
      {id: "rockEdge", src: "images/rockX.png", type: "auto"},
      {id: "canoe", src: "images/canoe0_4.png", type: "canoe"}
    ],
    icons: [
      {code: "X", active: true, selected: false, id: "centerScreen", src: "images/centerScreen.png", title: "Center Screen (X)"},
      {code: "B", active: true, selected: false, id: "build", src: "images/build.png", title: "Build (B)"},
      {code: "D", active: true, selected: false, id: "dump", src: "images/dump.png", title: "Dump (D)"},
      {code: "G", active: true, selected: false, id: "grab", src: "images/grab.png", title: "Grab/Gather (G)"},
      {code: "F", active: true, selected: false, id: "feedFire", src: "images/feedFire.png", title: "Feed Fire (F)"},
      {code: "E", active: true, selected: false, id: "eat", src: "images/eat.png", title: "Eat (E)"},
      {code: "J", active: true, selected: false, id: "jump", src: "images/jump.png", title: "Jump in or out of Canoe (J)"},
      {code: "G", active: true, selected: false, id: "chop", src: "images/chop.png", title: "Chop down tree (G)"}
    ],
    currentTile: "water",
    currentType: "water",
    auto: false,
    availableActions: "default",
    started: false,
    paused: false
  },
  methods: {
    action(key){
      switch(key){
        case "B":
          popup.buildMenu()
          break
        case "D":
          dump()
          break
        case "E":
          eat()
          break
        case "F":
          feedFire()
          break
        case "G":
          grab()
          break
        case "X":
          this.setAutoCenter()
          break
        case "J":
          man.dismount()
          break
      }
    },
    checkActive(){
      //build:
      this.icons[1].active = active === man
      //dump:
      this.icons[2].active = (man.backpack.items.findIndex((i) => i.type === "log") >= 0 &&
              ["sand", "grass", "stump", "logpile"].includes(board.cells[man.x][man.y].type))
      //grab:
      this.icons[3].active = (man.backpack.weight < 10 && "berryTree" === board.cells[man.x][man.y].type &&
        board.objectsToShow.berryTrees[board.cells[man.x][man.y].id].berries.length > 0)
      //feed fire:
      this.icons[4].active = (man.backpack.items.findIndex((i) => i.type === "log") >= 0 && man.isNextToFire)
      //eat:
      this.icons[5].active = (("berryTree" === board.cells[man.x][man.y].type &&
              board.objectsToShow.berryTrees[board.cells[man.x][man.y].id].berries.length > 0)) ||
              (man.backpack.items.findIndex((e) => e.type === "berries") >= 0 )
      //jump:
      this.icons[6].active = (!man.isRidingCanoe && isNearSquare(man.x, man.y, canoe.x, canoe.y)) ||
               (man.isRidingCanoe && (canoe.landed || canoe.isBeside("dock")))
      //chop:
      this.icons[7].active = man.backpack.weight === 0 && ["tree", "treeShore", "logpile"].includes(board.cells[man.x][man.y].type)
    },
    setAutoCenter(){
      this.icons[0].selected = !this.icons[0].selected
      autoCenter = !autoCenter
      centerOn(active)
    },
    exit() {
      this.mode = "welcome"
      this.started = false
      draw()
      $("body").addClass("full-screen")
      topOffset = 0
      $("#board").css("top", topOffset+"px").css("left", leftOffset)
      $(window).scrollTop(0).scrollLeft(0)
      initializeVars()
      noLoop()
      popup.welcomeMenu()
    },
    edit(){
      this.mode = "edit"
      $("body").removeClass("full-screen")
      topOffset = 100
      $("#board").css("top", topOffset+"px").css("left", "0px")
      generateBoard()
      this.started = true
      loop()
    },
    setCurrent(id, type){
      this.currentTile = id
      this.currentType = type
      this.auto = type === "auto" ? true : false
    },
    generateBoard(){
      generateBoard()
    },
    saveBoard(){
      board.objectsToShow = {logpiles: [], fires: [], berryTrees: []}
      for (let i = 0; i < cols; i++){
        for (let j = 0; j< rows; j++){
          if (board.cells[i][j].type === "berryTree"){
            board.cells[i][j].id = board.objectsToShow.berryTrees.length
            board.objectsToShow.berryTrees.push({x: i, y: j, berries: []})
          }
          if (isNextToType(i,j, ["pit", "sandpit"]))
            board.cells[i][j].byPit = true
          else
            delete board.cells[i][j].byPit
        }
      }
      let id = prompt("enter id for game")
      if (id !== null){
        board.id = id
        localStorage.setItem("board"+id, JSON.stringify(board))
        alert("Game "+id+" was saved.")
      }
    },
    loadBoard(){
      let id = prompt("enter id of game to load")
      if (id === null)
        return
      board = JSON.parse(localStorage["board"+id])
      if (!board.objectsToShow){
        board.objectsToShow = {logpiles: [], fires: [], berryTrees: []}
      }
      if (board.id === undefined){
        board.id = id
      }
      if (this.mode === "welcome"){
        this.mode = "play"
        this.started = true
        startGame()
      }
      else if (this.mode === "play"){
        initializeVars()
        startGame()
      }
    },
    fillBoard(){
      for (let i=0; i<cols; i++){
        for (let j =0; j<rows; j++){
          let type = (i%8 + j%8 > Math.random()*5 && i%8 + j%8 < Math.random()*14) ?
                "tree" : "grass"
          if (board.cells[i][j].type === "random")
            board.cells[i][j] = {tile: type, type, revealed: false}
        }
      }
    },
    startGame(){
      board = JSON.parse(JSON.stringify(gameBoards[0]))
      this.mode = "play"
      this.started = true
      leftOffset = 37
      startGame()
    },
    pauseGame(){
      if (this.paused){
        showCount = 0
        resumeTimer()
        loop()
        this.paused = false
      }
      else {
        message = "Game Paused"
        showCount = 2
        this.paused = true
        noLoop()
      }
    }
  }
})