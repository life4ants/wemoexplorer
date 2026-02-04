let editor = {
  path: [],
  cell1: {},
  tile: "water",
  type: "water",
  tool: "brush",
  undoList: [],
  unSaved: false,

  mousePressed(){
    let x = Math.floor(mouseX/25)
    let y = Math.floor(mouseY/25)
    let id = x+"_"+y
    if (this.tool === "brush"){
      if (this.type === "start"){
        if (board.cells[x][y].type !== "water"){
          board.startX = x
          board.startY = y
          this.unSaved = true
          if (test){console.log(board.cells[x][y])}
        }
      }
      else if (this.type === "pit0"){
        if (board.cells[x][y].type === "pit")
          return
        this.cell1 = {x,y}
        this.setUndo(x,y)
        this.changeTile(x,y, "pit", "pit")
        this.type = "pit1"
      }
      else if (this.type === "pit1"){
        if (board.cells[x][y].type === "pit")
          return
        this.addUndo(x,y)
        this.changeTile(x,y, "pit", "pit")
        let id = board.teleports.length > 0 ? board.teleports[board.teleports.length-1].id+1 : 0
        board.cells[x][y].pair = this.cell1
        board.cells[x][y].id = id
        board.cells[this.cell1.x][this.cell1.y].pair = {x,y}
        board.cells[this.cell1.x][this.cell1.y].id = id
        board.teleports.push({a:this.cell1, b:{x,y}, id:id})
        this.type = "pit0"
        this.cell1 = {}
        
      }
      else {
        this.setUndo(x,y)
        this.path = [id]
        if (this.type === "auto")
          this.changeTile(x,y, "cross", "cross")
        else
          this.changeTile(x,y, this.tile, this.type)
      }
    }
    else if (this.tool === "floodFill"){
      let cell = board.cells[x][y]
      this.floodFill(x, y, cell.tile, cell.type, this.tile, this.type)
    }
  },

  mouseDragged(){
    let x = Math.floor(mouseX/25)
    let y = Math.floor(mouseY/25)
    let id = x+"_"+y
    if (["start", "pit0", "pit1", "star"].includes(this.type))
      return
    if (!this.path.includes(id)){
      this.path.push(id)
      this.addUndo(x,y)
      if (this.type === "auto")
        this.changeTile(x,y, "cross", "cross")
      else
        this.changeTile(x,y, this.tile, this.type)
    }
  },

  mouseReleased(){
    if (this.type === "auto")
      this.parsePath(this.tile)
    else
      this.path = []
  },

  showMouse(){
    if (this.tool === "brush"){
      image(tiles[this.type === "auto" ? this.tile + "X" : this.tile], mouseX-12, mouseY-12, 24,24)
      stroke(0)
      strokeWeight(1)
      noFill()
      rect(mouseX,mouseY, 25, 25)
    }
    else
      image(tiles[this.tool], mouseX-13, mouseY-13, 26,26)
  },

  changeTile(x,y, tile, type){
    this.unSaved = true
    if (board.cells[x][y].type === "pit" && board.cells[x][y].pair){
      let a = board.cells[x][y].pair.x
      let b = board.cells[x][y].pair.y
      board.cells[a][b] = {tile: "random", type: "random"}
      let index = board.teleports.findIndex((e) => e.id === board.cells[x][y].id)
      board.teleports.splice(index, 1)
      this.undoList = []
    }
    let t = stackable.includes(board.cells[x][y].tile.replace(/\d+$/, "")) ? board.cells[x][y].tile : "grass"
    if (type === "rock"){
      if (board.cells[x][y].type === "rock")
        board.cells[x][y].quantity = board.cells[x][y].quantity === 1 ? 4 : board.cells[x][y].quantity-1
      else
        board.cells[x][y] = {tile: t, type, quantity: 4}
    }
    else if (type === "clay")
      board.cells[x][y] = {tile: t, type, quantity: 5}
    else if (seeThru.includes(type))
      board.cells[x][y] = {tile: t, type}
    else
      board.cells[x][y] = {tile, type}
  },

  floodFill(x,y, tile1, type1, tile2, type2){
    if (type1 === type2)
      return
    this.addUndo(x,y)
    this.changeTile(x,y,tile2, type2)
    let list = [{x,y}]
    for (let i = 0; i<list.length; i++){
      list = list.concat(this.fillRing(list[i].x, list[i].y, tile1, type1, tile2, type2))
      if (list.length > board.cols*board.rows){
        console.log("floodfill overflow")
        return
      }
    }
    
  },

  fillRing(x,y, tile1, type1, tile2, type2){
    let list = []
    for (let i = x-1; i <= x+1; i++){
      for (let j = i === x ? y-1 : y; j <= y+1; j+=2){
        if (i >= 0 && i < board.cols && j >= 0 && j < board.rows && board.cells[i][j].type === type1){
          this.addUndo(i,j)
          this.changeTile(i,j,tile2, type2)
          list.push({x:i,y:j})
        }
      }
    }
    return list
  },

  undo(){
    for (let e of this.undoList){
      this.changeTile(e.x, e.y, e.tile, e.type)
    }
    this.undoList = []
  },

  setUndo(x,y){
    this.undoList = [{x, y, tile: board.cells[x][y].tile, type: board.cells[x][y].type}]
  },

  addUndo(x,y){
    this.undoList.push({x, y, tile: board.cells[x][y].tile, type: board.cells[x][y].type})
  },

  cancelPit(){
    this.undo()
    this.cell1 = {}
  },

  newWorld(cols, rows, fillType){
    board = new Board(cols, rows, fillType)
    world.resize(cols, rows)
    this.undoList = []
    this.unSaved = true
  },

  loadBoard(b){
    if (b.type === "custom")
      board = new Board(JSON.parse(localStorage["board"+b.name]))
    else
      board = new Board(JSON.parse(JSON.stringify(gameBoards[b.id])))
    world.resize(board.cols, board.rows)
    this.undoList = []
    this.unSaved = false
  },

  resizeWorld(cols, rows){
    if (cols > board.cols){
      for (let i = board.cols; i < cols; i++){
        board.cells.push(new Array(board.rows).fill({tile: "random", type: "random"}))
      }
    }
    else if (cols < board.cols){
      board.cells.splice(cols, board.cols-cols)
    }
    board.cols = cols
    if (rows > board.rows){
      for (let i = 0; i < board.cells.length; i++) {
        for (let j = board.rows; j < rows; j++ ){
          board.cells[i].push({tile: "random", type: "random"})
        }
      }
    }
    else if (rows < board.rows){
      for (let i = 0; i < board.cells.length; i++) {
        board.cells[i].splice(rows, board.rows-rows)
      }
    }
    board.rows = rows
    world.resize(cols, rows)
    this.undoList = []
    board.startX = board.startX < cols ? board.startX : cols-1
    board.startY = board.startY < rows ? board.startY : rows-1
    board.revealCount = board.cols*board.rows
  },

  treeFill(){
    for (let i=0; i<board.cols; i++){
      for (let j =0; j<board.rows; j++){
        let r = random(22)
        let tile = r < 2 ? "tree" : r < 4 ? "treeThin" : r < 6 ? "bush4" :
        r < 8 ? "bush1" : r < 8.5 ? "berryBush" : r < 15 ? "longGrass" : "grass"
        if (board.cells[i][j].type === "random"){
          this.addUndo(i, j)
          if (tile === "longGrass")
            board.cells[i][j] = {tile: "longGrass1", type: "longGrass", growtype: floor(random(30))}
          else if (tile === "berryBush")
            board.cells[i][j] = {tile: "grass", type: "berryBush", berries: [], growtime: floor(random(30))}
          else {
            let type = tile === "bush4" ? "tree" :
              tile === "bush1" ? "treeThin" : tile
            board.cells[i][j] = {tile, type}
          }
        }
      }
    }
  },

  parsePath(type){
    let tiles = type === "river" ? this.riverMaker() : this.beachMaker()
    if (tiles){
      for (let i = 0; i < this.path.length; i++){
        let ar = this.path[i].split("_")
        let x = Number(ar[0])
        let y = Number(ar[1])

        this.changeTile(x,y, type+tiles[i], type)
      }
    }
    this.path = []
  },

  beachMaker(){
    if (this.path.length < 2)
      return false
    let ar = []
    for (let i = 0; i < this.path.length; i++){
      let id = this.path[i].split("_")
      ar.push([Number(id[0]), Number(id[1])])
    }
    let tileNum = []
    for (let i=0; i<ar.length; i++){
      let x = ar[i][0], y = ar[i][1]
      if (i === 0){
        tileNum[i] = ar[i+1][0] < x && ar[i+1][1] <= y ? 7 :
                       ar[i+1][1] < y ? 10 :
                         ar[i+1][0] > x ? 2 : 4
      }
      else if (i === ar.length-1){
        tileNum[i] = ar[i-1][0] < x && ar[i-1][1] <= y ? 2 :
                       ar[i-1][1] < y ? 4 :
                         ar[i-1][0] > x ? 7 : 10
      }
      else if (ar[i+1][0] < x && ar[i+1][1] <= y) { //next is left
        tileNum[i] = ar[i-1][1] < y ? 6 :  //last is top
                       ar[i-1][0] > x ? 7 : //last is right
                         11 // last is below
      }
      else if (ar[i+1][1] < y) { //next is top
        tileNum[i] = ar[i-1][0] > x ? 9 : //last is right
                       ar[i-1][1] > y ? 10 : // last is below
                         12 // last is left
      }
      else if (ar[i+1][0] > x) { //next is right
        tileNum[i] = ar[i-1][1] < y ? 5 :  //last is top
                       ar[i-1][0] < x ? 2 : //last is left
                         1 // last is below
      }
      else { //next is below
        tileNum[i] = ar[i-1][1] < y ? 4 :  //last is top
                       ar[i-1][0] > x ? 8 : //last is right
                         3 // last is left
      }
    }
    return tileNum
  },

  riverMaker(){
    if (this.path.length < 2)
      return false
    let ar = []
    for (let i = 0; i < this.path.length; i++){
      let id = this.path[i].split("_")
      ar.push([Number(id[0]), Number(id[1])])
    }
    let tileNum = []
    for (let i=0; i<ar.length; i++){
      let x = ar[i][0], y = ar[i][1]
      if (i === 0)
        tileNum[i] = ar[i+1][0] === x ? 5 : 6

      else if (i === ar.length-1)
        tileNum[i] = ar[i-1][0] === x ? 5 : 6

      else if (ar[i+1][0] < x) { //next is left
        tileNum[i] = ar[i-1][1] < y ? 3 :  //last is top
                       ar[i-1][0] > x ? 6 : //last is right
                         2 // last is below
      }
      else if (ar[i+1][1] < y) { //next is top
        tileNum[i] = ar[i-1][0] > x ? 4 : //last is right
                       ar[i-1][1] > y ? 5 : // last is below
                         3 // last is left
      }
      else if (ar[i+1][0] > x) { //next is right
        tileNum[i] = ar[i-1][1] < y ? 4 :  //last is top
                       ar[i-1][0] < x ? 6 : //last is left
                         1 // last is below
      }
      else { //next is below
        tileNum[i] = ar[i-1][1] < y ? 5 :  //last is top
                       ar[i-1][0] > x ? 1 : //last is right
                         2 // last is left
      }
    }
    return tileNum
  },

  islandMaker(cols,rows){
    if (cols < 17 || rows < 17)
      return
    this.path = ["10_3"]
    let x = 11, y = 3;
    let go = true, count = 0
    let dir = "R"
    let move = "R"
    let size = 7

    while(go){
      if (x < cols-size && y < size && count < cols*2){//top left
        move = y === 1 ? (dir === "U" ? ["R"] : ["D", "R"]) :
                 y === size-1 ? (dir === "D" ? ["R"] : ["U", "R"]) : this.sanitizeDirs(["R", "U", "D"], dir)
      }
      else if (x>=cols-size && y<rows-size){//right top
        move = x === cols-2 ? (dir === "R" ? ["D"] : ["L", "D"]) :
                 x === cols-size ? (dir === "L" ? ["D"] : ["R", "D"]) : this.sanitizeDirs(["D", "L", "R"], dir)
      }
      else if (x>=size && y>=rows-size){//bottom right
        move = y === rows-size ? (dir === "U" ? ["L"] : ["D", "L"]) :
                 y === rows-2 ? (dir === "D" ? ["L"] : ["U", "L"]) : this.sanitizeDirs(["L", "U", "D"], dir)
      }
      else if (x<size && y>=size){//left bottom
        move = x === 1 ? (dir === "L" ? ["U"] : ["R", "U"]) :
                 x === size-1 ? (dir === "R" ? ["U"] : ["L", "U"]) : this.sanitizeDirs(["U", "L", "R"], dir)
      }
      else if (x < cols-size && y < size && count > cols*2){//finish up
        if (y === 3){
          if (x === 9)
            go = false
          move = ["R"]
        }
        else
          move = ["U"]
      }
      let ob = this.pickMove(x,y, move)
      x = ob.x
      y = ob.y
      dir = ob.dir
      count++
      if (count > (cols+rows)*4){
        go = false
        console.error("while loop forced to quit")
      }
    }
    this.parsePath("beach")
  },

  pickMove(x,y,dirs){
    let roll = Math.random()
    switch (dirs.length){
      case 1:
        return this.move(x,y,dirs[0])
      case 2:
        return roll > .5 ? this.move(x,y,dirs[0]) : this.move(x,y,dirs[1])
      case 3:
        return roll > .5 ? this.move(x,y,dirs[0]) : roll > .25 ? this.move(x,y,dirs[1]) : this.move(x,y,dirs[2])
    }
  },

  move(x,y, dir){
    this.path.push(x+"_"+y)
    switch (dir){
      case "U": y--; break;
      case "D": y++; break;
      case "R": x++; break;
      case "L": x--; break;
    }
    return {x,y, dir}
  },

  sanitizeDirs(dirs, lastDir){
    let d = ""
    switch (lastDir){
      case "U": d = "D"; break;
      case "D": d= "U"; break;
      case "R": d= "L"; break;
      case "L": d= "R"; break;
    }
    let i = dirs.findIndex((e) => e === d)
    if (i !== -1)
      dirs.splice(i, 1)
    return dirs
  },

  magicCircle(i,j,r,print){
    let x = r, y = 0
    for (let a = TWO_PI; a >= 0; a-=(TWO_PI/(r*10))){
      let nx = r*cos(a)
      let ny = r*sin(a)
      if (round(nx) != x || round(ny) != y)
        this.path.push(round(nx+i)+"_"+round(ny+j))
      x = round(nx)
      y = round(ny)
    }
    if (print)
      this.parsePath("beach")
    else {
      console.log(this.path)
      this.path = []
    }
  }
}

