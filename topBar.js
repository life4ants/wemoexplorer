let game = new Vue({
  el: '#topBar',
  template: `
    <div class="topBar">
      <button type='button' @click='changeMode'>{{mode === "edit" ? "play" : "edit"}}</button>
      <img v-if="mode === 'edit'" v-for="pic in pics" :key="pic.id" :src="pic.src"
        height="25" width="25" class="tile" :class="{selected: currentTile === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
      <p v-if="mode === 'play'">Welcome to Wemo Explorer</p>
      <div v-if="mode === 'edit'">
        <button type="button" @click="saveBoard" title="save the current board">Save</button>
        <button type="button" @click="generateBoard" title="generate new board">New</button>
        <button type="button" @click="loadBoard" title="load a saved board">Load</button>
        <button type="button" @click="fillBoard" title="fill board with trees and grass">Fill</button>
      </div>
    </div>
    `,
  data: {
    mode: "play",
    pics: [
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
      { id: "beachEdge2", src: "images/beachEdge2.png", type: "beachEdge"},
      { id: "beachEdge3", src: "images/beachEdge3.png", type: "beachEdge"},
      { id: "beachEdge4", src: "images/beachEdge4.png", type: "beachEdge"},
      { id: "dock1", src: "images/dock1.png", type: "dock"},
      { id: "dock2", src: "images/dock2.png", type: "dock"},
      { id: "dock3", src: "images/dock3.png", type: "dock"},
      { id: "grass", src: "images/grass.png", type: "grass"},
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
      { id: "palm", src: "images/palm.png", type: "palm"},
      { id: "pit", src: "images/pit.png", type: "pit"},
      { id: "random", src: "images/random.png", type: "random"},
      { id: "river1", src: "images/river1.png", type: "river"},
      { id: "river2", src: "images/river2.png", type: "river"},
      { id: "river3", src: "images/river3.png", type: "river"},
      { id: "river4", src: "images/river4.png", type: "river"},
      { id: "river5", src: "images/river5.png", type: "river"},
      { id: "river6", src: "images/river6.png", type: "river"},
      { id: "rock", src: "images/rock.png", type: "rock"},
      { id: "rock1", src: "images/rock1.png", type: "mountain"},
      { id: "rock2", src: "images/rock2.png", type: "mountain"},
      { id: "rock3", src: "images/rock3.png", type: "mountain"},
      { id: "rock4", src: "images/rock4.png", type: "mountain"},
      { id: "rock5", src: "images/rock5.png", type: "mountain"},
      { id: "rock6", src: "images/rock6.png", type: "mountain"},
      { id: "rock7", src: "images/rock7.png", type: "mountain"},
      { id: "rock8", src: "images/rock8.png", type: "mountain"},
      { id: "rock9", src: "images/rock9.png", type: "mountain"},
      { id: "rock10", src: "images/rock10.png", type: "mountain"},
      { id: "rock11", src: "images/rock11.png", type: "mountain"},
      { id: "rock12", src: "images/rock12.png", type: "mountain"},
      { id: "rock13", src: "images/rock13.png", type: "mountain"},
      { id: "sand", src: "images/sand.png", type: "sand"},
      { id: "sandpit", src: "images/sandpit.png", type: "sandpit"},
      { id: "stump", src: "images/stump.png", type: "stump"},
      { id: "tent", src: "images/tent.png", type: "tent"},
      { id: "tree", src: "images/tree.png", type: "tree"},
      { id: "treeShore1", src: "images/treeShore1.png", type: "tree"},
      { id: "treeShore2", src: "images/treeShore2.png", type: "tree"},
      { id: "treeShore3", src: "images/treeShore3.png", type: "tree"},
      { id: "treeShore4", src: "images/treeShore4.png", type: "tree"},
      { id: "treeShore5", src: "images/treeShore5.png", type: "tree"},
      { id: "treeShore6", src: "images/treeShore6.png", type: "tree"},
      { id: "treeShore7", src: "images/treeShore7.png", type: "tree"},
      { id: "treeShore8", src: "images/treeShore8.png", type: "tree"},
      { id: "treeShore9", src: "images/treeShore9.png", type: "tree"},
      { id: "treeShore10", src: "images/treeShore10.png", type: "tree"},
      { id: "treeShore11", src: "images/treeShore11.png", type: "tree"},
      { id: "treeShore12", src: "images/treeShore12.png", type: "tree"},
      { id: "water", src: "images/water.png", type: "water"},
      {id: "beach", src: "images/beachX.png", type: "auto"},
      {id: "treeShore", src: "images/treeShoreX.png", type: "auto"}
    ],
    currentTile: "water",
    currentType: "water",
    auto: false
  },
  methods: {
    changeMode() {
      if (this.mode === "edit"){
        this.mode = "play"
        $("body").addClass("full-screen")
      }
      else {
        this.mode = "edit"
        $("body").removeClass("full-screen")
        $("#board").css("top", topOffset+"px").css("left", "0px")
      }
    },
    setCurrent(id, type){
      this.currentTile = id
      this.currentType = type
      this.auto = type === "auto" ? true : false
    },
    generateBoard(){
      window.generateBoard()
    },
    saveBoard(){
      let id = prompt("enter id for game")
      localStorage.setItem("board"+id, JSON.stringify(board))
    },
    loadBoard(){
      let id = prompt("enter id of game to load")
      board = JSON.parse(localStorage["board"+id])
    },
    fillBoard(){
      console.log("not yet")
    }
  }
})