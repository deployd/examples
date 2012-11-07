var app = angular.module('microblogApp', []);

app.factory('Feed', function($rootScope) {
  var PAGE_SIZE = 5;

  var Feed = function Feed(query) {
    this.query = query || {};
    this.posts = [];
    this.lastTime = 0;
    this.moreToLoad = false;
  };

  Feed.prototype.loadPosts = function() {
    var feed = this;

    var query = angular.copy(this.query);
    query.$limit = PAGE_SIZE + 1;
    query.postedTime = {$lt: this.lastTime};
    query.$sort = {postedTime: -1};

    dpd.posts.get(query, function(result) {
      if (result.length > PAGE_SIZE) {
        result.pop();
        feed.moreToLoad = true;
      } else {
        feed.moreToLoad = false;
      }
      if (result.length) feed.lastTime = result[result.length - 1].postedTime;

      Array.prototype.push.apply(feed.posts, result);

      $rootScope.$apply();
    });
  };

  Feed.prototype.refresh = function() {
    this.lastTime = new Date().getTime();
    this.posts.length = 0;
    this.loadPosts();
    this.moreToLoad = false;
  };

  return Feed;
});

app.directive('dpdMessageFor', function() {
  return function(scope, element, attrs) {
    var post = scope.$eval(attrs.dpdMessageFor);
    var message = post.message;
    var mentions = post.mentions;
    if (mentions) {
      mentions.forEach(function(m) {
        message = message.replace('@' + m, '<a href="/user.html?user=' + m + '">@' + m + '</a>');
      });
    }

    element.html(message);
  };
});

app.controller('LoginCtrl', function($scope, $rootScope) {
  $rootScope.userLoaded = false;

  function getMe() {
    dpd.users.me(function(user) {
      $rootScope.currentUser = user;
      $rootScope.userLoaded = true;
      $scope.$apply();
    });
  }
  getMe();


  $scope.showLogin = function(val) {
    $scope.loginVisible = val;
    if (val) {
      $scope.username = '';
      $scope.password = '';
    }
  };

  $scope.login = function() {
    dpd.users.login({
      username: $scope.username,
      password: $scope.password
    }, function(session, error) {
      if (error) {
        alert(error.message);
      } else {
        $scope.showLogin(false);
        getMe();

        $scope.$apply();
      }
    });
  };

  $scope.logout = function() {
    dpd.users.logout(function() {
      $rootScope.currentUser = null;
      $scope.$apply();
    });
  };
});