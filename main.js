const topbarHeight = 55
const dumpable = ["beach", "sand", "grass", "stump", "beachEdge", "grassBeach", "dock", "rockMiddle"]
const grabable = ["log", "stick", "rock", "longGrass", "clay", "bone", "logpile", "stickpile", "rockpile", "claypile", "bonepile", "veggies"]
const sleepable = ["beach", "sand", "grass", "beachEdge", "grassBeach", "dock", "longGrass", "rockMiddle", "campsite"]
const buildable = ["sand", "grass", "beachEdge", "stump", "longGrass", "rockMiddle", "firepit"]
const fordable = ["river5","river6","river7","river8","river9","river10","river11","river12","river17","river18"]
const seeThru = ["log", "randomLog", "bone", "steppingStones", "randomRock", "randomStick", "stick", "snake", "cactus"]
const nonWalkable = ["water", "river", "rockEdge", "firepit", "pit", "sandpit", "campsite", "rockpile"]

function preload(){
  tiles = {
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
    beachEdge1: loadImage("images/beachEdge1.png"),
    beachEdge2: loadImage("images/beachEdge2.png"),
    beachEdge3: loadImage("images/beachEdge3.png"),
    beachEdge4: loadImage("images/beachEdge4.png"),
    berries: loadImage("images/berries.png"),
    berryTree: loadImage("images/berryTree.png"),
    bone: loadImage("images/bone.png"),
    bomb: loadImage("images/bomb1.png"),
    bones: loadImage("images/bone.png"),
    boneShovel: loadImage("images/boneShovel.png"),
    cactus: loadImage("images/cactus.png"),
    campsite: loadImage("images/campsite.png"),
    clouds: loadImage("images/clouds.png"),
    cloudsHalf: loadImage("images/cloudsHalf.png"),
    cross: loadImage("images/cross.png"),
    day: loadImage("images/sun.png"),
    dawn: loadImage("images/dawn.png"),
    dock1: loadImage("images/dock1.png"),
    dock2: loadImage("images/dock2.png"),
    dock3: loadImage("images/dock3.png"),
    dock4: loadImage("images/dock4.png"),
    dock5: loadImage("images/dock5.png"),
    dock6: loadImage("images/dock6.png"),
    dusk: loadImage("images/dusk.png"),
    canoe: [ loadImage("images/canoe0.png"),
             loadImage("images/canoe1.png")
           ],
    clay: loadImage("images/clay.png"),
    clay1: loadImage("images/clay1.png"),
    clay2: loadImage("images/clay2.png"),
    clay3: loadImage("images/clay3.png"),
    clay4: loadImage("images/clay4.png"),
    clay5: loadImage("images/clay5.png"),
    claypot: loadImage("images/claypot.png"),
    claypot_water: loadImage("images/claypot_water.png"),
    construction: {
      raft: loadImage("images/raftHB.png"),
      campsite: loadImage("images/campsiteHB.png")
    },
    explosion: loadImage("images/explosion.png"),
    fire: [
      loadImage("images/fire1.png"),
      loadImage("images/fire2.png"),
      loadImage("images/fire3.png"),
      loadImage("images/fire4.png")
    ],
    firepit: loadImage("images/firepit.png"),
    firepitOutlined: loadImage("images/firepitOutlined.png"),
    grass: loadImage("images/grass.png"),
    log: loadImage("images/log.png"),
    logs: loadImage("images/logs.png"),
    longGrass: loadImage("images/longGrass.png"),
    longGrass1: loadImage("images/longGrass1.png"),
    longGrass2: loadImage("images/longGrass2.png"),
    longGrass3: loadImage("images/longGrass3.png"),
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
    night: loadImage("images/moon.png"),
    palm: loadImage("images/palm.png"),
    pit: loadImage("images/pit.png"),
    players: [ loadImage("images/player10.png"),
               loadImage("images/player11.png")
             ],
    playersAnimated: [ loadImage("images/player10animation.png"),
                       loadImage("images/player11animation.png")
             ],
    raft: [ loadImage("images/raft0.png"),
            loadImage("images/raft1.png"),
          ],
    rabbit: loadImage("images/rabbit.png"),
    rabbitLive: loadImage("images/rabbitLive.png"),
    rabbitDead: loadImage("images/rabbitDead.png"),
    random: loadImage("images/random.png"),
    randomBerries: loadImage("images/randomBerries.png"),
    randomGrass: loadImage("images/randomGrass.png"),
    randomLog: loadImage("images/randomLog.png"),
    randomPit: loadImage("images/randomPit.png"),
    randomRock: loadImage("images/randomRock.png"),
    randomStick: loadImage("images/randomStick.png"),
    randomTree: loadImage("images/randomTree.png"),
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
    rock1: loadImage("images/rock1.png"),
    rock2: loadImage("images/rock2.png"),
    rock3: loadImage("images/rock3.png"),
    rock4: loadImage("images/rock4.png"),
    rock: loadImage("images/rock1.png"),
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
    rockMiddle: loadImage("images/rockEdge13.png"),
    sand: loadImage("images/sand.png"),
    sandpit: loadImage("images/sandpit.png"),
    sleeping: loadImage("images/sleeping.png"),
    snake: loadImage("images/snake.png"),
    steppingStones: loadImage("images/steppingStones.png"),
    stick: loadImage("images/stick.png"),
    sticks: loadImage("images/sticks.png"),
    stoneAx: loadImage("images/stoneAx.png"),
    stump: loadImage("images/stump.png"),
    tent: loadImage("images/tent.png"),
    timeOfDay: loadImage("images/timeOfDay.png"),
    tree: loadImage("images/tree.png"),
    treeThin: loadImage("images/tree-thin.png"),
    treeShore1: loadImage("images/treeShore1.png"),
    treeShore2: loadImage("images/treeShore2.png"),
    treeShore3: loadImage("images/treeShore3.png"),
    treeShore4: loadImage("images/treeShore4.png"),
    treeShore5: loadImage("images/treeShore5.png"),
    treeShore6: loadImage("images/treeShore6.png"),
    treeShore7: loadImage("images/treeShore7.png"),
    treeShore8: loadImage("images/treeShore8.png"),
    treeShore9: loadImage("images/treeShore9.png"),
    treeShore10: loadImage("images/treeShore10.png"),
    treeShore11: loadImage("images/treeShore11.png"),
    treeShore12: loadImage("images/treeShore12.png"),
    veggies: loadImage("images/veggies.png"),
    veggies1: loadImage("images/veggies1.png"),
    veggies2: loadImage("images/veggies2.png"),
    veggies3: loadImage("images/veggies3.png"),
    veggies4: loadImage("images/veggies4.png"),
    veggyStew: loadImage("images/veggyStew.png"),
    water: loadImage("images/water.png"),
    wigwam: loadImage("images/wigwam.png"),
    z: loadImage("images/z's.png")
  }

  sounds.files = {
    //chop: new Audio("sounds/chop.mp3"),
    eat: new Audio("sounds/eat.mp3"),
    //dig: new Audio("sounds/dig.mp3"),
    //dump: new Audio("sounds/dump.mp3"),
    //fling: new Audio("sounds/fling.mp3"),
    //grab: new Audio("sounds/grab.mp3"),
    pit: new Audio("sounds/pitShort.mp3"),
    //water: new Audio("sounds/water.wav"),
    walk1: new Audio("sounds/walk1.mp3"),
    walk2: new Audio("sounds/walk2.mp3")
  }

  tiles.construction.steppingStones = tiles.steppingStones
  tiles.clays = tiles.clay
}

