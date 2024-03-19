import { Animal } from "./Animal"
import { LimitedSet } from "./LimitedSet"
import { Movable } from "./Movable"

export class Herdsman extends Movable {

	public maxSpeed = 600

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string,
		public followers: LimitedSet<Animal>
	) {
		super(scene, x, y, texture)

		this.setDepth(10)

		scene.sys.displayList.add(this);
		scene.sys.updateList.add(this);
		scene.physics.add.existing(this, false);
		
		scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
			this.moveToPoint(new Phaser.Math.Vector2(pointer.x, pointer.y))
		})

		setTimeout(() => {
			this.setCollideWorldBounds(true)
		}, 0)
	}

	addFollower(follower: Animal) {
		if (this.canAddFollower()) {
			this.followers.add(follower)
		} else {
			throw new Error(`Herdsman: Max group capacity (${this.followers.maxCapacity}) already reached`)
		}
	}

	canAddFollower() {
		return this.followers.canAdd()
	}
}
