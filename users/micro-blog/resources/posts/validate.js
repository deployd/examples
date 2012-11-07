if (!this.message) {
    error('message', "is required");
} else if (this.message.length > 140) {
    error('message', "must be below 140 characters");
} else {
    var mentions = (this.message.match(/@[a-z0-9]+/ig) || []).map(function(m) {
        //Drop the @
        return m.replace('@', '');
    });
    
    // Only include users that actually exist
    dpd.users.get({username: {$in: mentions}}, function(users) {
        if (users) {
            this.mentions = users.map(function(u) {
                return u.username;
            });
        }
    });
   
}

