export let sounds = {
  odd: true,
  files: {},
  musicVolume: 0.4,
  musicOn: false,

  initialize(){
    const music = new Audio("sounds/music3.mp3")
    music.crossOrigin = 'anonymous'
    music.loop = true
    music.addEventListener('loadedmetadata', () => {
      music.currentTime = Math.random() * music.duration
    });

    let audioCtx = null
    let gainNode = null

    const ensureAudioContext = () => {
      if (audioCtx) return
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const source = audioCtx.createMediaElementSource(music)
      gainNode = audioCtx.createGain()
      source.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      gainNode.gain.value = this.musicVolume
    }


    this.setMusic = function(on) {
      ensureAudioContext()
      if (audioCtx.state === 'suspended') audioCtx.resume()
      if (on) {
        music.play()
      } else {
        music.pause()
      }
      this.musicOn = on
    }

    this.setMusicVolume = function(v) {
      this.musicVolume = v
      if (gainNode) gainNode.gain.value = this.musicVolume
    }
   
    
    this.files = {
    chop: new Audio("sounds/chop.mp3"),
    dig: new Audio("sounds/dig.mp3"),
    eat: new Audio("sounds/eat.mp3"),
    fling: new Audio("sounds/grab.mp3"),
    lose: new Audio("sounds/lose.mp3"),
    sleep: new Audio("sounds/sleeping.mp3"),
    pit: new Audio("sounds/pitShort.mp3"),
    vomit: new Audio("sounds/vomit.mp3"),
    walk1: new Audio("sounds/walk1.mp3"),
    walk2: new Audio("sounds/walk2.mp3"),
    win: new Audio("sounds/win.mp3")
  }
    this.files.sleep.loop = true
    this.files.sleep.volume = 0.3
    this.files.win.volume = 0.4
    this.files.eat.volume = 0.4
  },

  play(file){ 
    if ("walk" === file){
      let num1 = this.odd ? 1 : 2
      let num2 = this.odd ? 2 : 1
      if (this.files[file+num1].currentTime != 0){
        this.files[file+num1].pause()
        this.files[file+num1].currentTime = 0
      }
      this.files[file+num2].play()
      this.odd = !this.odd
    }
    else if (['win', 'lose'].includes(file)){
      this.files.music.pause()
      this.files[file].play()
    }
    else {
      if (this.files[file].currentTime != 0)
        this.files[file].currentTime = 0
      this.files[file].play()
    }
  }
}