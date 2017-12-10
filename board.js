class Board {
  constructor(cols, rows, obj){
    if (obj)
      this.cells = obj.cells
    else {
      let output = []
      for (let x = 0; x<cols; x++){
        output.push([])
        for (let y = 0; y<rows; y++){
          output[x].push({tile: "water", type: "water"})
        }
      }
      this.cells = output
    }
    this.startX = obj.startX || 8
    this.startY = obj.startY || 8

  }

  saveProgress(){

  }

  saveCustom(){

  }
}