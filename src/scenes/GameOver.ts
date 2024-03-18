
export default class GameOver extends Phaser.Scene {
	constructor() {
		super('GameOver')
	}
	
	preload() {
		this.load.image('restart', 'assets/images/restart-btn.png');
		this.load.image('settings', 'assets/images/settings-btn.png');
}

	create() {
		const { width, height } = this.scale;
		const cx = width * 0.5;
		const cy = height * 0.5;

		const title = this
			.add.text(0,0, 'You Win!', {
				fontSize: '100px',
			})
			.setOrigin(0.5,0.5)

		title.setPosition(cx, cy / 3 + 300)

		const subtitle = this
			.add.text(0,0, "Reload page to play again", {
				fontSize: '72px',
			})
			.setOrigin(0.5, 0.5)

		subtitle.setPosition(cx, cy / 3 + 500)
	}
}
