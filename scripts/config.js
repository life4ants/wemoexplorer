export const topbarHeight = 55
export const version = 10902 // update this with each version publication
export const dumpable = ["beach", "sand", "grass", "stump", "beachEdge", "grassBeach", "dock", "rockMiddle", "blank"]
export const grabable = ["log", "stick", "rock", "longGrass", "clay", "bone", "logpile", "stickpile", "rockpile", "claypile", "bonepile", "arrowpile", "longGrasspile", "mushroom"]
export const sleepable = ["beach", "sand", "grass", "beachEdge", "grassBeach", "dock", "longGrass", "rockMiddle", "campsite", "root"]
export const buildable = ["sand", "grass", "beachEdge", "stump", "longGrass", "rockMiddle", "firepit", "root"]
export const fordable = ["river5","river6","river7","river8","river9","river10","river11","river12","river17","river18"]
export const seeThru = ["log", "bone", "steppingStones", "stick", "cactus", "berryBush", "star", "mushroom", "boulder", "palm", "flag"]
export const stackable = //tiles boulders are allowed on, and see thru types can be put on in editor
  ["water", "beach", "sand", "grass", "beachEdge", "grassBeach", "dock", "rockMiddle", "sandpit", "river", "root", "stump", "blank"]
export const nonWalkable = ["water", "river", "rockEdge", "firepit", "pit", "sandpit", "campsite", "construction"]
export const options = {
  build: [
    {name: "firepit", src: "images/firepitIcon.png", title: "Firepit", level: 0,
        time: 15, energy: 200,
        resources: "none",
        dist: "A bonfire to spend the night next to",
        inst: "Go to the spot where you want to build a firepit, then click build." },

    {name: "stoneAx", src: "images/stoneAx.png", title: "Stone Ax", level: 0,
        time: 15, energy: 100,
        resources: "1 stick, 1 long grass, 1 rock",
        dist: "A primitive ax for chopping trees and other things",
        inst: "Gather the needed resources in your backpack, then click build."},

    {name: "basket", src: "images/basket.png", title: "Basket", level: 1,
        time: 20, energy: 50,
        resources: "6 long grass",
        dist: "For gathering berries and veggies in",
        inst: "Gather 6 long grass in your backpack, then click build."},

    {name: "raft", src: "images/raft0.png", title: "Raft", level: 1,
        time: 0, energy: 400,
        resources: "8 logs, 8 long grass",
        dist: "For exploring water",
        inst: "Click build to select a location."},

    {name: "steppingStones", src: "images/steppingStonesIcon.png", title: "Stepping Stones", level: 2,
        time: 0, energy: 150,
        resources: "3 rocks",
        dist: "For crossing rivers",
        inst: "Click build to select a location."},

    {name: "boneShovel", src: "images/boneShovel.png", title: "Bone Shovel", level: 2,
        time: 20, energy: 120,
        resources: "1 stick, 1 long grass, 1 bone",
        dist: "A primitive shovel for digging clay",
        inst: "Gather the needed resources in your backpack, then click build."},

    {name: "campsite", src: "images/campsite.png", title: "Campsite", level: 2,
        time: 0, energy: 500,
        resources: "5 logs, 10 sticks, 5 clay, 20 long grass",
        dist: "A place to store tools, cook meals, and more!",
        inst: "Click build to select a location."},

    {name: "bow", src: "images/bow.png", title: "Bow", level: 3,
        time: 30, energy: 80,
        resources: "1 stick, 2 long grass",
        dist: "For hunting",
        inst: "Gather the needed resources in your backpack, then click build."},

    {name: "arrows", src: "images/arrow.png", title: "Arrows", level: 3,
        time: 25, energy: 200,
        resources: "2 sticks, 4 long grass, 2 rocks",
        dist: "Flint head arrows for hunting",
        inst: "Makes 5 arrows. Gather the needed resources in your backpack, then click build. Must have an Ax with you."},

    {name: "claypot", src: "images/claypot.png", title: "Clay Pot", level: 3,
        time: 120, energy: 150,
        resources: "2 clay",
        dist: "For cooking food and carrying water",
        inst: "Gather the clay in your backpack, go to a campsite, feed the fire enough to last 2 hours, then click build."},

    {name: "bomb", src: "images/bomb1.png", title: "Bomb", level: 4,
        time: 5, energy: 400,
        resources: "none",
        dist: "For clearing away clouds",
        inst: "Click build, then select how many bombs you want added to your backpack."}
  ],
  cook: [
    {name: "rabbitStew", src: "images/veggyStew.png", title: "Rabbit Stew", active: true,
        time: 40, benefits: "800 health, 400 energy", servings: 8,
        resources: "4 units water, 8 veggies, 1 dead rabbit",
        dist: "Nutritious Rabbit Stew",
        inst: `Gather the water in a Clay Pot and put it in your campsite. Gather the veggies in a Basket. Have the rabbit in your backpack.
          Feed the fire to last 40 minutes, then click cook.` }
  ],
  resources: [ //used by popup.dumpMenu
    {name: "arrow", src: "images/arrow.png"},
    {name: "bomb", src: "images/bomb.png"},
    {name: "bone", src: "images/bone.png"},
    {name: "clay", src: "images/clay.png"},
    {name: "log", src: "images/logs.png"},
    {name: "longGrass", src: "images/longGrass.png"},
    {name: "mushroom", src: "images/mushrooms.png"},
    {name: "rabbitDead", src: "images/rabbitDead.png"},
    {name: "rabbitLive", src: "images/rabbitLive.png"},
    {name: "rock", src: "images/rocks.png"},
    {name: "stick", src: "images/sticks.png"},
  ]
}
