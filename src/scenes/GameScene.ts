import { Herdsman } from "../classes/Herdsman"
import { Animal } from "../classes/Animal"
import { Yard } from "../classes/Yard"
import { AnimalFactory } from "../classes/AnimalFactory"
import { Spawner } from "../classes/Spawner"
import { Group } from "../classes/Group"
import { GameUi } from "../components/GameUi"
import { AnimalSet } from "../classes/AnimalSet"
import { getGameConfigFromLS } from "../utils/getGameConfigFromLs"


const DEFAULT_GAME_CONFIG: GameConfig = {
	MAX_GROUP_CAPACITY: 5,
	ANIMAL_SCALE_RANGE: [0.8, 1.2],
	ANIMALS_SPAWN_RANDOMLY: false,
	ANIMAL_RANDOM_SPAWN_TIME_RANGE: [5_000, 10_000],
	ANIMAL_NUMBER: 12,
}


export default class GameScene extends Phaser.Scene {

    declare player: Herdsman
    declare yard: Yard
    declare ui: GameUi
    declare animals: AnimalSet

    declare GAME_CONFIG: GameConfig

    herdsmanGroup = new Group<Animal>()

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
			...getGameConfigFromLS(),
		}
    }

    create() {
        const scene = this;
        const { width, height } = this.scale;
        const cx = width * 0.5;
        const cy = height * 0.5;
        
        this.add.tileSprite(cx,cy,width, height, 'grass')

        this.yard = new Yard(this, cx, cy, 500, 500, 'hay')

        const spawner = new Spawner(this)

        const chickenFactory = new AnimalFactory(this, 'chick', { 
            randomSizeRange: this.GAME_CONFIG.ANIMAL_SCALE_RANGE
        })

        this.player = new Herdsman(this, this.yard.x, this.yard.y, 'dude', 0, this.GAME_CONFIG.MAX_GROUP_CAPACITY)
        this.player.followers = this.herdsmanGroup;

        this.animals = new AnimalSet(scene);

        this.animals.add(chickenFactory.createMultiple(this.GAME_CONFIG.ANIMAL_NUMBER))

        this.animals.forEach(animal => {
            spawner.spawn(animal, { excludeArea: this.yard.spawnFreeZone.getBounds() } )
        })

        spawner.on('spawn', (spawned: unknown) => {
            if (spawned instanceof Animal) {
                this.animals.add(spawned)
                spawned.startWandering(undefined, this.yard.spawnFreeZone.getBounds())
            }
        })

        this.animals.forEach(animal => {
            animal.startWandering(undefined, this.yard.spawnFreeZone.getBounds())
        })

        if (this.GAME_CONFIG.ANIMALS_SPAWN_RANDOMLY) {
            function startRandomChickenSpawn(timeRange: [number, number]) {
		        const randomTime = Phaser.Math.RND.between(...timeRange)
                
                return setTimeout(() => {
                    const chick = chickenFactory.create({ 
                        randomSizeRange: scene.GAME_CONFIG.ANIMAL_SCALE_RANGE 
                    })
                    spawner.spawn(chick, { excludeArea: scene.yard.spawnFreeZone.getBounds() })
                    scene.ui.update({animalsTotalNumber: scene.animals.size })
                    startRandomChickenSpawn(timeRange)
                }, randomTime)
            }

            startRandomChickenSpawn(this.GAME_CONFIG.ANIMAL_RANDOM_SPAWN_TIME_RANGE)
        }

        this.ui = new GameUi(this, { 
            animalsTotalNumber: this.animals.size, 
            maxGroupCapacity: this.GAME_CONFIG.MAX_GROUP_CAPACITY 
        })
    }

    update() {
        this.ui.update({
            groupSize: this.herdsmanGroup.size,
            animalsReturned: this.yard.animals.size,
            animalsTotalNumber: this.animals.size,
            maxGroupCapacity: this.player.maxGroupCapacity,
        })

        if (this.yard.animals.size === this.animals.size) {
            this.scene.start('GameOver')
        }
    }
}
