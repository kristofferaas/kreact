import { removeNode } from "../DOM";

export function applyReference(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else {
    ref.current = value;
  }
}

export function unMount(virtual_node, parent_virtual_node, skip) {
  let ref;
  // if (options.unMount) options.unMount(virtual_node)

  if ((ref = virtual_node.ref)) {
    applyReference(ref, null, parent_virtual_node);
  }

  let dom;
  if (!skip && typeof virtual_node.type !== "function") {
    skip = (dom = virtual_node.$dom) != null;
  }

  virtual_node.$dom_child = null;
  virtual_node.$dom = null;

  if ((ref = virtual_node.$component) != null) {
    ref.componentWillUnmount && ref.componentWillUnmount();

    ref.base = ref.$parent_dom = null;
  }

  if ((ref = virtual_node.$children)) {
    for (let i = 0; i < ref.length; i++) {
      if (ref[i]) {
        unMount(ref[i], parent_virtual_node, skip);
      }
    }
  }

  if (dom != null) {
    removeNode(dom);
  }
}

export function doRender(props, _state, context) {
  return this.constructor(props, context);
}

export function commitRoot(mounts) {
  let component;

  while ((component = mounts.pop())) {
    component.componentDidMount && component.componentDidMount();
  }
}
