const topbarHeight = 55
const dumpable = ["beach", "sand", "grass", "stump", "beachEdge", "grassBeach", "dock", "rockMiddle"]
const grabable = ["log", "stick", "rock", "longGrass", "clay", "bone", "logpile", "stickpile", "rockpile", "claypile", "bonepile", "arrowpile"]
const sleepable = ["beach", "sand", "grass", "beachEdge", "grassBeach", "dock", "longGrass", "rockMiddle", "campsite"]
const buildable = ["sand", "grass", "beachEdge", "stump", "longGrass", "rockMiddle", "firepit"]
const fordable = ["river5","river6","river7","river8","river9","river10","river11","river12","river17","river18"]
const seeThru = ["log", "randomLog", "bone", "steppingStones", "randomRock", "randomStick", "stick", "snake", "cactus"]
const nonWalkable = ["water", "river", "rockEdge", "firepit", "pit", "sandpit", "campsite", "construction"]
const options = {
  reset(){
    for (var i = this.build.length - 1; i >= 0; i--) {
      switch (this.build[i].name) {
        case "raft":
          this.build[i].active = !vehicles.raft
          break
        case "bomb":
          this.build[i].active = board.revealCount <= 100
          break
        case "claypot":
        case "bow":
        case "arrows":
          this.build[i].active = board.buildings.length > 0
      }
    }
  },
  build: [
    {name: "firepit", src: "images/firepitIcon.png", title: "Firepit", active: true,
        time: 15, energy: 200,
        resources: "none",
        dist: "A bonfire to spend the night next to",
        inst: "Go to the spot where you want to build a firepit, then click build." },
    {name: "steppingStones", src: "images/steppingStonesIcon.png", title: "Stepping Stones", active: true,
        time: 0, energy: 150,
        resources: "3 rocks",
        dist: "For crossing rivers",
        inst: "Click build to select a location."},
    {name: "stoneAx", src: "images/stoneAx.png", title: "Stone Ax", active: true,
        time: 15, energy: 100,
        resources: "1 stick, 1 long grass, 1 rock",
        dist: "A primitive ax for chopping trees and other things",
        inst: "Gather the needed resources in your backpack, then click build."},
    {name: "boneShovel", src: "images/boneShovel.png", title: "Bone Shovel", active: true,
        time: 20, energy: 120,
        resources: "1 stick, 1 long grass, 1 bone",
        dist: "A primitive shovel for digging clay and ore",
        inst: "Gather the needed resources in your backpack, then click build."},
    {name: "bow", src: "images/bow.png", title: "Bow", active: false,
        time: 45, energy: 80,
        resources: "1 stick, 2 long grass",
        dist: "For hunting",
        inst: "Gather the needed resources in your backpack, then click build."},
    {name: "arrows", src: "images/arrow.png", title: "Arrows", active: false,
        time: 25, energy: 200,
        resources: "2 sticks, 4 long grass, 2 rocks",
        dist: "Flint head arrows for hunting",
        inst: "Makes 5 arrows. Gather the needed resources in your backpack, then click build. Must have an Ax with you."},
    {name: "basket", src: "images/basket.png", title: "Basket", active: true,
        time: 30, energy: 50,
        resources: "6 long grass",
        dist: "For gathering berries and veggies in",
        inst: "Gather 6 long grass in your backpack, then click build."},
    {name: "claypot", src: "images/claypot.png", title: "Clay Pot", active: false,
        time: 60, energy: 150,
        resources: "2 clay",
        dist: "For cooking food and carrying water",
        inst: "Gather the clay in your backpack, go to a campsite, feed the fire enough to last on hour, then click build."},
    {name: "raft", src: "images/raft0.png", title: "Raft", active: true,
        time: 0, energy: 400,
        resources: "8 logs, 8 long grass",
        dist: "For exploring water",
        inst: "Click build to select a location."},
    {name: "campsite", src: "images/campsite.png", title: "Campsite", active: true,
        time: 0, energy: 500,
        resources: "5 logs, 10 sticks, 5 clay, 10 long grass",
        dist: "A place to store tools, cook meals, and more!",
        inst: "Click build to select a location."},
    {name: "bomb", src: "images/bomb1.png", title: "Bomb", active: false,
        time: 5, energy: 300,
        resources: "none",
        dist: "For clearing away clouds",
        inst: "Click build, then select how many bombs you want added to your backpack."}
  ],
  cook: [
    {name: "rabbitStew", src: "images/veggyStew.png", title: "Rabbit Stew", active: true,
        time: 40, benefits: "800 health, 400 energy", servings: 8,
        resources: "4 units water, 8 veggies, 1 dead rabbit",
        dist: "Nutritious Rabbit Stew",
        inst: `Gather the water in a Clay Pot and the veggies in a Basket. Have the rabbit in your backpack. 
          Feed the fire to last 40 minutes.
          Put both containers in your campsite, then click cook.` }
  ],
  resources: [
    {name: "log", src: "images/logs.png"},
    {name: "rock", src: "images/rocks.png"},
    {name: "longGrass", src: "images/longGrass.png"},
    {name: "bone", src: "images/bone.png"},
    {name: "clay", src: "images/clay.png"},
    {name: "stick", src: "images/sticks.png"},
    {name: "arrow", src: "images/arrow.png"},
    {name: "rabbitLive", src: "images/rabbitLive.png"},
    {name: "rabbitDead", src: "images/rabbitDead.png"}
  ],
  tools: [
    {name: "stoneAx", type: "tool", src: "images/stoneAx.png"},
    {name: "bow", type: "tool", src: "images/bow.png"},
    {name: "boneShovel", type: "tool", src: "images/boneShovel.png"},
    {name: "claypot", type: "container", src: "images/claypot.png"},
    {name: "basket", type: "container", src: "images/basket.png"}
  ]
}

