
export function getGameConfigFromLs() {
	const result: Partial<GameConfig> = {}

	const animalNumber = localStorage.getItem(`settings.ANIMAL_NUMBER`)
	const spawnRandomly = localStorage.getItem(`settings.ANIMALS_SPAWN_RANDOMLY`)

	if (animalNumber) result.ANIMAL_NUMBER = Number(animalNumber)
	if (spawnRandomly) result.ANIMALS_SPAWN_RANDOMLY = Boolean(spawnRandomly)

	return result
}
