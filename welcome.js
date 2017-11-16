let welcome = {
  template: `
      <div class="modal-dialog" id="popup-lg" style="z-index: 10">
        <div class="modal-content" id="grow">
          <div class="modal-header">
            <h1>Wemo Explorer</h1>
          </div>
          <div class="modal-body">
            <h6>Hi there! Welcome to Wemo!</h6>
            <p>Click on your name or make a new player:</p>
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
            <div class="links">
              <a @click="deleteMode = !deleteMode">{{deleteMode ? 'done' : 'delete players'}}</a>
            </div>
            <button class="button-primary" @click="newPlayer">New Player</button>
            <input type="text" v-model="name">
            <div class="links">
              <a @click="() => loadBoard('play')">custom board</a>
              <a @click="edit">create board</a>
              <a @click="listGames">list boards</a>
            </div>
          </div>
        </div>
      </div>
    `,
  data(){
    return {
      players: [],
      name: "",
      deleteMode: false
    }
  },
  props: [
    'startGame', 'loadBoard', 'edit'
  ],
  mounted(){
    setTimeout(() => $("#grow").addClass("large"), 0)
    if (localStorage.wemoPlayers){
      this.players = JSON.parse(localStorage.wemoPlayers)
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
      currentPlayer = this.players[id]
      currentPlayer.index = id
      this.startGame()
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
    }
  }
}

