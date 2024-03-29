let sounds = {
  odd: true,
  files: {},

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
    else {
      if (this.files[file].currentTime != 0)
        this.files[file].currentTime = 0
      this.files[file].play()
    }
  }
}