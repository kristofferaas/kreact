/* eslint-disable camelcase */
import { diff } from "./diff";
import { assign } from "./internal";
import { commitRoot } from "./diff/utils";

/**
 * @class Component
 * @classdesc Base component class, extends classes to make them components
 * @param {object} props
 * @param {object} context
 * @property {object} $context Internal: Context object.
 * @property {boolean} $dirty Internal: Dirty flag.
 * @property {object} $next_state Internal: Next state.
 * @property {(HTMLElement | null)} $parent_dom Internal: DOM reference to parent.
 * @property {*} $render_callbacks Internal: Callback for when render is done.
 * @property {VirtualNode} $virtual_node Internal: VirtualNode of Component.
 */
export class Component {
	constructor(props, context) {
		this.props = props;
		this.context = context;
	}

	/**
	 * @callback update
	 * @param {object} state
	 * @returns {object}
	 */

	/**
	 * @param {(object | update)} update
	 * @param {function?} callback
	 */
	setState(update, callback) {
		const state =
			this.$next_state !== this.state
				? this.$next_state
				: (this.$next_state = assign({}, this.state));

		if (typeof update !== "function" || (update = update(state, this.props)))
			assign(state, update);

		if (update == null) return;

		if (this.$virtual_node) {
			callback && this.$render_callbacks.push(callback);

			queueRender(this);
		}
	}

	/**
	 * Forces component to update
	 * @param {()=>{}} callback
	 */
	forceUpdate(callback) {
		const virtual_node = this.$virtual_node,
			old_dom = this.$virtual_node.$dom,
			parent_dom = this.$parent_dom;

		if (parent_dom) {
			const force = callback !== false;

			const old_virtual_node = assign({}, virtual_node);

			const mounts = [];

			const new_dom = diff(
				parent_dom,
				virtual_node,
				old_virtual_node,
				this.$context,
				parent_dom.ownerSVGElement !== undefined,
				null,
				mounts,
				force,
				old_dom == null ? getDomSibling(virtual_node) : old_dom
			);

			commitRoot(mounts, virtual_node);

			if (new_dom != old_dom) updateParentDomPointers(virtual_node);
		}
		callback && callback();
	}
}

export function getDomSibling(virtual_node, index) {
	if (index == null) {
		return virtual_node.$parent
			? getDomSibling(
					virtual_node.$parent,
					virtual_node.$parent.$children.indexOf(virtual_node) + 1
			  )
			: null;
	}

	let sibling;
	for (index; index < virtual_node.$children.length; index++) {
		sibling = virtual_node.$children[index];

		if (sibling != null && sibling.$dom != null) return sibling.$dom;
	}

	return typeof virtual_node.type === "function"
		? getDomSibling(virtual_node)
		: null;
}

export function updateParentDomPointers(virtual_node) {
	virtual_node = virtual_node.$parent;

	if (virtual_node != null && virtual_node.$component != null) {
		virtual_node.$dom = virtual_node.$component.base = null;

		for (let i = 0; i < virtual_node.$children.length; i++) {
			const child = virtual_node.$children[i];

			if (child != null && child.$dom != null) {
				virtual_node.$dom = virtual_node.$component.base = child.$dom;
				break;
			}
		}

		return updateParentDomPointers(virtual_node);
	}
}

/**
 * @private
 * @function queueRender
 * @param {*} component
 */
const _queue = [];

export function queueRender(component) {
	if (!component.$dirty) component.$dirty = true;

	if (_queue.push(component) === 1) Promise.resolve().then(flushRenderQueue);
}

export function flushRenderQueue() {
	let flush;
	_queue.sort((a, b) => b.$virtual_node.$depth - a.$virtual_node.$depth);
	while ((flush = _queue.pop())) {
		if (flush.$dirty) flush.forceUpdate();
	}
}
