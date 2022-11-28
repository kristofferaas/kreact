/* eslint-disable camelcase */
import { diff } from "./diff";
import { Component } from "./component";
import { createElement } from "./createElement";
import { EMPTY_OBJECT, EMPTY_ARRAY } from "./internal";
import { commitRoot } from "./diff/utils";
import Fragment from "./builtIns/Fragment";

export { createElement, Component };

export function render(virtual_node, parent_dom, replace) {
	// if (options.$root) options.$root(virtual_node, parent_dom);

	const is_hydrating = replace === EMPTY_OBJECT;
	const old_virtual_node = is_hydrating
		? null
		: (replace && replace.$children) || parent_dom.$children;

	virtual_node = createElement(Fragment, null, [virtual_node]);

	const mounts = [];

	diff(
		parent_dom,
		is_hydrating
			? (parent_dom.$children = virtual_node)
			: ((replace || parent_dom).$children = virtual_node),
		old_virtual_node || EMPTY_OBJECT,
		EMPTY_OBJECT,
		parent_dom.ownerSVGElement !== void 0,
		replace && !is_hydrating
			? [replace]
			: old_virtual_node
			? null
			: EMPTY_ARRAY.slice.call(parent_dom.childNodes),
		mounts,
		false,
		replace || EMPTY_OBJECT,
		is_hydrating
	);
	commitRoot(mounts, virtual_node);
}
