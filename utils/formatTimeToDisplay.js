const formatTimeToDisplay = function(time) {
  // '00:00:00'
  let splitTime = time.split(':')
  if (splitTime[0] == 0) {
    splitTime.shift()
    return splitTime.join(':')
  } else {
    return time
  }
}

module.exports = formatTimeToDisplay