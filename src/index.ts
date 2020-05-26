import { AmmoPhysics } from './ammoPhysics'

const physics = new AmmoPhysics()

physics.init().then(() => {
  const boxBodyId = physics.addBox()
})
