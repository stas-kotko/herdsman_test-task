import { AnimalFactory, AnimalFactoryConfig } from "./AnimalFactory";

interface SpawnConfig {
	exactPoint?: Phaser.Geom.Point,
	includeArea?: Phaser.Geom.Rectangle,
	excludeArea?: Phaser.Geom.Rectangle
}

export class Spawner extends Phaser.Events.EventEmitter {

	private timerId?: number

	constructor(
		public scene: Phaser.Scene,
	) {
		super()
	}

	spawn(
		what: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[], 
		config: SpawnConfig = {}
	) {

		const {
			exactPoint,
			includeArea,
			excludeArea,
		} = config;

		if (!Array.isArray(what)) {
			what = [what]
		}

		const area = includeArea || this.scene.scale.getViewPort()

		what.forEach(object => {

			if (exactPoint) {
				object.setPosition(exactPoint.x, exactPoint.y)
			} else {
				const spawnPoint = area.getRandomPoint()
		
				if (excludeArea) {
					Phaser.Geom.Rectangle.RandomOutside(area, excludeArea, spawnPoint)
				}
				
				object.setPosition(spawnPoint.x, spawnPoint.y)
			}

			this.emit('spawn', object)
		})

	}
}
