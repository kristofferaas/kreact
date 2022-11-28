import { queueRender } from "./component";

/**
 * @function createContext
 * @param {*} default_value
 */

let i = 0;

export function createContext(default_value) {
  const data = {};

  const new_context = {
    $id: "$ctx" + i++,
    $default_value: default_value,
    Consumer(consumer_props, consumer_context) {
      this.shouldComponentUpdate = (props, _state, context) =>
        consumer_context !== context ||
        consumer_props.children !== props.children;

      return consumer_props.children(consumer_context);
    },
    Provider(provider_props) {
      if (!this.getChildContext) {
        const subs = [];
        this.getChildContext = () => {
          data[new_context.$id] = this;
          return data;
        };
        this.shouldComponentUpdate = (props) => {
          subs.some((component) => {
            if (component.$parent_dom) {
              component.context = props.value;
              queueRender(component);
            }
          });
        };
        this.sub = (component) => {
          subs.push(component);
          let old = component.componentWillUnmount;
          component.componentWillUnmount = () => {
            subs.splice(subs.indexOf(component), 1);
            old && old.call(component);
          };
        };
      }
      return provider_props.children;
    },
  };

  new_context.Consumer.context_types = new_context;

  return new_context;
}
