app.controller('FeedCtrl', function($scope, Feed) {

  var PAGE_SIZE = 5;

  var feed = new Feed();
  $scope.feed = feed;

  $scope.submit = function(newPost) {
    dpd.posts.post({
      message: newPost
    }, function(result, error) {
      if (error) {
        if (error.message) {
          alert(error.message);
        } else if (error.errors && error.errors.message) {
          alert("Message " + error.errors.message);
        } else {
          alert("An error occurred");
        }
      } else {
        feed.posts.unshift(result);
        $scope.newPost = '';
        $scope.$apply();
      }
    }); 
  };

  feed.refresh();

});