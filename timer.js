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
  wemoMins = Math.floor(milisecounds/250)+120//shift time 2 hours from 0
  wemoHours = Math.floor(wemoMins/60)
  wemoDays = Math.floor(wemoMins/1440)+1

  let mins = wemoMins%1440

  if (mins >= 57 && mins <= 60){
    timeOfDay = "dawn"
    nightTimer = nightTimer > 20 ? 0 : nightTimer
  }
  else if (mins >= 117 && mins <= 120){
    timeOfDay = "day"
  }
  else if (mins >= 1287 && mins <= 1290){
    message = "Night is Coming!!"
    showCount = showCount < 5 ? 40 : showCount
  }
  else if (mins >= 1317 && mins <= 1320){
    timeOfDay = "dusk"
    nightTimer = nightTimer > 20 ? 0 : nightTimer
  }
  else if (mins >= 1377 && mins <= 1380){
    timeOfDay = "night"
  }
}

function showNight(){
  switch(timeOfDay){
    case "day":
      return
    case "dusk":
      alpha = nightTimer > 180 ? 240 :
        nightTimer > 150 ? nightTimer+60 : Math.floor(nightTimer*1.4)
      break
    case "night":
      alpha = 240
      break
    case "dawn":
      alpha = nightTimer > 180 ? 0 :
        nightTimer < 30 ? 240 - nightTimer : Math.floor((180 - nightTimer)*1.4)
      break
  }
  fill(0,0,0,alpha)
  rect(0,0,2000,1625)
  nightTimer++
}