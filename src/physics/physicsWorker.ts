import { Physics } from './physics'

var Module = { TOTAL_MEMORY: 256 * 1024 * 1024 }
const urls = 'http://localhost:8080/lib/ammo.wasm.js'
importScripts(urls)

let physics: Physics

self.addEventListener('message', (e: any) => {
  const { data } = e

  if (Array.isArray(data)) {
    if (data[0] === 'add') {
      if (data[1] === 'box') physics.add.box(data[2])
      if (data[1] === 'sphere') physics.add.sphere(data[2])
    }
    if (data[0] === 'destroy') physics.destroy(data[1])
  }
})

Ammo().then(Ammo => {
  physics = new Physics()

  self.postMessage({ msg: 'ready' })

  let last = new Date().getTime()

  setInterval(() => {
    let now = new Date().getTime()
    const delta = now - last
    last = now

    self.postMessage({ msg: 'preUpdate' })
    const updates = physics.update(delta)
    self.postMessage({ msg: 'postUpdate' })
    self.postMessage({ msg: 'updates', updates })
  }, 1000 / 60)
})