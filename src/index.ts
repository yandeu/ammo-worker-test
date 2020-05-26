import { AmmoPhysics } from './ammoPhysics'
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
  camera.position.set(20, 10, 10)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // add ground
  const geometry = new THREE.BoxGeometry(20, 1, 20)
  const material = new THREE.MeshBasicMaterial({ color: 'darkgray' })
  const ground = new THREE.Mesh(geometry, material)
  scene.add(ground)
  physics.addBox(ground.uuid, 20, 1, 20)
  objects.set(ground.uuid, ground)

  const addSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5)
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() * 0xffffff,
    })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)
    physics.addSphere(sphere.uuid)
    objects.set(sphere.uuid, sphere)
  }
  for (let i = 0; i < 100; i++) {
    addSphere()
  }

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
    }
  })

  const animate = function() {
    requestAnimationFrame(animate)

    renderer.render(scene, camera)
  }

  animate()
}

physics.init().then(() => {
  main()
})
