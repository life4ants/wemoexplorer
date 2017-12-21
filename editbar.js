let editBar = {
  template: `
    <div class="topbar">
      <div class="side-buttons">
        <div class="menu">
          <span>Menu</span>
          <div class="menu-content">
            <span @click="saveBoard" title="save the current board">Save</span>
            <hr>
            <span @click="generateBoard" title="generate new board">New</span>
            <span @click="previewBoard">Preview</span>
            <hr>
            <span @click="island">Make an island</span>
            <span @click="grassAndTreeFill" title="fill board with trees and grass">Grass&Trees</span>
            <hr>
            <span @click="() => load(false)">Load default</span>
          </div>
        </div>
        <div class="menu" @click='exit'>Exit</div>
        <div class="menu" @click='() => load(true)' title="load a saved board">Load</div>
      </div>
      <div class="flex">
        <div class="tilebox">
          <img v-for="pic in tiles1" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
        </div>
        <div class="tilebox">
          <img v-for="pic in tiles2" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
        </div>
        <div class="tilebox-short">
          <img v-for="pic in tiles3" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
        </div>
        <div class="tilebox-short">
          <img v-for="pic in tiles4" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
        </div>
        <img v-for="pic in tiles5" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" @click="() => setCurrent(pic.id, pic.type)">
      </div>
    </div>
    `,
  data(){
    return {
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
        { id: "treeThin", src: "images/tree-thin.png", type: "treeThin"},
        { id: "dock6", src: "images/dock6.png", type: "dock"},
        { id: "dock2", src: "images/dock2.png", type: "dock"},
        { id: "dock5", src: "images/dock5.png", type: "dock"},
        { id: "beachEdge1", src: "images/beachEdge1.png", type: "beachEdge"},
        { id: "beachEdge4", src: "images/beachEdge4.png", type: "beachEdge"},
        { id: "palm", src: "images/palm.png", type: "palm"},
        { id: "tree", src: "images/tree.png", type: "tree"}
      ],
      tiles4: [
        { id: "longGrass3", src: "images/longGrass3.png", type: "longGrass"},
        { id: "berryTree", src: "images/berryTree.png", type: "berryTree"},
        { id: "log", src: "images/log.png", type: "log"},
        { id: "rock", src: "images/rock4.png", type: "rock"},
        { id: "clay", src: "images/clay5.png", type: "clay"},
        { id: "bone", src: "images/bone.png", type: "bone"},
        { id: "grass", src: "images/grass.png", type: "grass"}
      ],
      tiles5: [
        { id: "stick", src: "images/stick.png", type: "stick"},
        { id: "veggies4", src: "images/veggies4.png", type: "veggies"},
        { id: "rockMiddle", src: "images/rockEdge13.png", type: "rockMiddle"},
        { id: "water", src: "images/water.png", type: "water"},
        { id: "random", src: "images/random.png", type: "random"},
        { id: "randomPit", src: "images/randomPit.png", type: "randomPit"},
        { id: "randomGrass", src: "images/randomGrass.png", type: "randomGrass"},
        { id: "randomLog", src: "images/randomLog.png", type: "randomLog"},
        { id: "randomRock", src: "images/randomRock.png", type: "randomRock"},
        { id: "randomTree", src: "images/randomTree.png", type: "randomTree"},
        { id: "randomStick", src: "images/randomStick.png", type: "randomStick"},
        { id: "randomBerries", src: "images/randomBerries.png", type: "randomBerries"},
        {id: "beach", src: "images/beachX.png", type: "auto"},
        {id: "treeShore", src: "images/treeShoreX.png", type: "auto"},
        {id: "grassBeach", src: "images/grassBeachX.png", type: "auto"},
        {id: "rockEdge", src: "images/rockX.png", type: "auto"},
        {id: "river", src: "images/grassRiverX.png", type: "auto"},
        {id: "start", src: "images/player10icon.png", type: "start"}
      ],
      selected: "water"
    }
  },
  props: [
    'exit'
  ],
  methods: {
    setCurrent(id, type){
      this.selected = id
      editor.tile = id
      editor.type = type
      editor.auto = type === "auto" ? true : false
    },
    generateBoard(){
      let wcols = Math.floor((window.innerWidth-37)/25)
      let wrows = Math.floor((window.innerHeight-55)/25)
      let p = prompt("How big would you like your world to be?\nSize of screen is "+wcols+" by "+wrows+". Max suggested size is 80 by 50.\n"+
        "Please enter width and height separated by a coma:")
      if (p === null)
        return
      p = p.split(",")
      let cols = Number(p[0])
      let rows = Number(p[1])
      if (cols != cols || rows != rows)
        alert("Please enter 2 numbers separated by a coma (\",\")")
      else
        editor.newWorld(cols,rows, "random")
    },

    previewBoard(){
      board.fill()
    },

    saveBoard(){
      board.save()
    },

    island(){
      editor.newWorld(board.cols, board.rows, "water")
      editor.islandMaker(board.cols, board.rows)
      editor.floodFill(8,8,board.cells[8][8].tile,board.cells[8][8].type,"random","random")
    },

    load(custom){
      let message = custom ? "enter name of custom world to load" : "enter id of default world to load"
      let id = prompt(message)
      if (id === null)
        return
      if (custom)
        board = new Board(JSON.parse(localStorage["board"+id]))
      else
        board = new Board(JSON.parse(JSON.stringify(gameBoards[id])))
      world.resize(board.cols, board.rows)
    },

    grassAndTreeFill(){
      editor.treeFill()
    }
  }
}

