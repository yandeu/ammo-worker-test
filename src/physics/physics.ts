import { AmmoDebugDrawer } from '../debugDrawer'

export class Physics {
  private tmpBtTrans = new Ammo.btTransform()
  private tmpBtVector3 = new Ammo.btVector3()
  private tmpBtQuaternion = new Ammo.btQuaternion(0, 0, 0, 1)

  public dispatcher: Ammo.btDispatcher
  public physicsWorld: Ammo.btDiscreteDynamicsWorld
  public rigidBodies: Map<string, Ammo.btRigidBody> = new Map()

  public debugDrawer: AmmoDebugDrawer

  constructor() {
    this.setupPhysicsWorld()
  }

  public debugDrawerInit(debugVertices: any, debugColors: any) {
    this.debugDrawer = new AmmoDebugDrawer(
      null,
      debugVertices,
      debugColors,
      this.physicsWorld
    )
    this.debugDrawer.enable()
  }

  public debugDrawerUpdate() {
    if (!this.debugDrawer || !this.debugDrawer.enabled) return false
    this.debugDrawer.update()
    return true
  }

  public setGravity(x: number = 0, y: number = 0, z: number = 0) {
    this.tmpBtVector3.setValue(x, y, z)
    this.physicsWorld.setGravity(this.tmpBtVector3)
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

    return updates
  }

  public get add() {
    return {
      box: (params: any) => this.addBox(params),
      sphere: (params: any) => this.addSphere(params),
    }
  }

  public destroy(uuid: string) {
    const rb = this.rigidBodies.get(uuid)
    if (rb) this.physicsWorld.removeRigidBody(rb)
  }

  private addBox(params: any = {}) {
    const { width = 1, height = 1, depth = 1 } = params
    const boxHalfExtents = new Ammo.btVector3(width / 2, height / 2, depth / 2)
    const collisionShape = new Ammo.btBoxShape(boxHalfExtents)
    this.collisionShapeToRigidBody(collisionShape, params)
  }

  private addSphere(params: any = {}) {
    const { radius = 1 } = params
    const collisionShape = new Ammo.btSphereShape(radius / 2)
    this.collisionShapeToRigidBody(collisionShape, params)
  }

  public collisionShapeToRigidBody(
    collisionShape: Ammo.btCollisionShape,
    params: any = {}
  ) {
    // apply params
    const {
      uuid,
      mass = 1,
      collisionFlags = 0,
      pos = { x: 0, y: 0, z: 0 },
      quat = { x: 0, y: 0, z: 0, w: 1 },
    } = params

    // we need a uuid!
    if (typeof uuid === 'undefined') {
      console.warn('Please provide an uuid')
      return
    }

    // apply position and rotation
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
    this.setGravity(0, -9.81 * 2, 0)
  }
}
