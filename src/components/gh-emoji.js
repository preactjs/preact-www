import map from './emoji.json';

const REG = /\b:([a-z0-9_]+):\b/gi;

const TO_EMOJI = (s, name) => map[name.toLowerCase()] || s;

export function replace(str) {
	return str.replace(REG, TO_EMOJI);
}
