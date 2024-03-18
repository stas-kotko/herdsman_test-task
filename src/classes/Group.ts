export class Group<T> {
	maxCapacity = 5
	members: Set<T>

	constructor(
		initMembers?: Set<T>,
	) {
		this.members = initMembers || new Set<T>()
	}

	get size() {
		return this.members.size
	}

	canAdd() {
		return this.members.size < this.maxCapacity
	}

	add(member: T) {
		if (this.canAdd()) {
			this.members.add(member)
		}
	}

	dismiss(member: T) {
		this.members.delete(member)
	}

	dismissAll() {
		this.members.clear()
	}
}