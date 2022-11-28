import { tick } from "./diff";
import { createElement } from "./createElement";
import { EMPTY_OBJECT } from "./internal";
import { commitRoot } from "./diff/utils";
import Fragment from "./builtIns/Fragment";

export function render(virtual_node, parent_dom) {
  const old_virtual_node = parent_dom.$children;
  virtual_node = createElement(Fragment, null, [virtual_node]);
  const mounts = [];

  parent_dom.$children = virtual_node;
  tick(
    parent_dom,
    parent_dom.$children,
    old_virtual_node || EMPTY_OBJECT,
    EMPTY_OBJECT,
    parent_dom.ownerSVGElement !== void 0,
    [],
    mounts,
    false,
    EMPTY_OBJECT
  );
  commitRoot(mounts, virtual_node);
}
