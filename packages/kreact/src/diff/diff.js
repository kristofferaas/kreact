import Fragment from "../builtIns/Fragment";
import { Component } from "../component";
import { diffChildren } from "./children";
import { diffNodes } from "./nodes";
import { doRender } from "./utils";
import { assign } from "../internal";

export function diff(
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
  // Temporary variable so we can reuse.
  let temp;

  // Are we diffing a component or a node?
  const new_type = new_virtual_node.type;

  /*
				If new_type is a function we are going to diff a component,
				otherwise we are diffing a DOM-node!
			*/
  if (typeof new_type === "function") {
    let component, is_new;

    // The new props for this component
    const new_props = new_virtual_node.props;

    /*
					Do this component require a context?
					If so get the correct context, if not use an empty object
				*/
    // Save the context type to temp
    temp = new_type.context_types;
    // Get the context id and use it to get the correct context
    const provider = temp && context[temp.$id];
    const component_context = temp
      ? provider
        ? provider.props.value
        : temp.$default_value
      : {};

    /*
					Do we have a old component, or are we constructing a new component?
				*/
    if (old_virtual_node.$component) {
      // Old component

      // Store the old component
      component = old_virtual_node.$component;
      // And assing the old component to the new virtual node
      new_virtual_node.$component = component;
    } else {
      // New component,
      // so we need to construct it
      is_new = true;

      // Is the component a class or a function?
      if (new_type.prototype && new_type.prototype.render) {
        // Component is a class

        // Instantiate the new component,
        // and pass the new props and the component's context
        component = new new_type(new_props, component_context);

        // Assing the new instance of our component to the new virtual node
        new_virtual_node.$component = component;
      } else {
        // Component is a function

        // We require a component to be a class,
        // So we need to create a component class

        // Instantiate a new base component
        // and pass the new props and component's context
        component = new Component(new_props, component_context);

        // We require a constructor,
        // so we make it out component reference
        component.constructor = new_type;

        // A component class requires a render function,
        // doRender is a generic render function we use for this.
        component.render = doRender;

        // And we add our new component to the new virtual node
        new_virtual_node.$component = component;
      }

      // If we have a context provider,
      // subscribe our new component to that context
      if (provider) provider.sub(component);

      // Set components props to be the new props
      component.props = new_props;

      // If we didn't receive any state make it a empty object
      if (!component.state) {
        component.state = {};
      }

      // Add component's context to the component instance
      component.context = component_context;

      // Refer to the complete context object in this component for later use
      component.$context = context;

      // Add dirty tag to component
      // Dirty tells us that this component is "under construction" or it's values will change.
      component.$dirty = is_new;

      // Add list for adding callback
      component.$render_callbacks = [];
    }

    /*

					Calculate the next state for this component

				*/

    // Next state that will be passed to the component
    if (component.$next_state === undefined) {
      // If it's not defined set it to current state
      component.$next_state = component.state;
    }

    // If component needs to derive it's state from passed props,
    // getDerivedStateFromProps is a static method in a component
    if (new_type.getDerivedStateFromProps !== undefined) {
      // Merge state with the result of getDerivedStateFromProps method
      /** @private This can possibly be simplified or at least be more readable */
      assign(
        component.$next_state == component.state
          ? (component.$next_state = assign({}, component.$next_state))
          : component.$next_state,
        new_type.getDerivedStateFromProps(new_props, component.$next_state)
      );
    }

    /*
					Here we do logic depending if this is a new component or old
				*/
    if (is_new) {
      // If the component have defined a componentDidMount method,
      // push it to mounts so we can call componentDidMount later.
      /** @private This step can possibly be moved inside the new component construction step */
      mounts.push(component);
    } else {
      // Should the component update?
      // The default awnser is yes it should,
      // If the component have defined a shouldComponentUpdate method,
      // and it returns false, then no and we skip the update.
      // If force is true, then it updates regardless.
      if (
        !force &&
        component.shouldComponentUpdate !== undefined &&
        // We pass it the next props and next state
        component.shouldComponentUpdate(new_props, component.$next_state) ===
          false
      ) {
        // The component should not update

        // We re-assing new values to the component so it doesn't fall behind
        component.props = new_props;
        component.state = component.$next_state;
        component.$virtual_node = new_virtual_node;
        new_virtual_node.$dom =
          old_dom != null
            ? old_dom !== old_virtual_node.$dom
              ? old_dom
              : old_virtual_node.$dom
            : null;
        new_virtual_node.$children = old_virtual_node.$children;

        for (temp = 0; temp < new_virtual_node.$children.length; temp++) {
          if (new_virtual_node.$children[temp]) {
            new_virtual_node.$children[temp].$parent = new_virtual_node;
          }
        }

        // We're now done with this component,
        // and it's now clean
        component.$dirty = false;

        // Break the update
        return;
      }
    }

    // We need previous component props and state
    const old_props = component.props;
    const old_state = component.state;

    // Re-assign the next props, state and context to the component
    component.context = component_context;
    component.props = new_props;
    component.state = component.$next_state;

    // Apply internal data to component
    component.$virtual_node = new_virtual_node;
    component.$parent_dom = parent_dom;

    // We can now consider the component clean
    component.$dirty = false;

    // Get the components next virtual dom,
    // so we can render it later.
    // Since we require a render method we don't need to check if exists.
    temp = component.render(
      component.props,
      component.state,
      component.context
    );

    const is_fragment =
      temp != null && temp.type == Fragment && temp.key == null;

    /** @private This should be removed in the future, but the store provider uses it */
    if (component.getChildContext != null) {
      context = assign(assign({}, context), component.getChildContext());
    }

    // If it is a fragment virtual node children should be the fragment children,
    // else it should be the root virtual node
    new_virtual_node.$children = is_fragment ? temp.props.children : temp;

    // Diff the old virtual node and the new virtual node
    // This will also render to the DOM if needed
    diffChildren(
      parent_dom,
      new_virtual_node,
      old_virtual_node,
      context,
      is_svg,
      excess_dom_children,
      mounts,
      old_dom
    );

    // The component is not up to date

    // Refer to the component's dom node
    component.base = new_virtual_node.$dom;

    // Call render callbacks
    while ((temp = component.$render_callbacks.pop())) {
      if (component.$next_state) component.state = component.$next_state;
      temp.call(component);
    }

    // If this isn't a new component
    // run componentDidUpdate if defined
    if (
      !is_new &&
      old_props != null &&
      component.componentDidUpdate !== undefined
    ) {
      component.componentDidUpdate(old_props, old_state);
    }
  } else {
    /*
					Virtual node type is a string
					so it's just a normal HTML element
				*/

    // Diff node, this will also render it if needed
    new_virtual_node.$dom = diffNodes(
      old_virtual_node.$dom,
      new_virtual_node,
      old_virtual_node,
      context,
      is_svg,
      excess_dom_children,
      mounts
    );
  }
}
