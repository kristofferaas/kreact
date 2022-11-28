// Contants
export const EMPTY_OBJECT = {};
export const EMPTY_ARRAY = [];

// Options
export const options = {};

export function assign(target, obj) {
	for (const key in obj) {
		target[key] = obj[key];
	}
	return target;
}

/**
 * Shallow comparison
 * @param {*} a
 * @param {*} b
 * @returns {boolean} true if a and b is shallowly equal, false otherwise.
 */
export function shallowEquals(a, b) {
	/**
	 * @todo Improve shallow Equals
	 */

	if (a === b) return true;

	const seen = [];
	for (const key in a) {
		if (a.hasOwnProperty(key)) {
			const aValue = a[key];
			const bValue = b[key];
			if (aValue !== bValue) return false;
			seen.push(key);
		}
	}
	for (const key in b) {
		if (b.hasOwnProperty(key) && !(key in seen)) {
			const bValue = b[key];
			const aValue = a[key];
			if (aValue !== bValue) return false;
		}
	}
	return true;
}