let starEditor = {
  selected: {id: 0},
  mode: "add",
  matrix: [],

  calculateMatrix(){ //add ids to stars, builds board.stars as empty list
    this.matrix = Array.from({ length: board.cols }, () => [])

    // add cells for each star in board.stars, delete stars that are not on the board
    if (board.stars.length > 0){
      for (let i = board.stars.length-1; i >= 0; i--){
        let s = board.stars[i]
        if (board.cells[s.x][s.y].type !== "star"){
          board.stars.splice(i, 1)
        }
        else {
          board.cells[s.x][s.y].id = s.id
          for (let c of s.cells){
            this.matrix[c.x][c.y] = s.id
          }
        }
      }
    }
    // add any new stars found on the board
    for (let i = 0; i < board.cols; i++){
      for (let j = 0; j< board.rows; j++){
        let cell = board.cells[i][j]
        if (cell.type === "star"){
          if (cell.id == null || board.stars.findIndex(e => e.id === cell.id) === -1){
            cell.id = board.stars.length === 0 ? 0 : board.stars[board.stars.length-1].id+1
            board.stars.push({ x: i, y: j, id: cell.id, cells: [] })
            if (this.matrix[i][j] != null){// this cell already belongs to another star.
              let index = board.stars.findIndex(e => e.id === this.matrix[i][j]) 
              for (let cell of board.stars[index].cells){ // reasign all of that star's cells
                this.asignCell(cell.x, cell.y)
              }
            }
          }
        }
      }
    }
    if (board.stars.length < 2){
      return
    }
    // asign cells to a star that don't have one (i.e. their star was deleted)
    for (let i = 0; i < board.cols; i++){
      for (let j = 0; j< board.rows; j++){
        if (this.matrix[i][j] == null){
          this.asignCell(i,j)
        }
      }
    }
    this.selected = {x: board.stars[0].x, y: board.stars[0].y, id: board.stars[0].id}
  },

  saveStars(){ //fills board.stars.cells list
    board.revealCount = board.cols*board.rows
    for (let s of board.stars){
      s.cells = []
    }
    for (let i = 0; i < board.cols; i++){
      for (let j = 0; j< board.rows; j++){
        let index = board.stars.findIndex(e => e.id === this.matrix[i][j])
        if (index === -1)
          console.error(`missing star with id ${this.matrix[i][j]}. Error at ${i},${j}.`)
        else
          board.stars[index].cells.push({x:i,y:j})
      }
    }
  },

  asignStars(){
    for (let i = 0; i < board.cols; i++){
      for (let j = 0; j< board.rows; j++){
        this.asignCell(i,j)
      }
    }
  },

  asignCell(x,y, skip){
    let id = 0
    let mindist = board.rows+board.cols
    for (let a = 0; a < board.stars.length; a++){
      let d = dist(x,y,board.stars[a].x, board.stars[a].y)
      if (d < mindist && a !== skip){
        mindist = d; id = a
      }
    }
    this.matrix[x][y] = board.stars[id].id
  },

  mousePressed(){
    let x = Math.floor(mouseX/25)
    let y = Math.floor(mouseY/25)
    let cell = board.cells[x][y]
    if (cell.type === "star"){
      this.selected = {x,y, id: cell.id}
    }
    else if (this.mode === 'add') {
      this.matrix[x][y] = this.selected.id
    }
    else if (this.mode === 'subtract'){
      this.asignCell(x,y, this.selected.id)
    }
  }
}