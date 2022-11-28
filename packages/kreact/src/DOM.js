export function setProperty(dom, name, new_value, old_value, is_svg) {
  name = is_svg
    ? name === "className"
      ? "class"
      : name
    : name === "class"
    ? "className"
    : name;

  if (name === "key" || name === "children") {
    // NO-OP
  }
  // Set style
  else if (name === "style") {
    const style = dom.style;

    if (typeof new_value === "string") {
      style.cssText = new_value;
    } else {
      if (typeof old_value === "string") {
        // Reset
        style.cssText = "";
        old_value = null;
      }

      if (old_value) {
        for (const i in old_value) {
          if (!(new_value && i in new_value)) {
            setStyle(style, i, "");
          }
        }
      }

      if (new_value) {
        for (const i in new_value) {
          if (!old_value || new_value[i] !== old_value[i]) {
            setStyle(style, i, new_value[i]);
          }
        }
      }
    }
  }
  // Set event
  else if (name[0] === "o" && name[1] === "n") {
    let use_capture; // TODO
    let normalized_name = name.toLowerCase();

    // Is the given name a real event?
    const event_exits = normalized_name in dom;

    // Normalize name
    normalized_name = (event_exits ? normalized_name : name).slice(2);

    if (new_value) {
      if (!old_value) {
        dom.addEventListener(normalized_name, eventProxy, use_capture);
      }

      const old_listeners = dom.$listeners || (dom.$listeners = {});

      // Save set event in dom.$listeners
      old_listeners[normalized_name] = new_value;
    } else {
      // Remove event listener
      dom.removeEventListener(normalized_name, eventProxy, use_capture);
    }
  }
  //
  else if (!is_svg && name in dom) {
    dom[name] = new_value == null || new_value === false ? "" : new_value;
  }
  //
  else if (
    typeof new_value !== "function" /* && name !== "dangerouslySetInnerHTML" */
  ) {
    if (name !== (name = name.replace(/^xlink:?/, ""))) {
      // Namespace attribute
      const xlink = "http://www.w3.org/1999/xlink";
      name = name.toLowerCase();
      if (new_value == null || new_value === false) {
        dom.removeAttributsNS(xlink, name);
      } else {
        dom.setAttributeNS(xlink, name);
      }
    }
    // Normal attribute
    else if (new_value == null || new_value === false) {
      dom.removeAttribute(name);
    } else {
      dom.setAttribute(name, new_value);
    }
  }
}

export function setStyle(style, key, value) {
  // TODO
  // ADD MORE LOGIC
  style[key] =
    typeof value === "number" ? value + "px" : value == null ? "" : value;
}

export function eventProxy(event) {
  // Get stored event from Node
  const listener = this.$listeners[event.type];

  // Invoke listener
  return listener(event);
}

export function removeNode(node) {
  const parent = node.parentNode;
  if (parent) {
    parent.removeChild(node);
  }
}
