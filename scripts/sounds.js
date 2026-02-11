let sounds = {
  odd: true,
  files: {},

  initialize(){
    let music = new Audio("sounds/music3.mp3")
    music.addEventListener('loadedmetadata', () => {
      const t = Math.random() * music.duration
      music.currentTime = t
      music.loop = true
    });

    // let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    // let gainNode = audioCtx.createGain()
    // gainNode.gain.value = 0.6
    // let source = audioCtx.createMediaElementSource(music)
    // source.connect(gainNode);
    // gainNode.connect(audioCtx.destination);

    // this.setMusicVolume = function(v) {
    //   gainNode.gain.value = v
    // }
    
    this.files = {
    chop: new Audio("sounds/chop.mp3"),
    dig: new Audio("sounds/dig.mp3"),
    eat: new Audio("sounds/eat.mp3"),
    lose: new Audio("sounds/lose.mp3"),
    music: music,
    sleep: new Audio("sounds/sleeping.mp3"),
    vomit: new Audio("sounds/vomit.mp3"),
    water: new Audio("sounds/water.wav"),
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