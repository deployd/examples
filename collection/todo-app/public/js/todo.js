$(document).ready(function() {

  getTodos();
  $('#add-btn').click(addTodo);
  $('#remove-completed-btn').click(removeCompletedItems);

  function getTodos() {
    // Get all todos
    dpd.todos.get(function(todos, err) {
      if (err) {
        // Alert if there's an error
        return alert(err.message || "an error occurred");
      }

      if (!todos.length) {
        $('#empty').show();
      }

      // todos is an array
      todos.forEach(function(todo) {
        renderTodo(todo);
      });
    });
  }


  function renderTodo(todo) {
    var $el = $('<li>'), 
        $label = $('<label class="checkbox">'), 
        $checkbox = $('<input type="checkbox">');

    // Tag the element with our todo's id so we can access it later
    $el.attr('id', todo.id);

    $el.append($label);
    $label.append($checkbox).append(todo.title);

    var updateCheckbox = function() {
      if (todo.completed) {
        $checkbox.attr('checked', 'checked');
      }  
    };
    updateCheckbox();
  
    $checkbox.change(function() {
      todo.completed = $checkbox.is(':checked');
      // Update the property on the server. The callback is optional
      dpd.todos.put(todo.id, {completed: todo.completed});
    });

    $el.appendTo('#todos');
    $('#empty').hide();
  }

  function addTodo() {
    var title = $('#todo-title').val();

    // Create a todo
    dpd.todos.post({
      title: title
    }, function(todo, err) {
      if (err) {
        // An error could be either the err.message property, or err.errors.title, so we account for either case
        alert(err.message || (err.errors && err.errors.title));
        return;
      }

      $('#todo-title').val('');
      renderTodo(todo);
    });
    return false;
  }

  function removeCompletedItems() {
    // Get all completed todos
    dpd.todos.get({completed: true}, function(todos) {
      todos.forEach(function(t) {
        // Delete it; "completed: true" is a failsafe
        dpd.todos.del({id: t.id, completed: true}, function() {
          // Now that's it's deleted from the server, remove the element, too
          $('#' + t.id).remove();
          
          if (!$('#todos').children().length) {
            $('#empty').show();
          }
        });
      });
    });
    return false;
  }

});
