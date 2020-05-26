export class Physics {
  private tmpBtTrans = new Ammo.btTransform()
  private tmpBtVector3 = new Ammo.btVector3()
  private tmpBtQuaternion = new Ammo.btQuaternion(0, 0, 0, 1)

  public dispatcher: Ammo.btDispatcher
  public physicsWorld: Ammo.btDiscreteDynamicsWorld
  public rigidBodies: Map<string, Ammo.btRigidBody> = new Map()

  constructor() {
    this.setupPhysicsWorld()
  }

  public setGravity(x: number = 0, y: number = 0, z: number = 0) {
    this.tmpBtVector3.setValue(x, y, z)
    this.physicsWorld.setGravity(this.tmpBtVector3)
  }

  public getBodyInformation(id: string) {
    return this.rigidBodies.get(id)
  }

  public update(delta: number) {
    // ttep world
    const deltaTime = delta / 1000
    this.physicsWorld.stepSimulation(deltaTime)

    this.rigidBodies.forEach(rb => {
      const ms = rb.getMotionState()

      if (ms) {
        ms.getWorldTransform(this.tmpBtTrans)
        let p = this.tmpBtTrans.getOrigin()
        let q = this.tmpBtTrans.getRotation()
        // console.log(p.x(), p.y(), p.z())
      }
    })
  }

  public addBox(params: any = {}) {
    // log
    console.log('Adding a box with params: ', params)

    // make collision shape
    const collisionShape = new Ammo.btBoxShape(
      new Ammo.btVector3(params.width / 2, params.height / 2, params.depth / 2)
    )

    const { id } = params
    const pos = { x: 0, y: 0, z: 0 }
    const quat = { x: 0, y: 0, z: 0, w: 1 }
    const mass = 1

    // apply position and rotaton
    const transform = new Ammo.btTransform()
    transform.setIdentity()
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z))
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w))

    // create the rigid body
    const motionState = new Ammo.btDefaultMotionState(transform)
    const localInertia = new Ammo.btVector3(0, 0, 0)
    if (mass > 0) collisionShape.calculateLocalInertia(mass, localInertia)
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motionState,
      collisionShape,
      localInertia
    )
    const rigidBody = new Ammo.btRigidBody(rbInfo)
    if (mass > 0) rigidBody.setActivationState(4) // Disable deactivation

    // ad rigid body to physcis world
    this.physicsWorld.addRigidBody(rigidBody)
    this.rigidBodies.set(id, rigidBody)
  }

  public setupPhysicsWorld() {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
    const broadphase = new Ammo.btDbvtBroadphase()
    const solver = new Ammo.btSequentialImpulseConstraintSolver()
    this.dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration)
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      this.dispatcher,
      broadphase,
      solver,
      collisionConfiguration
    )
    this.setGravity(0, -9.81, 0)

    setInterval(() => {
      this.update(16)
    }, 1000 / 60)
  }
}
