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
  }
})

Ammo().then(Ammo => {
  physics = new Physics()
  self.postMessage('ready')
})
