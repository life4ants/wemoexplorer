// Entry point — single <script type="module"> replaces all individual script tags

import { tiles, gameBoards, world, man, board, setMsgs } from './state.js'
import { topbarHeight, dumpable, grabable } from './config.js'
import { sounds } from './sounds.js'
import { helpers } from './helpers.js'
import { timer } from './timer.js'
import { viewport } from './viewport.js'
import { topbar } from './topbar.js'
import { builder } from './builder.js'
import { tutorial } from './tutorial.js'
import { test } from './test.js'
import { Board } from './board.js'
import { popup } from './popup.js'
import { game } from './game.js'
import { editor, starEditor } from './editor.js'
import { msgs } from './message.js'
import { keyPressed, keyHandler, mousePressed, mouseDragged,
         mouseReleased, windowResized, touchStarted } from './events.js'

// Initialize state
setMsgs(msgs)

// Attach world.resize() here to avoid circular dep in state.js (needs game + topbarHeight)
world.resize = function(cols, rows) {
  let offset = game.mode === "play" ? topbarHeight : 0
  resizeCanvas(
    max(cols*25, window.innerWidth),
    max(rows*25+offset, window.innerHeight))
}

// p5.js callbacks (must be on window for p5 global mode)
window.preload = function() {
  //console.timeLog("load", "preload started")
  document.getElementById("p5_loading").innerHTML = "Loading Images ..."
  Object.assign(tiles, {
    apple: loadImage("images/apple.png"),
    apples: loadImage("images/apples.png"),
    arrow: loadImage("images/arrow.png"),
    arrow1: loadImage("images/arrow2.png"),
    arrowInFlight: loadImage("images/arrows.png"),
    backpack: loadImage("images/carrying.png"),
    basket: loadImage("images/basket.png"),
    basketBerries: loadImage("images/basketBerries.png"),
    beach1: loadImage("images/beach1.png"),
    beach2: loadImage("images/beach2.png"),
    beach3: loadImage("images/beach3.png"),
    beach4: loadImage("images/beach4.png"),
    beach5: loadImage("images/beach5.png"),
    beach6: loadImage("images/beach6.png"),
    beach7: loadImage("images/beach7.png"),
    beach8: loadImage("images/beach8.png"),
    beach9: loadImage("images/beach9.png"),
    beach10: loadImage("images/beach10.png"),
    beach11: loadImage("images/beach11.png"),
    beach12: loadImage("images/beach12.png"),
    beachX: loadImage("images/beachX.png"),
    beachEdge1: loadImage("images/beachEdge1.png"),
    beachEdge2: loadImage("images/beachEdge2.png"),
    beachEdge3: loadImage("images/beachEdge3.png"),
    beachEdge4: loadImage("images/beachEdge4.png"),
    berries: loadImage("images/berries.png"),
    berryTree: loadImage("images/berryTree.png"),
    berryBush: loadImage("images/berryBush.png"),
    blank: loadImage("images/blank.png"),
    bone: loadImage("images/bone.png"),
    bomb: loadImage("images/bomb1.png"),
    boneShovel: loadImage("images/boneShovel.png"),
    bow: loadImage("images/bow.png"),
    boulder: loadImage("images/boulder.png"),
    bush1: loadImage("images/bush1.png"),
    bush2: loadImage("images/bush2.png"),
    bush3: loadImage("images/bush3.png"),
    bush4: loadImage("images/bush4.png"),
    bush5: loadImage("images/bush5.png"),
    build: loadImage("images/build.png"),
    cactus: loadImage("images/cactus.png"),
    campsite: loadImage("images/campsite.png"),
    canoe: [ loadImage("images/canoe0.png"),
             loadImage("images/canoe1.png")
           ],
    chop: loadImage("images/chop.png"),
    clay: loadImage("images/clay.png"),
    clay1: loadImage("images/clay1.png"),
    clay2: loadImage("images/clay2.png"),
    cross: loadImage("images/cross.png"),
    clay3: loadImage("images/clay3.png"),
    clay4: loadImage("images/clay4.png"),
    clay5: loadImage("images/clay5.png"),
    claypot: loadImage("images/claypot.png"),
    claypot_water: loadImage("images/claypot_water.png"),
    clouds: loadImage("images/clouds.png"),
    clouds1: loadImage("images/clouds1.png"),
    clouds2: loadImage("images/clouds2.png"),
    clouds3: loadImage("images/clouds3.png"),
    clouds4: loadImage("images/clouds4.png"),
    cloudsHalf: loadImage("images/cloudsHalf.png"),
    construction: {
      raft: loadImage("images/raftHB.png"),
      campsite: loadImage("images/campsiteHB.png")
    },
    dawn: loadImage("images/dawn.png"),
    day: loadImage("images/sun.png"),
    dock1: loadImage("images/dock1.png"),
    dock2: loadImage("images/dock2.png"),
    dock3: loadImage("images/dock3.png"),
    dock4: loadImage("images/dock4.png"),
    dock5: loadImage("images/dock5.png"),
    dock6: loadImage("images/dock6.png"),
    dusk: loadImage("images/dusk.png"),
    dump: loadImage("images/dump.png"),
    eat: loadImage("images/eat.png"),
    explosion: loadImage("images/explosion.png"),
    feedFire: loadImage("images/feedFire.png"),
    fire: [
      loadImage("images/fire1.png"),
      loadImage("images/fire2.png"),
      loadImage("images/fire3.png"),
      loadImage("images/fire4.png")
    ],
    firepit: loadImage("images/firepit.png"),
    firepitOutlined: loadImage("images/firepitOutlined.png"),
    flag: loadImage("images/flag.png"),
    floodFill: loadImage("images/floodFill.png"),
    grab: loadImage("images/grab.png"),
    grass: loadImage("images/grass.png"),
    grass2: loadImage("images/grass2.png"),
    grassBeach1: loadImage("images/grassBeach1.png"),
    grassBeach2: loadImage("images/grassBeach2.png"),
    grassBeach3: loadImage("images/grassBeach3.png"),
    grassBeach4: loadImage("images/grassBeach4.png"),
    grassBeach5: loadImage("images/grassBeach5.png"),
    grassBeach6: loadImage("images/grassBeach6.png"),
    grassBeach7: loadImage("images/grassBeach7.png"),
    grassBeach8: loadImage("images/grassBeach8.png"),
    grassBeach9: loadImage("images/grassBeach9.png"),
    grassBeach10: loadImage("images/grassBeach10.png"),
    grassBeach11: loadImage("images/grassBeach11.png"),
    grassBeach12: loadImage("images/grassBeach12.png"),
    grassBeachX: loadImage("images/grassBeachX.png"),
    log: loadImage("images/log.png"),
    logs: loadImage("images/logs.png"),
    longGrass: loadImage("images/longGrass.png"),
    longGrass1: loadImage("images/longGrass1.png"),
    longGrass2: loadImage("images/longGrass2.png"),
    longGrass3: loadImage("images/longGrass3.png"),
    mushroom: loadImage("images/mushroom.png"),
    mushrooms: loadImage("images/mushrooms.png"),
    night: loadImage("images/moon.png"),
    palm: loadImage("images/palm.png"),
    pit: loadImage("images/pit.png"),
    players: [ loadImage("images/player10.png"),
               loadImage("images/player11.png")
             ],
    playerIcon: loadImage("images/player10icon.png"),
    playersAnimated: [ loadImage("images/player10animation.png"),
                       loadImage("images/player11animation.png")
             ],
    rabbit: loadImage("images/rabbit.png"),
    rabbitLive: loadImage("images/rabbitLive.png"),
    rabbitDead: loadImage("images/rabbitDead.png"),
    rabbitStew: loadImage("images/veggyStew.png"),
    raft: [ loadImage("images/raft0.png"),
            loadImage("images/raft1.png"),
          ],
    random: loadImage("images/random.png"),
    river1: loadImage("images/grassRiver1.png"),
    river2: loadImage("images/grassRiver2.png"),
    river3: loadImage("images/grassRiver3.png"),
    river4: loadImage("images/grassRiver4.png"),
    river5: loadImage("images/grassRiver5.png"),
    river6: loadImage("images/grassRiver6.png"),
    river7: loadImage("images/beachRiver1.png"),
    river8: loadImage("images/beachRiver2.png"),
    river9: loadImage("images/beachRiver3.png"),
    river10: loadImage("images/beachRiver4.png"),
    river11: loadImage("images/beachRiver5.png"),
    river12: loadImage("images/beachRiver6.png"),
    river13: loadImage("images/rockRiver1.png"),
    river14: loadImage("images/rockRiver2.png"),
    river15: loadImage("images/rockRiver3.png"),
    river16: loadImage("images/rockRiver4.png"),
    river17: loadImage("images/rockRiver5.png"),
    river18: loadImage("images/rockRiver6.png"),
    river19: loadImage("images/rockRiver7.png"),
    river20: loadImage("images/rockRiver8.png"),
    river21: loadImage("images/rockRiver9.png"),
    river22: loadImage("images/rockRiver10.png"),
    riverX: loadImage("images/grassRiverX.png"),
    rock1: loadImage("images/rock1.png"),
    rock2: loadImage("images/rock2.png"),
    rock3: loadImage("images/rock3.png"),
    rock4: loadImage("images/rock4.png"),
    rocks: loadImage("images/rocks.png"),
    rockEdge1: loadImage("images/rockEdge1.png"),
    rockEdge2: loadImage("images/rockEdge2.png"),
    rockEdge3: loadImage("images/rockEdge3.png"),
    rockEdge4: loadImage("images/rockEdge4.png"),
    rockEdge5: loadImage("images/rockEdge5.png"),
    rockEdge6: loadImage("images/rockEdge6.png"),
    rockEdge7: loadImage("images/rockEdge7.png"),
    rockEdge8: loadImage("images/rockEdge8.png"),
    rockEdge9: loadImage("images/rockEdge9.png"),
    rockEdge10: loadImage("images/rockEdge10.png"),
    rockEdge11: loadImage("images/rockEdge11.png"),
    rockEdge12: loadImage("images/rockEdge12.png"),
    rockEdgeX: loadImage("images/rockX.png"),
    rockMiddle: loadImage("images/rockEdge13.png"),
    sand: loadImage("images/sand.png"),
    sandpit: loadImage("images/sandpit.png"),
    sleeping: loadImage("images/sleeping.png"),
    snake: loadImage("images/snake.png"),
    star: loadImage("images/star.png"),
    steppingStones: loadImage("images/steppingStones.png"),
    stick: loadImage("images/stick.png"),
    sticks: loadImage("images/sticks.png"),
    stoneAx: loadImage("images/stoneAx.png"),
    stump: loadImage("images/stump.png"),
    timeOfDay: loadImage("images/timeOfDay.png"),
    tree: loadImage("images/tree.png"),
    treeThin: loadImage("images/tree-thin.png"),
    veggies: loadImage("images/veggies.png"),
    veggies1: loadImage("images/veggies1.png"),
    veggies2: loadImage("images/veggies2.png"),
    veggies3: loadImage("images/veggies3.png"),
    veggies4: loadImage("images/veggies4.png"),
    water: loadImage("images/water.png"),
    z: loadImage("images/z's.png")
  })

  document.getElementById("p5_loading").innerHTML = "Loading Sounds ..."
  sounds.initialize()
  tiles.construction.steppingStones = tiles.steppingStones
  tiles.arrows = tiles.arrow
  tiles.bones = tiles.bone
  tiles.clays = tiles.clay
  tiles.rock = tiles.rock1

  //load the worlds:
  for (let i = 0; i<8; i++){
    $.getJSON(`worlds/${i}.json`, function(data){
      gameBoards[i] = data
    })
  }
  //console.timeLog("load", "preload finished")
}

