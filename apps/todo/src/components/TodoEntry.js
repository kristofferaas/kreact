import { h, Component } from "kreact";

class TodoEntry extends Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.todo);
  }

  render() {
    return h("li", { onClick: this.handleDelete }, this.props.todo.text);
  }
}

export default TodoEntry;
