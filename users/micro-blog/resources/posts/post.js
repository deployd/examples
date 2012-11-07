if (!me) cancel("You must be logged in to post", 401);

this.creator = me.id;
this.creatorName = me.username;

this.postedTime = new Date().getTime();