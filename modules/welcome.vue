<template>
  <div class="modal" id="popup-lg">
    <div class="modal-dialog" >
      <div class="modal-content" id="grow">
        <div class="modal-header horizonal">
          <a href="/">
          <img src="../../images/logo.png" class="logo">
        </a>
          <h1>Wemo Explorer</h1>
        </div>
        <!-- PICK PLAYER -->
        <div v-if="page === 'pickPlayer'" class="modal-body">
          <div class="center whatsNew">
            <h5>Current version: {{history[0].version}}</h5>
            <h6>Published {{history[0].date}}</h6>
          </div>
          <div v-if="lastVisit < history[0].value" class="scroll-box">
            <h5>What's new since your last visit:</h5>
            <div v-for="entry in whatsNew" class="whatsNew">
              <div class="center">
                <h5>Version {{entry.version}}</h5>
                <h6>Published {{entry.date}}</h6>
              </div>
              <ul>
                <li v-for="l in entry.items">{{l}}</li>
              </ul>
            </div>
          </div>
          <p>Click on your name or make a new player:</p>
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
            <div @click="addPlayer" class="button-tiles-content clickable">
              <i>New Player</i>
            </div>
          </div>
          <div class="links">
            <a v-if="players.length > 0" @click="deleteMode = !deleteMode">{{deleteMode ? 'done deleting' : 'delete players'}}</a>
            <a @click="page = 'history'">version history</a>
            <span>Views since Dec 13, 2025: {{viewCount}}</span>
          </div>
        </div>

        <!-- NEW PLAYER -->
        <div v-else-if="page === 'newPlayer'" class="modal-body center">
          <h5>What is your name?</h5>
          <input type="text" v-model="name" placeholder="enter name" class="player-name" id="inputOne">
          <button class="button-primary" id="etr" @click="newPlayer">Start</button>
          <button v-if="players.length > 0" id="esc" @click="page = 'pickPlayer'">Cancel</button>
        </div>

        <!-- HISTORY -->
        <div v-else-if="page === 'history'" class="modal-body">
          <div class="links">
            <a @click="page = 'pickPlayer'">back</a>
            </div>
          <div v-for="entry in history" class="whatsNew">
            <div class="center">
              <h5>Version {{entry.version}}</h5>
              <h6>Published {{entry.date}}</h6>
            </div>
            <ul>
              <li v-for="l in entry.items">{{l}}</li>
            </ul>
          </div>
        </div>

        <!-- HIGH SCORES -->
        <div v-else-if="page === 'highScores'" class="modal-body">
          <h4>High Scores for {{worlds[selected].name}}:</h4>
          <div v-for="h in highScores[selected]" class="flex-around">
            <h6>{{h.player_name}}</h6>
            <h6>{{h.played_at}}</h6>
            <h6>{{h.game_time}}</h6>
          </div>
          <br>
          <button @click="exitHighScores">Back</button>
        </div>

        <!-- PICK GAME -->
        <div v-else-if="page === 'pickGame'" class="modal-body">
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
              <div class="button-tiles-flexbox links">
                <a v-if="highScores[id]" @click="() => showHighScores(id)">High Scores</a>
              </div>
            </div>
          </div>
          <h6 v-if="customWorlds.length > 0" class="left-header">Custom Worlds:</h6>
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
      pageViews: "loading",
      history: [
        {version: "1.9.0", date: "Feb 10, 2026", value: 10900,
        items: ["High Score page", "4 new worlds"]},
        {version: "1.8.1", date: "Feb 3, 2026", value: 10801,
        items: ["New worlds for levels 2 and 3", "mushrooms grow the first day"]},
        {version: "1.8.0", date: "Feb 2, 2026", value: 10800,
        items: ["Star Editor", "Download as default", "Show message when taking teleports"]},
        {version: "1.7.8", date: "Jan 29, 2026", value: 10708,
        items: ["Push boulders holding shift"]},
        {version: "1.7.7", date: "Jan 29, 2026", value: 10707,
        items: ["New Level 1 world"]},
        {version: "1.7.6", date: "Jan 29, 2026", value: 10706,
        items: ["Grass and Veggies regrow when fully picked", "Lots of bug fixes", 
          "Rabbits can't walk on piles", "Push boulders instead of grabbing"]},
        {version: "1.7.5", date: "Jan 28, 2026", value: 10705,
        items: ["Walk onto but not off boulders and water", 
          "Save and Save As on editor, nicer popup confirm when deleting worlds and players", 
          "Background music updates", "20 long grass to build campsite"]},
        {version: "1.7.4", date: "Jan 27, 2026", value: 10704,
        items: ["Fix for stars and teleports", "Eat mushrooms with M", 
          "Snakes spawn from sandpits", "Cook stew without dropping basket"]},
        {version: "1.7.3", date: "Jan 27, 2026", value: 10703,
        items: ["New object: Boulders", "Rabbits and snakes show when they are near you"]},
        {version: "1.7.2", date: "Jan 25, 2026", value: 10702,
        items: ["New Welcome page", "Multiple rafts"]},
        {version: "1.7.1", date: "Jan 24, 2026", value: 1701,
        items: ["Background music", "Cook button", 
          "Can grab and dump rabbit, but not burn them", "Mobile movement issues"]},
        {version: "1.7.0", date: "Jan 23, 2026", value: 10700,
        items: ["Must start fire with long grass", "Multiple fires show correctly"]},
        {version: "1.6.0", date: "Jan 19, 2026", value: 10600,
        items: ["New Tutorial and Quest system", "Track level completes"]},
        {version: "1.5.5", date: "Jan 17, 2026", value: 10505,
        items: ["Update flood fill on editor"]}, 
        {version: "1.5.4", date: "Jan 16, 2026", value: 10504,
        items: ["New Danger: Snakes", ]},
        {version: "1.5.3", date: "Jan 15, 2026", value: 10503,
        items: ["Pick berries and apples", "Limit backback to 4 items and basket to 2 items"]},
        {version: "1.5.2", date: "Jan 14, 2026", value: 10502,
        items: ["Bug fixes", "Grab, dump and eat mushrooms"]},
        {version: "1.5.1", date: "Jan 13, 2026", value: 10501,
        items: ["Start in tutorial", "New object: mushrooms"]},
        {version: "1.5.0", date: "Jan 8, 2026", value: 10500,
        items: ["Find stars to reveal clouds"]},
        {version: "1.4.1", date: "Jan 7, 2026", value: 10401,
        items: ["Show game time on custom worlds", "No night on level one"]},
        {version: "1.4.0", date: "Dec 13, 2025", value: 10400,
        items: ["View counts on main page", "Game time on default worlds"]},
        {version: "1.3", date: "April 9, 2023", value: 10300,
        items: ["Levels are locked until all the previous levels are completed", 
          "Custom worlds are locked until the first two levels are completed",
          "Items on the build menu unlock based on level",
          "Pits are now teleports"]},
      ],
      whatsNew: [],
      highScores:{},
    }
  },
  props: [
    'startGame', 'edit', 'player', 'lastVisit', 'viewCount'
  ],
  mounted(){
    setTimeout(() => $("#grow").addClass("large"), 0)
    this.loadHighScores()
    if (localStorage.wemoPlayers)
      this.players = JSON.parse(localStorage.wemoPlayers)
    if (this.players.length === 0){
      this.page = "newPlayer"
    }
    if (this.player.index !== undefined) {
      this.pickPlayer(this.player.index)
    }
    if (this.lastVisit < this.history[0].value){
      for (let e of this.history){
        if (e.value > this.lastVisit)
          this.whatsNew.push(e)
      }
    }
  },
  computed: {
    message(){
      return "" 
    }
  },
  methods: {
    addPlayer(){
      this.page = "newPlayer"
      this.name = ""
      setTimeout(() => $("#inputOne").focus(), 0)
    },

    async loadHighScores(){
      try {
        const response = await fetch('/api/games/highscores');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (!data.success) {
          console.error('Server error:', data.error);
          showErrorMessage(data.error || 'Failed to load high scores');
          return;
        }

        // data.highscores is an object like { "1": [...], "2": [...], ... }
        this.highScores = data.highscores;

      } catch (err) {
        console.error('Failed to fetch highscores:', err);
        showErrorMessage('Could not load high scores – check your connection');
        return
      }
      for (let k in this.highScores){
        for (let i = 0; i < this.highScores[k].length; i++){
          const date = new Date(this.highScores[k][i].played_at+"Z").toLocaleString(
              'en-US', { dateStyle: 'medium', timeStyle: 'short' })
          this.highScores[k][i].played_at = date
          const minutes = helpers.formatedWemoMins(this.highScores[k][i].game_time)
          this.highScores[k][i].game_time = minutes
        }
      }
    },

    showHighScores(level){
      this.page = "highScores"
      this.selected = level
    },

    exitHighScores(){
      this.page = "pickGame"
    },

    newPlayer(){
      let name = this.name.trim()
      if (name.length > 0){
        let level = typeof test === "undefined" ? 0 : 8
        this.players.push({
          name: name, unlockedLevel: level, games: [], character: 0,
          userId: helpers.randomId(), verified: false, createdAt: new Date().toISOString()
        })
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
      popup.callback = () => {
        if (this.players[id].games.length > 0){
          for (let i = 0; i < this.players[id].games.length; i++){
            localStorage.removeItem("wemoGame"+this.players[id].games[i].id)
          }
        }
        this.players.splice(id, 1)
        localStorage.setItem("wemoPlayers", JSON.stringify(this.players))
        this.deleteMode = false
      }
      popup.setInput("Are you sure you want to delete "+this.players[id].name+"?", "callback", "yesno")
    },

    deleteGame(name, customWorldIndex){
      popup.callback = () => {
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
      popup.setInput("Are you sure you want to delete "+name+"? Everyone's progress on this world will also be deleted.", "callback", "yesno")
    },

    signout(){
      this.page = "pickPlayer"
      this.currentPlayer = {}
    },

    matchWorlds(){
      //make the default worlds:
      let defaultWorlds = []
      for (let i = 0; i < gameBoards.length; i++){
        defaultWorlds.push({name: gameBoards[i].name, level: i, savedGame: false})
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
        popup.callback = () => this.startGame(type, this.currentPlayer, name)
        popup.setInput("Delete your process and restart the level?", "callback", "yesno")
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
  .logo {
    height: 40px;
    margin-right: 30px;
  }

  .whatsNew {
  margin-top: 15px;
  background-color: #ddd;
  border-radius: 10px;
  padding: 5px 10px;
}

.center {
  text-align: center;
}

.scroll-box {
  max-height: 350px;
  overflow: scroll;
  margin: 15px 0px;
}

@media (min-width: 350px){
  .player-name {
    width: 300px;
  }
}

@media (min-width:  550px){
  .logo {
    height: 55px;
  }
  .center h5 {
    display: inline;
    margin-right: 20px;
  }
  .center h6 {
    display: inline;
  }
}
</style>
