import { AnimalFactory } from "../components/AnimalFactory";
import { Spawner } from "../components/Spawner";

interface RandomSpawnerConfig {
	timeRange: [number, number]
	scaleRange?: [number, number]
	excludeArea?: Phaser.Geom.Rectangle
}

export function startRandomAnimalSpawn(
	factory: AnimalFactory, 
	spawner: Spawner, 
	config: RandomSpawnerConfig,
	callback?: () => any,
) {
	const { timeRange, scaleRange, excludeArea } = config;

	const randomTime = Phaser.Math.RND.between(...timeRange)
	const randomSize = Phaser.Math.RND.between(...scaleRange || [1, 1])
	
	return setTimeout(() => {
			const chick = factory.create({
					size: randomSize
			})
			spawner.spawn(chick, { excludeArea })
			callback && callback()
			startRandomAnimalSpawn(factory, spawner, config, callback)
	}, randomTime)
}