const SetTimer = require('./timer')

module.exports = class RateLimit extends SetTimer {
  constructor (cb, timer) {
    if (typeof cb !== 'function') throw new Error('Must supply callback function to RateLimit')

    super(timer)
    this.currentlyEmptyingQueue = false
    this.queue = []
    this.cb = cb
  }

  emptyQueue () {
    if (this.queue.length) {
      this.currentlyEmptyingQueue = true
      setTimeout(() => {
        this.queue.shift().call()
        this.emptyQueue()
      }, this._timer)
    } else {
      this.currentlyEmptyingQueue = false
    }
  }

  run (...args) {
    var resolve, reject, promise = new Promise((res, rej) => {
      resolve = res
      reject = rej
    })

    this.queue.push(() => {
      Promise.resolve()
      .then(() => this.cb.apply(this, args))
      .then(resolve)
      .catch(reject)
    })

    if (!this.currentlyEmptyingQueue) this.emptyQueue()

    return promise
  }
}
