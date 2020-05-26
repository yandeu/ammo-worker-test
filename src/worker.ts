import { Physics } from './physics'

var Module = { TOTAL_MEMORY: 256 * 1024 * 1024 }
const urls = 'http://localhost:8080/lib/ammo.wasm.js'
importScripts(urls)

let physics: Physics

self.addEventListener('message', (e: any) => {
  const { data } = e

  if (data.msg === 'add') {
    if (data.type === 'box') {
      physics.addBox({ ...data.params })
    }
    if (data.type === 'sphere') {
      physics.addSphere({ ...data.params })
    }
  }
})

Ammo().then(Ammo => {
  physics = new Physics()
  self.postMessage('ready')

  let last = new Date().getTime()

  setInterval(() => {
    let now = new Date().getTime()
    const delta = now - last
    last = now

    const updates = physics.update(delta)
    self.postMessage({ msg: 'updates', updates })
  }, 16)
})
