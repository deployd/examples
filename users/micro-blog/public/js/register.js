app.controller('RegisterCtrl', function($scope) {
  if (document.referrer && document.referrer !== location.href) {
    $scope.referrer = document.referrer;
  } else {
    $scope.referrer = '/';
  }

  $scope.register = function() {
    if ($scope.password !== $scope.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    dpd.users.post({
      username: $scope.username,
      password: $scope.password
    }, function(user, error) {
      if (error) {
        if (error.message) {
          alert(message);
        } else if (error.errors) {
          var messages = '';
          var errors = error.errors;

          if (errors.username) {
            messages += "Username " + errors.username + "\n";
          }
          if (errors.password) {
            messages += "Password " + errors.password + "\n";
          }

          alert(messages);
        }
      } else {
        dpd.users.login({
          username: $scope.username,
          password: $scope.password
        }, function() {
          location.href = $scope.referrer;
        });
      }
    });
  };

});