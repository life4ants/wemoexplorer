let viewport = {
  boardLeft: $("#board").position().left,
  boardTop: $("#board").position().top,
  top: world.topOffset,
  left: world.leftOffset,
  bottom: window.innerHeight-world.topOffset,
  right: window.innerWidth-world.leftOffset,
  width: this.right,

  update(center){
    let position
    if (game.autoCenter || center)
      position = this.centerOn(active, center)
    else
      position = this.follow(active)
    if (position || center)
      this.position()
  },

  position(){
    this.boardLeft = $("#board").position().left
    this.boardTop = $("#board").position().top
    let boardLeft = $("#board").position().left-world.leftOffset
    let boardTop = $("#board").position().top-world.topOffset
    this.left = boardLeft < 0 ? abs(boardLeft) : 0
    this.top = boardTop < 0 ? abs(boardTop) : 0
    this.right = window.innerWidth < width+world.leftOffset ? this.left+window.innerWidth-world.leftOffset : this.left+width
    this.bottom = window.innerHeight < height ? this.top+window.innerHeight-world.topOffset : this.top+height
    this.width = this.right-this.left
  },

  follow(object) {
    let newLeft, newTop

    if (window.innerWidth < width+world.leftOffset){ //board is wider than screen
      newLeft = this.checkEdge(this.boardLeft, (object.x*25) + this.boardLeft, 
                              world.leftOffset, window.innerWidth, width)
    }
    if (window.innerHeight < height+world.topOffset){//board is taller than screen
      newTop = this.checkEdge(this.boardTop,
        object.y*25+topbarHeight - (topbarHeight - this.boardTop), 
        0, window.innerHeight, height)
    }

    if (newTop === this.boardTop && newLeft === this.boardLeft)
      return false
    $("#board").css("top", newTop).css("left", newLeft)
    return true
  },

  checkEdge(boardLeft, manPos, leftEdge, rightEdge, width){
    if (manPos < leftEdge)
      return boardLeft+20
    if (manPos < leftEdge+100)
      return boardLeft+10 > leftEdge ? leftEdge : boardLeft+10
    if (manPos > rightEdge)
      return boardLeft-20
    if (manPos > rightEdge-125)
      return boardLeft-10 < rightEdge-width ? rightEdge-width : boardLeft-10
    return boardLeft
  },

  centerOn(object, fly) {
    // center in the x direction:
    let left = Math.floor((window.innerWidth+world.leftOffset)/2)
    let newLeft = left-object.x*25+13 // the left value to set #board in order to center the man in the viewport
    let maxLeft = world.leftOffset
    let minLeft = window.innerWidth - width
    newLeft = width < window.innerWidth-world.leftOffset ? Math.floor((window.innerWidth-world.leftOffset-width)/2)+world.leftOffset :
                fly ? constrain(newLeft, minLeft, maxLeft) :
                  constrain(helpers.smoothChange(this.boardLeft, newLeft), minLeft, maxLeft)
    // center in the y direction:
    let top = Math.floor((window.innerHeight+world.topOffset)/2)
    let newTop = top-object.y*25+13-topbarHeight
    let maxTop = world.topOffset
    let minTop = window.innerHeight - height
    newTop = height < window.innerHeight ? Math.floor((window.innerHeight - height)/2) :
                fly ? constrain(newTop, minTop, maxTop) :
                  constrain(helpers.smoothChange(this.boardTop, newTop), minTop, maxTop)
    if (newTop === this.boardTop && newLeft === this.boardLeft)
      return false
    $("#board").css("top", newTop).css("left", newLeft)
    return true
  },

  screenEdges(){
    if (game.mode === "edit"){
      let l = window.pageXOffset
      let t = window.pageYOffset
      let r = l + window.innerWidth - world.leftOffset
      let b = t + window.innerHeight
      return {top: floor(t/25), 
              left: floor(l/25), 
              bottom: min(floor(b/25), board.rows), 
              right: min(floor(r/25), board.cols) }
    }
    else {
      return { top: floor(this.top/25),
              left: floor(this.left/25),
              right: min(floor(this.right/25)+1, board.cols),
              bottom: min(floor((this.bottom-topbarHeight)/25)+1, board.rows) }
    }
  },

  onScreen(x,y){
    let e = this.screenEdges()
    return (x >= e.left && x < e.right && y >= e.top && y < e.bottom)
  }
}
