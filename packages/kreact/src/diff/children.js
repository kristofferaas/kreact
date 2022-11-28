import { toChildArray } from "../virtualNode";
import { getDomSibling } from "../component";
import { removeNode } from "../DOM";
import { EMPTY_ARRAY, EMPTY_OBJECT } from "../internal";

import { diff } from "./";
import { unMount, applyReference } from "./utils";

export function diffChildren(
  parent_dom,
  new_parent_virtual_node,
  old_parent_virtual_node,
  context,
  is_svg,
  excess_dom_children,
  mounts,
  old_dom
) {
  let i, j, old_child, new_dom, first_child_dom, refs, sibling_dom;

  let old_children =
    (old_parent_virtual_node && old_parent_virtual_node.$children) ||
    EMPTY_ARRAY;

  const old_children_length = old_children.length;

  if (old_dom == EMPTY_OBJECT) {
    if (excess_dom_children != null) {
      old_dom = excess_dom_children[0];
    } else if (old_children_length) {
      old_dom = getDomSibling(old_parent_virtual_node, 0);
    } else {
      old_dom = null;
    }
  }

  i = 0;
  new_parent_virtual_node.$children = toChildArray(
    new_parent_virtual_node.$children,
    (new_child) => {
      new_child;

      if (new_child != null) {
        new_child.$parent = new_parent_virtual_node;
        new_child.$depth = new_parent_virtual_node.$depth + 1;

        old_child = old_children[i];

        if (
          old_child === null ||
          (old_child &&
            new_child.key == old_child.key &&
            new_child.type === old_child.type)
        ) {
          old_children[i] = void 0;
        } else {
          for (j = 0; j < old_children.length; j++) {
            old_child = old_children[j];

            if (
              old_child &&
              new_child.key == old_child.key &&
              new_child.key === old_child.type
            ) {
              old_children[j] = void 0;
              break;
            }

            old_child = null;
          }
        }

        old_child = old_child || EMPTY_OBJECT;

        new_dom = diff(
          parent_dom,
          new_child,
          old_child,
          context,
          is_svg,
          excess_dom_children,
          mounts,
          null,
          old_dom
        );

        if ((j = new_child.ref) && old_child.ref != j) {
          refs = refs || [];
          refs.push(j, new_child.$component || new_dom, new_child);
        }

        if (new_dom != null) {
          if (first_child_dom == null) {
            first_child_dom = new_dom;
          }

          if (new_child.$dom_child != null) {
            new_dom = new_child.$dom_child;

            new_child.$dom_child = null;
          } else if (
            excess_dom_children == old_child ||
            new_dom != old_dom ||
            new_dom.parentNode == null
          ) {
            block: {
              if (old_dom == null || old_dom.parentNode !== parent_dom) {
                parent_dom.appendChild(new_dom);
              } else {
                sibling_dom = old_dom;
                for (
                  j = 0;
                  (sibling_dom = sibling_dom.nextSibling) &&
                  j < old_children_length;
                  j++
                ) {
                  if (sibling_dom == new_dom) {
                    break block;
                  }
                }
                parent_dom.insertBefore(new_dom, old_dom);
              }
            }

            // if (new_parent_virtual_node.type == "option") {
            // 	parent_dom.value = ""
            // }
          }

          old_dom = new_dom.nextSibling;

          if (typeof new_parent_virtual_node.type === "function") {
            new_parent_virtual_node.$dom_child = new_dom;
          }
        }
      }
      i++;
      return new_child;
    }
  );

  new_parent_virtual_node.$dom = first_child_dom;

  if (
    excess_dom_children != null &&
    typeof new_parent_virtual_node.type !== "function"
  ) {
    for (i = excess_dom_children.length; i--; ) {
      if (excess_dom_children[i] != null) {
        removeNode(excess_dom_children[i]);
      }
    }
  }

  for (i = old_children_length; i--; ) {
    if (old_children[i] != null) {
      unMount(old_children[i], old_children[i]);
    }
  }

  // Set references
  if (refs) {
    for (i = 0; i < refs.length; i++) {
      applyReference(refs[i], refs[++i], refs[++i]);
    }
  }
}
