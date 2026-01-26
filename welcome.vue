<template>
  <div class="modal" id="popup-lg">
    <div class="modal-dialog" >
      <div class="modal-content" id="grow">
        <div class="modal-header">
          <h1>Wemo Explorer</h1>
        </div>
        <div v-if="page === 'pickPlayer'" class="modal-body">
          <h5>Welcome Back!</h5>
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
            <div @click="page = 'newPlayer'" class="button-tiles-content clickable">
              <i>New Player</i>
            </div>
          </div>
          <div class="links">
            <a v-if="players.length > 0" @click="deleteMode = !deleteMode">{{deleteMode ? 'done deleting' : 'delete players'}}</a>
            <a @click="page = 'history'">version history</a>
            <span>Views since Dec 13, 2025: {{viewCount}}</span>
          </div>
        </div>
        <div v-else-if="page === 'newPlayer'" class="modal-body center">
          <h5>What is your name?</h5>
          <input type="text" v-model="name" placeholder="enter name" class="player-name">
          <button class="button-primary" id="etr" @click="newPlayer">Start</button>
          <button v-if="players.length > 0" id="esc" @click="page = 'pickPlayer'">Cancel</button>
        </div>
        <div v-else-if="page === 'history'" class="modal-body">
          <div class="links">
            <a @click="page = 'pickPlayer'">back</a>
            </div>
          <div class="whatsNew">
            <div class="center">
              <h5>Version 1.7.2</h5>
              <h6>Published Jan 25, 2026</h6>
            </div>
            <ul>
              <li>New Welcome page</li>
              <li>Muliple rafts</li>
            </ul>
          </div>
          <div class="whatsNew">
            <div class="center">
              <h5>Version 1.7.1</h5>
              <h6>Published Jan 24, 2026</h6>
            </div>
            <ul>
              <li>More info on How to Play page</li>
              <li>Background music</li>
              <li>Cook button</li>
              <li>Should work on mobile</li>
              <li>Can grab and dump rabbits, but not burn them.</li>
            </ul>
          </div>
          <div class="whatsNew">
            <div class="center">
              <h5>Version 1.7.0</h5>
              <h6>Published Jan 23, 2026</h6>
            </div>
            <ul>
              <li>Must start fire with long grass</li>
              <li>Mulitple fires show correctly</li>
              <li>Probably lots of new bugs. Please test.</li>
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
            <div v-for="(item, id) in worlds" class="button-tiles-content flex">
              <h6 class="button-tiles-flexbox">{{item.name}}</h6>
              <div class="button-tiles-flexbox">
                <button v-if="item.level <= currentPlayer.unlockedLevel" @click="() => pickGame('default', item.level, id)">Play</button>
                <span v-else >Locked</span>
              </div>
              <div class="button-tiles-flexbox">
                <button v-if="item.savedGame" @click="() => pickGame('resume', item.gameId, id)">Resume</button>
                <div v-else style="width: 80px"></div>
              </div>
              <div class="button-tiles-flexbox">
                <span>Times finished: {{item.completes}}</span>
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
            <div v-for="(item, id) in customWorlds" class="button-tiles-content flex">
              <h6 class="button-tiles-flexbox">{{item.name}}</h6>
              <div class="button-tiles-flexbox">
                <button @click="() => pickGame('custom', item.name, id)">Play</button>
              </div>
              <div class="button-tiles-flexbox">
                <button v-if="item.savedGame" @click="() => pickGame('resume', item.gameId, id)">Resume</button>
                <div v-else style="width: 80px"></div>
              </div>
              <div class="button-tiles-flexbox">
                <span>Playtime: {{item.playtime}} minutes</span>
              </div>
            </div>
          </div>
          <div v-if="currentPlayer.unlockedLevel > 2" class="links">
            <a @click="deleteMode = !deleteMode">{{deleteMode ? 'done deleting' : 'delete custom worlds'}}</a>
            <a @click="() => edit(currentPlayer)">create/edit custom worlds</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
