import GameScene from "../scenes/GameScene";
import { Animal } from "./Animal";
import { Herdsman } from "./Herdsman";
import { Yard } from "./Yard";

export class AnimalSet extends Set {

	constructor(
		public scene: GameScene,
		initValues?: Animal[]
	) {	
		super()

		initValues && this.add(initValues)
	}

	add(animals: Animal | Animal[]) {

		if (!Array.isArray(animals)) {
			animals = [animals]
		}

		animals.forEach(animal => {
			this.configureAnimal(animal)
			super.add(animal)
		})
		
		return this
	}

	private configureAnimal(animal: Animal) {
		animal.playerCollider = this.scene.physics.add.overlap(
				this.scene.player,
				animal, 
				this.animalPlayerCollideHandler as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
		)

		animal.yardCollider = this.scene.physics.add.overlap(
				animal, 
				this.scene.yard, 
				this.animalYardOverlapHandler as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback
		)

		animal.yardCollider.active = false

		animal.on('unfollow', () => {
				this.scene.herdsmanGroup.dismiss(animal)
		})
	}

	private animalYardOverlapHandler(animal: Animal, yard: Yard) {

		animal.yardCollider?.destroy()

		yard.adoptAnimal(animal)
		
		animal.unfollow()
		animal.moveToPoint(yard.getCenter())
		animal.startWandering(yard.getBounds())
	}

	private animalPlayerCollideHandler(player: Herdsman, animal: Animal) {
		if (player.canAddFollower()) {
				player.addFollower(animal)
				
				animal.playerCollider?.destroy()
				animal.yardCollider && (animal.yardCollider.active = true)
				
				animal.follow(player)
		}
	}
}
