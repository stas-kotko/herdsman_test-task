interface GameUiUpdateParams { 
	groupSize: string | number
	maxGroupCapacity: string | number
	animalsReturned: string | number
	animalsTotalNumber: string  | number
}

export class GameUi {
	private firstLineText: Phaser.GameObjects.Text
	private secondLineText: Phaser.GameObjects.Text

	state: GameUiUpdateParams = {
		groupSize: 0,
		maxGroupCapacity: 0,
		animalsReturned: 0,
		animalsTotalNumber: 0,
	}

	constructor(
			scene: Phaser.Scene,
			config: Partial<GameUiUpdateParams> = {}
	){
		this.state = { ...this.state, ...config };

			const padding = 15
			const textStyle: Phaser.Types.GameObjects.Text.TextStyle = { 
					color: '#ffffff', 
					fontSize: 36, 
					fontStyle: 'bold', 
			}

			const background = scene.add.rectangle(0, 0, 0, 0 ,0x111111, 0.9).setOrigin(0,0); 
			
			this.firstLineText = scene.add.text(
					padding, 
					padding, 
					this.getFirstLine(this.state.animalsReturned, this.state.animalsTotalNumber), 
					textStyle
			);

			this.secondLineText = scene.add.text(
					padding, 
					this.firstLineText.height + padding * 2, 
					this.getSecondLine(this.state.groupSize, this.state.maxGroupCapacity), 
					textStyle
			)

			background.width = Math.max(this.firstLineText.width, this.secondLineText.width) + padding * 3;
			background.height = this.firstLineText.height + this.secondLineText.height + padding * 3;

			scene.add.container(0, 0, [
					background,
					this.firstLineText,
					this.secondLineText
			]).setDepth(100)
	}

	private getFirstLine(a: string | number, b: string | number) {
			return `Animals returned: ${a} / ${b}`
	}

	private getSecondLine(a: string | number, b: string | number) {
			return `Followers: ${a} / ${b}`
	}

	update({ groupSize, maxGroupCapacity, animalsReturned, animalsTotalNumber }: Partial<GameUiUpdateParams>) {
		const prevState = this.state

		this.firstLineText.setText(this.getFirstLine(
			animalsReturned || prevState.animalsReturned, 
			animalsTotalNumber || prevState.animalsTotalNumber
		))

		this.secondLineText.setText(this.getSecondLine(
			groupSize || prevState.groupSize, 
			maxGroupCapacity || prevState.maxGroupCapacity
		))

	}
}