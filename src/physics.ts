export class Physics {
  private tmpBtTrans = new Ammo.btTransform()
  private tmpBtVector3 = new Ammo.btVector3()
  private tmpBtQuaternion = new Ammo.btQuaternion(0, 0, 0, 1)

  public dispatcher: Ammo.btDispatcher
  public physicsWorld: Ammo.btDiscreteDynamicsWorld
  public rigidBodies: Map<string, Ammo.btRigidBody> = new Map()

  private _onUpdates = (updates: any) => {}

  constructor() {
    this.setupPhysicsWorld()
  }

  public setGravity(x: number = 0, y: number = 0, z: number = 0) {
    this.tmpBtVector3.setValue(x, y, z)
    this.physicsWorld.setGravity(this.tmpBtVector3)
  }

  public onUpdates(fnc: (updates: any) => void) {
    this._onUpdates = fnc
  }

  public update(delta: number) {
    let updates: any[] = []

    // step world
    const deltaTime = delta / 1000
    this.physicsWorld.stepSimulation(deltaTime)

    this.rigidBodies.forEach((rb, uuid) => {
      const ms = rb.getMotionState()

      if (ms) {
        ms.getWorldTransform(this.tmpBtTrans)
        let p = this.tmpBtTrans.getOrigin()
        let q = this.tmpBtTrans.getRotation()
        updates.push(uuid, p.x(), p.y(), p.z(), q.x(), q.y(), q.z(), q.w())
      }
    })

    this._onUpdates(updates)
  }

  public addSphere(params: any = {}) {
    const collisionShape = new Ammo.btSphereShape(0.5)

    const { uuid } = params
    const pos = {
      x: (Math.random() - 0.5) * 10,
      y: Math.random() * 10 + 20,
      z: (Math.random() - 0.5) * 10,
    }
    const quat = { x: 0, y: 0, z: 0, w: 1 }
    const mass = 1

    this.collisionShapeToRigidBody(collisionShape, uuid, pos, quat, mass)
  }

  public addBox(params: any = {}) {
    // make collision shape
    const collisionShape = new Ammo.btBoxShape(
      new Ammo.btVector3(params.width / 2, params.height / 2, params.depth / 2)
    )

    const { uuid } = params
    const pos = { x: 0, y: 0, z: 0 }
    const quat = { x: 0, y: 0, z: 0, w: 1 }
    const mass = 0

    this.collisionShapeToRigidBody(collisionShape, uuid, pos, quat, mass, 1)
  }

  public collisionShapeToRigidBody(
    collisionShape: Ammo.btCollisionShape,
    uuid: string,
    pos: any,
    quat: any,
    mass: number,
    collisionFlags = 0
  ) {
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

    // rigid body properties
    if (mass > 0) rigidBody.setActivationState(4) // Disable deactivation
    rigidBody.setCollisionFlags(collisionFlags)
    rigidBody.setRestitution(0.8)

    // ad rigid body to physics world
    this.physicsWorld.addRigidBody(rigidBody)
    this.rigidBodies.set(uuid, rigidBody)
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
