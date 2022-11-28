import { h, Component } from "kreact";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return h(
      "button",
      {
        id: "counter",
        type: "button",
        onClick: () => {
          this.setState({ count: this.state.count + 1 });
        },
      },
      `Count: ${this.state.count}`
    );
  }
}

export default Counter;
