const React = require('react');
const ReactDOM = require('react-dom');

class App extends React.Component {
  constructor(){
    super();

    this.state = { todos: []};

    dpd.todos.get()
      .then(todos => this.setState({ todos }));
  }

  addTask(e){
    e.preventDefault();
    const todos = this.state.todos;
    const title = this.input.value;

    if (title) {
      dpd.todos.post({ title }, (result, error) => {
        if (error) throw new Error(error);

        this.setState({
          todos: [
            ...todos,
            {
              id: result.id,
              title: this.input.value,
              done: false
            }
          ]
        });

        this.input.value = '';
      });
    }
  }

  toggleTask(i){
    const todos = this.state.todos;
    const updatedTodo = Object.assign({}, todos[i], {done: !todos[i].done});

    dpd.todos.put(updatedTodo, (result, error) => {
      this.setState({
        todos: [
          ...todos.slice(0, i),
          result,
          ...todos.slice(i+1)
        ]
      });
    });
  }

  removeDoneTasks(e){
    e.preventDefault();
    const todos = this.state.todos.filter(t => t.done);

    todos.forEach(todo => {
      dpd.todos.del(todo.id, (_, error) => {
        if (error) throw new Error(error);
        this.setState({ todos: this.state.todos.filter(t => t !== todo) });
      });
    });
  }

  render(){
    var noTasks;
    if (!this.state.todos.length)
      noTasks = (<p id="empty">You don't have any todos! Add one now:</p>);

    return (
      <div className="container">
        <h1>Deployd Todos</h1>
        { noTasks }
        <ul id="todos" className="unstyled">
          {
            this.state.todos.map((todo, index) =>
              {
                return (
                  <li key={todo.id}>
                    <label className="checkbox">
                      <input type="checkbox" onClick={ this.toggleTask.bind(this, index) } checked={todo.done}/>
                      <span>{ todo.title }</span>
                    </label>
                  </li>
                );
              }
            )

          }
        </ul>
        <form className="form-inline">
          <input
            id="todo-title"
            type="text"
            ref={ (node) => this.input = node }
          />
          <button
            id="add-btn"
            className="btn btn-success"
            onClick={ this.addTask.bind(this) }
          >Add</button>
        </form>
        <p>
          <a href id="remove-completed-btn" onClick={ this.removeDoneTasks.bind(this) }>Remove completed</a>
        </p>
      </div>
    );
  }
}


ReactDOM.render(<App/>, document.getElementById('app'));
