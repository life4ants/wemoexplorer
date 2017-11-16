let welcome = {
  template: `
      <div class="modal-dialog" id="popup-lg" style="z-index: 10">
        <div class="modal-content" id="grow">
          <div class="modal-header">
            <h1>Wemo Explorer</h1>
          </div>
          <div v-if="stage === 1" class="modal-body">
            <h5>Hi there! Welcome to Wemo!</h5>
            <p>{{message}}</p>
            <div v-if="deleteMode" class="button-tiles">
              <div v-for="(player, id) in players">
                {{player.name}}
                <a @click="() => deletePlayer(id)">delete</a>
              </div>
            </div>
            <div v-else class="button-tiles">
              <div v-for="(player, id) in players" @click="() => pickPlayer(id)">
                {{player.name}}
              </div>
            </div>
            <div v-if="players.length > 0" class="links">
              <a @click="deleteMode = !deleteMode">{{deleteMode ? 'done' : 'delete players'}}</a>
            </div>
            <button class="button-primary" id="etr" @click="newPlayer">New Player</button>
            <input type="text" v-model="name" placeholder="enter name">
          </div>
          <div v-else class="modal-body">
            <h5>{{currentPlayer.name}}, pick the world you want to play in:</h5>
            <div class="links">
              <a @click="signout">not {{currentPlayer.name}}? sign out</a>
            </div>
            <h6 class="left-header">Default Worlds:</h6>
            <div class="button-tiles">
              <div v-for="item in worlds" class="flex-around">
                <h6 class="left-header">World {{item.level}}</h6>
                <button @click="() => pickGame('default', item.level)">Play</button>
                <button v-if="item.savedGame" @click="() => pickGame('resume', item.gameId)">Resume</button>
              </div>
            </div>
            <h6 class="left-header">Custom Worlds:</h6>
            <div class="button-tiles">
              <div v-for="item in customWorlds" class="flex-around">
                <h6 class="left-header">{{item.name}}</h6>
                <button @click="() => pickGame('custom', item.name)">Play</button>
                <button v-if="item.savedGame" @click="() => pickGame('resume', item.gameId)">Resume</button>
              </div>
            </div>
            <div class="links">
              <a @click="edit">create your own world</a>
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
      worlds: [],
      customWorlds: [],
      name: "",
      deleteMode: false
    }
  },
  props: [
    'startGame', 'edit', 'player'
  ],
  mounted(){
    setTimeout(() => $("#grow").addClass("large"), 0)
    if (localStorage.wemoPlayers){
      this.players = JSON.parse(localStorage.wemoPlayers)
    }
    if (this.player.index != undefined) {
      this.pickPlayer(this.player.index)
    }
  },
  computed: {
    message(){
      return this.players.length > 0 ? "Click on your name or make a new player:" : "Please enter your name to get started:"
    }
  },
  methods: {
    newPlayer(){
      if (this.name.length > 0){
        this.players.push({name: this.name, unlockedLevel: 1, games: []})
        localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
        this.name = ""
      }
    },

    pickPlayer(id){
      let p = this.players[id]
      p.index = id
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
        if (typeof savedGames[i].level === "number"){
          defaultWorlds[savedGames[i].level-1].savedGame = true
          defaultWorlds[savedGames[i].level-1].gameId = savedGames[i].id
        }
        else {
          let index = customWorlds.findIndex((e) => e.name === savedGames[i].level)
          if (index === -1)
            console.error("saved game",savedGames[i].level,"not found in custom worlds")
          customWorlds[index].savedGame = true
          customWorlds[index].gameId = savedGames[index].id
        }
      }
      this.customWorlds = customWorlds
      this.worlds = defaultWorlds
    },

    pickGame(type, id){
      console.log(type, id)
      this.startGame(type, this.currentPlayer, id)
    }
  }
}

