import { type Herdsman } from "./Herdsman";
import { Movable } from "./Movable";

const START_WANDERING = {
  from: 1000,
  to: 6000,
}

const RANDOM_MOVEMENT_RANGE = 500

export class Animal extends Movable {

  target?: Herdsman | null

  maxSpeed = 250

  declare body: Phaser.Physics.Arcade.Body

  private arbitraryMovementTimerId?: number

  public playerCollider?: Phaser.Physics.Arcade.Collider
  public yardCollider?: Phaser.Physics.Arcade.Collider

  constructor(
    public scene: Phaser.Scene,
    x: number, 
    y: number, 
    texture: string, 
    frame?: string | number | undefined,
  ) {
    super(scene, x, y, texture, frame)

    scene.sys.displayList.add(this);
    scene.sys.updateList.add(this);
    scene.physics.add.existing(this, false);

    this.body.setSlideFactor(0)

    setTimeout(() => {
      this.setCollideWorldBounds(true)
    }, 0) 

    this.scene.events.on('update', () => { checkAnimalDirection(this); })
  }

  follow(who: Herdsman) {
    if (this.target) return

    this.stopWandering()

    this.target = who

    this.scene.events.on('update', () => {
      if (!this.target) return

      const distance = Phaser.Math.Distance.BetweenPoints(this, this.target);

      if (distance > 100) {
        this.target.body && this.moveToPoint(this.target.body.center)
      } else {
        this.setVelocity(0)
      }
    })
  }

  unfollow() {
    this.target = null
    this.setVelocity(0)
    this.emit('unfollow')
  }

  startWandering(bounds?: Phaser.Geom.Rectangle, exclude?: Phaser.Geom.Rectangle) {
    this.arbitraryMovementTimerId = setTimeout(
      () => {
        this.moveToRandomPoint(bounds, exclude)
        this.startWandering(bounds, exclude)
      }, 
      Phaser.Math.RND.between(START_WANDERING.from, START_WANDERING.to),
    )
  }

  stopWandering() {
    this.setVelocity(0)
    clearTimeout(this.arbitraryMovementTimerId)
  }

  moveToRandomPoint(bounds?: Phaser.Geom.Rectangle, exclude?: Phaser.Geom.Rectangle) {

    const range = RANDOM_MOVEMENT_RANGE

    const area = bounds ?? getArea(this, range);

    const randomPoint = getRandomPoint(area, exclude)

    this.moveToPoint(
      new Phaser.Math.Vector2(randomPoint.x, randomPoint.y),
      Phaser.Math.RND.between(50, 500),
    )
  }
}

function checkAnimalDirection(animal: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody) {
  if (animal.body.velocity.x > 5 && !animal.flipX) {
    animal.setFlipX(true)
  } else if (animal.body.velocity.x < -5 && animal.flipX) {
    animal.setFlipX(false)
  }
}


function getRandomPoint(area: Phaser.Geom.Rectangle, exclude?: Phaser.Geom.Rectangle) {
  let result = area.getRandomPoint();

  if (exclude) {
    const intersection = Phaser.Geom.Intersects.GetRectangleIntersection(area, exclude)
		
    if (intersection.width && intersection.height) {

      if (Phaser.Geom.Rectangle.ContainsPoint(intersection, result)) {
        result = getRandomPoint(area, exclude)
      }
    }
  }

  return result
}


function getArea(animal: Animal, range: number) {
  return new Phaser.Geom.Rectangle(
    Math.max(animal.x - range / 2, 0),
    Math.max(animal.y - range / 2, 0),
    range, 
    range,
  )
}