window.setup = function() {
  //console.timeLog("load", "setup started")
  let cvs = createCanvas(window.innerWidth, window.innerHeight)
  cvs.parent("board")
  $("#board").css("top", world.topOffset).css("left", world.leftOffset)
  strokeJoin(ROUND)
  noLoop()
  game.mode = "welcome"
  frameRate(world.frameRate)
  // console.timeLog("load", "setup finished")
  // console.timeEnd("load")
  if (!Vue.config.devtools){
    fetch(' https://api.counterapi.dev/v2/andys-games/wemo/up')
      .then(response => response.json())
      .then(result => {
        game.viewCount = result.data.up_count
      })
      .catch(error => console.error('Error:', error));
  }
}

window.draw = function() {
  background('green')
  if (game.started){
    board.display()
    if (game.mode === "play")
      playLoop()
    else if (game.mode === "build")
      builder.loop()
    else if (game.mode === "starEdit"){
      stroke("red")
      strokeWeight(3)
      noFill()
      rect(starEditor.selected.x*25,starEditor.selected.y*25,25,25)
    }
  }
}

function playLoop() {
  timer.update()
  game.checkActive()
  viewport.update(false)
  man.update()
  board.showNight()
  topbar.display()
  msgs.display()
  if ((man.energy <= 0 || man.health <= 0) && !man.isAnimated)
    popup.gameOver()
}

// p5.js event callbacks
window.keyPressed = keyPressed
window.mousePressed = mousePressed
window.mouseDragged = mouseDragged
window.mouseReleased = mouseReleased
window.windowResized = windowResized
window.touchStarted = touchStarted

// Globals needed by .vue files (httpVueLoader can't use ES imports)
window.popup = popup
window.game = game
window.helpers = helpers
window.sounds = sounds
window.tutorial = tutorial
window.editor = editor
window.starEditor = starEditor
window.viewport = viewport
window.builder = builder
window.gameBoards = gameBoards
window.world = world
window.dumpable = dumpable
window.grabable = grabable
window.Board = Board
window.keyHandler = keyHandler
if (Vue.config.devtools) {
  window.test = test
}

// Prevent right-click context menu on game board
$("#board").contextmenu(function(e) {
    e.preventDefault();
    e.stopPropagation();
});
