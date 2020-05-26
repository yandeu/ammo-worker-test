import { AmmoPhysics } from './ammoPhysics'
import * as THREE from 'three'

//@ts-ignore
import Stats from 'stats.js'
var stats1 = new Stats()
stats1.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.getElementById('stats1')?.appendChild(stats1.dom)
var stats2 = new Stats()
stats2.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.getElementById('stats2')?.appendChild(stats2.dom)

const physics = new AmmoPhysics()

const main = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  camera.position.set(50, 25, 25)
  camera.lookAt(0, 0, 0)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height)
  renderer.setPixelRatio(1)
  document.getElementById('canvas2')?.appendChild(renderer.domElement)

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
  physics.link(ground)

  const sphereGeo = new THREE.SphereGeometry(0.5)
  const boxGeo = new THREE.BoxGeometry(1, 1, 1)
  const mat = new THREE.MeshLambertMaterial({ color: 'orange' })

  const addSphere = () => {
    const sphere = new THREE.Mesh(sphereGeo, mat)
    scene.add(sphere)
    physics.add.sphere({ uuid: sphere.uuid })
    physics.link(sphere)
  }

  const addBox = (x: number, y: number, z: number) => {
    const box = new THREE.Mesh(boxGeo, mat)
    box.name = 'asdfasf'
    box.position.set(x, y, z)
    box.rotation.set(Math.random() * 3, Math.random() * 3, 0)
    scene.add(box)
    physics.add.existing(box)

    setTimeout(() => {
      scene.remove(box)
      physics.destroy(box.uuid)
    }, 10000)
  }

  const interval = setInterval(() => {
    addBox((Math.random() - 0.5) * 10, 20, (Math.random() - 0.5) * 10)
  }, 100)

  setTimeout(() => {
    clearInterval(interval)
  }, 10000)

  // this is only for the stats
  physics.worker.addEventListener('message', e => {
    const { data } = e
    if (data.msg === 'preUpdate') stats2.begin()
    if (data.msg === 'postUpdate') stats2.end()
  })

  const animate = function() {
    stats1.begin()

    renderer.render(scene, camera)

    stats1.end()
    requestAnimationFrame(animate)
  }

  animate()
}

const start = () => {
  return new Promise(resolve => {
    physics.init().then(() => {
      resolve(main)
    })
  })
}

export default start
