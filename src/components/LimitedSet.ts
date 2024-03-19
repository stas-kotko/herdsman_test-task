export class LimitedSet<T> extends Set {
	private _maxCapacity = 5

	constructor(
		maxCapacity: number,
	) {
		super()

		this._maxCapacity = maxCapacity
	}

	get maxCapacity() {
		return this._maxCapacity
	}

	canAdd() {
		return this.size < this._maxCapacity
	}

	add(member: T) {
		if (this.canAdd()) {
			super.add(member)
		}
		return this
	}
}