export default function pure(target) {
	target.prototype.shouldComponentUpdate = shouldComponentUpdate;
}

export function shouldComponentUpdate(props, state) {
	return !shallowEqual(props, this.props) || !shallowEqual(state, this.state);
}

function shallowEqual(obj, obj2) {
	if (Object.keys(obj).length!==Object.keys(obj2).length) {
		return false;
	}
	for (let i in obj) {
		if (obj.hasOwnProperty(i) && obj2[i]!==obj[i]) {
			return false;
		}
	}
	return true;
}
