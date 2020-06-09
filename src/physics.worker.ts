import { Physics } from './physics'
import * as Comlink from 'comlink'

var Module = { TOTAL_MEMORY: 256 * 1024 * 1024 }

import { wasmSupported } from './wasmSupported'
const ammoPath = wasmSupported ? 'ammo.wasm.js' : 'ammo.js'
importScripts(ammoPath)

import './requestAnimationFramePolyfill'

class Wrapper {
  physics: Physics

  async init() {
    return new Promise(resolve => {
      Ammo().then(() => {
        this.physics = new Physics()

        self.postMessage({ msg: 'ready' })

        let last = new Date().getTime()

        const loop = () => {
          let now = new Date().getTime()
          const delta = now - last
          last = now

          self.postMessage({ msg: 'preUpdate' })

          const updates = this.physics.update(delta)

          self.postMessage({ msg: 'updates', updates })

          const hasUpdated = this.physics.debugDrawerUpdate()
          // console.log(hasUpdated)

          if (hasUpdated) {
            const {
              verticesArray,
              colorsArray,
              index
            } = this.physics.debugDrawer
            self.postMessage({
              msg: 'debugDrawerUpdate',
              debugVertices: verticesArray,
              debugColors: colorsArray,
              index: index
            })
          }

          self.postMessage({ msg: 'postUpdate' })

          requestAnimationFrame(loop)
        }
        loop()

        resolve()
      })
    })
  }
}

Comlink.expose(Wrapper)