function setup(){
  let cvs = createCanvas(window.innerWidth, window.innerHeight)
  cvs.parent("board")
  $("#board").css("top", world.topOffset).css("left", world.leftOffset)
  strokeJoin(ROUND)
  noLoop()
  game.mode = "welcome"
  console.log("loaded in", Date.now()-world.frameTime)
}

function draw(){
  world.frameTime = Date.now()
  background('green')
  if (game.started){
    board.display()
    if (game.mode === "play")
      playLoop()
    else if (game.mode === "build")
      builder.loop()
  }
}

function playLoop(){
  timer.update()
  game.checkActive()
  // move board:
  viewport.update(false)
  //display:
  vehicles.display()
  man.update()
  board.showNight()
  topbar.display()
  msgs.display()
  if ((man.energy <= 0 || man.health <= 0) && !man.isAnimated)
    popup.gameOver()
}


$("#board").contextmenu(function(e) {
    e.preventDefault();
    e.stopPropagation();
});

// window.onblur = function(){
//   console.log("blur")
//   if (game.mode === "play")
//     popup.outOfFocus()
// }

// window.onfocus = function(){
//   console.log("focus")
//   if (popup.type === "outOfFocus"){
//     if (game.paused)
//       popup.type = "gamePaused"
//     else
//       popup.close()
//   }
// }
