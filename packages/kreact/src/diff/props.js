import { setProperty } from "../DOM";

export function diffProps(dom, new_props, old_props, is_svg) {
  let i;

  for (i in old_props) {
    if (!(i in new_props)) {
      // Remove property
      setProperty(dom, i, null, old_props[i], is_svg);
    }
  }

  for (i in new_props) {
    setProperty(dom, i, new_props[i], old_props[i], is_svg);
  }
}
