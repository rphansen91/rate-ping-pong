const chalk = require('chalk');
const clear = require('clear');
const RatePingPong = require('./');

const options = { timer: 0, max: 1000, min: 0, inc: 100 }
const limiter = new RatePingPong(execute(), options)

// GENERATE RANDOM TRAFFIC
setInterval(limiter.run.bind(limiter), 20)
setInterval(limiter.run.bind(limiter), 100)
setInterval(limiter.run.bind(limiter), 1000)

function execute () {
  return function (i) {
    render(displayStatus())
    const { call_count } = mockRateStatus()
    if (call_count >= 80) {
      limiter.incrementTimer()
    } else {
      limiter.decrementTimer()
    }
  }
}

function mockRateStatus () {
  return {
    call_count: random(0, 100)
  }
}

var last = now()
function displayStatus () {
  var n = now()
  var display = chalk`
  {bold Rate Limit Status}
  -----------------
  {green Timer}: ${limiter._timer}ms
  {green Elapsed}: ${n - last}ms
  {green Queue}: ${displayQueue(limiter.queue.length)}
  -----------------
  `
  last = n
  return display
}

function displayQueue (size) {
  return (size > 100) ? chalk.yellow(size) : size
}

function render (display) {
  clear()
  console.log(display)
}

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function now () {
  return new Date().getTime()
}
