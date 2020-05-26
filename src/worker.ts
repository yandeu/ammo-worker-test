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

  physics.onUpdates((updates: any) => {
    self.postMessage({ msg: 'updates', updates })
  })
})