function preload(){
  console.log("preload", Date.now()-world.frameTime)
  tiles = {
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
    bone: loadImage("images/bone.png"),
    bomb: loadImage("images/bomb1.png"),
    boneShovel: loadImage("images/boneShovel.png"),
    bow: loadImage("images/bow.png"),
    cactus: loadImage("images/cactus.png"),
    campsite: loadImage("images/campsite.png"),
    clouds: loadImage("images/clouds.png"),
    clouds1: loadImage("images/clouds1.png"),
    clouds2: loadImage("images/clouds2.png"),
    clouds3: loadImage("images/clouds3.png"),
    clouds4: loadImage("images/clouds4.png"),
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
    floodFill: loadImage("images/floodFill.png"),
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
    grassBeachX: loadImage("images/grassBeachX.png"),
    night: loadImage("images/moon.png"),
    palm: loadImage("images/palm.png"),
    pit: loadImage("images/pit.png"),
    players: [ loadImage("images/player10.png"),
               loadImage("images/player11.png")
             ],
    playerIcon: loadImage("images/player10Icon.png"),
    playersAnimated: [ loadImage("images/player10animation.png"),
                       loadImage("images/player11animation.png")
             ],
    raft: [ loadImage("images/raft0.png"),
            loadImage("images/raft1.png"),
          ],
    rabbit: loadImage("images/rabbit.png"),
    rabbitLive: loadImage("images/rabbitLive.png"),
    rabbitDead: loadImage("images/rabbitDead.png"),
    rabbitStew: loadImage("images/veggyStew.png"),
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
    steppingStones: loadImage("images/steppingStones.png"),
    stick: loadImage("images/stick.png"),
    sticks: loadImage("images/sticks.png"),
    stoneAx: loadImage("images/stoneAx.png"),
    stump: loadImage("images/stump.png"),
    tent: loadImage("images/tent.png"),
    timeOfDay: loadImage("images/timeOfDay.png"),
    tree: loadImage("images/tree.png"),
    treeThin: loadImage("images/tree-thin.png"),
    veggies: loadImage("images/veggies.png"),
    veggies1: loadImage("images/veggies1.png"),
    veggies2: loadImage("images/veggies2.png"),
    veggies3: loadImage("images/veggies3.png"),
    veggies4: loadImage("images/veggies4.png"),
    water: loadImage("images/water.png"),
    wigwam: loadImage("images/wigwam.png"),
    z: loadImage("images/z's.png")
  }

  sounds.files = {
    chop: new Audio("sounds/chop.mp3"),
    eat: new Audio("sounds/eat.mp3"),
    dig: new Audio("sounds/dig.mp3"),
    //dump: new Audio("sounds/dump.mp3"),
    //fling: new Audio("sounds/fling.mp3"),
    //grab: new Audio("sounds/grab.mp3"),
    pit: new Audio("sounds/pitShort.mp3"),
    sleep: new Audio("sounds/sleeping.mp3"),
    vomit: new Audio("sounds/vomit.mp3"),
    //water: new Audio("sounds/water.wav"),
    walk1: new Audio("sounds/walk1.mp3"),
    walk2: new Audio("sounds/walk2.mp3")
  }

  sounds.files.sleep.loop = true
  tiles.construction.steppingStones = tiles.steppingStones
  tiles.arrows = tiles.arrow
  tiles.bones = tiles.bone
  tiles.clays = tiles.clay
  tiles.rock = tiles.rock1
}

function setup(){
  let cvs = createCanvas(window.innerWidth, window.innerHeight)
  cvs.parent("board")
  $("#board").css("top", world.topOffset).css("left", world.leftOffset)
  strokeJoin(ROUND)
  noLoop()
  game.mode = "welcome"
  frameRate(world.frameRate)
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
