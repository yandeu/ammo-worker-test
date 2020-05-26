export class AmmoPhysics {
  worker: Worker

  async init() {
    this.worker = new Worker('./worker', { type: 'module' })

    return new Promise(resolve => {
      this.worker.addEventListener(
        'message',
        (e: any) => {
          resolve()
        },
        { once: true }
      )
    })
  }

  createId() {
    return (
      Math.random().toString(32).substring(2) +
      '-' +
      Math.random().toString(32).substring(2)
    )
  }

  addBox(width = 1, height = 1, depth = 1) {
    const id = this.createId()
    this.worker.postMessage({
      msg: 'add',
      type: 'box',
      params: { width, height, depth, id }
    })
    return id
  }
}

/**
 * KEEP THIS!!
 */
// const s = `
// var Module = { TOTAL_MEMORY: 256 * 1024 * 1024 }
// const urls = 'http://localhost:8080/lib/ammo.wasm.js'
// importScripts(urls)
// console.log(Ammo)
// Ammo().then(()=>{console.log('asdf')})
// const bla = e => {
//   console.log('bla', e.data)
// }`

// const webWorker = new Worker(
//   URL.createObjectURL(new Blob([s], { type: 'module' }))
// )
