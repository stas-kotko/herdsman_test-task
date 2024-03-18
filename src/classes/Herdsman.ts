import { Animal } from "./Animal"
import { Group } from "./Group"
import { Movable } from "./Movable"

export class Herdsman extends Movable {

	public maxSpeed = 600
	public maxGroupCapacity

	public followers = new Group<Animal>
	private defaultMaxGroupCapacity = 5

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string,
		frame?: string | number,
		maxGroupCapacity?: number
	) {
		super(scene, x, y, texture, frame)

		this.maxGroupCapacity = maxGroupCapacity || this.defaultMaxGroupCapacity

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
			throw new Error(`Herdsman: Max group capacity (${this.maxGroupCapacity}) already reached`)
		}
	}

	canAddFollower() {
		return this.followers.canAdd()
	}
}
