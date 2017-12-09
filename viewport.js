let viewport = {
  boardLeft: $("#board").position().left,
  boardTop: $("#board").position().top,
  top: topOffset,
  left: leftOffset,
  bottom: window.innerHeight-topOffset,
  right: window.innerWidth-leftOffset,
  width: this.right,

  update(center){
    let position
    if (game.autoCenter || center)
      position = this.centerOn(active, center)
    else
      position = this.follow(active)
    if (position)
      this.position()
  },

  position(){
    this.boardLeft = $("#board").position().left
    this.boardTop = $("#board").position().top
    let boardLeft = $("#board").position().left-leftOffset
    let boardTop = $("#board").position().top-topOffset
    this.left = boardLeft < 0 ? abs(boardLeft) : 0
    this.top = boardTop < 0 ? abs(boardTop) : 0
    this.right = window.innerWidth < worldWidth+leftOffset ? this.left+window.innerWidth-leftOffset : this.left+worldWidth
    this.bottom = window.innerHeight < worldHeight ? this.top+window.innerHeight-topOffset : this.top+worldHeight
    this.width = this.right-this.left
  },

  follow(object) {
    let newLeft = this.boardLeft
    let newTop = this.boardTop
    let step = 10

    if (window.innerWidth < worldWidth+leftOffset){
      if ((object.x*25) + this.boardLeft < 100 + leftOffset) // left
        newLeft = this.boardLeft+step > leftOffset ? leftOffset : this.boardLeft+step
      else if ((object.x*25) + this.boardLeft > window.innerWidth - 125) //right
        newLeft = this.boardLeft-step < window.innerWidth - worldWidth ? window.innerWidth - worldWidth : this.boardLeft-step
    }
    if (window.innerHeight < worldHeight+topOffset){
      if (object.y*25+topbarHeight - (topbarHeight - this.boardTop) < 100) //top
        newTop = this.boardTop+step > topOffset ? topOffset : this.boardTop+step
      else if ((object.y*25+topbarHeight) + this.boardTop > window.innerHeight - 125) //bottom
        newTop = this.boardTop-step < window.innerHeight - worldHeight ? window.innerHeight - worldHeight : this.boardTop-step
    }

    if (newTop === this.boardTop && newLeft === this.boardLeft)
      return false
    $("#board").css("top", newTop).css("left", newLeft)
    return true
  },

  centerOn(object, fly) {
    // center in the x direction:
    let left = Math.floor((window.innerWidth+leftOffset)/2)
    let newLeft = left-object.x*25+13 // the left value to set #board in order to center the man in the viewport
    let maxLeft = leftOffset
    let minLeft = window.innerWidth - worldWidth
    newLeft = worldWidth < window.innerWidth-leftOffset ? Math.floor((window.innerWidth-leftOffset-worldWidth)/2)+leftOffset :
                fly ? constrain(newLeft, minLeft, maxLeft) :
                  constrain(helpers.smoothChange(this.boardLeft, newLeft), minLeft, maxLeft)
    // center in the y direction:
    let top = Math.floor((window.innerHeight+topOffset)/2)
    let newTop = top-object.y*25+13-topbarHeight
    let maxTop = topOffset
    let minTop = window.innerHeight - worldHeight
    newTop = worldHeight < window.innerHeight ? Math.floor((window.innerHeight - worldHeight)/2) :
                fly ? constrain(newTop, minTop, maxTop) :
                  constrain(helpers.smoothChange(this.boardTop, newTop), minTop, maxTop)
    if (newTop === this.boardTop && newLeft === this.boardLeft)
      return false
    $("#board").css("top", newTop).css("left", newLeft)
    return true
  }
}