import { Herdsman } from "../components/Herdsman"
import { Animal } from "../components/Animal"
import { Yard } from "../components/Yard"
import { AnimalFactory } from "../components/AnimalFactory"
import { Spawner } from "../components/Spawner"
import { LimitedSet } from "../components/LimitedSet"
import { GameUi } from "../components/GameUi"
import { AnimalSet } from "../components/AnimalSet"
import { getGameConfigFromLs } from "../utils/getGameConfigFromLs"
import { startRandomAnimalSpawn } from "../utils/startRandomAnimalSpawn"


const DEFAULT_GAME_CONFIG: GameConfig = {
  MAX_GROUP_CAPACITY: 5,
  ANIMAL_SCALE_RANGE: [0.8, 1.2],
  ANIMALS_SPAWN_RANDOMLY: false,
  ANIMAL_RANDOM_SPAWN_TIME_RANGE: [5_000, 10_000],
  ANIMAL_NUMBER: 12,
}


export default class GameScene extends Phaser.Scene {

  declare player: Herdsman
  declare animals: AnimalSet
  declare yard: Yard
  declare ui: GameUi
  declare herdsmanGroup: LimitedSet<Animal>

  declare GAME_CONFIG: GameConfig


  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('sky', 'assets/images/sky.png');
    this.load.image('dude', 'assets/images/dude.png');
    this.load.image('chick', 'assets/images/chick.png');
    this.load.image('grass', 'assets/images/grass2.png');
    this.load.image('hay', 'assets/images/hay.png');
    this.load.image('menu', 'assets/images/menu-btn.png');

    this.GAME_CONFIG = {
      ...DEFAULT_GAME_CONFIG,
      ...getGameConfigFromLs(),
    }
  }

  create() {
    const { width, height } = this.scale;
    const cx = width * 0.5;
    const cy = height * 0.5;
        
    this.add.tileSprite(cx,cy,width, height, 'grass')

    this.yard = new Yard(this, cx, cy, 500, 500, 'hay')

    const spawner = new Spawner(this)

    const chickenFactory = new AnimalFactory(this, 'chick', { 
      randomSizeRange: this.GAME_CONFIG.ANIMAL_SCALE_RANGE,
    })

    this.herdsmanGroup = new LimitedSet<Animal>(this.GAME_CONFIG.MAX_GROUP_CAPACITY)

    this.player = new Herdsman(
      this, 
      this.yard.x, 
      this.yard.y, 
      'dude', 
      this.herdsmanGroup,
    )

    this.animals = new AnimalSet(
      this,
      chickenFactory.createMultiple(this.GAME_CONFIG.ANIMAL_NUMBER),
    );

    this.animals.forEach((animal: Animal) => {
      spawner.spawn(
        animal, 
        { excludeArea: this.yard.spawnFreeZone.getBounds() }, 
      )

      animal.startWandering(undefined, this.yard.spawnFreeZone.getBounds())
    })

    spawner.on('spawn', (spawned: unknown) => {
      if (spawned instanceof Animal) {
        this.animals.add(spawned)
        spawned.startWandering(undefined, this.yard.spawnFreeZone.getBounds())
      }
    })

    if (this.GAME_CONFIG.ANIMALS_SPAWN_RANDOMLY) {
      startRandomAnimalSpawn(
        chickenFactory,
        spawner,
        {
          timeRange: this.GAME_CONFIG.ANIMAL_RANDOM_SPAWN_TIME_RANGE,
          scaleRange: this.GAME_CONFIG.ANIMAL_SCALE_RANGE,
          excludeArea: this.yard.spawnFreeZone.getBounds(),
        },
        () => { this.ui.update({animalsTotalNumber: this.animals.size }); },
      )
    }

    this.ui = new GameUi(this, { 
      animalsTotalNumber: this.animals.size, 
      maxGroupCapacity: this.GAME_CONFIG.MAX_GROUP_CAPACITY, 
    })
  }

  update() {
    this.ui.update({
      groupSize: this.herdsmanGroup.size,
      animalsReturned: this.yard.animals.size,
      animalsTotalNumber: this.animals.size,
      maxGroupCapacity: this.herdsmanGroup.maxCapacity,
    })

    if (this.yard.animals.size === this.animals.size) {
      this.scene.start('GameOver')
    }
  }
}
