import { h, Component } from "kreact";

const createRandomId = () => Math.random().toString(36).substr(2, 9);

class TodoAdd extends Component {
  constructor(props) {
    super(props);
    this.state = { id: createRandomId(), text: "" };
    this.handleType = this.handleType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleType(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state);
    this.setState({ id: createRandomId(), text: "" });
  }

  render() {
    return h(
      "form",
      {
        onSubmit: this.handleSubmit,
      },
      h(
        "input",
        {
          type: "text",
          value: this.state.text,
          onChange: this.handleType,
        },
        this.state.text
      )
    );
  }
}

export default TodoAdd;
