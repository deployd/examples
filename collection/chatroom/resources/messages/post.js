this.date = new Date().getTime();

emit('messages:create', this);