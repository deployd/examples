if (this.username.length > 20) {
    error('username', "cannot exceed 20 characters");
}

if (this.username.match(/[^a-z0-9]/i)) {
    error('username', "must only include alphanumeric characters");
}