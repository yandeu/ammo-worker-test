import { AmmoPhysics } from './ammoPhysics'

// @ts-ignore
import Stats from 'stats.js'

var stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

import * as THREE from 'three'

const physics = new AmmoPhysics()

const main = () => {
  const objects = new Map()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(30, 15, 15)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(0.5)
  document.body.appendChild(renderer.domElement)

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  scene.add(directionalLight)
  var light = new THREE.AmbientLight(0x404040) // soft white light
  scene.add(light)

  // add ground
  const geometry = new THREE.BoxGeometry(40, 1, 40)
  const material = new THREE.MeshLambertMaterial({ color: 'darkgray' })
  const ground = new THREE.Mesh(geometry, material)
  scene.add(ground)
  physics.addBox({
    uuid: ground.uuid,
    width: 40,
    height: 1,
    depth: 40,
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
    physics.addSphere({ uuid: sphere.uuid })
    objects.set(sphere.uuid, sphere)
  }
  const addBox = () => {
    const box = new THREE.Mesh(boxGeo, mat)
    scene.add(box)
    physics.addBox({
      uuid: box.uuid,
      width: 1,
      height: 1,
      depth: 1,
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * 10 + 20,
      z: (Math.random() - 0.5) * 10,
    })
    objects.set(box.uuid, box)
  }

  const addObjects = (count: number) => {
    for (let i = 0; i < count; i++) {
      addSphere()
      addBox()
    }
  }

  // add sphere rain
  addObjects(10)
  const handle = setInterval(() => {
    addObjects(10)
  }, 100)

  setTimeout(() => {
    clearInterval(handle)
  }, 5000)

  const clock = new THREE.Clock()

  physics.onUpdates((updates: any) => {
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
  })

  const animate = function() {
    stats.begin()

    const delta = clock.getDelta()
    // const updates = physics.update(delta * 1000)
    // for (let i = 0; i < updates.length; i += 8) {
    //   let uuid = updates[i + 0]
    //   let px = updates[i + 1]
    //   let py = updates[i + 2]
    //   let pz = updates[i + 3]
    //   let qx = updates[i + 4]
    //   let qy = updates[i + 5]
    //   let qz = updates[i + 6]
    //   let qw = updates[i + 7]
    //   let obj = objects.get(uuid)
    //   // console.log(uuid)
    //   obj.position.set(px, py, pz)
    // }

    renderer.render(scene, camera)

    stats.end()
    requestAnimationFrame(animate)
  }

  animate()
}

const start = () => {
  physics.init().then(() => {
    main()
  })
}

export default start
