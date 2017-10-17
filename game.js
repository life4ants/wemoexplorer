let game = new Vue({
  el: '#topBar',
  template: `
    <div class="topBar">
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
      <div v-else>
        <div class="dropdown">
          <span>Menu</span>
          <div class="dropdown-content">
            <span @click="startGame">Board One</span>
            <hr>
            <span @click="loadBoard">Custom Board</span>
            <hr>
            <span @click="edit">Edit</span>
            <hr v-if="mode ==='play'">
            <span v-if="mode === 'play'" @click="exit">Exit</span>
          </div>
        </div>
        <div v-if="started" class="topBar-content">
          <div class="infobox" v-text="info"></div>
        </div>
        <div v-else class="topBar-content">
          <button type="button" @click="listGames">List Games</button>
          <button class="button-primary">Primary Button</button>
        </div>
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
      { id: "rockEdge1", src: "images/rock1.png", type: "rockEdge"},
      { id: "rockEdge2", src: "images/rock2.png", type: "rockEdge"},
      { id: "rockEdge3", src: "images/rock3.png", type: "rockEdge"},
      { id: "rockEdge4", src: "images/rock4.png", type: "rockEdge"},
      { id: "rockEdge5", src: "images/rock5.png", type: "rockEdge"},
      { id: "rockEdge6", src: "images/rock6.png", type: "rockEdge"},
      { id: "rockEdge7", src: "images/rock7.png", type: "rockEdge"},
      { id: "rockEdge8", src: "images/rock8.png", type: "rockEdge"},
      { id: "rockEdge9", src: "images/rock9.png", type: "rockEdge"},
      { id: "rockEdge10", src: "images/rock10.png", type: "rockEdge"},
      { id: "rockEdge11", src: "images/rock11.png", type: "rockEdge"},
      { id: "rockEdge12", src: "images/rock12.png", type: "rockEdge"},
      { id: "beachEdge2", src: "images/beachEdge2.png", type: "beachEdge"},
      { id: "rockMiddle", src: "images/rock13.png", type: "rockMiddle"}
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
      { id: "rock", src: "images/rock.png", type: "rock"},
      { id: "dock1", src: "images/dock1.png", type: "dock"},
      { id: "dock2", src: "images/dock2.png", type: "dock"},
      { id: "dock3", src: "images/dock3.png", type: "dock"},
      { id: "palm", src: "images/palm.png", type: "palm"},
      { id: "pit", src: "images/pit.png", type: "pit"},
      { id: "random", src: "images/random.png", type: "random"},
      { id: "river1", src: "images/river1.png", type: "river"},
      { id: "river2", src: "images/river2.png", type: "river"},
      { id: "river3", src: "images/river3.png", type: "river"},
      { id: "river4", src: "images/river4.png", type: "river"},
      { id: "river5", src: "images/river5.png", type: "river"},
      { id: "river6", src: "images/river6.png", type: "river"},
      { id: "tent", src: "images/tent.png", type: "tent"},
      { id: "water", src: "images/water.png", type: "water"},
      {id: "beach", src: "images/beachX.png", type: "auto"},
      {id: "treeShore", src: "images/treeShoreX.png", type: "auto"},
      {id: "grassBeach", src: "images/grassBeachX.png", type: "auto"},
      {id: "rockEdge", src: "images/rockX.png", type: "auto"},
      {id: "canoe", src: "images/canoe0_4.png", type: "canoe"}
    ],
    currentTile: "water",
    currentType: "water",
    auto: false,
    availableActions: "default",
    started: false
  },
  methods: {
    exit() {
      this.mode = "welcome"
      topOffset = 30
      $(".topBar").css("height", "30px")
      $("body").addClass("full-screen")
      $("#board").css("top", topOffset+"px").css("left", "0px")
      $(window).scrollTop(0).scrollLeft(0)
      initializeVars()
    },
    edit(){
      this.mode = "edit"
      topOffset = 100
      $(".topBar").css("height", "100px")
      $("body").removeClass("full-screen")
      $("#board").css("top", topOffset+"px").css("left", "0px")
      loadBoard()
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
      let id = prompt("enter id for game")
      localStorage.setItem("board"+id, JSON.stringify(board))
    },
    loadBoard(){
      let id = prompt("enter id of game to load")
      board = JSON.parse(localStorage["board"+id])
      if (!board.objectsToShow){
        board.objectsToShow = {logpiles: []}
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
    listGames(){
      let saved = Object.keys(localStorage)
      let games = []
      for (let i = 0; i < saved.length; i++){
        if (saved[i].substr(0, 5) === "board")
          games.push(saved[i].substring(5, saved[i].length))
      }
      alert(games)
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
      board = gameBoards[0]
      this.mode = "play"
      this.started = true
      startGame()
    }
  },
  computed: {
    info(){
      let output
      if (this.availableActions === "default")
        output= "use arrow keys to move"
      else if (this.availableActions === "dismount")
        output= "press J to get out of canoe"
      else if (this.availableActions === "mount")
        output= "press J to get into canoe"
      else if (this.availableActions === "tree")
        output= "press enter to chop down the tree"
      else if (this.availableActions === "log")
        output= "press d to dump the log"
      else if (this.availableActions === "logpile")
        output = "press g to grab a log"
      return output
    }
  }
})