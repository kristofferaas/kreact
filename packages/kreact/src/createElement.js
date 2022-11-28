import { createVirtualNode } from "./virtualNode";
import { assign } from "./internal";

/**
 * @typedef {import("./component").Component} Component
 */

/**
 *
 * @param {string | Component} type
 * @param {object} attributes
 * @param {*} [children]
 */
export function createElement(type, attributes, children) {
	const props = assign({}, attributes);

	if (arguments.length > 3) {
		children = [children];
		for (let i = 3; i < arguments.length; i++) {
			children.push(arguments[i]);
		}
	}

	if (children != null) {
		props.children = children;
	}

	const ref = props.ref;
	if (ref != null) delete props.ref;

	const key = props.key;
	if (key != null) delete props.key;

	return createVirtualNode(type, props, key, ref);
}

export function createReference() {
	return {};
}
