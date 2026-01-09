const editBar = {
  template: `
    <div class="editbar">
      <div class="menu-buttons">
        <div class="menu" @click='exit'>Exit</div>
        <div class="menu">
          <span>Menu</span>
          <div class="menu-content">
            <span @click="newBoard" title="generate new board">New</span>
            <span @click="load">Load</span>
            <span @click="resizeBoard" title="resize the board">Resize</span>
            <span @click="saveBoard" title="save the current board">Save</span>
            <span @click="island">Make an island</span>
            <span @click="grassAndTreeFill" title="fill board with trees and grass">Grass&Trees</span>
            <span @click='preview'>Preview</span>
            <span @click="download">Download</span>
            <span @click="upload">Upload</span>
          </div>
        </div>
      </div>
      <div class="board-name">
      {{boardName}}
      </div>
      <div class="editbar-top">
        <button @click= 'undo'>Undo</button>
        <div class="layer-buttons">
          <span :class = "{activelayer: set === 1}"
          class="layer-button"
          @click="() => changeSet(1)">Set 1</span>
          <span :class = "{activelayer: set === 2}"
          class="layer-button"
          @click="() => changeSet(2)">Set 2</span>
        </div>
        <div class="tilebox">
          <img v-for="pic in tools" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: tool === pic.id}" 
          @click="() => changeTool(pic.id)">
        </div>
      </div>
      <div class="editbar-bottom">
        <div v-if = 'set === 1' class="tilebox">
          <img v-for="pic in tiles1" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" 
          @click="() => setCurrent(pic.id, pic.type)">
        </div>
        <div v-if = 'set === 2' class="tilebox">
          <img v-for="pic in tiles2" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" 
          @click="() => setCurrent(pic.id, pic.type)">
        </div>
      </div>
    </div>
    `,
  data(){
    return {
      tiles1: [
        { id: "water", src: "images/water.png", type: "water"},
        { id: "sand", src: "images/sand.png", type: "sand"},
        { id: "grass", src: "images/grass.png", type: "grass"},
        { id: "rockMiddle", src: "images/rockEdge13.png", type: "rockMiddle"},
        { id: "random", src: "images/random.png", type: "random"},
        { id: "playerIcon", src: "images/player10icon.png", type: "start"},
        { id: "randomGrass", src: "images/randomGrass.png", type: "randomGrass"},
        { id: "randomLog", src: "images/randomLog.png", type: "randomLog"},
        { id: "randomRock", src: "images/randomRock.png", type: "randomRock"},
        { id: "randomTree", src: "images/randomTree.png", type: "randomTree"},
        { id: "randomStick", src: "images/randomStick.png", type: "randomStick"},
        { id: "randomBerries", src: "images/randomBerries.png", type: "randomBerries"},
        { id: "treeThin", src: "images/tree-thin.png", type: "treeThin"},
        { id: "tree", src: "images/tree.png", type: "tree"},
        { id: "longGrass3", src: "images/longGrass3.png", type: "longGrass"},
        { id: "berryTree", src: "images/berryTree.png", type: "berryTree"},
        { id: "berryBush", src: "images/berryBush.png", type: "berryBush"},
        { id: "veggies4", src: "images/veggies4.png", type: "veggies"},
        { id: "stick", src: "images/stick.png", type: "stick"},
        { id: "rock", src: "images/rock4.png", type: "rock"},
        { id: "clay", src: "images/clay5.png", type: "clay"},
        { id: "bone", src: "images/bone.png", type: "bone"},
        { id: "palm", src: "images/palm.png", type: "palm"},
        { id: "cactus", src: "images/cactus.png", type: "cactus"},
        { id: "bush1", src: "images/bush1.png", type: "treeThin"},
        { id: "bush2", src: "images/bush2.png", type: "tree"},
        { id: "bush3", src: "images/bush3.png", type: "bush3"},
        { id: "bush4", src: "images/bush4.png", type: "tree"},
        { id: "bush5", src: "images/bush5.png", type: "treeThin"},
        { id: "grass2", src: "images/grass2.png", type: "grass2"},
        { id: "dock1", src: "images/dock1.png", type: "dock"},
        { id: "dock2", src: "images/dock2.png", type: "dock"},
        { id: "dock3", src: "images/dock3.png", type: "dock"},
        { id: "dock4", src: "images/dock4.png", type: "dock"},
        { id: "dock5", src: "images/dock5.png", type: "dock"},
        { id: "dock6", src: "images/dock6.png", type: "dock"},
        { id: "beachEdge1", src: "images/beachEdge1.png", type: "beachEdge"},
        { id: "beachEdge2", src: "images/beachEdge2.png", type: "beachEdge"},
        { id: "beachEdge3", src: "images/beachEdge3.png", type: "beachEdge"},
        { id: "beachEdge4", src: "images/beachEdge4.png", type: "beachEdge"},
        { id: "pit", src: "images/pit.png", type: "pit0"},
        { id: "star", src: "images/star.png", type: "star"}
      ],
      tiles2: [
        { id: "beach", src: "images/beachX.png", type: "auto"},
        { id: "rockEdge", src: "images/rockX.png", type: "auto"},
        { id: "grassBeach", src: "images/grassBeachX.png", type: "auto"},
        { id: "river", src: "images/grassRiverX.png", type: "auto"},
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
        { id: "rockEdge12", src: "images/rockEdge12.png", type: "rockEdge"},
        { id: "river1", src: "images/grassRiver1.png", type: "river"},
        { id: "river2", src: "images/grassRiver2.png", type: "river"},
        { id: "river5", src: "images/grassRiver5.png", type: "river"},
        { id: "river3", src: "images/grassRiver3.png", type: "river"},
        { id: "river4", src: "images/grassRiver4.png", type: "river"},
        { id: "river6", src: "images/grassRiver6.png", type: "river"},
        { id: "river13", src: "images/rockRiver1.png", type: "river"},
        { id: "river14", src: "images/rockRiver2.png", type: "river"},
        { id: "river17", src: "images/rockRiver5.png", type: "river"},
        { id: "river15", src: "images/rockRiver3.png", type: "river"},
        { id: "river16", src: "images/rockRiver4.png", type: "river"},
        { id: "river18", src: "images/rockRiver6.png", type: "river"},
        { id: "river19", src: "images/rockRiver7.png", type: "river"},
        { id: "river20", src: "images/rockRiver8.png", type: "river"},
        { id: "river21", src: "images/rockRiver9.png", type: "river"},
        { id: "river22", src: "images/rockRiver10.png", type: "river"},
        { id: "river7", src: "images/beachRiver1.png", type: "river"},
        { id: "river8", src: "images/beachRiver2.png", type: "river"},
        { id: "river9", src: "images/beachRiver3.png", type: "river"},
        { id: "river10", src: "images/beachRiver4.png", type: "river"},
        { id: "river11", src: "images/beachRiver5.png", type: "river"},
        { id: "river12", src: "images/beachRiver6.png", type: "river"}
      ],
      tools: [
        { id: "floodFill", src: "images/floodFill.png"},
        { id: "brush",     src: "images/brush.png"}
      ],
      selected: "water",
      set: 1, 
      tool: "brush",
      boardName: "Board not saved"
    }
  },
  props: [
    'exit', 'preview'
  ],
  mounted(){
    editor.tool = "brush"
    editor.tile = editor.type = "water"
    editor.undoList = []
  },
  methods: {
    setCurrent(id, type){
      if (editor.type === "pit1")
        editor.cancelPit()
      editor.tile = this.selected = id
      editor.type = type
      if (["auto", "start", "pit1", "pit0"].includes(type))
        editor.tool = this.tool = "brush"
    },

    changeSet(id){
      this.set = id
      if (id === 1){
        editor.tile = this.selected = "water"
        editor.type = "water"
      }
      else {
        editor.tile = this.selected = "beach"
        editor.type = "auto"
        editor.tool = this.tool = "brush"
      }
    },

    changeTool(id){
      if (id === "floodFill" && ["auto", "start", "pit0", "pit1"].includes(editor.type))
        return
      editor.tool = this.tool = id
    },

    newBoard(){
      popup.setInput("Enter size for new World", "newBoard","getSize")
      this.boardName = "Board not saved"
    },

    resizeBoard(){
      popup.setInput("Enter new size for the World", "resize","getSize")
    },

    saveBoard(){
      popup.callback = (n)=> this.boardName = n
      board.save()
    },

    undo(){
      editor.undo()
    },

    island(){
      editor.newWorld(board.cols, board.rows, "water")
      editor.islandMaker(board.cols, board.rows)
      editor.floodFill(8,8,board.cells[8][8].tile,board.cells[8][8].type,"random","random")
    },

    load(){
      let items = []
      let saved = Object.keys(localStorage)
      for (let i = 0; i < saved.length; i++){
        if (saved[i].substr(0, 5) === "board")
          items.push({name: saved[i].substring(5, saved[i].length), type: "custom"})
      }
      for (let i = 0; i < gameBoards.length; i++){
        items.push({id: i, name: "Level "+(i+1), type: "default"})
      }
      popup.callback = (n)=> this.boardName = n
      popup.setMenu(items, "Select a world to load:", "load")
    },

    download(){
      let downloadUrl = URL.createObjectURL(new Blob(
        [JSON.stringify(board)], {type:'text/plain'}));
      popup.download(downloadUrl, board.name + ".txt")
    },

    upload(){
      popup.callback = (n)=> this.boardName = n
      popup.setInput("Upload file", "fileUpload", "fileUpload")
    },

    grassAndTreeFill(){
      editor.treeFill()
    }
  }
}

