Rate Ping
---------

Maintain zippy user experience while constantly adjusting to various API usage restrictions.

- Install

`npm install rate-ping`

- Setup

```js
const RatePingPong = require('rate-ping-pong')
const limiter = new RatePingPong(function highUsage () {
  // HIGH USAGE METHOD
}, {
  timer: 0,
  minimum: 0,
  maximum: null,
  increment: 100
})
```

- Usage

1. run(args) -> Promise


  Call the `highUsage` method with supplied arguments
  Returns a Promise


```js
limiter.run('a', 'b') // Promise
```

2. setTimer(Number) -> undefined


  Changes the rate limiting logic to execute once every 1000 milliseconds


```js
limiter.setTimer(1000)
```

3. incrementTimer(Number) -> undefined


  Increment the timer by the inc option, do not increase greater than max if supplied


```js
limiter.incrementTimer()
```

4. decrementTimer(Number) -> undefined


  Decrement the timer by the inc option, do not decrease below the min


```js
limiter.decrementTimer()
```

5. resetTimer() -> undefined


  Reset the timer to the originally supplied value


```js
limiter.resetTimer()
```



