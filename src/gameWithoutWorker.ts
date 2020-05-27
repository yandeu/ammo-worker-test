import { Physics } from './physics/physics'
import * as THREE from 'three'
import { createObjects, DPI } from './common'

// @ts-ignore
import Stats from 'stats.js'

const main = () => {
  var stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.getElementById('stats1')?.appendChild(stats.dom)

  const physics = new Physics()
  const objects = new Map()

  const width = window.innerWidth / 2 - 1
  const height = window.innerHeight

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  camera.position.set(50, 25, 25)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  renderer.setPixelRatio(DPI)
  document.getElementById('canvas1')?.appendChild(renderer.domElement)

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  scene.add(directionalLight)
  var light = new THREE.AmbientLight(0x404040) // soft white light
  scene.add(light)

  // add ground
  const geometry = new THREE.BoxGeometry(20, 1, 20)
  const material = new THREE.MeshLambertMaterial({ color: 'darkgray' })
  const ground = new THREE.Mesh(geometry, material)
  scene.add(ground)
  physics.add.box({
    uuid: ground.uuid,
    width: 20,
    height: 1,
    depth: 20,
    collisionFlags: 1,
    mass: 0,
  })
  objects.set(ground.uuid, ground)

  const sphereGeo = new THREE.SphereGeometry(0.5)
  const boxGeo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshLambertMaterial({ color: 'orange' })

  const addSphere = () => {
    const sphere = new THREE.Mesh(sphereGeo, mat)
    scene.add(sphere)
    physics.add.sphere({ uuid: sphere.uuid })
    objects.set(sphere.uuid, sphere)
  }
  const addBox = (x?: number, y?: number, z?: number) => {
    const box = new THREE.Mesh(boxGeo, mat)
    scene.add(box)
    physics.add.box({
      uuid: box.uuid,
      width: 1,
      height: 1,
      depth: 1,
      x: x || (Math.random() - 0.5) * 10,
      y: y || Math.random() * 10 + 20,
      z: z || (Math.random() - 0.5) * 10,
    })
    objects.set(box.uuid, box)
  }

  const addObjects = (count: number) => {
    for (let i = 0; i < count; i++) {
      addSphere()
      addBox()
    }
  }

  // for (let x = -5; x < 5; x++) {
  //   for (let z = -5; z < 5; z++) {
  //     for (let y = 20; y < 30; y++) {
  //       addBox(x * 1.2, y * 1.2, z * 1.2)
  //     }
  //   }
  // }

  createObjects(addObjects)

  stats.begin()

  const clock = new THREE.Clock()

  const animate = function() {
    const delta = clock.getDelta()
    const updates = physics.update(delta * 1000)
    for (let i = 0; i < updates.length; i += 8) {
      let uuid = updates[i + 0]
      let px = updates[i + 1]
      let py = updates[i + 2]
      let pz = updates[i + 3]
      let qx = updates[i + 4]
      let qy = updates[i + 5]
      let qz = updates[i + 6]
      let qw = updates[i + 7]
      let obj = objects.get(uuid)
      obj.position.set(px, py, pz)
      obj.rotation.setFromQuaternion(new THREE.Quaternion(qx, qy, qz, qw))
    }

    renderer.render(scene, camera)
    stats.end()

    requestAnimationFrame(animate)
  }

  animate()
}

const start = () => {
  return new Promise(resolve => {
    var s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = '/lib/ammo.js'
    s.onload = () => {
      Ammo().then(() => {
        resolve(main)
      })
    }
    document.body.append(s)
  })
}

export default start
