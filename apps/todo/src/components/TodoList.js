import { h, Component } from "kreact";
import TodoEntry from "./TodoEntry";

class TodoList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return h(
      "ol",
      null,
      this.props.todos.map((todo) =>
        h(TodoEntry, {
          key: todo.id,
          todo: todo,
          onDelete: this.props.onDelete,
        })
      )
    );
  }
}

export default TodoList;
