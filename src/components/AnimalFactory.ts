import { Animal } from "./Animal";

export interface AnimalFactoryConfig {
  texture?: string
  randomSizeRange?: [number, number]
  size?: number
  frame?: string
}

export class AnimalFactory {
  constructor(
    public scene: Phaser.Scene,
    private readonly texture: string,
    private readonly config: AnimalFactoryConfig = {},
  ) {}

  create(config: AnimalFactoryConfig = {}) {
    const animal = new Animal(
      this.scene, 
      0, 
      0, 
      config.texture ?? this.texture, 
      config.frame,
    )

    const randomSizeRange = config.randomSizeRange ?? this.config.randomSizeRange

    if (randomSizeRange) {
      animal.setScale(Phaser.Math.RND.realInRange(
        randomSizeRange[0],
        randomSizeRange[1],
      )) 
    } else {
      animal.setScale(config.size)
    }

    return animal
  }

  createMultiple(quantity: number, config: AnimalFactoryConfig = {}): Animal[] {
    const animals: Animal[] = []

    for (let i = 0; i < quantity; i++) {
      animals.push(this.create(config))
    }
	
    return animals
  }
}