import { h, Component } from "kreact";
import TodoAdd from "./components/TodoAdd";
import TodoList from "./components/TodoList";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { todos: [] };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleAdd(todo) {
    this.setState({ todos: [...this.state.todos, todo] });
  }

  handleDelete(todo) {
    this.setState({
      todos: this.state.todos.filter((t) => t.id !== todo.id),
    });
  }

  render() {
    return h(
      "div",
      null,
      h("h1", null, "Todo"),
      h(TodoAdd, { onAdd: this.handleAdd }),
      h(TodoList, { todos: this.state.todos, onDelete: this.handleDelete })
    );
  }
}

export default App;
