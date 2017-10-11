let board;

function generateBoard(){
  let output = {startX: 1, startY: 0, cells: []}
  for (let x = 0; x<cols; x++){
    output.cells.push([])
    for (let y = 0; y<rows; y++){
      let type = (x<6 || y<6 || x > cols-7 || y > rows-7) ? "water" : "random"
      output.cells[x].push({tile: type, type: type, revealed: false})
    }
  }
  board = output
}

// function createBoard() {
//   let output = []
//   for (let i=1; i<26; i++){
//     output.push([])
//     for (let j=1; j<41; j++){
//       let type = (i-1 < Math.random()*4 || j-1 < Math.random()*4 || j > Math.random()*5+35 || i > Math.random()*5+20) ?
//         "water" :
//           (i%8 + j%8 > Math.random()*5 && i%8 + j%8 < Math.random()*14) ?
//             "trees" :
//               (j - 10 - i%10 < 0 && j - 10 - i%5 > 2) ?
//                 "rocks" :
//                   (j < 18 && j > 15 && i%9 === 1) ?
//                     "house" :
//                       "grass"

//       output[i].push(type)
//     }
//   }
// }