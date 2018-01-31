const SetTimer = require('./timer')
const RateLimit = require('./')

function wait (time) {
  return new Promise(res => setTimeout(() => res(), time))
}

describe('Rate Limit Ping Pong', function () {

  describe('Options', function () {
    test('Should have default timer', function () {
      const limiter = new RateLimit(() => {})
      return expect(limiter._timer).toBe(0)
    })
    test('Should have default maximum', function () {
      const limiter = new RateLimit(() => {})
      return expect(limiter._maximum).toBe(null)
    })
    test('Should have default minimum', function () {
      const limiter = new RateLimit(() => {})
      return expect(limiter._minimum).toBe(0)
    })
    test('Should have default increment', function () {
      const limiter = new RateLimit(() => {})
      return expect(limiter._increment).toBe(100)
    })
    test('Should be able to provide timer only', function () {
      const limiter = new RateLimit(() => {}, 100)
      return expect(limiter._timer).toBe(100)
    })
    test('Should be able to provide timer', function () {
      const timer = 20
      const limiter = new RateLimit(() => {}, { timer })
      return expect(limiter._timer).toBe(timer)
    })
    test('Should be able to provide maximum', function () {
      const max = 20
      const limiter = new RateLimit(() => {}, { max })
      return expect(limiter._maximum).toBe(max)
    })
    test('Should be able to provide minimum', function () {
      const min = 20
      const limiter = new RateLimit(() => {}, { min })
      return expect(limiter._minimum).toBe(min)
    })
    test('Should be able to provide increment', function () {
      const inc = 20
      const limiter = new RateLimit(() => {}, { inc })
      return expect(limiter._increment).toBe(inc)
    })
  })

  describe('Behavior', function () {
    test('Should be a function', function () {
      expect(typeof RateLimit).toBe('function')
    })

    test('Should throw if no callback supplied', function () {
      expect(function () {
        new RateLimit()
      }).toThrow('Must supply callback function to RateLimit')
    })

    test('Should be an instance of SetTimer', function () {
      const limiter = new RateLimit(() => {})
      expect(limiter).toBeInstanceOf(SetTimer)
    })

    test('Should be able to set timer', function () {
      const limiter = new RateLimit(() => {}, 200)
      expect(limiter._timer).toBe(200)
    })

    test('Should be able to change timer', function () {
      const limiter = new RateLimit(() => {}, 200)
      limiter.setTimer(500)
      expect(limiter._timer).toBe(500)
    })

    test('Should be able to reset timer', function () {
      const limiter = new RateLimit(() => {}, 200)
      limiter.setTimer(500)
      limiter.setTimer(300)
      limiter.setTimer(100)
      limiter.resetTimer()
      expect(limiter._timer).toBe(200)
    })

    test('Should execute callback', function () {
      const spy = jest.fn()
      new RateLimit(spy, 0).run(13)
      return wait(0).then(() =>
        expect(spy).toHaveBeenCalledWith(13))
    })

    test('Should only execute within rate limit', function () {
      const spy = jest.fn()
      const limiter = new RateLimit(spy, 10)
      limiter.run(1)
      limiter.run(2)
      limiter.run(3)
      limiter.run(4)
      return wait(25).then(() =>
        expect(spy).toHaveBeenCalledTimes(2))
    })

    test('Should only execute within rate limit', function () {
      const double = n => Promise.resolve(2 * n)
      const limiter = new RateLimit(double, 10)

      return limiter.run(10)
      .then((res) => expect(res).toBe(20))
    })

    test('Should be able to increment timer', function () {
      const limiter = new RateLimit(() => {}, { timer: 0, inc: 10 })
      limiter.incrementTimer()
      limiter.incrementTimer()
      return expect(limiter._timer).toBe(20)
    })

    test('Should be able to increment timer to max', function () {
      const limiter = new RateLimit(() => {}, { timer: 0, inc: 10, max: 20 })
      limiter.incrementTimer()
      limiter.incrementTimer()
      limiter.incrementTimer()
      return expect(limiter._timer).toBe(20)
    })

    test('Should be able to decrement timer', function () {
      const limiter = new RateLimit(() => {}, { timer: 30, inc: 10 })
      limiter.decrementTimer()
      limiter.decrementTimer()
      return expect(limiter._timer).toBe(10)
    })

    test('Should be able to decrement timer to min', function () {
      const limiter = new RateLimit(() => {}, { timer: 20, inc: 10 })
      limiter.decrementTimer()
      limiter.decrementTimer()
      limiter.decrementTimer()
      return expect(limiter._timer).toBe(0)
    })
  })
})
