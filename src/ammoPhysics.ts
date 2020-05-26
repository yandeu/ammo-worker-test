export class AmmoPhysics {
  public worker: Worker
  private _onUpdates = (updates: any) => {}

  async init() {
    this.worker = new Worker('./worker', { type: 'module' })

    this.worker.addEventListener('message', e => {
      const { data } = e
      if (data.msg === 'updates') this._onUpdates(data.updates)
    })

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

  public onUpdates(fnc: (updates: any) => void) {
    this._onUpdates = fnc
  }

  addSphere(params: any = {}) {
    this.worker.postMessage({
      msg: 'add',
      type: 'sphere',
      params: { ...params },
    })
  }

  addBox(params: any = {}) {
    this.worker.postMessage({
      msg: 'add',
      type: 'box',
      params: { ...params },
    })
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
