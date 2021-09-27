var popup = new Vue({
  el: '#popup',
  template: `
    <div>
      <div class="modal" v-show="show" :id="size">
        <div class="modal-dialog">
          <div class="modal-content" >

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
            <div v-else-if="['build', 'cook'].includes(type)" class="modal-header">
              <h4>{{title}}</h4>
            </div>

            <div v-else-if="'input' === type" class="modal-header">
              <h6>{{title}}</h6>
              <input type="text" v-model="inputValue" id="inputOne">
            </div>

            <div v-else class="modal-header">
              <h6>{{title}}</h6>
            </div>

  <!-- *** Body: **** -->
            <div v-if="type === 'build'" class="modal-body horizonal">
              <div class="build-preview">
                <img :src="selected.src" height="50" width="50">
                <h5>{{selected.title}}</h5>
                <p>{{selected.dist}}</p>
                <p><b>Time it takes to build:</b> {{selected.time}} Wemo Minutes</p>
                <p><b>Energy Needed:</b> {{selected.energy}}</p>
                <p><b>Resources Needed:</b> {{selected.resources}}</p>
                <p><b>Instructions:</b> {{selected.inst}}</p>
              </div>
              <div class="build-menu">
                <div class="build-option-container">
                  <div v-for="(item, k) in showOptions" :id="item.name" :key="item.name" @click="() => select(k)"
                            :class="{'build-option-selected': selected.name === item.name, 'build-option': true}">
                    <img :src="item.src" height="35" width="35" >
                    <h6>{{item.title}}</h6>
                    <p>{{item.dist}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="type === 'cook'" class="modal-body">
              <p>In order to cook anything, you must have a campsite and a clay pot.</p>
              <div class="build-preview">
                <img :src="selected.src" height="50" width="50">
                <h5>{{selected.title}}</h5>
                <p>{{selected.dist}}</p>
                <p>Makes {{selected.servings}} servings</p>
                <p><b>Time it takes to cook:</b> {{selected.time}} Wemo Minutes</p>
                <p><b>Each Serving gives you:</b> {{selected.benefits}}</p>
                <p><b>Ingredients Needed:</b> {{selected.resources}}</p>
                <p><b>Instructions:</b> {{selected.inst}}</p>
              </div>
              <div class="build-menu">
                <div class="build-option-container">
                  <div v-for="(item, k) in showOptions" :id="item.name" :key="item.name" @click="() => select(k)"
                            :class="{'build-option-selected': selected.name === item.name, 'build-option': true}">
                    <img :src="item.src" height="35" width="35" >
                    <h6>{{item.title}}</h6>
                    <p>{{item.dist}}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="type === 'load'" class="modal-body">
              <div class="build-menu">
                <div class="build-option-container">
                  <div v-for="(item, k) in showOptions" :id="item.name" :key="item.name" @click="() => select(k)"
                            :class="{'build-option-selected': selected.name === item.name, 'build-option': true}">
                    <h6>{{item.name}}</h6>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="type === 'gameOver'" class="modal-body">
              <p>Your energy and/or health reached 0, and you died.</p>
            </div>

            <div v-else-if="'dumpMenu' === type" class="modal-body">
              <p>Use arrow keys or click:</p>
              <div class="flex">
                <div v-for="(item, k) in showOptions" :key="item.id" style="position: relative">
                  <img :src="item.src" height="35" width="35" @click="() => select(k)"
                    :class="selectId === k ? 'red-border' : 'no-border'">
                  <div v-if="item.num" class="img-badge">{{item.num}}</div>
                </div>
              </div>
            </div>

            <div v-else-if="'info' === type" class="modal-body">
              <div class="flex">
                <div v-for="item in showOptions" :key="item.id" style="position: relative">
                  <img :src="item.src" height="35" width="35" class="no-border">
                  <div v-if="item.num" class="img-badge">{{item.num}}</div>
                </div>
              </div>
            </div>

            <div v-else-if="'pickBombs' === type" class="modal-body">
              <label style="display: inline">Enter number:</label>
              <input type="number" min="1" max="5" id="inputOne" v-model="inputValue">
            </div>

             <div v-else-if="'getSize' === type" class="modal-body">
              <label style="display: inline">Number of columns (width):</label>
              <input type="number" v-model="inputValue.cols" min="20" max="250" id="inputOne">
              <br>
              <label style="display: inline">Number of rows (height):</label>
              <input type="number" v-model="inputValue.rows" min="20" max="250" id="inputTwo">
            </div>

<!-- *** Footer: *** -->
            <div v-if="'build' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="build">Build</button>
            </div>

            <div v-else-if="'cook' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="cook">Cook</button>
            </div>

            <div v-else-if="['alert', 'info'].includes(type)" class="modal-footer">
              <button type="button" id="etr" @click="close">Ok</button>
            </div>

            <div v-else-if="'dumpMenu' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="action">{{actionTitle}}</button>
            </div>

            <div v-else-if="'yesno' === type" class="modal-footer">
              <button type="button" id="esc" @click="() => yesnoAction(false)">No</button>
              <button type="button" class="button-primary" id="etr" @click="() => yesnoAction(true)">Yes</button>
            </div>

            <div v-else-if="'pickBombs' === type" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="action">Ok</button>
            </div>

            <div v-else-if="['input', 'load', 'getSize'].includes(type)" class="modal-footer">
              <button type="button" id="esc" @click="close">Cancel</button>
              <button type="button" class="button-primary" id="etr" @click="action">Ok</button>
            </div>

            <div v-else-if="'gameOver' === type" class="modal-footer">
              <button type="button" id="etr" @click="exit">Ok</button>
            </div>
          </div>
        </div>
      </div>
      <div :class="{'modal-backdrop': show && type !== 'gamePaused'}"></div>
    </div>
    `,
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
      inputValue: null
    }
  },
  methods: {
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

    buildMenu(){
      if (active === man){
        this.showOptions = JSON.parse(JSON.stringify(options.build.filter(e => e.active)))
        this.title = "Build Menu"
        this.type = "build"
        this.size = "popup-center"
        this.selected = this.showOptions[0]
        this.selectId = 0
        this.show = true
        setTimeout(() => $(".build-menu").scrollTop(0), 0)
        world.noKeys = true
        noLoop()
      }
    },

    build(){
      if (5000-man.hunger <= this.selected.energy){
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
        this.inputValue = 1
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

    cookMenu(){
      if (active === man){
        this.showOptions = JSON.parse(JSON.stringify(options.cook.filter(e => e.active)))
        this.title = "Cook Book"
        this.type = "cook"
        this.size = "popup-center"
        this.selected = this.showOptions[0]
        this.selectId = 0
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

    action(){
      let msg
      switch(this.actionTitle){
        case "Dump":
          if (msg = actions.dump(this.selected.name)) {this.setAlert(msg)}
          else {this.close()}
          break
        case "Drop":
          this.drop(this.selected); break
        case "Grab":
          this.grab(this.selected, this.selectId); break
        case "saveBoard":
          board.name = this.inputValue
          localStorage.setItem("board"+this.inputValue, JSON.stringify(board))
          this.setAlert("The game was saved"); break
        case "pickBombs":
          if (msg = actions.build(this.selected, {x: active.x, y: active.y}, this.inputValue))
            this.setAlert(msg)
          else {this.close()}; break
        case "load":
          if (this.selected.type === "custom")
            board = new Board(JSON.parse(localStorage["board"+this.selected.name]))
          else
            board = new Board(JSON.parse(JSON.stringify(gameBoards[this.selected.id])))
          world.resize(board.cols, board.rows)
          this.close(); break
        case "newBoard":
          editor.newWorld(this.inputValue.cols,this.inputValue.rows, "random")
          this.close()
      }
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
    },

    setInput(title, actionTitle, type){
      this.title = title
      this.actionTitle = actionTitle
      this.size = type === "getSize" ? "popup-center" : "popup-tiny"
      this.type = type
      this.show = true
      if (["input", "getSize"].includes(type)){
        this.inputValue = this.type === "input" ? "" : 
          {cols: Math.floor((window.innerWidth-37)/25), 
          rows: Math.floor((window.innerHeight-55)/25)}
        setTimeout(() => $("#inputOne").focus(), 0)
      }
      world.noKeys = true
      noLoop()
    },

    gameOver(){
      console.log("gameOver")
      board.gameOver = true
      this.show = true
      this.title = "Game Over!!"
      this.size = "popup-center"
      this.type = "gameOver"
      world.noKeys = true
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
      this.size = content.length > 25 ? "popup-center" : "popup-tiny"
      world.noKeys = true
      noLoop()
    },

    outOfFocus(){
      this.show = true
      this.type = "outOfFocus"
      this.size = "popup-tiny"
      noLoop()
    }
  }
})
