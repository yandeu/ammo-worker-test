import { Quaternion } from 'three'

export class AmmoPhysics {
  public objects = new Map()
  public worker: Worker

  async init() {
    this.worker = new Worker('./physicsWorker', { type: 'module' })

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

  public destroy(uuid: string) {
    this.worker.postMessage(['destroy', uuid])
  }

  private _onUpdates(updates: any) {
    for (let i = 0; i < updates.length; i += 8) {
      let uuid = updates[i + 0]
      let px = updates[i + 1]
      let py = updates[i + 2]
      let pz = updates[i + 3]
      let qx = updates[i + 4]
      let qy = updates[i + 5]
      let qz = updates[i + 6]
      let qw = updates[i + 7]
      let obj = this.objects.get(uuid)
      obj.position.set(px, py, pz)
      obj.rotation.setFromQuaternion(new Quaternion(qx, qy, qz, qw))
      //console.log(obj.name, px, py, pz)
    }
  }

  public get add() {
    return {
      existing: (mesh: THREE.Mesh) => this.addExisting(mesh),
      box: (params: any) => this.worker.postMessage(['add', 'box', params]),
      sphere: (params: any) =>
        this.worker.postMessage(['add', 'sphere', params]),
    }
  }

  public link(mesh: THREE.Mesh) {
    this.objects.set(mesh.uuid, mesh)
  }

  private addExisting(mesh: THREE.Mesh) {
    const { position: pos, quaternion: quat, uuid } = mesh

    // set default params
    const defaultParams = {
      width: 1,
      height: 1,
      depth: 1,
      radius: 1,
      radiusTop: 1, // for the cylinder
      radiusBottom: 1, // for the cylinder
      tube: 0.4, // for the torus
      tubularSegments: 6, // for the torus
    }

    let shape: string = 'unknown'
    // retrieve the shape from the geometry
    const type = mesh.geometry?.type || 'unknown'
    if (/box/i.test(type)) shape = 'box'
    else if (/cone/i.test(type)) shape = 'cone'
    else if (/cylinder/i.test(type)) shape = 'cylinder'
    else if (/extrude/i.test(type)) shape = 'extrude'
    else if (/plane/i.test(type)) shape = 'plane'
    else if (/sphere/i.test(type)) shape = 'sphere'
    else if (/torus/i.test(type)) shape = 'torus'

    if (shape === 'unknown') console.warn('shape unknown')

    // get the right params
    // @ts-ignore
    let params = { ...defaultParams, ...mesh?.geometry?.parameters }

    params = {
      ...params,
      uuid,
      pos: { x: pos.x, y: pos.y, z: pos.z },
      quat: { x: quat.x, y: quat.y, z: quat.z, w: quat.w },
    }

    // create rigidBody
    switch (shape) {
      case 'box':
        this.add.box({ ...params })
        break
      case 'sphere':
        this.add.sphere({ ...params })
        break
    }

    // link rigid body
    this.link(mesh)
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
