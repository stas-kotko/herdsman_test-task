export abstract class Movable extends Phaser.Physics.Arcade.Sprite {

	private targetPoint: Phaser.Math.Vector2 | null = null

	speed?: number | null
	maxSpeed = 800

	constructor(
		public scene: Phaser.Scene,
		x: number, 
		y: number, 
		texture: string, 
		frame?: string | number | undefined
	) {
		super(scene, x, y, texture, frame)

		this.scene.events.on('update', () => {

			if (!this.targetPoint) return

			if (!this.body) return

			if (this.x === this.targetPoint.x && this.y === this.targetPoint.y) return

			const distance = Phaser.Math.Distance.BetweenPoints(this.body.center, this.targetPoint);
			const speed = this.speed || this.maxSpeed;

			this.scene.physics.moveToObject(this, this.targetPoint, speed);

			this.body.velocity.scale(
				Phaser.Math.SmoothStep(distance, 0, speed / 10)
			);

			if (distance < 1) {
				this.body.reset(this.targetPoint.x, this.targetPoint.y);
				this.targetPoint = null
				this.speed = null
			}

		})
	}

	moveToPoint(point: Phaser.Math.Vector2, speed?: number) {
		this.targetPoint = point
		this.speed = speed
	}
}
