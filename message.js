let bootstrapColors = {
  primary: "#007bff",
  secondary: "#868e96",
  success: "#28a745",
  info: "#17a2b8",
  warning: "#ffc107",
  danger: "#dc3545",
  light: "#f8f9fa",
  dark: "#343a40"
}

let message = {
  following: {msg: 'Testing', frames: 0, size: 20},
  fixed: {on: false, msg: 'Testing', countDown: false, frames: 0, size: 30},
  color: bootstrapColors.danger,
  fontColor: bootstrapColors.light,

  display(){
    if (board.wemoMins%1440 >= 1260 && board.wemoMins%1440 <= 1300){
      this.showFixed("Night is Coming!!", 45)
    }
    else if (this.fixed.on){
      if (this.fixed.countDown)
        this.fixed.frames--
      if (this.fixed.frames === 0){
        this.fixed.on = false
        this.fixed.countDown = false
      }
      this.showFixed(this.fixed.msg, this.fixed.size)
    }
    else if (game.infoShown)
      this.showInfo()

    if (this.following.frames > 0){
      this.following.frames--
      this.showFollowing()
    }

  },

  reset(){
    this.following = {msg: 'Testing', frames: 0, size: 20}
    this.fixed = {on: false, msg: 'Testing', countDown: false, frames: 0, size: 30}
  },

  showFixed(msg, size){
    textSize(size)
    let w = textWidth(msg)+10
    let h = size+10
    let x = viewport.left+floor(viewport.width/2)
    let y = viewport.bottom-100
    rectMode(CENTER)
    fill(255,255,255,180)
    noStroke()
    rect(x,y,w,h, 15)
    fill(0)
    textAlign(CENTER,CENTER)
    text(msg, x,y)
    rectMode(CORNER)
  },

  showFollowing(){
    textSize(this.following.size)
    let w = textWidth(this.following.msg)+22
    let h = this.following.size+10
    let x = (active.x*25)
    let y = (active.y*25)+topbarHeight
    let fy = y+35+h > viewport.bottom
    let fx = x+w-20 > viewport.right
    noStroke()
    fill(this.color)
    if (fy)
      triangle(x+13,   y,  x+21, y-10, x+5, y-10)
    else
      triangle(x+13, y+25, x+21, y+35, x+5, y+35)

    let rx = fx ? x-w+35 : x-10
    let ry = fy ? y-(10+h) : y+35
    rect(rx,ry,w,h,15)
    fill(this.fontColor)
    textAlign(LEFT,TOP)
    text(this.following.msg,rx+11,ry+3)
  },

  showInfo(){
    let msg = "man dist: "+man.stepCount+" cells left to explore: "+board.revealCount+
        " walking cost: "+(Math.round(backpack.walkingCost()*100)/100)+" frame Rate: "+Math.floor(frameRate())+" mils: "+(Date.now()-world.frameTime)
    this.showFixed(msg, 18)
  }
}