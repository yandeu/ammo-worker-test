// https://gist.github.com/paulirish/1579671

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

;(function() {
  var lastTime = 0
  var vendors: any = ['ms', 'moz', 'webkit', 'o']
  for (var x = 0; x < vendors.length && !self.requestAnimationFrame; ++x) {
    // @ts-ignore
    self.requestAnimationFrame = self[vendors[x] + 'RequestAnimationFrame']
    self.cancelAnimationFrame =
      // @ts-ignore
      self[vendors[x] + 'CancelAnimationFrame'] ||
      // @ts-ignore
      self[vendors[x] + 'CancelRequestAnimationFrame']
  }

  if (!self.requestAnimationFrame)
    // @ts-ignore
    self.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = self.setTimeout(function() {
        callback(currTime + timeToCall)
      }, timeToCall)
      lastTime = currTime + timeToCall
      return id
    }

  if (!self.cancelAnimationFrame)
    self.cancelAnimationFrame = function(id: any) {
      clearTimeout(id)
    }
})()
