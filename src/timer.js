module.exports = class SetTimer {
  constructor (options) {
    this._maximum = null
    this._minimum = 0
    this._timer = 0
    this._originalTimer = 0
    this._increment = 100

    if (typeof options === 'object') {
      this._maximum = options.max || this._maximum
      this._minimum = options.min || this._minimum
      this._increment = options.inc || this._increment
      this._timer = options.timer || this._timer
      this._originalTimer = options.timer || this._timer
    } else if (typeof options === 'number') {
      this._timer = options
      this._originalTimer = options
    }
  }

  setTimer (timer) {
    this._timer = timer
  }

  resetTimer () {
    this.setTimer(this._originalTimer)
  }

  incrementTimer () {
    const timer = this._timer + this._increment
    if (!this._maximum || this._maximum >= timer) {
      this.setTimer(timer)
    }
  }

  decrementTimer () {
    const timer = this._timer - this._increment
    if (this._minimum <= timer) this.setTimer(timer)
  }
}
