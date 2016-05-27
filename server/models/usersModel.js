var db = require('./db');

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 255).unique();
      user.string('password', 255);
      user.string('email', 255);
      user.string('gender', 1);
      user.string('age', 2);
      user.string('ethnicity', 255);
      user.string('first-name', 255);
      user.string('last-name', 255);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

var User = db.Model.extend({

  tableName: 'users',
  hasTimestamps: true,
  
  initialize: function() {
    this.on('creating', this.hashPassword);
  },
  
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },

  hashPassword: function() {
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }

});

module.exports = User;