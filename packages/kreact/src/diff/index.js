import { diff } from "./diff";

export function tick(
  parent_dom,
  new_virtual_node,
  old_virtual_node,
  context,
  is_svg,
  excess_dom_children,
  mounts,
  force,
  old_dom
) {
  // If constructor is undefined we shouldn't perform any diffing and return null
  if (new_virtual_node.constructor !== undefined) return null;

  // Diff inside a try catch so we can print out errors
  try {
    diff(
      parent_dom,
      new_virtual_node,
      old_virtual_node,
      context,
      is_svg,
      excess_dom_children,
      mounts,
      force,
      old_dom
    );
  } catch (e) {
    // Log out error
    console.error(e.stack || e);
  }

  // Return the DOM reference
  return new_virtual_node.$dom;
}
