function getSeconds(time) {
  let arr = time.split(':').reduce((init, i) => {
      init.push(parseInt(i));
      return init
  }, [])
  let seconds = arr[0] * 3600 + arr[1] * 60 + arr[2]
  return seconds
}

module.exports = getSeconds