module.exports = {
  data(){
    return {
      page: "pickPlayer",
      players: [],
      currentPlayer: {},
      characters: ["images/player10icon.png", "images/player11icon.png"],
      selected: 0,
      worlds: [],
      customWorlds: [],
      name: "",
      deleteMode: false,
      pageViews: "loading"
    }
  },
  props: [
    'startGame', 'edit', 'player', 'updateMessage', 'viewCount'
  ],
  mounted(){
    setTimeout(() => $("#grow").addClass("large"), 0)
    if (localStorage.wemoPlayers)
      this.players = JSON.parse(localStorage.wemoPlayers)
    if (this.players.length === 0){
      this.page = "newPlayer"
    }
    if (this.player.index !== undefined) {
      this.pickPlayer(this.player.index)
    }
  },
  computed: {
    message(){
      return this.players.length > 0 ? 
        this.updateMessage ? "All your game progress has been deleted but the players are still here:"
          : "Click on your name or make a new player:" 
        : "Please enter your name to get started:"
    }
  },
  methods: {
    newPlayer(){
      if (this.name.length > 0){
        let level = typeof test === "undefined" ? 0 : 4
        this.players.push({name: this.name, unlockedLevel: level, games: [], character: 0})
        localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
        this.name = ""
        this.pickPlayer(this.players.length-1)
      }
    },

    pickPlayer(id){
      let p = this.players[id]
      p.index = id   // player not created with an index, must get one somehow
      this.selected = p.character || 0
      this.currentPlayer = p
      this.matchWorlds()
      this.page = 'pickGame'
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
      this.deleteMode = false
    },

    signout(){
      this.page = "pickPlayer"
      this.currentPlayer = {}
    },

    matchWorlds(){
      //make the default worlds:
      let defaultWorlds = []
      for (let i = 0; i < gameBoards.length; i++){
        fetch(`https://api.counterapi.dev/v2/andys-games/world${i}`)
          .then(response => response.json())
          .then(result => {
            this.worlds[i].playtime = result.data.up_count
            this.worlds[i].completes = result.data.down_count
          })
          .catch(error => console.error('Error:', error));
        defaultWorlds.push({name: gameBoards[i].name, level: i, savedGame: false, playtime: "~", completes: "~"})
      }
      //get custom worlds:
      let saved = Object.keys(localStorage)
      let customWorlds = []
      for (let i = 0; i < saved.length; i++){
        if (saved[i].substr(0, 5) === "board"){
          let playtime = JSON.parse(localStorage[saved[i]]).playtime || 0
          customWorlds.push({
            name: saved[i].substring(5, saved[i].length), 
            savedGame: false,
            playtime: playtime
          })
        }
      }
      //match:
      let savedGames = this.currentPlayer.games
      for (let i = 0; i < savedGames.length; i++){
        if (savedGames[i].type === "default"){
          defaultWorlds[savedGames[i].level].savedGame = true
          defaultWorlds[savedGames[i].level].gameId = savedGames[i].id
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

    pickGame(type, name, id){
      if (this.selected !== this.players[this.currentPlayer.index].character){
        this.players[this.currentPlayer.index].character = this.selected
        localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
      }
      this.currentPlayer.character = this.selected
      if (type === "default" && this.worlds[id].savedGame ||
          type === "custom" && this.customWorlds[id].savedGame){
        if (confirm("This will delete your process and restart the level!")){
          this.startGame(type, this.currentPlayer, name)
        }
      }
      else {
        this.startGame(type, this.currentPlayer, name)
      }
    },

    selectCharacter(id){
      this.selected = id
    }
  }
}
</script>
<style>
  .whatsNew {
  margin-top: 15px;
  background-color: #ddd;
  border-radius: 10px;
  padding: 5px 10px;
}

.center {
  text-align: center;
}
@media (min-width: 350px){
  .player-name {
    width: 300px;
  }
}

@media (min-width:  550px){
  .whatsNew h5 {
    display: inline;
    margin-right: 20px;
  }
  .whatsNew h6 {
    display: inline;
  }
}
</style>
