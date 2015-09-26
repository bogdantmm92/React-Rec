/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var app = app || {};

(function () {
  'use strict';

  app.ALL_TODOS = 'all';
  app.ACTIVE_TODOS = 'active';
  app.COMPLETED_TODOS = 'completed';
  var TodoFooter = app.TodoFooter;
  var TodoItem = app.TodoItem;

  var ENTER_KEY = 13;

  app.TodoApp = React.createClass({
    getInitialState: function () {
      return {
        nowShowing: app.ALL_TODOS,
        editing: null,
        inputValue: "",
      };
    },

    // Needed for sdk ---------
    componentWillMount: function() {
      app.ReactRec.init();
    },
    componentDidUpdate: function(prevProps, prevState) {
      var snapshotState = window.rct.serialize(this);
      app.ReactRec.saveState(snapshotState);
    },
    // Needed for sdk ---------

    componentDidMount: function () {
      var setState = this.setState;
      var router = Router({
        '/': setState.bind(this, {nowShowing: app.ALL_TODOS}),
        '/active': setState.bind(this, {nowShowing: app.ACTIVE_TODOS}),
        '/completed': setState.bind(this, {nowShowing: app.COMPLETED_TODOS})
      });
      router.init('/');
    },

    handleNewTodoKeyDown: function (event) {
      if (event.keyCode !== ENTER_KEY) {
        return;
      }

      event.preventDefault();

      // var val = React.findDOMNode(this.refs.newField).value.trim();

      if (this.state.inputValue && this.state.inputValue.length > 0) {
        this.props.model.addTodo(this.state.inputValue);
        this.setState({inputValue: ""});
      }
    },

    toggleAll: function (event) {
      var checked = event.target.checked;
      this.props.model.toggleAll(checked);
    },

    toggle: function (todoToToggle) {
      this.props.model.toggle(todoToToggle);
    },

    destroy: function (todo) {
      this.props.model.destroy(todo);
    },

    edit: function (todo) {
      this.setState({editing: todo.id});
    },

    save: function (todoToSave, text) {
      this.props.model.save(todoToSave, text);
      this.setState({editing: null});
    },

    cancel: function () {
      this.setState({editing: null});
    },

    clearCompleted: function () {
      this.props.model.clearCompleted();
    },
    handleChange: function(event) {
      this.setState({inputValue: event.target.value});
    },

    render: function () {
      var footer;
      var main;
      var todos = this.props.model.todos;

      var shownTodos = todos.filter(function (todo) {
        switch (this.state.nowShowing) {
        case app.ACTIVE_TODOS:
          return !todo.completed;
        case app.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
        }
      }, this);

      var todoItems = shownTodos.map(function (todo) {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={this.toggle.bind(this, todo)}
            onDestroy={this.destroy.bind(this, todo)}
            onEdit={this.edit.bind(this, todo)}
            editing={this.state.editing === todo.id}
            onSave={this.save.bind(this, todo)}
            onCancel={this.cancel}
          />
        );
      }, this);

      var activeTodoCount = todos.reduce(function (accum, todo) {
        return todo.completed ? accum : accum + 1;
      }, 0);

      var completedCount = todos.length - activeTodoCount;

      if (activeTodoCount || completedCount) {
        footer =
          <TodoFooter
            count={activeTodoCount}
            completedCount={completedCount}
            nowShowing={this.state.nowShowing}
            onClearCompleted={this.clearCompleted}
          />;
      }

      if (todos.length) {
        main = (
          <section className="main">
            <input
              className="toggle-all"
              type="checkbox"
              onChange={this.toggleAll}
              checked={activeTodoCount === 0}
            />
            <ul className="todo-list">
              {todoItems}
            </ul>
          </section>
        );
      }

      return (
        <div>
          <header className="header">
            <h1>todos</h1>
            <input
              ref="newField"
              className="new-todo"
              placeholder="What needs to be done?"
              onKeyDown={this.handleNewTodoKeyDown}
              onChange={this.handleChange}
              autoFocus={true}
              value={this.state.inputValue} />
          </header>
          {main}
          {footer}
        </div>
      );
    }
  });
})();
