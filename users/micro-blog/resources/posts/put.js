if (!(me && me.id === this.creator)) {
    cancel("You are not the creator", 401);
}

protect('postedTime');
protect('creator');
protect('creatorName');