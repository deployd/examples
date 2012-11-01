var Todo = Backbone.Model.extend({
  defaults: {
    title: '',
    completed: false
  }
});

var Todos = Backbone.Collection.extend({
  url: '/todos',
  model: Todo
});

var TodoView = Backbone.View.extend({

  tagName: 'li',

  template: _.template($('#todo-item-template').html()),

  events: {
    'change .completed-chk': 'completedChanged'
  },

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  completedChanged: function() {
    var completed = this.$('.completed-chk').is(':checked');
    this.model.save({
      completed: completed
    });
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});

var TodoAppView = Backbone.View.extend({
  el: '#todo-app',

  events: {
    'click #add-btn': 'addTodo',
    'click #remove-completed-btn': 'removeCompletedItems'
  },

  initialize: function() {
    this.todos = new Todos();
    this.todos.bind('all', this.render, this);
    this.todos.bind('reset', this.renderTodos, this);
    this.todos.bind('add', this.renderOneTodo, this);
    

    this.todos.fetch();
  },

  addTodo: function() {
    var title = this.$('#todo-title').val();
    this.todos.create({
      title: title
    });
    this.$('#todo-title').val('');
    return false;
  },

  removeCompletedItems: function() {
    var view = this;
    this.todos.each(function(t) {
      if (t.get('completed')) {
        t.destroy();
      }
    });
    return false;
  },

  render: function() {
    if (this.todos.length) {
      this.$('#empty').hide();
    } else {
      this.$('#empty').show();
    }
  },

  renderTodos: function() {
    this.$('#todos').empty();
    this.todos.each(this.renderOneTodo.bind(this));
  },

  renderOneTodo: function(todo) {
    var view = new TodoView({model: todo});
    this.$('#todos').append(view.render().el);
  }
});


var app = new TodoAppView();