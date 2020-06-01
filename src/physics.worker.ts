import { Physics } from './physics'

var Module = { TOTAL_MEMORY: 256 * 1024 * 1024 }

import { wasmSupported } from './wasmSupported'
const ammoPath = wasmSupported ? 'ammo.wasm.js' : 'ammo.js'
importScripts(ammoPath)

let physics: Physics

self.addEventListener('message', (e: any) => {
  const { data } = e

  if (Array.isArray(data)) {
    if (data[0] === 'add') {
      if (data[1] === 'box') physics.add.box(data[2])
      if (data[1] === 'sphere') physics.add.sphere(data[2])
    }
    if (data[0] === 'body') {
      if (data[1] === 'setLinearVelocity')
        physics.body.setLinearVelocity(data[2])
      if (data[1] === 'setAngularVelocity')
        physics.body.setAngularVelocity(data[2])
    }
    if (data[0] === 'destroy') physics.destroy(data[1])
    if (data[0] === 'debugDrawer') {
      if (data[1] === 'init')
        physics.debugDrawerInit(data[2].debugVertices, data[2].debugColors)
    }
  }
})

Ammo().then(Ammo => {
  physics = new Physics()

  self.postMessage({ msg: 'ready' })

  let last = new Date().getTime()

  const loop = () => {
    let now = new Date().getTime()
    const delta = now - last
    last = now

    self.postMessage({ msg: 'preUpdate' })
    const updates = physics.update(delta)

    const updated = physics.debugDrawerUpdate()
    if (updated) {
      const { verticesArray, colorsArray, index } = physics.debugDrawer
      self.postMessage({
        msg: 'debugDrawerUpdate',
        debugVertices: verticesArray,
        debugColors: colorsArray,
        index: index,
      })
    }

    self.postMessage({ msg: 'postUpdate' })
    self.postMessage({ msg: 'updates', updates })

    requestAnimationFrame(loop)
  }
  loop()
})
