var popup = new Vue({
  el: '#popup',
  template: `
    <div>
      <div class="modal" v-show="show" :id="size">
        <div class="modal-dialog">

          <build-menu v-if="['build', 'cook', 'load', 'dumpMenu', 'info'].includes(type)" 
            :type="type"
            :title="title"
            :selected="selected"
            :showOptions="showOptions"
            :select="select"
            :selectId="selectId"
            :action="action"
            :actionTitle="actionTitle"
            :close="close"
          ></build-menu>

          <alert-menu v-else-if="['alert', 'download', 'gameOver'].includes(type)" 
            :type="type"
            :title="title"
            :action="action"
            :actionTitle="actionTitle"
            :close="close"
            :exit="exit"
          ></alert-menu>

          <info-menu v-else-if="['manual', 'tutorial', 'welcome'].includes(type)" 
            :type="type"
            :close="close"
          ></info-menu>

          <select-menu v-else-if="['input', 'getSize', 'pickBombs', 'fileUpload'].includes(type)" 
            :type="type"
            :title="title"
            :inputValue="inputValue"
            :action="action"
            :close="close"
            :callback="callback"
            :setAlert="setAlert"
          ></select-menu>
          <div v-else class="modal-content" >

  <!-- **** Footer as everything: ***** -->
            <div v-if="'gamePaused' === type" class="modal-footer">
              <h6>Game Paused</h6>
              <p class="center-grey">press space bar to resume</p>
            </div>
            <div v-else-if="'outOfFocus' === type" class="modal-footer">
              <h6>Out of focus</h6>
              <p class="center-grey">click anywhere to close this</p>
            </div>

  <!-- **** Header: ************** -->
            <div v-else class="modal-header">
              <h6>{{title}}</h6>
            </div>

<!-- *** Footer: *** -->
            <div v-if="'yesno' === type" class="modal-footer">
              <button type="button" id="esc" @click="() => yesnoAction(false)">No</button>
              <button type="button" class="button-primary" id="etr" @click="() => yesnoAction(true)">Yes</button>
            </div>

          </div>
        </div>
      </div>
      <div :class="{'modal-backdrop': show && type !== 'gamePaused'}"></div>
    </div>
    `,
  components: {
    'alert-menu': httpVueLoader('alertMenu.vue'),
    'build-menu': httpVueLoader('buildMenu.vue'),
    'info-menu': httpVueLoader('infoMenu.vue'),
    'select-menu': httpVueLoader('selectMenu.vue')
  },
  data(){
    return {
      show: false,
      size: "popup-center",
      title: "",
      actionTitle: "",
      type: "",
      selected: null,
      showOptions: [],
      selectId: null,
      inputValue: {},
      callback: null // for sending the name of the board back to editbar vue object
    }
  },
  methods: {
    action(){
      let msg
      switch(this.actionTitle){
        case "Build":
          this.build(); break
        case "Cook":
          this.cook(); break
        case "Dump":
          if (msg = actions.dump(this.selected.name)) {this.setAlert(msg)}
          else {this.close()}; break
        case "Drop":
          this.drop(this.selected); break
        case "Grab":
          this.grab(this.selected, this.selectId); break
        case "saveBoard":
          board.name = this.inputValue.text
          localStorage.setItem("board"+this.inputValue.text, JSON.stringify(board))
          this.callback("Board Name: "+board.name)
          this.setAlert("The world was saved"); break
        case "pickBombs":
          if (msg = actions.build(this.selected, {x: active.x, y: active.y}, Number(this.inputValue.number)))
            this.setAlert(msg)
          else {this.close()}; break
        case "load":
          if (this.selected.type === "custom")
            board = new Board(JSON.parse(localStorage["board"+this.selected.name]))
          else
            board = new Board(JSON.parse(JSON.stringify(gameBoards[this.selected.id])))
          world.resize(board.cols, board.rows)
          this.callback("Board Name: "+board.name)
          this.close(); break
        case "newBoard":
          editor.newWorld(this.inputValue.cols,this.inputValue.rows, "random")
          this.close(); break
        case "resize":
          editor.resizeWorld(this.inputValue.cols,this.inputValue.rows)
          this.close()
      }
    },

    select(id){
      this.selectId = id
      this.selected = this.showOptions[id]
      if (this.type === "build"){
        $(".build-menu").scrollTop(
          $("#"+this.selected.name).offset().top-$(".build-menu").offset().top+$(".build-menu").scrollTop()-25
        );
      }
    },

    changeSelect(dir){
      let id = this.selectId+dir
      id = id >= this.showOptions.length ? 0 : id < 0 ? this.showOptions.length-1 : id
      this.select(id)
    },

    build(){
      if (man.energy <= this.selected.energy){
        this.title = "Opps! You don't have enough energy!"
        this.type = "alert"
        return
      }
      if (["steppingStones", "raft", "campsite"].includes(this.selected.name)){
        builder.item = this.selected
        builder.size = this.selected.name === "campsite" ? 2 : 1
        game.toggleBuildMode()
        this.close()
      }
      else if (this.selected.name === "bomb"){
        this.type = this.actionTitle = "pickBombs"
        this.title = "How many bombs do you want to get?"
        this.inputValue.number = 1
        setTimeout( () => $("#inputOne").focus(),0)
      }
      else {
        let message = actions.build(this.selected, {x: active.x, y: active.y})
        if (!message)
          this.close()
        else {
          this.title = message
          this.type = "alert"
        }
      }
    },

    buildMenu(){
      if (active === man){
        this.showOptions = options.build.filter(e => e.level <= board.level)
        this.selected = this.showOptions[0]
        this.selectId = 0
        this.actionTitle = "Build"
        this.title = "Build Menu"
        this.type = "build"
        this.size = "popup-center"
        this.show = true
        setTimeout(() => $(".build-menu").scrollTop(0), 0)
        world.noKeys = true
        noLoop()
      }
    },

    cook(){
      let msg = actions.cook(this.selected)
      if (msg)
        this.setAlert(msg)
      else
        this.close()
    },

    cookMenu(){
      if (active === man){
        this.showOptions = JSON.parse(JSON.stringify(options.cook.filter(e => e.active)))
        this.title = "Cook Book"
        this.type = "cook"
        this.actionTitle = "Cook"
        this.size = "popup-center"
        this.selected = this.showOptions[0]
        this.selectId = 0
        this.show = true
        setTimeout(() => $(".build-menu").scrollTop(0), 0)
        world.noKeys = true
        noLoop()
      }
    },

    download(url, name){
      $(window).scrollTop(0).scrollLeft(0)
      this.show = true
      this.title = url
      this.actionTitle = name
      this.type = "download"
      this.size = "popup-center"
      world.noKeys = true
      noLoop()
    },

    dumpMenu(){
      let items = backpack.getAllItems()
      if (items.length === 0)
        return
      if (items.length === 1){
        let msg = actions.dump(items[0].type)
        if (msg)
          this.setAlert(msg)
        return
      }
      let cell = board.cells[active.x][active.y]
      if (cell.type.substr(-4,4) === "pile"){
        let type = cell.type.substr(0, cell.type.length-4)
        if (backpack.includesItem(type)){
          let msg = actions.dump(type)
          if (msg)
            this.setAlert(msg)
          return
        }
      }
      let output = options.resources.filter(i => items.find((e) => e.type === i.name))
      this.setMenu(output, "What would you like to Dump?", "Dump")
    },

    dropMenu(){
      let items = toolbelt.getAllItems()
      if (items.length === 0)
        return
      this.setMenu(items, "What would you like to drop in your campsite?", "Drop")
    },

    drop(item){
      let camp = board.buildings[board.cells[active.x][active.y].id]
      if (item.type === "container"){
        camp.items.push(toolbelt.containers.splice(item.id, 1)[0])
      }
      else if (item.type === "tool"){
        camp.items.push(toolbelt.tools.splice(item.id, 1)[0])
      }
      this.close()
    },

    grabMenu(type, cellId){
      let id = type === "info" ? cellId : board.cells[active.x][active.y].id
      let items = board.buildings[id].items
      if (items.length === 0)
        return
      let output = []
      for (let i = 0; i < items.length; i++){
        let type = items[i].type || items[i]
        let x
        if (["claypot", "basket"].includes(type)){
          x = {src: items[i].getPhoto(), num: items[i].getQuantity(), type: "container"}
        }
        else {
          x = {src: "images/"+type+".png", type: "tool"}
        }
        output.push(x)
        
      }
      if (type === "grab" && !board.buildings[id].isCooking)
        this.setMenu(output, "What would you like to grab from your campsite?", "Grab")
      else if (type === "info")
        this.setMenu(output, "Items in this campsite:", "info")
      else
        this.setAlert("Sorry, you can't grab anything from your campsite while you are cooking.")
    },

    grab(x, selID){
      let items = board.buildings[board.cells[active.x][active.y].id].items
      if (x.type === "tool"){
        if (toolbelt.tools.length < toolbelt.maxTools){
          toolbelt.tools.push(items.splice(selID, 1)[0])
          this.close()
        }
        else
          this.setAlert("Opps! You can only carry two tools at a time!")
      }
      else if (x.type === "container"){
        if (toolbelt.containers.length < toolbelt.maxContainers){
          toolbelt.containers.push(items.splice(selID, 1)[0])
          this.close()
        }
        else
          this.setAlert("Opps! You can only carry one container at a time!")
      }
    },

    setMenu(items, title, actionTitle){
      $(window).scrollTop(0).scrollLeft(0)
      this.showOptions = JSON.parse(JSON.stringify(items))
      this.title = title
      this.size = "popup-tiny"
      if (["info", "load"].includes(actionTitle))
        this.type = this.actionTitle = actionTitle
      else {
        this.type = "dumpMenu" 
        this.actionTitle = actionTitle
      }
      this.selected = items[0]
      this.selectId = 0
      this.show = true
      world.noKeys = true
      noLoop()
    },

    setInput(title, actionTitle, type){
      $(window).scrollTop(0).scrollLeft(0)
      this.title = title
      this.actionTitle = actionTitle
      this.size = type === "getSize" ? "popup-center" : "popup-tiny"
      this.type = type
      this.show = true
      if (["input", "getSize", "pickBombs"].includes(type)){
        this.inputValue = this.type === "input" ? {text: ""} : 
          {cols: Math.floor((window.innerWidth)/25), 
          rows: Math.floor((window.innerHeight)/25)}
        setTimeout(() => $("#inputOne").focus(), 0)
      }
      world.noKeys = true
      noLoop()
    },

    setInfo(type){
      $(window).scrollTop(0).scrollLeft(0)
      this.size = type === "manual" ? "popup-lg" : "popup-center"
      this.type = type
      this.show = true
      world.noKeys = true
      noLoop()
    },

    gameOver(){
      board.gameOver = true
      this.show = true
      this.title = "Game Over!!"
      this.size = "popup-center"
      this.type = "gameOver"
      world.noKeys = true
      sounds.play("lose")
      noLoop()
    },

    exit(){
      game.exit()
    },

    close(){
      this.show = false
      this.type = ""
      world.noKeys = false
      loop()
    },

    setAlert(content){
      this.show = true
      this.title = content
      this.type = "alert"
      this.size = content.length > 27 ? "popup-center" : "popup-tiny"
      world.noKeys = true
      noLoop()
    },

    outOfFocus(){
      this.show = true
      this.type = "outOfFocus"
      this.size = "popup-tiny"
      noLoop()
    },

    yesnoAction(bool){
      if (this.actionTitle === "saveBoard"){
        if(bool){
          localStorage.setItem("board"+board.name, JSON.stringify(board))
          this.setAlert("The game was saved")
        }
        else
          this.setInput("Enter a new name for this world:", "saveBoard", "input")
      }
      else if (this.actionTitle === "eat"){
        if (bool && backpack.removeItem("mushroom", 1)){
          actions.eatAction("mushrooms")
          this.close()
        }
        else
          this.close()
      }
    }
  }
})
