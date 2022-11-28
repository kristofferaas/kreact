export function childrenInsert(
  parent_dom,
  new_dom,
  old_dom,
  old_children_length
) {
  let sibling_dom;
  if (old_dom == null || old_dom.parentNode !== parent_dom) {
    parent_dom.appendChild(new_dom);
  } else {
    sibling_dom = old_dom;
    for (
      let j = 0;
      (sibling_dom = sibling_dom.nextSibling) && j < old_children_length;
      j++
    ) {
      if (sibling_dom == new_dom) {
        return;
      }
    }
    parent_dom.insertBefore(new_dom, old_dom);
  }
}
