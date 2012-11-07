app.controller('UserFeedCtrl', function($scope, Feed) {

  var query = location.search;
  var username = query.split('?user=')[1];
  if (!username) {
    location.href = "/";
  }

  $scope.username = username;

  var feed = new Feed({
    creatorName: username
  });
  feed.refresh();

  var mentionsFeed = new Feed({
    mentions: username
  });
  mentionsFeed.refresh();

  $scope.switchFeeds = function(feedName) {
    $scope.feedName = feedName;
    if (feedName == 'mentions') {
      $scope.feed = mentionsFeed;
    } else if (feedName == 'posts') {
      $scope.feed = feed;
    } else {
      $scope.feed = null;
    }
  };

  $scope.switchFeeds('posts');
  $scope.feed = feed;
});