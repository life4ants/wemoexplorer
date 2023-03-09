let welcome = {
  template: `
      <div class="modal-dialog" id="popup-lg" style="z-index: 10">
        <div class="modal-content" id="grow">
          <div class="modal-header">
            <h1>Wemo Explorer</h1>
          </div>
          <div v-if="stage === 1" class="modal-body">
            <h5>{{title}}</h5>
            <p>{{message}}</p>
            <div v-if="deleteMode" class="button-tiles">
              <div v-for="(player, id) in players" class="button-tiles-content">
                {{player.name}}
                <a @click="() => deletePlayer(id)">delete</a>
              </div>
            </div>
            <div v-else class="button-tiles">
              <div v-for="(player, id) in players" @click="() => pickPlayer(id)" class="button-tiles-content clickable">
                {{player.name}}
              </div>
            </div>
            <div v-if="players.length > 0" class="links">
              <a @click="deleteMode = !deleteMode">{{deleteMode ? 'done deleting' : 'delete players'}}</a>
            </div>
            <input type="text" v-model="name" placeholder="enter name">
            <button class="button-primary" id="etr" @click="newPlayer">New Player</button>
            <div class="whatsNew">
              <h5>Version {{version}}</h5>
              <h6>Published {{publicationDate}}</h6>
              <ul>
                <li>Preview feature for custom worlds</li>
              </ul>
            </div>
          </div>
          <div v-else class="modal-body">
            <div class="links">
              <a @click="signout">not {{currentPlayer.name}}? sign out</a>
            </div>
            <h6>{{currentPlayer.name}}, pick your player:</h6>
            <img v-for="(pic, i) in characters" :src="pic" :key="i" @click="() => selectCharacter(i)"
                  :class="selected === i ? 'red-border' : 'no-border'" height="32" width="32">
            <h6>Pick the world you want to play in:</h6>
            <h6 class="left-header">Default Worlds:</h6>
            <div class="button-tiles">
              <div v-for="item in worlds" class="button-tiles-content">
                <h6 class="center-header four columns">World {{item.level}}</h6>
                <div class="four columns">
                  <button @click="() => pickGame('default', item.level)">Play</button>
                </div>
                <div class="four columns">
                  <button v-if="item.savedGame" @click="() => pickGame('resume', item.gameId)">Resume</button>
                </div>
              </div>
            </div>
            <h6 class="left-header">Custom Worlds:</h6>
            <div v-if="deleteMode" class="button-tiles">
              <div v-for="(item, id) in customWorlds" class="button-tiles-content">
                {{item.name}}
                <a @click="() => deleteGame(item.name, id)">delete</a>
              </div>
            </div>
            <div v-else class="button-tiles">
              <div v-for="item in customWorlds" class="button-tiles-content">
                <h6 class="center-header four columns">{{item.name}}</h6>
                <div class="four columns">
                  <button @click="() => pickGame('custom', item.name)">Play</button>
                </div>
                <div class="four columns">
                  <button v-if="item.savedGame" @click="() => pickGame('resume', item.gameId)">Resume</button>
                </div>
              </div>
            </div>
            <div class="links">
              <a @click="deleteMode = !deleteMode">{{deleteMode ? 'done deleting' : 'delete custom worlds'}}</a>
              <a @click="() => edit(currentPlayer)">create/edit custom worlds</a>
            </div>
          </div>
        </div>
      </div>
    `,
  data(){
    return {
      stage: 1,
      players: [],
      currentPlayer: {},
      characters: ["images/player10icon.png", "images/player11icon.png"],
      selected: 0,
      worlds: [],
      customWorlds: [],
      name: "",
      deleteMode: false,
      version: "1.2.3",
      publicationDate: "Mar 9, 2023"
    }
  },
  props: [
    'startGame', 'edit', 'player'
  ],
  mounted(){
    setTimeout(() => $("#grow").addClass("large"), 0)
    if (localStorage.wemoPlayers)
      this.players = JSON.parse(localStorage.wemoPlayers)
    if (this.player.index !== undefined) {
      this.pickPlayer(this.player.index)
    }
  },
  computed: {
    message(){
      return this.players.length > 0 ? "Click on your name or make a new player:" : "Please enter your name to get started:"
    },
    title(){
      return this.players.length > 0 ? "Welcome Back!" : "Hi There! Welcome to Wemo!"
    }
  },
  methods: {
    newPlayer(){
      if (this.name.length > 0){
        this.players.push({name: this.name, unlockedLevel: 1, games: [], character: 0})
        localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
        this.name = ""
      }
    },

    pickPlayer(id){
      let p = this.players[id]
      p.index = id   // player not created with an index, must get one somehow
      this.selected = p.character || 0
      this.currentPlayer = p
      this.matchWorlds()
      this.stage = 2
    },

    deletePlayer(id){
      if (confirm("Are you sure you want to delete "+this.players[id].name+"?")){
        if (this.players[id].games.length > 0){
          for (let i = 0; i < this.players[id].games.length; i++){
            localStorage.removeItem("wemoGame"+this.players[id].games[i].id)
          }
        }
        this.players.splice(id, 1)
        localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
        if (this.players.length === 0)
          this.deleteMode = false
      }
    },

    deleteGame(name, customWorldIndex){
      if (confirm("Are you sure you want to delete "+name+"? Everyone's progress on this world will also be deleted.")){
        localStorage.removeItem("board"+name)
        for (let i = this.players.length - 1; i >= 0; i--) {
          for (let j = this.players[i].games.length - 1; j >= 0; j--) {
            let game = this.players[i].games[j]
            if (game.name === name){
              localStorage.removeItem("wemoGame"+game.id)
              this.players[i].games.splice(j, 1)
            }
          }
        }
        this.customWorlds.splice(customWorldIndex, 1)
        localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
      }
    },

    signout(){
      this.stage = 1
      this.currentPlayer = {}
    },

    matchWorlds(){
      //make the default worlds:
      let defaultWorlds = []
      for (let i = 0; i < gameBoards.length; i++){
        defaultWorlds.push({level: i+1, savedGame: false})
      }
      //get custom worlds:
      let saved = Object.keys(localStorage)
      let customWorlds = []
      for (let i = 0; i < saved.length; i++){
        if (saved[i].substr(0, 5) === "board")
          customWorlds.push({name: saved[i].substring(5, saved[i].length), savedGame: false})
      }
      //match:
      let savedGames = this.currentPlayer.games
      for (let i = 0; i < savedGames.length; i++){
        if (savedGames[i].type === "default"){
          defaultWorlds[savedGames[i].level-1].savedGame = true
          defaultWorlds[savedGames[i].level-1].gameId = savedGames[i].id
        }
        else {
          let index = customWorlds.findIndex((e) => e.name === savedGames[i].name)
          if (index === -1){
            let name = savedGames[i].name
            savedGames.splice(i, 1)
            localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
            console.error("saved game",name,"was not found in custom worlds, so it was deleted")
            continue
          }
          customWorlds[index].savedGame = true
          customWorlds[index].gameId = savedGames[i].id
        }
      }
      this.customWorlds = customWorlds
      this.worlds = defaultWorlds
    },

    pickGame(type, id){
      if (this.selected !== this.players[this.currentPlayer.index].character){
        this.players[this.currentPlayer.index].character = this.selected
        localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
      }
      this.currentPlayer.character = this.selected
      this.startGame(type, this.currentPlayer, id)
    },

    selectCharacter(id){
      this.selected = id
    }
  }
}

