/* eslint-disable brace-style */
/* eslint-disable camelcase */
/**
 * @typedef {import("./component").Component} Component
 */

/**
 * @typedef {Object} VirtualNode
 * @property {(string | Component)} type
 * @property {object} props
 * @property {any} key
 * @property {object} ref
 * @property {(VirtualNode[] | null)} $children
 * @property {(HTMLElement | null)} $parent
 * @property {number} $depth
 * @property {(HTMLElement | null)} $dom
 * @property {(HTMLElement | null)} $dom_child
 * @property {(Component | null)} $component
 * @property {*} constructor
 */

/**
 * createVirtualNode - Creates a virtual node
 * @param {(string | Component)} type - Virtual Node type, HTMLElement name or component
 * @param {object} props - Properties passed to Component.
 * @param {any} key - Uniquely identify VirtualNode among siblings.
 * @param {object} ref - DOM reference to Virtual Node
 * @returns {VirtualNode}
 */
export function createVirtualNode(type, props, key, ref) {
	const virtual_node = {
		type,
		props,
		key,
		ref,
		// Meta
		$children: null,
		$parent: null,
		$depth: 0,
		$dom: null,
		$dom_child: null,
		$component: null,
		constructor: void 0
	};

	// More logic if needed

	return virtual_node;
}

/**
 * Ensures children is an array
 * @param {VirtualNode} children
 * @param {(vnode: VirtualNode) => (VirtualNode)} [callback]
 * @param {VirtualNode[]} [flat]
 */
export function toChildArray(children, callback, flat = []) {
	if (children == null || typeof children === "boolean") {
		if (callback) flat.push(callback(null));
	} else if (Array.isArray(children)) {
		for (let index = 0; index < children.length; index++) {
			const child = children[index];
			toChildArray(child, callback, flat);
		}
	} else {
		flat.push(callback ? callback(toVirtualNode(children)) : children);
	}

	return flat;
}

/**
 *
 * @param {any} primitive
 * @returns {VirtualNode}
 */
export function toVirtualNode(primitive) {
	// Not possible, invalid argument
	if (primitive == null || typeof primitive === "boolean") return null;

	if (typeof primitive === "string" || typeof primitive === "number") {
		// Create a virtual text node
		return createVirtualNode(null, primitive, null, null);
	}

	// Clone virtual_node
	if (primitive.$dom != null || primitive.$component != null) {
		let virtual_node = createVirtualNode(
			primitive.type,
			primitive.props,
			primitive.key,
			null
		);
		virtual_node.$dom = primitive.$dom;
		return virtual_node;
	}

	return primitive;
}
