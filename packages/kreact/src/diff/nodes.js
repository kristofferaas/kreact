import { EMPTY_OBJECT } from "../internal";

import { diffChildren } from "./children";
import { diffProps } from "./props";

export function diffNodes(
  dom,
  new_virtual_node,
  old_virtual_node,
  context,
  is_svg,
  excess_dom_children,
  mounts
) {
  let i;
  let old_props = old_virtual_node.props;
  let new_props = new_virtual_node.props;

  is_svg = new_virtual_node.type === "svg" || is_svg;

  if (dom == null && excess_dom_children != null) {
    for (i = 0; i < excess_dom_children.length; i++) {
      const child = excess_dom_children[i];
      if (
        child != null &&
        (new_virtual_node.type === null
          ? child.nodeType === 3
          : child.localName === new_virtual_node.type)
      ) {
        dom = child;
        excess_dom_children[i] = null;
        break;
      }
    }
  }

  if (dom == null) {
    if (new_virtual_node.type === null) {
      return document.createTextNode(new_props);
    }
    dom = is_svg
      ? document.createElementNS(
          "http://www.w3.org/2000/svg",
          new_virtual_node.type
        )
      : document.createElement(new_virtual_node.type);

    excess_dom_children = null;
  }

  if (new_virtual_node.type === null) {
    // Text Node
    if (old_props !== new_props) {
      if (excess_dom_children != null) {
        excess_dom_children[excess_dom_children.indexOf(dom)] = null;
      }
      dom.data = new_props;
    }
  } else if (new_virtual_node !== old_virtual_node) {
    old_props = old_virtual_node.props || EMPTY_OBJECT;

    diffProps(dom, new_props, old_props, is_svg);

    new_virtual_node.$children = new_virtual_node.props.children;

    diffChildren(
      dom,
      new_virtual_node,
      old_virtual_node,
      context,
      is_svg,
      excess_dom_children,
      mounts,
      EMPTY_OBJECT
    );
  }

  return dom;
}
