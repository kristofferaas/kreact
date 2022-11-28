import { Component } from "../component";
import { shallowEquals } from "../internal";

/**
 * Pure Component
 *
 * Component class that defines a default shouldComponentUpdates.
 * When using this component it will only update when the props
 * or state have changed.
 *
 * To save time and increase performance it will only shallowly compare
 * the current and previous props and state.
 * So if the props or state are mutated it won't detect the change
 * and it won't update.
 */
export default class PureComponent extends Component {
  /**
   * shouldComponentUpdate
   *
   * This method is called by the @/lib/render diffing algorithm.
   * You can implement this method yourself in your own component,
   * but 9 time out of 10 you'll do exactly this.
   */
  shouldComponentUpdate(nextProps, nextState) {
    const update =
      !shallowEquals(this.props, nextProps) ||
      !shallowEquals(this.state, nextState);
    // console.log(`should ${this.constructor.name} update?`, update);
    return update;
  }
}
