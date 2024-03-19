
export default class SettingsScene extends Phaser.Scene {

  animalNumber =  12
  isSpawnedRandomly =  false

  constructor() {
    super('Settings')
  }

  init() {
    this.animalNumber = Number(localStorage.getItem('settings.ANIMAL_NUMBER')) || this.animalNumber
    this.isSpawnedRandomly = Boolean(localStorage.getItem('settings.ANIMALS_SPAWN_RANDOMLY')) || this.isSpawnedRandomly
  }
	
  preload() {
    this.load.image('back', 'assets/images/back-btn.png');
    this.load.image('checkbox-checked', 'assets/images/box-checked.png');
    this.load.image('checkbox-unchecked', 'assets/images/box-unchecked.png');
    this.load.image('plus', 'assets/images/plus.png');
    this.load.image('minus', 'assets/images/minus.png');
  }

  create() {
    const centerX = this.scale.width * 0.5;

    const title = this.add.text(0,0, 'Settings', {
      fontSize: '62px',
      align: 'center',
    })

    title.setPosition(centerX - title.width / 2, 300)

    this
      .add.image(centerX, 100, 'back')
      .setInteractive()
      .once('pointerdown', () => {
        this.scene.start('Start')
      })

    const randomSpawnCheckbox = this.add.image(600, 650, this.isSpawnedRandomly ? 'checkbox-checked' : 'checkbox-unchecked')
      .setInteractive()
      .on('pointerdown', () => {
        this.isSpawnedRandomly = !this.isSpawnedRandomly
        localStorage.setItem('settings.ANIMALS_SPAWN_RANDOMLY', this.isSpawnedRandomly.toString())
        randomSpawnCheckbox.setTexture(this.isSpawnedRandomly ? 'checkbox-checked' :  'checkbox-unchecked')
      })

    this.add.text(randomSpawnCheckbox.x + 150 , randomSpawnCheckbox.y, 'Spawn Animals Randomly')
      .setFontSize(78)
      .setOrigin(0, 0.5)

    const animalInput = this.add.image(600, 500, 'checkbox-unchecked')
    const animalCountInputText = this.add.text(animalInput.x, animalInput.y, this.animalNumber.toString())
      .setColor('#ffffff')
      .setFontSize(50)
      .setOrigin(0.5, 0.5)

    this.add.text(animalInput.x + 150, animalInput.y, 'Number of Animals')
      .setColor('#ffffff')
      .setFontSize(78)
      .setOrigin(0, 0.5)
		

    this.add.image(600 + 80, 500, 'plus')
      .setInteractive()
      .on('pointerdown', () => {
        this.animalNumber++
        localStorage.setItem('settings.ANIMAL_NUMBER', this.animalNumber.toString())
        animalCountInputText.setText(this.animalNumber.toString())
      })
			
    this.add.image(600 - 80, 500, 'minus')
      .setInteractive()
      .on('pointerdown', () => {
        this.animalNumber--
        localStorage.setItem('settings.ANIMAL_NUMBER', this.animalNumber.toString())
        animalCountInputText.setText(this.animalNumber.toString())
      })
  }
}
