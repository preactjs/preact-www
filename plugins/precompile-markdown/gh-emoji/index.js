import map from './emoji.json';

const REG = /([^\\]):([a-z0-9_]+):/gi;

const TO_EMOJI = (s, p, name) => {
	name = name.toLowerCase();
	if (map.hasOwnProperty(name)) s = p + map[name];
	return s;
};

export function replace(str) {
	return str.replace(REG, TO_EMOJI);
}
