import { setProperty } from "../DOM";

export function diffProps(dom, new_props, old_props, is_svg, is_hydrating) {
  let i;

  for (i in old_props) {
    if (!(i in new_props)) {
      // Remove property
      setProperty(dom, i, null, old_props[i], is_svg);
    }
  }

  for (i in new_props) {
    if (
      (!is_hydrating || typeof new_props[i] === "function") &&
      // i !== "value" &&
      // i !== "checked" &&
      old_props[i] !== new_props[i]
    ) {
      setProperty(dom, i, new_props[i], old_props[i], is_svg);
    }
  }
}
