import { Animal } from "./Animal"

export class Yard extends Phaser.GameObjects.TileSprite {
	animals: Set<Animal> = new Set()

	declare body: Phaser.Physics.Arcade.Body

	spawnFreeZone: Phaser.GameObjects.Rectangle

	private spawnFreeZoneValue = 100

	constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, texture: string) {
		super(scene, x, y, width, height, texture)

		scene.sys.displayList.add(this);
		scene.physics.add.existing(this, true)

		this.spawnFreeZone = scene.add.rectangle(
			x, 
			y, 
			this.width + this.spawnFreeZoneValue * 2, 
			this.height + this.spawnFreeZoneValue * 2, 
		)
	}

	adoptAnimal(animal: Animal) {
		this.animals.add(animal)
	}
}