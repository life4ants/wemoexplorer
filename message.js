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

class Message {
  constructor(object){
    this.type = object.type
    this.fontSize = object.fontSize
    this.color = object.color
    this.fontColor = object.fontColor || 0
    this.data = object.data // a place to put some data that update() might need
    this.update = object.update //a function that sets the position (this.pos with x, y, w, h), and message (this.msg)
    this.isShown = object.isShown // a function to decide whether to show the message or not
  }

  display(){
    if (this.isShown()){
      textSize(this.fontSize)
      fill(this.color)
      noStroke()
      this.update()
      let x = this.pos.x
      let y = this.pos.y
      let w = this.pos.w
      let h = this.pos.h
      if (["square", "square-center"].includes(this.type)){
        x = this.type === "square-center" ? x-floor((w+10)/2) : x
        rect(x,y,w+10,h, 15)
        fill(this.fontColor)
        textAlign(CENTER,CENTER)
        text(this.msg,x+5,y,w,h)
      }
      else if (this.type === "triangle"){
        let fy = y+35+h > viewport.bottom
        let fx = x+w-20 > viewport.right
        if (fy)
          triangle(x+13,   y,  x+21, y-10, x+5, y-10)
        else
          triangle(x+13, y+25, x+21, y+35, x+5, y+35)

        let rx = fx ? x-w+35 : x-10
        let ry = fy ? y-(10+h) : y+35
        rect(rx,ry,w+22,h,15)
        fill(this.fontColor)
        textAlign(LEFT,TOP)
        text(this.msg,rx+11,ry+3,w,h)
      }
    }
  }
}

let messageCreater = {
  info(){
    let inst = {
      type: "square-center", fontSize: 18, color: [255,255,255,180],
      update: function(){
        let msg = "man dist: "+man.stepCount+" | cells left to explore: "+board.revealCount+
          " | walking cost: "+(Math.round(man.walkingCost()*100)/100)+" | stand count: "+man.standCount
        let x = viewport.left+floor(viewport.width/2)
        let y = viewport.bottom-50
        this.pos = {w: 500, h: 46, x, y}
        this.msg = msg
      },
      isShown: function() {return game.infoShown}
    }
    return new Message(inst)
  },
  night(){
    let inst = {
      type: "square-center", fontSize: 45, color: [255,255,255,180],
      update: function(){
        let msg = "Night is Coming!!"
        let x = viewport.left+floor(viewport.width/2)
        let y = viewport.bottom-120
        this.pos = {w: textWidth(msg)+15, h: 55, x, y}
        this.msg = msg
      },
      isShown: function() {return !world.noNight && board.wemoMins%1440 >= 1260 && board.wemoMins%1440 <= 1300}
    }
    return new Message(inst)
  }
}

let msgs = { //object that holds all messages and updates them in draw()
  following: {msg: 'Testing', frames: 0, size: 20},
  color: bootstrapColors.danger,
  fontColor: bootstrapColors.light,
  messages: [messageCreater.info(), messageCreater.night()],

  display(){
    if (this.following.frames > 0){
      this.following.frames--
      this.showFollowing()
    }
    for (let i = 0; i < this.messages.length; i++){
      this.messages[i].display()
    }
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
  }
}
