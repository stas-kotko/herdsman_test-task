export default class StartScene extends Phaser.Scene {

  constructor() {
    super('Start')
  }
	
  preload() {
    this.load.image('start', 'assets/images/start-btn.png');
    this.load.image('settings', 'assets/images/settings-btn.png');
  }

  create() {
    const { width, height } = this.scale;
    const cx = width * 0.5;
    const cy = height * 0.5;

    this.add.image(cx, cy, 'start')
      .setInteractive()
      .once('pointerdown', () => {
        this.scene.start('Game')
      })

    this.add.image(cx, cy + 100, 'settings')
      .setInteractive()
      .once('pointerdown', () => {
        this.scene.start('Settings')
      })

    const title = this.add.text(0,0, 'Herdsman', {
      fontSize: '84px',
      align: 'center',
    })

    title.setPosition(cx - title.width / 2, height / 3)

  }
}
