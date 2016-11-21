export default function pure(target) {
	target.prototype.shouldComponentUpdate = shouldComponentUpdate;
}

export function shouldComponentUpdate(props, state) {
	return !shallowEqual(props, this.props) || !shallowEqual(state, this.state);
}

function shallowEqual(obj, obj2) {
	for (let i in obj) {
		if (i=='children' ? (obj[i].length!==obj2[i].length || obj[i][0]!==obj[i][0]) : obj[i]!==obj2[i]) return false;
	}
	for (let i in obj2) {
		if (!(i in obj)) return false;
	}
	return true;
}
