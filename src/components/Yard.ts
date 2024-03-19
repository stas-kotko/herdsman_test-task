import { type Animal } from "./Animal"

export class Yard extends Phaser.GameObjects.TileSprite {
	
  declare body: Phaser.Physics.Arcade.Body
	
  private spawnFreeZoneValue = 100
	
  public animals = new Set<Animal>()
  public spawnFreeZone: Phaser.GameObjects.Rectangle

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