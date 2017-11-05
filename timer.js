let milisecounds, wemoMins, wemoHours, wemoDays

function showTopbar(){
  let left = abs($("#board").position().left)
  let top = abs($("#board").position().top-topOffset)
  let width = window.innerWidth
  noStroke()
  fill(255)
  rect (left, top, width, 40)
  if (frameCount%3 === 0){
    updateTimer()
  }
  showTimer()
}

function showTimer(){
  let showMins = wemoMins%60 < 10 ? "0"+wemoMins%60 : wemoMins%60
  let showHours = wemoHours%12 === 0 ? 12 : wemoHours%12
  let suffix = Math.floor(wemoHours/12)%2 === 0 ? " AM" : " PM"
  let right = abs($("#board").position().left)+window.innerWidth
  let top = abs($("#board").position().top-topOffset)+5

  textAlign(RIGHT, TOP)
  textSize(26)
  fill(0)
  text(" Day "+ wemoDays + ", "+showHours+":"+showMins+suffix, right-40, top)
  image(tiles[timeOfDay], right-35, top)
}

function updateTimer(){
  milisecounds = Date.now() - startTime
  wemoMins = Math.floor(milisecounds/250)+1200//shift time 2 hours from 0
  wemoHours = Math.floor(wemoMins/60)
  wemoDays = Math.floor(wemoMins/1440)+1

  let mins = wemoMins%1440

  timeOfDay = mins >= 60 && mins <= 119 ? "dawn" :
                mins >= 1320 && mins <= 1379 ? "dusk" :
                  mins >= 1380 || mins <= 59 ? "night" :
                    "day"

  if (mins >= 1290 && mins <= 1300){
    message = "Night is Coming!!"
    showCount = showCount = 8
  }

}

function showNight(){
  switch(timeOfDay){
    case "day":
      return
    case "dusk":
      time = wemoMins%1440-1320
      alpha = Math.round(243-pow((60-time)*.26, 2))
      break
    case "night":
      alpha = 240
      break
    case "dawn":
      time = wemoMins%1440-60
      alpha = Math.round(243-pow((time+1)*.26, 2))
      break
  }
  fill(0,0,0,alpha)
  noStroke()
  beginShape()
  vertex(0,0)
  vertex(2000,0)
  vertex(2000,1625)
  vertex(0,1624)
  let fires = board.objectsToShow.fires
  for (let i =0; i<fires.length; i++){
    if (fires[i].value > 0){
      let x = fires[i].x
      let y = fires[i].y
      beginContour()
      vertex(x*25+12,y*25-25+topbarHeight)
      bezierVertex(x*25-38,y*25-25+topbarHeight,x*25-38,y*25+50+topbarHeight,x*25+12,y*25+50+topbarHeight)
      bezierVertex(x*25+62,y*25+50+topbarHeight,x*25+62,y*25-25+topbarHeight,x*25+12,y*25-25+topbarHeight)
      endContour()
    }
  }
  endShape(CLOSE)
}